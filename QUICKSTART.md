# 🚀 Guide de Démarrage Rapide

## Ce que tu as maintenant

Un package NPM partagé `@yaqeen/remotion-compositions` qui contient toutes tes compositions Remotion.

## Structure du Projet

```
remotion-quran-compositions/
├── src/
│   ├── components/           # Tous tes composants Remotion
│   │   ├── QuranVideo.tsx   # ✅ Composition principale
│   │   ├── AyahScene.tsx    # ✅ Animation d'un ayah
│   │   ├── Background.tsx   # ✅ Fond (gradient/image/video)
│   │   ├── TextDisplay.tsx  # ✅ Affichage du texte
│   │   └── Watermark.tsx    # ✅ Logo/watermark
│   ├── utils/               # Fonctions utilitaires
│   │   ├── timeline.ts      # ✅ Calcul de la timeline
│   │   ├── animations.ts    # ✅ Styles d'animation
│   │   └── textUtils.ts     # ✅ Utilitaires texte
│   ├── assets/
│   │   └── icons.tsx        # ✅ Icônes sociales
│   ├── types.ts             # ✅ Types TypeScript
│   ├── index.ts             # ✅ Exports principaux
│   └── Root.tsx             # ✅ Root Remotion
├── examples/
│   ├── simple-backend.js    # 📝 Exemple backend simple
│   └── example-backend.ts   # 📝 Exemple backend TypeScript
├── package.json
├── tsconfig.json
├── README.md
└── INSTALLATION.md
```

## Installation en 3 étapes

### 1️⃣ Pusher sur GitHub

```bash
cd remotion-quran-compositions
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/TON_USERNAME/remotion-quran-compositions.git
git push -u origin main
```

### 2️⃣ Installer dans ton Frontend

```bash
cd ton-frontend-project
npm install git+https://github.com/TON_USERNAME/remotion-quran-compositions.git
```

**Modifier Root.tsx:**

```tsx
// ❌ AVANT
import { QuranVideo } from './compositions/QuranVideo';

// ✅ APRÈS
import { QuranVideo, calculateTimeline } from '@yaqeen/remotion-compositions';
```

### 3️⃣ Installer dans ton Backend

```bash
cd ton-backend-project
npm install git+https://github.com/TON_USERNAME/remotion-quran-compositions.git
npm install @remotion/bundler @remotion/renderer
```

**Créer route de rendu:**

```javascript
const { bundle } = require('@remotion/bundler');
const { renderMedia } = require('@remotion/renderer');

app.post('/api/video/generate', async (req, res) => {
  const bundled = await bundle({
    entryPoint: require.resolve('@yaqeen/remotion-compositions'),
  });
  
  await renderMedia({
    serveUrl: bundled,
    codec: 'h264',
    outputLocation: 'output.mp4',
    inputProps: req.body,
  });
  
  res.json({ success: true });
});
```

## Utilisation

### Dans le Frontend

```tsx
import { 
  QuranVideo, 
  calculateTimeline,
  type VideoSettings 
} from '@yaqeen/remotion-compositions';

// Utilise comme avant!
```

### Dans le Backend

```javascript
const { calculateTimeline } = require('@yaqeen/remotion-compositions');

const timeline = calculateTimeline(ayahs, 30);
console.log('Duration:', timeline.length);
```

## Mise à jour du package

Quand tu modifies les compositions:

```bash
# 1. Dans remotion-quran-compositions
git add .
git commit -m "Update animations"
git push

# 2. Dans frontend ET backend
npm update @yaqeen/remotion-compositions
```

## Avantages

✅ **Un seul endroit** pour modifier les compositions  
✅ **Pas de duplication** de code  
✅ **Versioning facile** avec Git  
✅ **Projets séparés** (frontend et backend indépendants)  
✅ **Mise à jour simple** avec npm update  

## Commandes Utiles

```bash
# Compiler le package
npm run build

# Compiler en mode watch
npm run watch

# Nettoyer
npm run clean

# Voir la structure
tree -I node_modules
```

## Support

- 📖 Voir `README.md` pour la documentation complète
- 📋 Voir `INSTALLATION.md` pour le guide détaillé
- 💡 Voir `examples/` pour des exemples d'utilisation

## Prochaines Étapes

1. ✅ Pusher le projet sur GitHub
2. ✅ Installer dans frontend
3. ✅ Installer dans backend  
4. ✅ Tester la génération de vidéo
5. ✅ Supprimer les fichiers dupliqués dans tes projets

---

**Bravo! Tu as maintenant un package partagé professionnel! 🎉**
