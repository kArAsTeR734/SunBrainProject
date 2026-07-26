import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { memo } from 'react';
import './MarkdownContent.scss';
import katex from 'katex';

interface MarkdownProps {
  content: string;
}

export const MarkdownContent = memo(({ content }: MarkdownProps) => {
  const normalizeSolution = (text: string) => {
    return text
      .replace(/\\n/g, '\n')
      .replace(/\r\n/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  };

  const solution = normalizeSolution(content);
  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        p: ({ children }) => <p className="md-paragraph">{children}</p>,
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
            const inlineClassName = ['md-img', 'md-img--inline', props.className]
              .filter(Boolean)
              .join(' ');
            return <img {...props} className={inlineClassName} alt="" />;
          }

          const imageClassName = ['md-img', 'md-img--block', props.className]
            .filter(Boolean)
            .join(' ');

          const normalizedAlt = kind === 'image:block' ? (payload ?? '') : alt;

          return <img {...props} className={imageClassName} alt={normalizedAlt} />;
        },
      }}
    >
      {solution}
    </ReactMarkdown>
  );
});
