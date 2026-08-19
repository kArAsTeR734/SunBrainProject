import { ProtectedRoute } from '@app/routes/ProtectedRoute.tsx';
import { HomeworkLayout } from '@shared/layouts';
import { type AppRouteHandle, PATHS } from '@shared/routes';
import { CatalogLayout } from '@widgets/objects-catalog';
import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const HomePage = lazy(() =>
  import('@pages/home-page').then(({ HomePage }) => ({ default: HomePage })),
);
const LoginPage = lazy(() =>
  import('@pages/login-page').then(({ LoginPage }) => ({ default: LoginPage })),
);
const RegistrationPage = lazy(() =>
  import('@pages/registration-page').then(({ RegistrationPage }) => ({
    default: RegistrationPage,
  })),
);
const StudentPersonalAccountPage = lazy(() =>
  import('@pages/student-personal-account').then(({ StudentPersonalAccountPage }) => ({
    default: StudentPersonalAccountPage,
  })),
);
const StudentObjectCatalogPage = lazy(() =>
  import('@pages/student-object-catalog').then(({ StudentObjectCatalogPage }) => ({
    default: StudentObjectCatalogPage,
  })),
);
const StudentCalendarPage = lazy(() =>
  import('@pages/student-personal-calendar').then(({ StudentCalendarPage }) => ({
    default: StudentCalendarPage,
  })),
);
const StudentHomeworkPage = lazy(() =>
  import('@pages/student-homework').then(({ StudentHomeworkPage }) => ({
    default: StudentHomeworkPage,
  })),
);
const KnowledgeTestPage = lazy(() =>
  import('@pages/knowledge-test-page').then(({ KnowledgeTestPage }) => ({
    default: KnowledgeTestPage,
  })),
);
const NotFoundPage = lazy(() =>
  import('@pages/not-found').then(({ NotFoundPage }) => ({
    default: NotFoundPage,
  })),
);
const StudentHomework = lazy(() =>
  import('@widgets/student-homework').then(({ StudentHomework }) => ({
    default: StudentHomework,
  })),
);
const HomeworkTaskList = lazy(() =>
  import('@features/homework-tasks').then(({ HomeworkTaskList }) => ({
    default: HomeworkTaskList,
  })),
);
const CatalogObjectCards = lazy(() =>
  import('@widgets/objects-catalog').then(({ CatalogObjectCards }) => ({
    default: CatalogObjectCards,
  })),
);
const TaskThemeList = lazy(() =>
  import('@widgets/objects-catalog').then(({ TaskThemeList }) => ({
    default: TaskThemeList,
  })),
);
const CatalogTaskList = lazy(() =>
  import('@widgets/catalog-task-list').then(({ CatalogTaskList }) => ({
    default: CatalogTaskList,
  })),
);
const KnowledgeTestSubjectCards = lazy(() =>
  import('@widgets/knowledge-test').then(({ KnowledgeTestSubjectCards }) => ({
    default: KnowledgeTestSubjectCards,
  })),
);
const KnowledgeTestSubjectDetails = lazy(() =>
  import('@widgets/knowledge-test').then(({ KnowledgeTestSubjectDetails }) => ({
    default: KnowledgeTestSubjectDetails,
  })),
);
const KnowledgeTest = lazy(() =>
  import('@widgets/knowledge-test').then(({ KnowledgeTest }) => ({
    default: KnowledgeTest,
  })),
);

export type AppRouteObject = RouteObject & {
  handle?: AppRouteHandle;
  children?: AppRouteObject[];
};

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
