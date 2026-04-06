import { CSSProperties } from "react";
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

if (typeof document !== "undefined") {
  const STYLE_ID = "__surah-name-v4-style__";
  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      @font-face {
        font-family: 'surah-name-v4-icon';
        src: url('${SURAH_FONT_URL}') format('truetype');
        font-display: swap;
      }
    `;
    document.head.appendChild(style);
  }
}

const surahLigature = (n: number) =>
  `surah${String(n).padStart(3, "0")}`;

/**
 * Convert Western digits to Arabic-Indic numerals
 * 1 → ١   12 → ١٢   114 → ١١٤
 */
const toArabicIndic = (n: number): string =>
  String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[parseInt(d)]);

/**
 * U+06DD  ARABIC END OF AYAH  ۝
 * When this character precedes Arabic-Indic digits inside the Amiri (or any
 * Quran-capable) font, it renders as the decorative ayah-number medallion
 * that appears at the end of each verse in a printed Mushaf.
 *
 * Example:  ۝١   ۝١٢   ۝١١٤
 */
const ayahOrnament = (ayahNumber: number): string =>
  `\u06DD${toArabicIndic(ayahNumber)}`;

// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  ayah: SelectedAyah;
  language: Language;
  isChunk?: boolean;
  isLastChunk?: boolean; // ← show ayah number ornament at end of last chunk
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

  // Show ornament when: full ayah (not a chunk) OR this is the last chunk
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

  const separatorStyle: CSSProperties = {
    width: "60px",
    height: "1px",
    background: "rgba(255,255,255,0.25)",
    margin: "16px auto 0",
    borderRadius: "1px",
  };

  // Arabic verse block — inline with the ornament at the end
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

  /**
   * Ayah ornament style — same Amiri font so the medallion renders natively.
   * Slightly smaller than the verse text so it sits elegantly at the end.
   */
  const ornamentStyle: CSSProperties = {
    fontFamily: '"Amiri", "Traditional Arabic", serif',
    fontSize: "46px",         // slightly smaller than verse
    lineHeight: "inherit",
    color: "rgba(255,255,255,0.85)",
    textShadow: "0 2px 12px rgba(0,0,0,0.5)",
    fontWeight: 400,
    display: "inline",
    marginInlineStart: "6px", // small gap after verse text (RTL-aware)
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
        {/* <div style={separatorStyle} /> */}
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