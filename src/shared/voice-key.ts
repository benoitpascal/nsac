/**
 * Names the recorded voice file of a line, so the generation script and the page agree on it:
 * two FNV-1a hashes of the text with different seeds, as 16 hex digits.
 */
export const voiceKey = (text: string) => {
  const line = text.normalize('NFC');
  const hash = (seed: number) => {
    let value = seed;
    for (const char of line) {
      value ^= char.codePointAt(0) ?? 0;
      value = Math.imul(value, 0x01000193) >>> 0;
    }
    return value.toString(16).padStart(8, '0');
  };
  return hash(0x811c9dc5) + hash(0x050c5d1f);
};
