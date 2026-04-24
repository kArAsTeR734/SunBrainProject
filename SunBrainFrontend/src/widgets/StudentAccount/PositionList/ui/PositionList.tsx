import PositionItem from '@/widgets/StudentAccount/PositionList/ui/PositionItem/PositionItem.tsx';
import './positionList.scss';
import clsx from 'clsx';
import { useAppSelector } from '@/shared/hooks/redux.ts';
import { useLeaderboard } from '@entities/User/models/useLeaderboard.ts';
import { DataFallback } from '@shared/ui';
import { useEffect, useState } from 'react';

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
    <div className="position__items">
      {leaderboard.topUsers.map(({ position, fullName, points }) => (
        <div className="position__item" key={position}>
          <div className={clsx('position__item-placement', 'first')}>
            {position}.
          </div>
          <p className="position__item-info">{fullName}</p>
          <p className="position__item-score">{points} баллов</p>
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
