export interface MagicSettings {
  secretPhrase: string;
  typingSpeed: number; // For potential future auto-typing features
  fontSize: number;
}

export enum DragState {
  CLOSED = 'CLOSED',
  OPEN = 'OPEN'
}