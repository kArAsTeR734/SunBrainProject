import type { Task } from '@entities/task/@x/homework';

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
