import { RouteObject } from 'react-router-dom';
import { StudentHomework } from '@/widgets/StudentHomework/ui/StudentHomework.tsx';
import { HomeworkTaskList } from '@features/HomeworkTasks';
import { ProtectedRoute } from '@app/providers/ProtectedRoute/ProtectedRoute.tsx';
import { CatalogObjectCards, TaskThemeList } from '@widgets/ObjectsCatalog';
import {
  KnowledgeTest,
  KnowledgeTestSubjectCards,
  KnowledgeTestSubjectDetails,
} from '@widgets/KnowledgeTest';
import { CatalogLayout, HomeworkLayout } from '@shared/layouts';
import {
  HomePage,
  KnowledgeTestPage,
  LoginPage,
  NotFoundPage,
  RegistrationPage,
  StudentCalendarPage,
  StudentHomeworkPage,
  StudentObjectCatalogPage,
  StudentPersonalAccountPage,
} from '@/pages';
import { CatalogTaskList } from '@entities/Catalog';

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
