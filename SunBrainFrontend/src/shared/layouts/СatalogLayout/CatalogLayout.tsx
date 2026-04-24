import { Outlet, useParams } from 'react-router-dom';
import { useTopics } from '@features/Topics/models/hooks/useTopics.ts';

export const CatalogLayout = () => {
  const { subjectId } = useParams();
  const { data: topics } = useTopics(subjectId ?? '');

  return (
    <>
      <Outlet context={{ subjectId, topics }} />
    </>
  );
};
