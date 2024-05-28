export type Message =
  | { op: "connect" }
  | { op: "open"; buffer: ArrayBuffer; name: string }
  | { op: "open-url", url: string };

export interface OpenOptions {
  baseUrl?: string;
  fullEditor?: boolean;
}
