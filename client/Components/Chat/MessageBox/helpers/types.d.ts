export type CaretPosition = {
  caretOffset: number;
  currentNode: Node | null;
};

export type MentionMode = {
  mode: boolean;
  text: string | null;
  position: number | null;
};

export type Suggestion = {
  id: number;
  title: string;
  type: string;
};

export type SuggestionBoxProps = {
  show: boolean;
  keyword: string | null;
  onSelect: ( suggestion: Suggestion ) => void;
};
