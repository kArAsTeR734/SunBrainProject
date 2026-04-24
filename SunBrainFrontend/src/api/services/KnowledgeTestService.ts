import {
  FinishTestResponse,
  GenerateTestHomeworkRequest,
  GenerateTestHomeworksData,
  GetTestPoolMetaResponse,
  GetTestReviewDataResponse,
  KnowledgeTestSubjectCode,
  StartTestResponse,
  SubmitTestAnswerRequest,
  SubmitTestAnswerResponse,
} from '@features/Test/models/types.ts';
import { request } from '@shared/api/api-client.ts';
import { api } from '@/api/config/api.config.ts';

export class KnowledgeTestService {
  public static async getTestMetaData({
    subjectCode,
  }: KnowledgeTestSubjectCode): Promise<GetTestPoolMetaResponse> {
    return request(api.get(`/api/test/subjects/${subjectCode}/pool-meta`));
  }

  public static async startTest({
    subjectCode,
  }: KnowledgeTestSubjectCode): Promise<StartTestResponse> {
    return request(
      api.post('/api/test/start', {
        subjectCode,
      }),
    );
  }

  public static async testSubmitAnswer(
    { testId }: { testId: number },
    { taskId, answer }: SubmitTestAnswerRequest,
  ): Promise<SubmitTestAnswerResponse> {
    return request(
      api.post(`/api/test/${testId}/answer`, {
        taskId,
        answer,
      }),
    );
  }

  public static async finishTest({
    testId,
  }: {
    testId: number;
  }): Promise<FinishTestResponse> {
    return request(api.post(`/api/test/${testId}/finish`));
  }

  public static async generateHomeworks(
    { testId }: { testId: number },
    body: GenerateTestHomeworkRequest = {},
  ): Promise<GenerateTestHomeworksData> {
    return request(api.post(`/api/test/${testId}/generate-homeworks`, body));
  }

  public static async getTestReview({
    testId,
  }: {
    testId: number;
  }): Promise<GetTestReviewDataResponse> {
    return request(api.get(`/api/test/${testId}/review`));
  }
}
