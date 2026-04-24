import './studentAccountProgress.css';
import ProgressList from '@/backlog/ProgressList/ProgressList.tsx';

const StudentAccountProgress = () => {
  return (
    <>
      <div className="progress">
        <h2 className="progress__header">Прогресс обучения</h2>
        <ProgressList />
      </div>
    </>
  );
};

export default StudentAccountProgress;
