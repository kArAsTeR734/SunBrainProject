import { Outlet, useParams } from 'react-router-dom';
import { useTopics } from '@features/Topics';

export const CatalogLayout = () => {
  const { subjectId } = useParams();
  const { data: topics } = useTopics(subjectId ?? '');

  return (
    <>
      <Outlet context={{ subjectId, topics }} />
    </>
  );
};
