/**
 * Split Arabic text into chunks ≤ maxChars on word boundaries.
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

/**
 * Merge an array of parts into exactly n groups (consecutive).
 * Distributes as evenly as possible.
 */
function mergeIntoNGroups(parts: string[], n: number): string[] {
  if (parts.length <= n) return parts; // can't exceed available parts

  const groups: string[] = [];
  const baseSize  = Math.floor(parts.length / n);
  const remainder = parts.length % n;
  let   cursor    = 0;

  for (let i = 0; i < n; i++) {
    const size  = baseSize + (i < remainder ? 1 : 0);
    const slice = parts.slice(cursor, cursor + size).join(" ").trim();
    groups.push(slice);
    cursor += size;
  }

  return groups;
}

/**
 * Proportional word-split fallback — splits into exactly n parts by word count.
 */
function splitByWordsProportion(text: string, n: number): string[] {
  const words    = text.split(" ");
  const chunkLen = Math.ceil(words.length / n);
  const result: string[] = [];

  for (let i = 0; i < n; i++) {
    const slice = words.slice(i * chunkLen, (i + 1) * chunkLen);
    if (slice.length) result.push(slice.join(" ").trim());
  }

  return result;
}

/**
 * Split a translation (EN/FR) into exactly n chunks.
 *
 * Strategy (in order of preference):
 *   1. Split on sentence endings  →  ". "  "! "  "? "
 *   2. Split on clause boundaries →  ", "  "; "  " - "
 *   3. Proportional word split    (fallback)
 *
 * Each strategy tries to get ≥ n parts, then merges them into exactly n groups.
 */
export function splitTranslationIntoNChunks(text: string, n: number): string[] {
  if (n <= 1) return [text];

  // 1. Sentence boundaries
  const sentences = text
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(Boolean);

  if (sentences.length >= n) {
    return mergeIntoNGroups(sentences, n);
  }

  // 2. Clause boundaries (comma, semicolon, em-dash, " - ")
  const clauses = text
    .split(/(?<=[,;])\s+|(?<=\s)-\s/)
    .map(s => s.trim())
    .filter(Boolean);

  if (clauses.length >= n) {
    return mergeIntoNGroups(clauses, n);
  }

  // 3. Proportional word fallback
  return splitByWordsProportion(text, n);
}