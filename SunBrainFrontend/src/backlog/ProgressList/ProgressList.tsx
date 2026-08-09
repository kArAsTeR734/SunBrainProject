import ProgressItem from '../ProgressItem/ProgressItem.tsx';
import styles from './progressList.module.scss';

const ProgressList = () => {
  return (
    <>
      <div className={styles.items}>
        <ProgressItem />
      </div>
    </>
  );
};

export default ProgressList;
