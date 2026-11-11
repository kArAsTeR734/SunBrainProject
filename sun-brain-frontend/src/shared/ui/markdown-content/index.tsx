import { lazy, Suspense } from 'react';

const MarkdownRenderer = lazy(() =>
  import('./MarkdownContent').then(({ MarkdownContent }) => ({
    default: MarkdownContent,
  })),
);

export const MarkdownContent = ({ content }: { content: string }) => (
  <Suspense fallback={<p role="status">Загружаем формулы…</p>}>
    <MarkdownRenderer content={content} />
  </Suspense>
);
