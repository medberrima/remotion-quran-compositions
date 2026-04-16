import { CSSProperties } from "react";
import { delayRender, continueRender } from "remotion";
import {
  FacebookIcon,
  InstagramIcon,
  TiktokIcon,
  GooglePlayIcon,
  XIcon,
} from "../assets/icons";
import type { Language, SelectedAyah } from "../types";
import { getAyahTextWithoutBasmala } from "../utils/textUtils";

// ── Surah Name V4 font ────────────────────────────────────────────────────
const SURAH_FONT_URL =
  "https://static-cdn.tarteel.ai/qul/fonts/surah-names/v4/surah-name-v4.ttf";

// ── Tell Remotion: "don't screenshot any frame until this font is ready" ──
//
// delayRender() is called at module level (outside any component).
// Remotion holds ALL frame captures until every open handle is released
// via continueRender(). This guarantees the font is decoded before
// the first screenshot is taken — fixing the blank surah name in exports.
//
// Why the old approach failed:
//   document.createElement('style') + @font-face only *registers* the font.
//   It does NOT download or decode it. The FontFace API's .load() does both.
//
const _surahFontHandle = delayRender("Loading surah-name-v4 font");

new FontFace(
  "surah-name-v4-icon",
  `url("${SURAH_FONT_URL}") format("truetype")`,
)
  .load()
  .then((loaded) => {
    document.fonts.add(loaded);
    continueRender(_surahFontHandle);
  })
  .catch((err) => {
    // Always release the handle — leaving it open makes Remotion hang forever
    console.error("⚠️ surah-name-v4 font failed to load:", err);
    continueRender(_surahFontHandle);
  });

// ─────────────────────────────────────────────────────────────────────────────

const surahLigature = (n: number) => `surah${String(n).padStart(3, "0")}`;

/**
 * Convert Western digits to Arabic-Indic numerals
 * 1 → ١   12 → ١٢   114 → ١١٤
 */
const toArabicIndic = (n: number): string =>
  String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[parseInt(d)]);

/**
 * U+06DD  ARABIC END OF AYAH  ۝
 * Renders as the decorative ayah-number medallion in Amiri / Quran fonts.
 */
const ayahOrnament = (ayahNumber: number): string =>
  `\u06DD${toArabicIndic(ayahNumber)}`;

// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  ayah: SelectedAyah;
  language: Language;
  isChunk?: boolean;
  isLastChunk?: boolean;
}

export const TextDisplay: React.FC<Props> = ({
  ayah,
  language,
  isChunk = false,
  isLastChunk = false,
}) => {
  const isArabic = language === "ar";

  const translationText =
    language === "ar"
      ? ayah.text_ar
      : language === "en"
        ? ayah.text_en
        : ayah.text_fr;

  const arabicDisplayText = isChunk
    ? ayah.text_ar
    : getAyahTextWithoutBasmala(ayah.text_ar);

  const showOrnament = !isChunk || isLastChunk;

  // ── Styles ────────────────────────────────────────────────────────────────
  const containerStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "30px 30px",
    maxWidth: "95%",
    textAlign: "center",
  };

  const surahHeaderRowStyle: CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "140px",
  };

  const surahIconStyle: CSSProperties = {
    fontFamily: "'surah-name-v4-icon'",
    fontSize: "76px",
    color: "rgba(255,255,255,0.92)",
    lineHeight: 1.1,
    userSelect: "none",
  };

  const surahNameStyle: CSSProperties = {
    fontFamily: "'surah-name-v4-icon'",
    fontSize: "76px",
    color: "rgba(255,255,255,0.92)",
    lineHeight: 1.1,
    textShadow: "0 2px 16px rgba(0,0,0,0.45)",
    userSelect: "none",
  };

  const arabicBlockStyle: CSSProperties = {
    direction: "rtl",
    textAlign: "center",
    lineHeight: 1.9,
  };

  const arabicTextStyle: CSSProperties = {
    fontFamily: '"Amiri", "Traditional Arabic", serif',
    fontSize: "52px",
    lineHeight: "inherit",
    color: "#FFFFFF",
    textShadow: "0 4px 20px rgba(0,0,0,0.6)",
    fontWeight: 400,
  };

  const ornamentStyle: CSSProperties = {
    fontFamily: '"Amiri", "Traditional Arabic", serif',
    fontSize: "46px",
    lineHeight: "inherit",
    color: "rgba(255,255,255,0.85)",
    textShadow: "0 2px 12px rgba(0,0,0,0.5)",
    fontWeight: 400,
    display: "inline",
    marginInlineStart: "6px",
  };

  const translationStyle: CSSProperties = {
    fontFamily: '"Cairo", "Inter", sans-serif',
    fontSize: isArabic ? "52px" : "34px",
    lineHeight: isArabic ? 1.9 : 1.6,
    color: isArabic ? "#FFFFFF" : "rgba(255,255,255,0.95)",
    textShadow: "0 2px 10px rgba(0,0,0,0.4)",
    direction: isArabic ? "rtl" : "ltr",
    fontWeight: isArabic ? 400 : 500,
    marginTop: "16px",
    marginBottom: isArabic ? "40px" : "0",
  };

  const metaStyle: CSSProperties = {
    fontFamily: '"Cairo", sans-serif',
    fontSize: "22px",
    color: "rgba(255,255,255,0.85)",
    marginTop: "40px",
    textShadow: "0 2px 12px rgba(0,0,0,0.5)",
    fontWeight: 500,
    letterSpacing: "0.5px",
  };

  const barStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "12px",
    padding: "10px 25px",
    margin: "28px 0 10px",
    background: "rgba(0, 0, 0, 0.23)",
    borderRadius: "50px",
    fontFamily: '"Cairo", sans-serif',
    fontSize: "18px",
    fontWeight: 700,
    color: "#FFFFFF",
    opacity: 0.9,
  };

  const storeIconStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "5px",
  };

  const socialRowStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
    opacity: 0.7,
    marginTop: "8px",
  };

  const handleStyle: CSSProperties = {
    fontFamily: '"Cairo", sans-serif',
    fontSize: "13px",
    fontWeight: 500,
    color: "#FFFFFF",
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div style={containerStyle}>

      {/* ── SURAH NAME HEADER ── */}
      <div>
        <div style={surahHeaderRowStyle}>
          <span style={surahNameStyle}>
            {surahLigature(ayah.surahNumber)}
          </span>
          <span style={surahIconStyle}>surah-icon</span>
        </div>
      </div>

      {/* ── ARABIC VERSE + AYAH ORNAMENT inline ── */}
      <div style={arabicBlockStyle}>
        <span style={arabicTextStyle}>{arabicDisplayText}</span>
        {showOrnament && (
          <span style={ornamentStyle}>
            {ayahOrnament(ayah.ayahNumber)}
          </span>
        )}
      </div>

      {/* ── TRANSLATION ── */}
      {language !== "ar" && (
        <div style={translationStyle}>{translationText}</div>
      )}

      {/* ── SURAH + AYAH REFERENCE ── */}
      <div style={metaStyle}>
        {ayah.surahName} • Ayah {ayah.ayahNumber}
      </div>

      {/* ── DOWNLOAD BAR ── */}
      <div style={barStyle}>
        <div style={storeIconStyle}>
          <GooglePlayIcon size={17} color="#FFFFFF" />
          Google Play
        </div>
        <span>•</span>
        Yaqeen Muslim - يقين المسلم
        <span>•</span>
        حمّل مجاناً
      </div>

      {/* ── SOCIAL ROW ── */}
      <div style={socialRowStyle}>
        <InstagramIcon size={16} color="#FFFFFF" />
        <FacebookIcon  size={16} color="#FFFFFF" />
        <XIcon         size={16} color="#FFFFFF" />
        <TiktokIcon    size={16} color="#FFFFFF" />
        <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>·</span>
        <span style={handleStyle}>@YaqeenMuslimApp</span>
      </div>

    </div>
  );
};