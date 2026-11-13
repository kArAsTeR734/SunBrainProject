import { request } from '@shared/api';
import { api } from '@shared/api';

import type { TopicResponse } from '../model/types';

export class TopicService {
  public static async getTopicsById(subjectId: string): Promise<TopicResponse> {
    return request(api.get(`api/topics/${subjectId}`));
  }
}
