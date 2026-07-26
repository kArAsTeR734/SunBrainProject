import { request } from '@shared/api';
import { api } from '@/api/config/api.config.ts';
import type { TopicResponse } from '@features/Topics';

export class TopicService {
  public static async getTopicsById(subjectId: string): Promise<TopicResponse> {
    return request(api.get(`api/topics/${subjectId}`));
  }
}
