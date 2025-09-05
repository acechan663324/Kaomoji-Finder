
export interface Kaomoji {
  emoji: string;
  tags: string[];
}

export interface Category {
  name: string;
  kaomojis: Kaomoji[];
}
