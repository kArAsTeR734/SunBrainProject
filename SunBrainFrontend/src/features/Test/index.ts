export { TestNavigation } from './ui/TestNavigation/TestNavigation';

export { TestResults } from './ui/TestResut/TestResult';

export { getKnowledgeTestSubjectById, KNOWLEDGE_TEST_SUBJECTS } from './models/knowledgeTestConfig';

export { useFinishTestMutation } from './api/useFinishTestMutation.ts';
export { useGetKnowledgeTestTotalTaskCount } from './api/useGetKnowledgeTestTotalTaskCount.ts';
export { useStartTestMutation } from './api/useStartTestMutation.ts';
export { useSubmitTestTaskMutation } from './api/useSubmitTestTaskMutation.ts';
export { useTestData } from './models/hooks/useTestData';
export { useTestReview } from './api/useTestReview.ts';

export type * from './models/types';

export {
  clearTestSnapshot,
  getTestSessionData,
  getTestSessionKey,
  setTestSessionData,
} from './models/setTestToSessionStorage';
