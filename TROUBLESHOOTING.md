# 🔧 Guide de Résolution - Erreur Vite

## ❌ Erreur rencontrée

```
Failed to resolve entry for package "@yaqeen/remotion-compositions"
The package may have incorrect main/module/exports specified in its package.json
```

## ✅ Solution

Le package a été mis à jour pour pointer directement vers les **fichiers source TypeScript** au lieu des fichiers compilés. Cela fonctionne mieux avec Vite.

### Étape 1: Mettre à jour le package

Dans ton projet `remotion-quran-compositions`:

```bash
cd remotion-quran-compositions
git add .
git commit -m "Fix: Point to source files for Vite compatibility"
git push
```

### Étape 2: Réinstaller dans ton frontend

```bash
cd ton-frontend-project

# Supprimer l'ancien
npm uninstall @yaqeen/remotion-compositions

# Réinstaller
npm install git+https://github.com/TON_USERNAME/remotion-quran-compositions.git

# Nettoyer le cache Vite
rm -rf node_modules/.vite
```

### Étape 3: Redémarrer

```bash
yarn dev
```

## 📝 Ce qui a changé dans package.json

**Avant:**
```json
{
  "main": "dist/index.js",
  "types": "dist/index.d.ts"
}
```

**Après:**
```json
{
  "main": "src/index.ts",
  "module": "src/index.ts",
  "types": "src/index.ts",
  "exports": {
    ".": {
      "import": "./src/index.ts",
      "require": "./src/index.ts",
      "types": "./src/index.ts"
    }
  }
}
```

## 🎯 Pourquoi ça marche?

- **Vite** peut compiler TypeScript à la volée
- Pas besoin de `npm run build` avant d'utiliser le package
- Hot reload fonctionne mieux
- Plus simple pour le développement

## 🔄 Pour le Backend (Node.js)

Le backend a besoin des fichiers compilés. Deux options:

### Option A: Utiliser ts-node (Recommandé)

```bash
npm install --save-dev ts-node @types/node
```

Puis dans ton code:
```javascript
require('ts-node/register');
const { calculateTimeline } = require('@yaqeen/remotion-compositions');
```

### Option B: Compiler le package avant utilisation

Dans `remotion-quran-compositions`:
```bash
npm run build
git add dist/
git commit -m "Add compiled files"
git push
```

Puis mettre à jour `package.json` pour pointer vers `dist`:
```json
{
  "main": "dist/index.js",
  "types": "dist/index.d.ts"
}
```

## ⚠️ Si l'erreur persiste

### 1. Vérifier l'installation

```bash
npm list @yaqeen/remotion-compositions
```

Devrait afficher:
```
@yaqeen/remotion-compositions@1.0.0
└── git+https://github.com/...
```

### 2. Nettoyer complètement

```bash
# Supprimer node_modules
rm -rf node_modules

# Supprimer package-lock.json ou yarn.lock
rm package-lock.json
# ou
rm yarn.lock

# Réinstaller tout
npm install
# ou
yarn install
```

### 3. Vérifier les imports

Dans ton code frontend, assure-toi d'importer comme ça:

```tsx
// ✅ CORRECT
import { QuranVideo } from '@yaqeen/remotion-compositions';

// ❌ INCORRECT
import { QuranVideo } from '@yaqeen/remotion-compositions/dist/index';
```

### 4. Configuration Vite (si nécessaire)

Ajoute dans `vite.config.ts`:

```typescript
export default defineConfig({
  optimizeDeps: {
    include: ['@yaqeen/remotion-compositions']
  },
  resolve: {
    alias: {
      '@yaqeen/remotion-compositions': '@yaqeen/remotion-compositions/src/index.ts'
    }
  }
});
```

## 🎉 Ça devrait marcher maintenant!

Lance à nouveau:
```bash
yarn dev
```

Si tu as encore des problèmes, vérifie:
1. ✅ Le package est bien sur GitHub
2. ✅ Tu as accès au repo (si privé)
3. ✅ Le fichier `src/index.ts` existe dans le package
4. ✅ Ton `package.json` du frontend liste bien la dépendance

---

**Besoin d'aide?** Vérifie que tous les fichiers sont bien présents dans le package:
```bash
cd remotion-quran-compositions
ls -la src/
```

Tu devrais voir:
```
src/
├── components/
├── utils/
├── assets/
├── types.ts
├── index.ts
└── Root.tsx
```
