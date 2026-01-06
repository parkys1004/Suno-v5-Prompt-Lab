
export interface PromptResult {
  style: string;
  lyrics: string;
  title: string;
  tags: string[];
  vibe: string;
}

export interface HistoryItem extends PromptResult {
  id: string;
  timestamp: number;
}
