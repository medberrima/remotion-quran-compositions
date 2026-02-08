export function getAyahTextWithoutBasmala(text: string): string {
  // Remove Basmala if present at the beginning
  const basmala = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ";
  
  if (text.startsWith(basmala)) {
    return text.slice(basmala.length).trim();
  }
  
  return text;
}
