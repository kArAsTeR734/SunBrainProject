interface TestTaskInterface {
  id: number;
  title: string;
  isAnswered: boolean;
  isCurrent: boolean;
  orderIndex: number;
}

export type TestTask = TestTaskInterface;
