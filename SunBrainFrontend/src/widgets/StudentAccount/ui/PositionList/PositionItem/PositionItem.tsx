import './positionItem.scss';
import clsx from 'clsx';
import type { LeaderboardUser } from '@entities/Leaderboard';

export const PositionItem = ({ fullName, position, points }: LeaderboardUser) => {
  return (
    <>
      <div className="position__item">
        <div className={clsx('position__item-placement', 'first')}>{position}.</div>
        <div className="position__item-info">{fullName}</div>
        <div className="position__item-score">{points} баллов</div>
      </div>
    </>
  );
};
