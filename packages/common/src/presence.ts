export interface PresenceData {
  mode: string | null;
  cursor: {
    container: string;
    position: { x: number; y: number }
  } | null;
  component: {
    id: string
    data?: any
  } | null;
}
