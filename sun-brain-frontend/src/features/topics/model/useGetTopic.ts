import { useTopics } from '@features/topics';

export const useGetTopic = (topicId: string) => {
  const { data: topics } = useTopics(topicId);

  if (!topics) return;

  return topics.find((topic) => topic.number === Number(topicId));
};
