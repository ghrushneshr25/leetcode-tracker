export interface TopicTag {
  name: string;
  slug: string;
}

export interface Example {
  number: number;
  images?: string[];
  input?: string;
  output?: string;
  explanation?: string;
  notes?: string[];
}

export interface Question {
  difficulty: "EASY" | "MEDIUM" | "HARD";
  id: number;
  questionFrontendId: string;
  status: string;
  title: string;
  titleSlug: string;
  topicTags: TopicTag[];

  parsedDescription?: string;
  customJudge?: string;
  examples?: Example[];
  constraints?: string; // currently stored as a string in JSON
  followUp?: string;
  completed: boolean;
  completedAt?: string;
  needsReattempt?: boolean;
}