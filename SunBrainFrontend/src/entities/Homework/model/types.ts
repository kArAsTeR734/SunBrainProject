import { Task } from '@entities/Task/model/types.ts';

export interface HomeworkBase {
  id: number;
  title: string;
  subject: string;
  deadline: string;
}

export interface HomeworkTopic {
  id: number;
  number: string;
  name: string;
  code: string;
}

export interface Homework extends HomeworkBase {
  tasks: Task[];
  topic: HomeworkTopic;
}

export interface HomeworkListItem extends HomeworkBase {
  tasksCount: number;
}

export interface MyHomeworksResponse {
  homeworks: HomeworkListItem[];
}

export interface CheckAnswerResponse {
  correct: boolean;
  points: number;
}
