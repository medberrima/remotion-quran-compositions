/**
 * Split Arabic ayah text into chunks ≤ maxChars on word boundaries.
 * Translation is intentionally NOT split here — see AyahScene for strategy.
 */
export function splitArabicIntoChunks(text: string, maxChars = 50): string[] {
  if (text.length <= maxChars) return [text];

  const words   = text.split(" ");
  const chunks: string[] = [];
  let   current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length <= maxChars) {
      current = candidate;
    } else {
      if (current) chunks.push(current.trim());
      current = word;
    }
  }
  if (current) chunks.push(current.trim());

  return chunks;
}