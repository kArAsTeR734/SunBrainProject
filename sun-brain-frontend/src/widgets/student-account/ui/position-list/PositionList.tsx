import { useLeaderboard } from '@entities/user';
import { useAppSelector } from '@shared/lib';
import { DataFallback } from '@shared/ui';
import { useEffect, useState } from 'react';

import positionStyles from './position-item/positionItem.module.scss';
import { PositionItem } from './position-item/PositionItem.tsx';
import styles from './positionList.module.scss';

export const PositionList = () => {
  const { user } = useAppSelector((state) => state.userReducer);
  const {
    data: leaderboard,
    isLoading,
    isFetching,
    refetch,
  } = useLeaderboard(user?.id ?? 0);
  const [userOnTop, setUserOnTop] = useState<boolean>(false);

  useEffect(() => {
    if (leaderboard?.topUsers.find((u) => u.fullName === user?.fullName)) {
      setUserOnTop(true);
    } else {
      setUserOnTop(false);
    }
  }, [leaderboard, user?.fullName]);

  if (isLoading || isFetching) {
    return <DataFallback state="loading" title="Загружаем рейтинг..." />;
  }

  if (!leaderboard) {
    return (
      <DataFallback
        state="error"
        title="Не удалось получить рейтинг."
        description="Можно повторить запрос."
        onAction={() => void refetch()}
      />
    );
  }

  return (
    <div className={styles.items}>
      {leaderboard.topUsers.map(({ position, fullName, points }) => (
        <div className={positionStyles.item} key={position}>
          <div className={`${positionStyles.itemPlacement} ${positionStyles.first}`}>
            {position}.
          </div>
          <p className={positionStyles.itemInfo}>{fullName}</p>
          <p className={positionStyles.itemScore}>{points} баллов</p>
        </div>
      ))}
      {!userOnTop && (
        <PositionItem
          fullName={leaderboard.currentUser.fullName}
          points={leaderboard.currentUser.points}
          position={leaderboard.currentUser.position}
        />
      )}
    </div>
  );
};
