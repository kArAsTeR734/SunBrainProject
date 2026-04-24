import { useTopics } from '@features/Topics/models/hooks/useTopics.ts';

export const useGetTopic = (topicId: string) => {
  const { data: topics } = useTopics(topicId);

  if (!topics) return;

  return topics.find((topic) => topic.number === Number(topicId));
};
