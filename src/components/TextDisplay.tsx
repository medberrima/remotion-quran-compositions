import { CSSProperties, useEffect, useRef } from "react";
import { continueRender, delayRender } from "remotion";
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
const SURAH_FONT_FAMILY = "surah-name-v4-icon";

// Inject the @font-face rule once at module level.
// This makes the rule available to Chromium — but does NOT guarantee
// the font is decoded. That is handled below with delayRender.
if (typeof document !== "undefined") {
  const STYLE_ID = "__surah-name-v4-style__";
  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      @font-face {
        font-family: '${SURAH_FONT_FAMILY}';
        src: url('${SURAH_FONT_URL}') format('truetype');
        font-display: block;
      }
    `;
    document.head.appendChild(style);
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────

const surahLigature = (n: number) => `surah${String(n).padStart(3, "0")}`;

/** Western digits → Arabic-Indic numerals:  1 → ١   12 → ١٢ */
const toArabicIndic = (n: number): string =>
  String(n).replace(/\d/g, (d) => "٠١٢٣٤٥٦٧٨٩"[parseInt(d)]);

/**
 * U+06DD  ARABIC END OF AYAH  ۝
 * Rendered by Amiri as the decorative medallion at the end of a verse.
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
  // ── Tell Remotion to wait until both fonts are decoded ───────────────────
  // delayRender() pauses the renderer for this frame until continueRender()
  // is called. Without this the headless Chromium screenshots the frame
  // before the font bytes are available and the surah name disappears.
  const fontHandleRef = useRef<ReturnType<typeof delayRender> | null>(null);

  useEffect(() => {
    fontHandleRef.current = delayRender("Loading surah-name and Amiri fonts");

    Promise.all([
      // Surah ligature icon font
      document.fonts.load(`76px '${SURAH_FONT_FAMILY}'`, surahLigature(ayah.surahNumber)),
      // Arabic verse / ornament font
      document.fonts.load(`52px 'Amiri'`),
    ])
      .catch(() => {
        // Never block the render — if the font fails, continue anyway
      })
      .finally(() => {
        if (fontHandleRef.current !== null) {
          continueRender(fontHandleRef.current);
          fontHandleRef.current = null;
        }
      });

    return () => {
      // Safety: release the handle if the component unmounts first
      if (fontHandleRef.current !== null) {
        continueRender(fontHandleRef.current);
        fontHandleRef.current = null;
      }
    };
  }, [ayah.surahNumber]);

  // ── Data ─────────────────────────────────────────────────────────────────
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

  // Show ornament for a full ayah OR the last chunk of a split ayah
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

  const surahNameStyle: CSSProperties = {
    fontFamily: `'${SURAH_FONT_FAMILY}'`,
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
      <div style={surahHeaderRowStyle}>
        <span style={surahNameStyle}>
          {surahLigature(ayah.surahNumber)}
        </span>
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