import { useCallback, useState } from 'react';

export const useTask = () => {
  const [isTaskComplete, setIsTaskComplete] = useState<boolean>(false);

  const toggleTaskComplete = useCallback((isCorrect: boolean) => {
    setIsTaskComplete(isCorrect);
  }, []);

  return {
    isTaskComplete,
    toggleTaskComplete,
  };
};
