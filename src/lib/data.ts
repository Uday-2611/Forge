export type SourceDetail = {
  sub: string;
  title: string;
  upvotes: number | null;
};

export type PainPoint = {
  id: string;
  score: number;
  title: string;
  industry: string;
  difficulty: string;
  source: string;
  sourceDetail: SourceDetail[];
  target: string;
  solution: string;
  keywords: string[];
  builders: number;
};


export const INDUSTRIES = [
  "All",
  "Finance",
  "Productivity",
  "Healthcare",
  "Creator Economy",
  "Other",
];
export const DIFFICULTIES = ["Any build", "Weekend", "Solo", "Team"];
export const SORTS = ["Trending", "New", "Pain Score"];
