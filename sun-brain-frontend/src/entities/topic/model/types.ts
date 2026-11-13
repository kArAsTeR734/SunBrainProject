export interface Topic {
  id: number;
  name: string;
  number: string;
}

export type TopicResponse = {
  topics: Topic[];
};
