"""Fail-closed checks for generated tasks. No eval, network, or third-party packages."""
import ast
import json
import math
import re
import sys
import xml.etree.ElementTree as ET
from fractions import Fraction


def calculate(expression):
    if not isinstance(expression, str) or len(expression) > 2000:
        raise ValueError('Invalid verification expression')
    tree = ast.parse(expression, mode='eval')
    if sum(1 for _ in ast.walk(tree)) > 300:
        raise ValueError('Verification expression is too complex')
    if not any(isinstance(node, (ast.BinOp, ast.Call)) for node in ast.walk(tree)):
        raise ValueError('Verification must derive the answer, not repeat a literal')

    def visit(node):
        if isinstance(node, ast.Constant) and type(node.value) in (int, float):
            value = Fraction(ast.get_source_segment(expression, node))
        elif isinstance(node, ast.UnaryOp) and isinstance(node.op, (ast.UAdd, ast.USub)):
            value = visit(node.operand) * (-1 if isinstance(node.op, ast.USub) else 1)
        elif isinstance(node, ast.BinOp):
            a, b = visit(node.left), visit(node.right)
            if isinstance(node.op, ast.Add): value = a + b
            elif isinstance(node.op, ast.Sub): value = a - b
            elif isinstance(node.op, ast.Mult): value = a * b
            elif isinstance(node.op, ast.Div): value = a / b
            elif isinstance(node.op, ast.Pow) and b.denominator == 1 and abs(b) <= 100:
                value = a ** int(b)
            else: raise ValueError('Unsupported arithmetic operation')
        elif isinstance(node, ast.Call) and isinstance(node.func, ast.Name) and not node.keywords:
            args = [visit(arg) for arg in node.args]
            if node.func.id == 'abs' and len(args) == 1: value = abs(args[0])
            elif node.func.id == 'sqrt' and len(args) == 1 and args[0] >= 0:
                n, d = args[0].numerator, args[0].denominator
                if math.isqrt(n) ** 2 != n or math.isqrt(d) ** 2 != d:
                    raise ValueError('Square root is not rational')
                value = Fraction(math.isqrt(n), math.isqrt(d))
            elif node.func.id in ('comb', 'factorial') and all(a.denominator == 1 and 0 <= a <= 200 for a in args):
                if node.func.id == 'comb' and len(args) == 2: value = Fraction(math.comb(*map(int, args)))
                elif node.func.id == 'factorial' and len(args) == 1: value = Fraction(math.factorial(int(args[0])))
                else: raise ValueError('Invalid function arguments')
            else: raise ValueError('Unsupported verification function')
        else: raise ValueError('Unsupported verification syntax')
        if value.numerator.bit_length() > 4096 or value.denominator.bit_length() > 4096:
            raise ValueError('Verification arithmetic is too large')
        return value

    return visit(tree.body)


def validate_svg(svg):
    if svg is None: return
    if not isinstance(svg, str) or len(svg) > 20000 or re.search(r'<!|<\?|&', svg):
        raise ValueError('Unsafe or oversized SVG')
    root = ET.fromstring(svg)
    namespace = '{http://www.w3.org/2000/svg}'
    if root.tag != namespace + 'svg': raise ValueError('SVG namespace is required')
    box = [float(x) for x in re.split(r'[\s,]+', root.attrib.get('viewBox', '').strip())]
    if len(box) != 4 or not all(math.isfinite(x) for x in box) or not (0 < box[2] <= 2000 and 0 < box[3] <= 2000):
        raise ValueError('Invalid SVG viewBox')
    tags = {'svg', 'g', 'path', 'line', 'polyline', 'polygon', 'rect', 'circle', 'ellipse',
            'text', 'tspan', 'defs', 'marker', 'title', 'desc'}
    attrs = {'viewBox', 'width', 'height', 'x', 'y', 'x1', 'x2', 'y1', 'y2', 'cx', 'cy',
             'r', 'rx', 'ry', 'd', 'points', 'fill', 'stroke', 'stroke-width', 'stroke-dasharray',
             'stroke-linecap', 'stroke-linejoin', 'font-size', 'font-family', 'font-weight',
             'text-anchor', 'dominant-baseline', 'transform', 'opacity', 'fill-opacity',
             'stroke-opacity', 'id', 'marker-end', 'marker-start', 'markerWidth', 'markerHeight',
             'refX', 'refY', 'orient', 'markerUnits', 'preserveAspectRatio', 'dx', 'dy'}
    elements = list(root.iter())
    if len(elements) > 300: raise ValueError('SVG has too many elements')
    if len(elements) < 2: raise ValueError('Empty SVG illustration')
    for element in elements:
        if not element.tag.startswith(namespace) or element.tag[len(namespace):] not in tags:
            raise ValueError('Unsupported SVG element')
        for key, value in element.attrib.items():
            if key not in attrs or re.search(r'javascript:|data:|https?:|//', value, re.I):
                raise ValueError('Unsafe SVG attribute')
            if 'url(' in value.lower() and not re.fullmatch(r'url\(#[A-Za-z][\w-]*\)', value):
                raise ValueError('External SVG resource')
        if element.tag == namespace + 'text':
            for key, lo, size in [('x', box[0], box[2]), ('y', box[1], box[3])]:
                if key in element.attrib:
                    position = float(element.attrib[key])
                    if not math.isfinite(position) or not lo <= position <= lo + size:
                        raise ValueError('SVG text is outside viewBox')


def verify(payload):
    task = payload['task']
    for field in ['statementLatex', 'solutionLatex']:
        text = task.get(field)
        if not isinstance(text, str) or not 20 <= len(text.strip()) <= 12000:
            raise ValueError('Missing or oversized task text: ' + field)
        if re.search(r'[\x00-\x08\x0b\x0c\x0e-\x1f]', text):
            raise ValueError('Broken text/LaTeX control characters')
    answer = task.get('answerLatex')
    if not isinstance(answer, str) or not re.fullmatch(r'[+-]?\d{1,12}(?:[.,]\d{1,12})?', answer):
        raise ValueError('Answer must be an exact finite decimal')
    validate_svg(task.get('imageSvg'))
    validate_svg(task.get('solutionImageSvg'))
    if payload.get('requiresImage') and not task.get('imageSvg'):
        raise ValueError('This task requires an illustration')
    if payload.get('expression') is not None:
        computed = calculate(payload['expression'])
        if computed != Fraction(answer.replace(',', '.')):
            raise ValueError('Independent arithmetic does not match the answer')
        if payload.get('independentAnswer') is not None:
            independent = payload['independentAnswer']
            if not isinstance(independent, str) or not re.fullmatch(r'[+-]?\d{1,12}(?:[.,]\d{1,12})?', independent):
                raise ValueError('Invalid independent answer')
            if computed != Fraction(independent.replace(',', '.')):
                raise ValueError('Reviewer answer disagrees with independent arithmetic')
    return {'valid': True, 'answer': answer.replace(',', '.')}


if __name__ == '__main__':
    try:
        print(json.dumps(verify(json.load(sys.stdin)), ensure_ascii=True))
    except Exception as error:
        print(json.dumps({'valid': False, 'error': str(error)}, ensure_ascii=True))
        sys.exit(1)
