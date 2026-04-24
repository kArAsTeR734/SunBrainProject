import { api } from '@/api/config/api.config.ts';

export class AIService {
  public static async test(): Promise<string> {
    const response = await api.post(
      '/api/ai/chat',
      {
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          {
            role: 'user',
            content: 'Сгенерируй 5 задач по квадратным уравнениям',
          },
        ],
      },
      {
        headers: { 'Content-Type': 'application/json' },
      },
    );

    console.log(response.data);
    return response.data.content;
  }
}
