import { loadFont as loadFontFromFile } from "@remotion/fonts";
import { continueRender, delayRender } from "remotion";

// Google fonts
import { loadFont as loadAmiri } from "@remotion/google-fonts/Amiri";
import { loadFont as loadCairo } from "@remotion/google-fonts/Cairo";

import surahFontUrl from "../../assets/fonts/surah-name-v4.ttf";

export const { fontFamily: amiriFamily } = loadAmiri("normal", {
  weights: ["400", "700"],
  subsets: ["arabic"],
});

export const { fontFamily: cairoFamily } = loadCairo("normal", {
  weights: ["400", "500", "700"],
  subsets: ["arabic", "latin"],
});

export const surahFontFamily = "surah-name-v4-icon";

const handle = delayRender("Loading surah-name font");

loadFontFromFile({
  family: surahFontFamily,
  url: surahFontUrl,
})
  .then(() => continueRender(handle))
  .catch((err) => {
    console.error("Surah font failed:", err);
    continueRender(handle);
  });
