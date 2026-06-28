export interface TopicTag {
  name: string;
  slug: string;
}

export interface Question {
  id: number;
  questionFrontendId: string;
  title: string;
  titleSlug: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  completed: boolean;
  topicTags: TopicTag[];
  description: string;
  completedAt: string;
  needsReattempt: boolean;
}