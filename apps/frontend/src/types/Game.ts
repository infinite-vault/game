export interface Game {
  id: number;
  name: string;
  round: number;
  section: 'move' | 'fight';
}
