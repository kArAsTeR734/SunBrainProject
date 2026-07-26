export const PATHS = {
  HOME: '/',
  LOGIN: '/login',
  REGISTRATION: '/registration',
  STUDENT: {
    CATALOG: '/student/catalog',
    CALENDAR: '/student/calendar',
    ACCOUNT: '/student/account',
    SUBJECT: (subjectId: string) => `/student/catalog/${subjectId}`,
    HOMEWORK_LINK: (id: string | number) => `/student/homework/${id}`,
    HOMEWORK: `/student/homework`,
  },
  TEST: '/student/test',
  TEST_SUBJECT: (subjectId: string) => `/student/test/${subjectId}`,
  TEST_RUN: (subjectId: string) => `/student/test/${subjectId}/run`,
  NOT_FOUND: '*',
} as const;
