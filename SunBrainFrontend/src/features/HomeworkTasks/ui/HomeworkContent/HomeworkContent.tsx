import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { FC, memo } from 'react';
import './HomeworkContent.scss';
import { InlineMath } from 'react-katex';

interface Props {
  content: string;
}

export const MarkdownContent: FC<Props> = memo(({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{
        p: ({ children }) => <p className="md-paragraph">{children}</p>,
        img: ({ alt = '', ...props }) => {
          const [kind, payload] = alt.split('|');

          if (kind === 'formula:inline' && payload) {
            return <InlineMath math={payload} />;
          }

          if (kind === 'formula:inline') {
            const inlineClassName = [
              'md-img',
              'md-img--inline',
              props.className,
            ]
              .filter(Boolean)
              .join(' ');
            return <img {...props} className={inlineClassName} alt="" />;
          }

          const imageClassName = ['md-img', 'md-img--block', props.className]
            .filter(Boolean)
            .join(' ');

          const normalizedAlt = kind === 'image:block' ? (payload ?? '') : alt;

          return (
            <img {...props} className={imageClassName} alt={normalizedAlt} />
          );
        },
      }}
    >
      {content}
    </ReactMarkdown>
  );
});
