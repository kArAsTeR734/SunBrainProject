import { Outlet, useParams } from 'react-router-dom';

export const HomeworkLayout = () => {
  const { homeworkId } = useParams<{ homeworkId: string }>();
  const id = homeworkId ? Number(homeworkId) : null;
  return <Outlet context={{ homeworkId: id }} />;
};
