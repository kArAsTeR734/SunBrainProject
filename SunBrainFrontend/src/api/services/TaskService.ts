import { request } from '@shared/api';
import { api } from '@/api/config/api.config.ts';
import type { CheckAnswerResponse } from '@entities/Homework';
import type { CatalogItemsResponse } from '@entities/Task';

export class TaskService {
  static async checkTaskAnswer(taskId: number, answer: string): Promise<CheckAnswerResponse> {
    return request(api.post(`/api/tasks/${taskId}/check`, { answer }));
  }

  static async getCatalogTasks(themeId: number): Promise<CatalogItemsResponse> {
    return request(api.get(`/api/tasks/catalog/${themeId}`));
  }
}
