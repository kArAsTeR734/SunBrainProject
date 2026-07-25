import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
import { ProtectedRoute } from '@app/providers/ProtectedRoute/ProtectedRoute.tsx';
import { CatalogLayout, HomeworkLayout } from '@shared/layouts';

const HomePage = lazy(() =>
  import('@/pages/HomePage/index.tsx').then(({ HomePage }) => ({ default: HomePage })),
);
const LoginPage = lazy(() =>
  import('@/pages/LoginPage/index.tsx').then(({ LoginPage }) => ({ default: LoginPage })),
);
const RegistrationPage = lazy(() =>
  import('@/pages/RegistrationPage/index.tsx').then(({ RegistrationPage }) => ({
    default: RegistrationPage,
  })),
);
const StudentPersonalAccountPage = lazy(() =>
  import('@/pages/StudentPersonalAccoutn/index.tsx').then(({ StudentPersonalAccountPage }) => ({
    default: StudentPersonalAccountPage,
  })),
);
const StudentObjectCatalogPage = lazy(() =>
  import('@/pages/StudentObjectCatalog/index.tsx').then(({ StudentObjectCatalogPage }) => ({
    default: StudentObjectCatalogPage,
  })),
);
const StudentCalendarPage = lazy(() =>
  import('@/pages/StudentPersonalCalendar/index.tsx').then(({ StudentCalendarPage }) => ({
    default: StudentCalendarPage,
  })),
);
const StudentHomeworkPage = lazy(() =>
  import('@/pages/StudentHomework/index.tsx').then(({ StudentHomeworkPage }) => ({
    default: StudentHomeworkPage,
  })),
);
const KnowledgeTestPage = lazy(() =>
  import('@/pages/KnowledgeTestPage/index.tsx').then(({ KnowledgeTestPage }) => ({
    default: KnowledgeTestPage,
  })),
);
const NotFoundPage = lazy(() =>
  import('@/pages/NotFound/NotFoundPage.tsx').then(({ NotFoundPage }) => ({
    default: NotFoundPage,
  })),
);
const StudentHomework = lazy(() =>
  import('@/widgets/StudentHomework/ui/StudentHomework.tsx').then(({ StudentHomework }) => ({
    default: StudentHomework,
  })),
);
const HomeworkTaskList = lazy(() =>
  import('@features/HomeworkTasks/ui/HomeworkTaskList/HomeworkTaskList.tsx').then(
    ({ HomeworkTaskList }) => ({ default: HomeworkTaskList }),
  ),
);
const CatalogObjectCards = lazy(() =>
  import('@widgets/ObjectsCatalog/CatalogObjectCards/CatalogObjectCards.tsx').then(
    ({ CatalogObjectCards }) => ({ default: CatalogObjectCards }),
  ),
);
const TaskThemeList = lazy(() =>
  import('@widgets/ObjectsCatalog/TaskThemeList/TaskThemeList.tsx').then(({ TaskThemeList }) => ({
    default: TaskThemeList,
  })),
);
const CatalogTaskList = lazy(() =>
  import('@entities/Catalog/ui/CatalogTaskList/CatalogTaskList.tsx').then(
    ({ CatalogTaskList }) => ({ default: CatalogTaskList }),
  ),
);
const KnowledgeTestSubjectCards = lazy(() =>
  import('@widgets/KnowledgeTest/ui/KnowledgeTestSubjectCards/KnowledgeTestSubjectCards.tsx').then(
    ({ KnowledgeTestSubjectCards }) => ({ default: KnowledgeTestSubjectCards }),
  ),
);
const KnowledgeTestSubjectDetails = lazy(() =>
  import('@widgets/KnowledgeTest/ui/KnowledgeTestSubjectDetails/KnowledgeTestSubjectDetails.tsx').then(
    ({ KnowledgeTestSubjectDetails }) => ({ default: KnowledgeTestSubjectDetails }),
  ),
);
const KnowledgeTest = lazy(() =>
  import('@widgets/KnowledgeTest/KnowledgeTest.tsx').then(({ KnowledgeTest }) => ({
    default: KnowledgeTest,
  })),
);

export type AppRouteHandle = {
  breadcrumb?: string | ((_match: any) => string);
};

export type AppRouteObject = RouteObject & {
  handle?: AppRouteHandle;
  children?: AppRouteObject[];
};

export const CATALOG_ITEMS = [
  { id: 'ephysic', path: 'ephysic', title: 'ЕГЭ Физика' },
  { id: 'emath', path: 'emath', title: 'ЕГЭ Математика' },
  { id: 'ophysic', path: 'ophysic', title: 'ОГЭ Физика' },
  { id: 'omath', path: 'omath', title: 'ОГЭ Математика' },
] as const;

export type SubjectPath = (typeof CATALOG_ITEMS)[number]['path'];

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

export const getRoutesConfig = (): AppRouteObject[] => [
  {
    path: PATHS.HOME,
    element: <HomePage />,
  },
  {
    path: PATHS.LOGIN,
    element: <LoginPage />,
  },
  {
    path: PATHS.REGISTRATION,
    element: <RegistrationPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: PATHS.STUDENT.ACCOUNT,
        element: <StudentPersonalAccountPage />,
      },
      {
        path: `${PATHS.STUDENT.CATALOG}`,
        element: <StudentObjectCatalogPage />,
        children: [
          {
            index: true,
            element: <CatalogObjectCards />,
          },
          {
            path: ':subjectId',
            element: <CatalogLayout />,
            children: [
              {
                index: true,
                element: <TaskThemeList />,
              },
              {
                path: ':themeId',
                element: <CatalogTaskList />,
              },
            ],
          },
        ],
      },
      {
        path: PATHS.STUDENT.CALENDAR,
        element: <StudentCalendarPage />,
        handle: {
          breadcrumb: 'Календарь заданий',
        },
      },
      {
        path: PATHS.STUDENT.HOMEWORK,
        element: <StudentHomeworkPage />,
        children: [
          {
            index: true,
            element: <StudentHomework />,
          },
          {
            path: ':homeworkId',
            element: <HomeworkLayout />,
            children: [
              {
                index: true,
                element: <HomeworkTaskList />,
              },
            ],
          },
        ],
      },
      {
        path: PATHS.TEST,
        element: <KnowledgeTestPage />,
        children: [
          {
            index: true,
            element: <KnowledgeTestSubjectCards />,
          },
          {
            path: ':subjectId',
            element: <KnowledgeTestSubjectDetails />,
          },
          {
            path: ':subjectId/run',
            element: <KnowledgeTest />,
          },
        ],
      },
    ],
  },
  {
    path: PATHS.NOT_FOUND,
    element: <NotFoundPage />,
  },
];
