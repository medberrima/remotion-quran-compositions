/**
 * Splits Arabic text into chunks ≤ maxChars, breaking on word boundaries.
 */
export function splitArabicIntoChunks(text: string, maxChars = 50): string[] {
  if (text.length <= maxChars) return [text];

  const words = text.split(" ");
  const chunks: string[] = [];
  let current = "";

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
 * Splits a translation into exactly N chunks, proportionally aligned
 * with the Arabic chunks.
 *
 * Strategy:
 *  1. Try to split at natural punctuation boundaries (،  ,  .  ;  —)
 *  2. Fall back to proportional word-count split
 *
 * Each chunk i aligns with Arabic chunk i.
 */
export function splitTranslationIntoNChunks(text: string, n: number): string[] {
  if (n <= 1 || !text) return [text];

  const words = text.split(" ");
  const total = words.length;

  // — Try punctuation-aware split first —
  // Find indices of words ending with a natural break
  const breakPoints: number[] = [];
  const punctRe = /[،,\.;—!؟?]$/;

  for (let i = 0; i < total - 1; i++) {
    if (punctRe.test(words[i])) breakPoints.push(i + 1); // word index after punct
  }

  if (breakPoints.length >= n - 1) {
    // Pick n-1 break points spaced as evenly as possible
    const step = breakPoints.length / (n - 1);
    const chosen: number[] = [];
    for (let i = 0; i < n - 1; i++) {
      chosen.push(breakPoints[Math.round(i * step)]);
    }

    const chunks: string[] = [];
    let prev = 0;
    for (const bp of chosen) {
      chunks.push(words.slice(prev, bp).join(" ").trim());
      prev = bp;
    }
    chunks.push(words.slice(prev).join(" ").trim());
    return chunks;
  }

  // — Fallback: proportional word-count split —
  const chunkSize = Math.ceil(total / n);
  const chunks: string[] = [];
  for (let i = 0; i < n; i++) {
    const slice = words.slice(i * chunkSize, (i + 1) * chunkSize);
    chunks.push(slice.join(" ").trim());
  }

  // Pad if needed
  while (chunks.length < n) chunks.push("");

  return chunks;
}

/**
 * Distributes displayFrames across N chunks proportionally
 * to Arabic chunk character length — a reliable proxy for recitation time.
 *
 * If audioUrl is present, the proportional weight leans on char count
 * which closely mirrors how long each portion takes to recite.
 */
export function distributeFrames(
  arabicChunks: string[],
  totalDisplayFrames: number,
  chunkEnterFrames: number,
  chunkExitFrames: number
): number[] {
  const n = arabicChunks.length;
  const transitionFrames = (chunkEnterFrames + chunkExitFrames) * n;
  const availableDisplay = Math.max(totalDisplayFrames - transitionFrames, n * 10);

  const totalChars = arabicChunks.reduce((acc, c) => acc + c.length, 0);

  // Weight by char count → proxy for recitation duration
  const rawFrames = arabicChunks.map((c) =>
    Math.round((c.length / totalChars) * availableDisplay)
  );

  // Fix rounding drift so sum == availableDisplay
  const drift = availableDisplay - rawFrames.reduce((a, b) => a + b, 0);
  rawFrames[rawFrames.length - 1] += drift;

  return rawFrames.map((f) => Math.max(f, 10));
}