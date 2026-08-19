import styles from './DataFallback.module.scss';

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
    <div className={styles.dataFallback} data-state={state}>
      <p className={styles.title}>{title}</p>
      {description && <p className={styles.description}>{description}</p>}
      {onAction && (
        <button className={styles.action} type="button" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
};
