/**
 * Splits Arabic (or any) text into chunks that fit comfortably on screen.
 * Splits on word boundaries so no word is cut mid-way.
 *
 * @param text      Full ayah text
 * @param maxChars  Max characters per chunk (default 100)
 * @returns         Array of text chunks
 */
export function splitIntoChunks(text: string, maxChars = 100): string[] {
  // Short text — no split needed
  if (text.length <= maxChars) return [text];

  const words = text.split(" ");
  const chunks: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;

    if (candidate.length <= maxChars) {
      current = candidate;
    } else {
      // Push current chunk and start a new one
      if (current) chunks.push(current);
      current = word;
    }
  }

  // Push the last remaining chunk
  if (current) chunks.push(current);

  return chunks;
}
