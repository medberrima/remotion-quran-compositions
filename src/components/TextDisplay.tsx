import { CSSProperties } from "react";
import {
  FacebookIcon,
  InstagramIcon,
  TiktokIcon,
  XIcon,
  GooglePlayIcon,
} from "../assets/icons";
import type { Language, SelectedAyah } from "../types";
import { getAyahTextWithoutBasmala } from "../utils/textUtils";

interface Props {
  ayah: SelectedAyah;
  language: Language;
}

// ─── Localised strings ────────────────────────────────────────────────────────
const STRINGS = {
  ar: {
    appName: "يقين المسلم",
    appSub: "قرآن • صلاة • قبلة",
    cta: "حمّل مجاناً",
    store: "Google Play",
    handle: "@YaqeenMuslimApp",
  },
  en: {
    appName: "Yaqeen Muslim",
    appSub: "Quran • Prayer • Qibla",
    cta: "Free Download",
    store: "Google Play",
    handle: "@YaqeenMuslimApp",
  },
  fr: {
    appName: "Yaqeen Muslim",
    appSub: "Coran • Prière • Qibla",
    cta: "Télécharger",
    store: "Google Play",
    handle: "@YaqeenMuslimApp",
  },
} as const;

// ─── Component ────────────────────────────────────────────────────────────────
export const TextDisplay: React.FC<Props> = ({ ayah, language }) => {
  const isArabic = language === "ar";
  const str = STRINGS[language];

  const translationText =
    language === "ar"
      ? ayah.text_ar
      : language === "en"
        ? ayah.text_en
        : ayah.text_fr;

  // ── Container ──────────────────────────────────────────────────────────────
  const containerStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "60px 50px",
    maxWidth: "95%",
    textAlign: "center",
    gap: "0px",
  };

  // ── Arabic verse ───────────────────────────────────────────────────────────
  const arabicTextStyle: CSSProperties = {
    fontFamily: '"Amiri", "Traditional Arabic", serif',
    fontSize: "52px",
    lineHeight: 1.9,
    color: "#FFFFFF",
    textShadow: "0 4px 20px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4)",
    marginBottom: "0px",
    direction: "rtl",
    fontWeight: 400,
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
  };

  // ── Translation ────────────────────────────────────────────────────────────
  const translationStyle: CSSProperties = {
    fontFamily: '"Inter", "Segoe UI", sans-serif',
    fontSize: isArabic ? "52px" : "34px",
    lineHeight: isArabic ? 1.9 : 1.6,
    color: isArabic ? "#FFFFFF" : "rgba(255,255,255,0.95)",
    textShadow: "0 3px 16px rgba(0,0,0,0.5), 0 2px 6px rgba(0,0,0,0.3)",
    direction: isArabic ? "rtl" : "ltr",
    fontWeight: isArabic ? 400 : 500,
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
    marginBottom: isArabic ? "40px" : "0",
  };

  // ── Surah meta ─────────────────────────────────────────────────────────────
  const metaStyle: CSSProperties = {
    fontFamily: '"Inter", sans-serif',
    fontSize: "22px",
    color: "rgba(255,255,255,0.85)",
    marginTop: "40px",
    textShadow: "0 2px 12px rgba(0,0,0,0.5)",
    fontWeight: 500,
    letterSpacing: "0.5px",
  };

  // ── Marketing footer card ──────────────────────────────────────────────────
  const footerCardStyle: CSSProperties = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "24px",
    padding: "18px 32px",
    margin: "36px 0 8px",
    background: "rgba(0, 0, 0, 0.55)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    border: "1.5px solid rgba(255, 255, 255, 0.18)",
    borderRadius: "20px",
    width: "100%",
    maxWidth: "720px",
    boxSizing: "border-box",
    // Flip row direction for Arabic so app info is on right
    flexDirection: isArabic ? "row-reverse" : "row",
  };

  // LEFT BLOCK — App identity
  const appIdentityStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: isArabic ? "flex-end" : "flex-start",
    gap: "2px",
    direction: isArabic ? "rtl" : "ltr",
    flex: "0 0 auto",
  };

  const appNameStyle: CSSProperties = {
    fontFamily: isArabic
      ? '"Amiri", "Traditional Arabic", serif'
      : '"Inter", sans-serif',
    fontSize: isArabic ? "26px" : "22px",
    fontWeight: 700,
    color: "#FFFFFF",
    textShadow: "0 2px 8px rgba(0,0,0,0.5)",
    lineHeight: 1.2,
    letterSpacing: isArabic ? "0" : "0.2px",
  };

  const appSubStyle: CSSProperties = {
    fontFamily: isArabic
      ? '"Amiri", "Traditional Arabic", serif'
      : '"Inter", sans-serif',
    fontSize: isArabic ? "18px" : "15px",
    fontWeight: 400,
    color: "rgba(255,255,255,0.75)",
    lineHeight: 1.3,
    letterSpacing: isArabic ? "0" : "0.3px",
  };

  // DIVIDER
  const vertDivStyle: CSSProperties = {
    width: "1.5px",
    height: "44px",
    background:
      "linear-gradient(to bottom, transparent, rgba(255,255,255,0.3), transparent)",
    flexShrink: 0,
  };

  // MIDDLE BLOCK — Social icons + handle
  const socialBlockStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
    flex: "1 1 auto",
  };

  const iconsRowStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  };

  const handleStyle: CSSProperties = {
    fontFamily: '"Inter", sans-serif',
    fontSize: "17px",
    fontWeight: 600,
    color: "rgba(255,255,255,0.9)",
    letterSpacing: "0.3px",
    textShadow: "0 1px 6px rgba(0,0,0,0.4)",
  };

  // RIGHT BLOCK — CTA + Google Play
  const ctaBlockStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column",
    alignItems: isArabic ? "flex-start" : "flex-end",
    gap: "4px",
    flex: "0 0 auto",
    direction: isArabic ? "rtl" : "ltr",
  };

  const ctaLabelStyle: CSSProperties = {
    fontFamily: isArabic
      ? '"Amiri", "Traditional Arabic", serif'
      : '"Inter", sans-serif',
    fontSize: isArabic ? "20px" : "15px",
    fontWeight: isArabic ? 700 : 600,
    color: "#4ADE80", // green accent — visible on any bg
    textShadow: "0 0 12px rgba(74,222,128,0.4)",
    lineHeight: 1.2,
    letterSpacing: isArabic ? "0" : "0.2px",
  };

  const storeRowStyle: CSSProperties = {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    flexDirection: isArabic ? "row-reverse" : "row",
  };

  const storeTextStyle: CSSProperties = {
    fontFamily: '"Inter", sans-serif',
    fontSize: "14px",
    fontWeight: 500,
    color: "rgba(255,255,255,0.7)",
    letterSpacing: "0.2px",
  };

  return (
    <div style={containerStyle}>
      {/* ── Arabic verse ─────────────────────────────────────── */}
      <div style={arabicTextStyle}>
        {getAyahTextWithoutBasmala(ayah.text_ar)}
      </div>

      {/* ── Translation (non-Arabic only) ───────────────────── */}
      {language !== "ar" && (
        <div style={translationStyle}>{translationText}</div>
      )}

      {/* ── Surah & Ayah reference ───────────────────────────── */}
      <div style={metaStyle}>
        {ayah.surahName} • {isArabic ? "الآية" : "Ayah"} {ayah.ayahNumber}
      </div>

      {/* ── Marketing Footer Card ────────────────────────────── */}
      <div style={footerCardStyle}>

        {/* App identity — name + subtitle */}
        <div style={appIdentityStyle}>
          <span style={appNameStyle}>{str.appName}</span>
          <span style={appSubStyle}>{str.appSub}</span>
        </div>

        <div style={vertDivStyle} />

        {/* Social icons + handle */}
        <div style={socialBlockStyle}>
          <div style={iconsRowStyle}>
            <InstagramIcon size={28} color="#FFFFFF" />
            <TiktokIcon    size={28} color="#FFFFFF" />
            <FacebookIcon  size={28} color="#FFFFFF" />
            <XIcon         size={28} color="#FFFFFF" />
          </div>
          <span style={handleStyle}>{str.handle}</span>
        </div>

        <div style={vertDivStyle} />

        {/* CTA + Google Play */}
        <div style={ctaBlockStyle}>
          <span style={ctaLabelStyle}>{str.cta} ↓</span>
          <div style={storeRowStyle}>
            <GooglePlayIcon size={16} color="rgba(255,255,255,0.7)" />
            <span style={storeTextStyle}>{str.store}</span>
          </div>
        </div>

      </div>
    </div>
  );
};