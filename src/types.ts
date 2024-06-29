export interface ApiQuote {
  author: string;
  category: string;
  text: string;
}

export interface ApiQuotes {
  [id: string]: ApiQuote;
}

export interface Post extends ApiQuote {
  id: string;
}

export interface QuoteMutation {
  author: string;
  category: string;
  text: string;
}