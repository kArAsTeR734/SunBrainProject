import { AxiosResponse } from 'axios';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export async function request<T>(
  promise: Promise<AxiosResponse<ApiResponse<T>>>,
): Promise<T> {
  const response = await promise;

  if (!response.data.success) {
    throw new Error(response.data.message || 'API Error');
  }

  return response.data.data;
}
