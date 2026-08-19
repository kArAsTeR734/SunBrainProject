import type { TopicResponse } from '@features/topics';
import { request } from '@shared/api';
import { api } from '@shared/api/config/api.config.ts';

export class TopicService {
  public static async getTopicsById(subjectId: string): Promise<TopicResponse> {
    return request(api.get(`api/topics/${subjectId}`));
  }
}
