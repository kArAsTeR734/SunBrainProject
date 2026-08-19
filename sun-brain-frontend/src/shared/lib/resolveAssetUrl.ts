import { API_BASE_URL } from '@shared/api/config/api.config.ts';

export const resolveAssetUrl = (value?: string | null) => {
  if (!value) {
    return '';
  }

  const apiBaseUrl = API_BASE_URL.replace(/\/$/, '');

  try {
    const url = new URL(value, apiBaseUrl);

    if (url.pathname.startsWith('/uploads/')) {
      return `${apiBaseUrl}${url.pathname}${url.search}${url.hash}`;
    }
  } catch {
    return value;
  }

  return value;
};
