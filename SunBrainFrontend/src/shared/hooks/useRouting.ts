import { useMemo } from 'react';
import {
  PATHS,
  CATALOG_ITEMS,
  SubjectPath,
} from '@/app/providers/routes/config.tsx';

export const useRouting = () => {
  const catalogItems = useMemo(
    () =>
      CATALOG_ITEMS.map((item) => ({
        ...item,
        fullPath: PATHS.STUDENT.SUBJECT(item.path),
      })),
    [],
  );

  const getSubjectPath = (subjectId: SubjectPath) =>
    PATHS.STUDENT.SUBJECT(subjectId);

  return {
    paths: PATHS,
    catalogItems,
    getSubjectPath,
  };
};
