export interface SearchBarProps {
  query: string;
  onSearch: (query: string) => void;
}

export interface SearchBarState {
  input: string;
}
