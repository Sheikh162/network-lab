export type Node = {
  id: string;
  status: 'running' | 'stopped';
  pid: number | null;
  vncPort: number | null;
  overlayPath: string;
  guacamoleConnectionId: string | null;
  guacamoleUrl: string | null;
};