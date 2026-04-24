import { request } from '@shared/api/api-client.ts';
import { api } from '@/api/config/api.config.ts';
import {
  Homework,
  MyHomeworksResponse,
} from '@entities/Homework/model/types.ts';

export class HomeworkService {
  static async getUserHomeworkList(): Promise<MyHomeworksResponse> {
    return request(api.get('/api/homework/my'));
  }

  static async getUserHomeworkTasks(homeworkId: number): Promise<Homework> {
    return request(api.get(`/api/homework/${homeworkId}`));
  }
}
