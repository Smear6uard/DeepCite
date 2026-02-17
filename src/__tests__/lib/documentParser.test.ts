import { describe, it, expect, vi } from "vitest";

// Mock unpdf and mammoth
vi.mock("unpdf", () => ({
  extractText: vi.fn(),
}));

vi.mock("mammoth", () => ({
  default: {
    extractRawText: vi.fn(),
  },
}));

describe("documentParser", () => {
  it("rejects invalid PDF buffer", async () => {
    const { parsePDF } = await import("@/lib/documentParser");
    const result = await parsePDF(Buffer.from("not a pdf"));
    expect(result.error).toContain("Invalid PDF");
    expect(result.content).toBe("");
  });

  it("rejects empty buffer", async () => {
    const { parsePDF } = await import("@/lib/documentParser");
    const result = await parsePDF(Buffer.alloc(0));
    expect(result.error).toContain("empty");
  });

  it("returns null for unknown document type", async () => {
    const { parseDocumentFromBuffer } = await import("@/lib/documentParser");
    const result = await parseDocumentFromBuffer(
      Buffer.from("test"),
      "file.txt"
    );
    expect(result).toBeNull();
  });

  it("rejects .doc format", async () => {
    const { parseDocumentFromBuffer } = await import("@/lib/documentParser");
    const result = await parseDocumentFromBuffer(
      Buffer.from("test"),
      "file.doc"
    );
    expect(result?.error).toContain("Legacy .doc format");
  });

  it("detects document types from URL", async () => {
    const { getDocumentType } = await import("@/lib/documentParser");
    expect(getDocumentType("https://example.com/file.pdf")).toBe("pdf");
    expect(getDocumentType("https://example.com/file.docx")).toBe("docx");
    expect(getDocumentType("https://example.com/file.doc")).toBe("doc");
    expect(getDocumentType("https://example.com/file.txt")).toBeNull();
  });

  it("parses DOCX successfully", async () => {
    const mammoth = await import("mammoth");
    vi.mocked(mammoth.default.extractRawText).mockResolvedValue({
      value: "Hello world from DOCX",
      messages: [],
    });

    const { parseDOCX } = await import("@/lib/documentParser");
    const result = await parseDOCX(Buffer.from("fake docx"));
    expect(result.content).toBe("Hello world from DOCX");
    expect(result.type).toBe("docx");
  });
});
