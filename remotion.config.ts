// remotion.config.ts
// Fichier de configuration pour le bundling Remotion (utilisé par le backend)

import { Config } from '@remotion/cli/config';

// Configuration pour le rendu côté serveur
Config.setVideoImageFormat('jpeg');
Config.setOverwriteOutput(true);

export default Config;
