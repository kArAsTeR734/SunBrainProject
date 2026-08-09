import type { Homework, MyHomeworksResponse } from '@entities/Homework';
import { request } from '@shared/api';

import { api } from '@/api/config/api.config.ts';

export class HomeworkService {
  static async getUserHomeworkList(): Promise<MyHomeworksResponse> {
    return request(api.get('/api/homework/my'));
  }

  static async getUserHomeworkTasks(homeworkId: number): Promise<Homework> {
    return request(api.get(`/api/homework/${homeworkId}`));
  }
}
