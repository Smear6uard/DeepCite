export interface Source {
  url: string;
  scraperUsed: string | null;
  error: string | null;
}

export interface Attachment {
  filename: string;
  type: string;
}

export interface Message {
  role: "user" | "ai";
  content: string;
  displayedContent?: string;
  isError?: boolean;
  isStreaming?: boolean;
  sources?: Source[];
  attachment?: Attachment;
  timestamp: number;
}

export interface UploadedFile {
  content: string;
  filename: string;
  type: string;
}

export interface FrontendMessage {
  role: "user" | "ai";
  content: string;
}

export interface ScrapedSource {
  url: string;
  content: string;
  scraperUsed: string | null;
  error: string | null;
}

export interface ParsedDocument {
  content: string;
  type: "pdf" | "docx" | "doc";
  pageCount?: number;
  error?: string;
  scraperUsed?: string;
}

export interface StreamEvent {
  type: "status" | "content" | "sources";
  message?: string;
  text?: string;
  data?: Source[];
}
