export function getTypeLabel(type: string) {
  switch (type) {
    case 'single':
      return 'Выберите один вариант';
    case 'multiple':
      return 'Выберите несколько вариантов';
    case 'number':
      return 'Введите число';
    case 'text':
      return 'Введите ответ';
    default:
      return '';
  }
}
