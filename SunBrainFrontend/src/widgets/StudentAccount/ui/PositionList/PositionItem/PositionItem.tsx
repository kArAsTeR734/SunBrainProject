import type { LeaderboardUser } from '@entities/Leaderboard';
import clsx from 'clsx';

import styles from './positionItem.module.scss';

export const PositionItem = ({ fullName, position, points }: LeaderboardUser) => {
  return (
    <>
      <div className={styles.item}>
        <div className={clsx(styles.itemPlacement, styles.first)}>{position}.</div>
        <div className={styles.itemInfo}>{fullName}</div>
        <div className={styles.itemScore}>{points} баллов</div>
      </div>
    </>
  );
};
