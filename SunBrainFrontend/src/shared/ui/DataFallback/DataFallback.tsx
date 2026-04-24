import './DataFallback.scss';

type DataFallbackState = 'loading' | 'error' | 'empty';

interface DataFallbackProps {
  state: DataFallbackState;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const DataFallback = ({
  state,
  title,
  description,
  actionLabel = 'Повторить',
  onAction,
}: DataFallbackProps) => {
  return (
    <div className={`data-fallback data-fallback--${state}`}>
      <p className="data-fallback__title">{title}</p>
      {description && (
        <p className="data-fallback__description">{description}</p>
      )}
      {onAction && (
        <button
          className="data-fallback__action"
          type="button"
          onClick={onAction}
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
