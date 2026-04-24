import './positionItem.css';
import clsx from 'clsx';
import { LeaderboardUser } from '@entities/Leaderboard/types.ts';

const PositionItem = ({ fullName, position, points }: LeaderboardUser) => {
  return (
    <>
      <div className="position__item">
        <div className={clsx('position__item-placement', 'first')}>
          {position}.
        </div>
        <div className="position__item-info">{fullName}</div>
        <div className="position__item-score">{points} баллов</div>
      </div>
    </>
  );
};

export default PositionItem;
