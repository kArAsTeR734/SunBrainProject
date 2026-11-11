export type Task = {
  id: number;
  number: string;
  question: string;
  solutionLatex: string;
  points: string;
};

export type HomeworkTask = {
  id: number;
  number: string;
  question: string;
  solutionLatex: string;
  points: string;
};

export type CatalogTask = {
  id: number;
  number: string;
  content: string;
  solutionLatex: string;
  points: string;
};

export interface CatalogItemsInterface {
  catalogTasks: CatalogTask[];
  nextCursor: number | null;
}

export type CatalogItemsResponse = CatalogItemsInterface;

export interface CheckAnswerResponse {
  correct: boolean;
  points: number;
}
