import './studentAccountPosition.css';
import PositionList from '@/widgets/StudentAccount/PositionList';

export const StudentAccountPosition = () => {
  return (
    <>
      <div className="position">
        <div className="position__wrapper">
          <div className="position__header">Текущая позиция в рейтинге</div>
          <PositionList />
        </div>
      </div>
    </>
  );
};
