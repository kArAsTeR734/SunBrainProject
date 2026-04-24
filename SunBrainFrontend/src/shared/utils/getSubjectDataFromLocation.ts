import { CATALOG_ITEMS } from '@app/providers/routes/config.tsx';

export interface SubjectReturnType {
  subjectId: string;
  subjectTheme: string;
}

export function getSubjectIdFromLocation(
  pathname: string,
): SubjectReturnType | null {
  const segments = pathname.split('/').filter(Boolean);

  if (segments[1] !== 'homework') {
    return null;
  }

  const subject = segments[2];
  const subjectTheme = segments[3];
  if (!subject) {
    return null;
  }

  const isValidSubject = CATALOG_ITEMS.some((item) => item.path === subject);

  if (subjectTheme) {
    return {
      subjectId: subject,
      subjectTheme: subjectTheme,
    };
  }

  return isValidSubject
    ? {
        subjectId: subject,
        subjectTheme: subjectTheme,
      }
    : null;
}
