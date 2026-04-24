import { TaskCountByNumber } from '@shared/types/types.ts';

export type KnowledgeTestSubjectId = 'emath' | 'omath' | 'ephysic' | 'ophysic';
export type KnowledgeTestDifficultyLevel = 'easy' | 'medium' | 'hard';

export interface KnowledgeTestSubjectCode {
  subjectCode: KnowledgeTestSubjectId;
}

export interface TestPoolNumberMeta {
  taskNumber: number;
  availableTotal: number;
  availableByDifficulty: {
    easy: number;
    medium: number;
    hard: number;
  };
  maxSelectableForTest: number; // 0..2
}

export interface GetTestPoolMetaData {
  subjectId: number;
  subjectCode: KnowledgeTestSubjectId;
  subjectName: string;
  testTaskNumbers: number[]; // [1..12]
  targetTotalTasks: number; // сейчас 20
  minPossibleTotalTasks: number;
  maxPossibleTotalTasks: number;
  canBuildTarget: boolean;
  missingTaskNumbers: number[];
  numbers: TestPoolNumberMeta[];
}

export type GetTestPoolMetaResponse = GetTestPoolMetaData;

export interface TestTaskPublic {
  id: number;
  taskNumber: number;
  orderIndex: number;
  difficulty: KnowledgeTestDifficultyLevel;
  content: string;
  originalTex: string | null;
  answerFormat: string | null;
}

export interface StartTestData {
  testId: number;
  subjectId: number;
  subjectCode: KnowledgeTestSubjectId;
  targetTotalTasks: number;
  totalTasks: number;
  countsByNumber: TaskCountByNumber[];
  tasks: TestTaskPublic[];
}

export type StartTestResponse = StartTestData;

export interface SubmitTestAnswerRequest {
  taskId: number;
  answer: string;
}

export interface SubmitTestAnswerData {
  isCorrect: boolean;
}

export type SubmitTestAnswerResponse = SubmitTestAnswerData;

export interface GeneratedHomeworkTopic {
  id: number;
  number: number;
  name: string;
}

export interface GeneratedHomeworkMeta {
  homeworkId: number;
  title: string;
  deadline: string;
  subjectId: number;
  taskNumber: number;
  topic: GeneratedHomeworkTopic;
}

export interface TestGenerationError {
  taskNumber: number;
  message: string;
}

export interface GenerateTestHomeworksData {
  testId: number;
  subjectId: number;
  generatedFromTaskNumbers: number[];
  generatedHomeworks: GeneratedHomeworkMeta;
  generationErrors: TestGenerationError;
}

export interface FinishTestData {
  totalTasks: number;
  correctTasks: number;
  masteryByTaskNumber: Record<string, boolean>;
  failedTaskNumbers: number[];
  hasFailedTaskNumbers: boolean;
}

export type FinishTestResponse = FinishTestData;

export interface TestReviewItem {
  taskId: number;
  taskNumber: number;
  orderIndex: number;
  difficulty: 'easy' | 'medium' | 'hard' | string;
  content: string;
  originalTex: string | null;
  answerFormat: string | null;
  userAnswer: string | null;
  correctAnswer: string;
  isCorrect: boolean;
}

export interface GetTestReviewData {
  testId: number;
  subjectId: number;
  totalTasks: number;
  correctTasks: number;
  answers: TestReviewItem[];
}

export type GetTestReviewDataResponse = GetTestReviewData;

export interface GenerateTestHomeworkRequest {
  taskNumbers?: number[];
}

export interface KnowledgeTestSubject {
  id: KnowledgeTestSubjectId;
  title: string;
  examLabel: string;
  subjectLabel: string;
  examTaskCount: number;
}
