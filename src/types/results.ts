export interface ResultItem {
  name: string;
  description: string;
}

export interface ResultsProps {
  results: ResultItem[];
  loading: boolean;
  error: string | null;
}
