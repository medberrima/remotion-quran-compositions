export const getAyahTextWithoutBasmala = (text: string): string => {
  const basmalaPatterns = [
    'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ',
    'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    'بسم الله الرحمن الرحيم',
    'بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيم',
  ];


  let cleanedText = text;
  basmalaPatterns.forEach(pattern => {
    cleanedText = cleanedText.replace(new RegExp(`^${pattern}\\s*`, 'g'), '');
  });

  return cleanedText.trim();
};