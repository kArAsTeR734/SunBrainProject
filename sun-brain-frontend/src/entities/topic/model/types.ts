export interface Topic {
  id: number;
  name: string;
  number: number;
}

export type TopicResponse = {
  topics: Topic[];
};
