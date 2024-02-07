export type Message =
  | { op: "connect" }
  | { op: "open"; buffer: ArrayBuffer; name: string };

export interface OpenOptions {
  baseUrl?: string;
  fullEditor?: boolean;
}

interface BaseSettings {
  referrer?: string;
  icon?: string;
  accent?: string;
  workspace?: string;
  tabLimit?: number;
  blockOpen?: boolean;
}

interface BasePayload {
  mode: "http" | "embedded";
  settings?: BaseSettings;
}

interface EmbeddedPayload extends BasePayload {
  mode: "embedded";
  origin: string;
}

interface HttpPayload extends BasePayload {
  mode: "http";
  openUrl: string;
  saveUrl: string;
  follow?: boolean;
}

export type PixlrPayloadJWT = EmbeddedPayload | HttpPayload;

export interface ApiAccessKeys {
  clientKey: string;
  clientSecret: string;
}
