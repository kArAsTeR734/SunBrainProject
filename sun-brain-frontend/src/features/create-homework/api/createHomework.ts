import { api, request } from '@shared/api';

interface CreateHomeworkRequest {
  title: string;
  subjectCode: string;
  topicId: number;
  count: number;
  deadline: string;
}

export const createHomework = (data: CreateHomeworkRequest): Promise<{ id: number }> =>
  request(api.post('/api/homework', data));
