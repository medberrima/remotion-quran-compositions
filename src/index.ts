// Root & Components
export { RemotionRoot } from './Root';
export { QuranVideo } from './components/QuranVideo';
export { AyahScene } from './components/AyahScene';
export { Background } from './components/Background';
export { TextDisplay } from './components/TextDisplay';
export { Watermark } from './components/Watermark';

// Utils
export { calculateTimeline } from './utils/timeline';
export { getAnimationStyle } from './utils/animations';
export { getAyahTextWithoutBasmala } from './utils/textUtils';

// Types
export type {
  Language,
  SelectedAyah,
  AnimationStyle,
  Background as BackgroundType,
  LogoPosition,
  LogoPositionId,
  VideoSettings,
  TimelineSegment,
} from './types';

// Icons
export {
  FacebookIcon,
  InstagramIcon,
  TiktokIcon,
  XIcon,
  GooglePlayIcon,
} from './assets/icons';
