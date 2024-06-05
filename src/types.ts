export type Message =
  | { op: "connect" }
  | { op: "open"; buffer: ArrayBuffer; name: string }
  | { op: "open-url", url: string };

export interface OpenOptions {
  baseUrl?: string;
  fullEditor?: boolean;
  language?: language;
}

export type language = "us" | "id" | "ml" | "cz" | "dk" | "de" | "es" | "ph" | "fr" | "hr" | "it" | "nl" | "no" | "pl" | "pt" | "br" | "ro" | "rs" | "ru" | "fi" | "se" | "tr" | "vn" | "th" | "gr" | "kr" | "jp" | "cn" | "tw";