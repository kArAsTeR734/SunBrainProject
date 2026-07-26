import { useMemo } from 'react';
import { CATALOG_ITEMS, type SubjectPath } from '@entities/Catalog';
import { PATHS } from '@shared/routes';

export const useSubjectPath = () => {
  const catalogItems = useMemo(
    () =>
      CATALOG_ITEMS.map((item) => ({
        ...item,
        fullPath: PATHS.STUDENT.SUBJECT(item.path),
      })),
    [],
  );

  const getSubjectPath = (subjectId: SubjectPath) => PATHS.STUDENT.SUBJECT(subjectId);

  return {
    paths: PATHS,
    catalogItems,
    getSubjectPath,
  };
};
