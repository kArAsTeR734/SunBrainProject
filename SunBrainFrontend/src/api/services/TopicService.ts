import { request } from '@shared/api/api-client.ts';
import { api } from '@/api/config/api.config.ts';
import { TopicResponse } from '@features/Topics/models/types.ts';

export class TopicService {
  public static async getTopicsById(subjectId: string): Promise<TopicResponse> {
    return request(api.get(`api/topics/${subjectId}`));
  }
}
