export const getTestSessionKey = (testId: number) => `knowledge-test-${testId}`;

export const setTestSessionData = <T>(testId: number, data: T) => {
  sessionStorage.setItem(getTestSessionKey(testId), JSON.stringify(data));
};

export const getTestSessionData = <T>(testId: number): T | null => {
  const raw = sessionStorage.getItem(getTestSessionKey(testId));
  if (!raw) {
    return null;
  }
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
};

export const clearTestSnapshot = () => {
  sessionStorage.clear();
};
