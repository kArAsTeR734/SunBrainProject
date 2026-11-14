import 'katex/dist/katex.min.css';

import clsx from 'clsx';
import katex from 'katex';
import { memo } from 'react';
import ReactMarkdown, { defaultUrlTransform } from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';

import styles from './MarkdownContent.module.scss';

interface MarkdownProps {
  content: string;
}

export const MarkdownContent = memo(({ content }: MarkdownProps) => {
  const normalizeSolution = (text: string) => {
    return text
      // A literal newline escape must not consume LaTeX commands such as \ne or \neq.
      .replace(/\\n(?![A-Za-z])/g, '\n')
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  };

  const solution = normalizeSolution(content);
  return (
    <ReactMarkdown
      urlTransform={(url, key, node) =>
        node.tagName === 'img' &&
        key === 'src' &&
        url.startsWith('data:image/svg+xml;utf8,')
          ? url
          : defaultUrlTransform(url)
      }
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        p: ({ children }) => <p className={styles.mdParagraph}>{children}</p>,
        img: ({ alt = '', ...props }) => {
          const [kind, payload] = alt.split('|');

          if (kind === 'formula:inline' && payload) {
            return (
              <span
                dangerouslySetInnerHTML={{
                  __html: katex.renderToString(payload, { throwOnError: false }),
                }}
              />
            );
          }

          if (kind === 'formula:inline') {
            const inlineClassName = clsx(styles.inline, props.className);
            return <img {...props} className={inlineClassName} alt="" />;
          }

          const imageClassName = clsx(styles.block, props.className);

          const normalizedAlt = kind === 'image:block' ? (payload ?? '') : alt;

          return <img {...props} className={imageClassName} alt={normalizedAlt} />;
        },
      }}
    >
      {solution}
    </ReactMarkdown>
  );
});
