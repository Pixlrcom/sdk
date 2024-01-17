export type Message =
  | { op: "connect" }
  | { op: "open"; buffer: ArrayBuffer; name: string };

export interface OpenOptions {
  baseUrl?: string;
}
