import { request } from '@shared/api';
import { api } from '@/api/config/api.config.ts';
import type { Homework, MyHomeworksResponse } from '@entities/Homework';

export class HomeworkService {
  static async getUserHomeworkList(): Promise<MyHomeworksResponse> {
    return request(api.get('/api/homework/my'));
  }

  static async getUserHomeworkTasks(homeworkId: number): Promise<Homework> {
    return request(api.get(`/api/homework/${homeworkId}`));
  }
}
