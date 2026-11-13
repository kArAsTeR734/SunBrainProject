import { Button } from '../button/Button';
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
        <Button className={styles.action} onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
