import { useSearchParams } from 'react-router-dom';

export const useMySearchParams = <T extends string>(key: T): string | null => {
  const [params] = useSearchParams();

  return params.get(key);
};
