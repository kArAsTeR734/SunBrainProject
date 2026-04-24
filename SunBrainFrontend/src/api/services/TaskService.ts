import { request } from '@shared/api/api-client.ts';
import { api } from '@/api/config/api.config.ts';
import { CheckAnswerResponse } from '@entities/Homework/model/types.ts';
import { CatalogItemsResponse } from '@entities/Task/model/types.ts';

export class TaskService {
  static async checkTaskAnswer(
    taskId: number,
    answer: string,
  ): Promise<CheckAnswerResponse> {
    return request(api.post(`/api/tasks/${taskId}/check`, { answer }));
  }

  static async getCatalogTasks(themeId: number): Promise<CatalogItemsResponse> {
    return request(api.get(`/api/tasks/catalog/${themeId}`));
  }
}
