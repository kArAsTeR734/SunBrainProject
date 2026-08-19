import { useTopics } from '@features/topics';
import { Outlet, useParams } from 'react-router-dom';

export const CatalogLayout = () => {
  const { subjectId } = useParams();
  const { data: topics } = useTopics(subjectId ?? '');

  return (
    <>
      <Outlet context={{ subjectId, topics }} />
    </>
  );
};
