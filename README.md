# SAP-Maïs — Système d'Alerte Précoce (Projet Maïs 2026)

Outil de suivi-évaluation à visée prédictive, avec système d'alerte précoce, conçu comme modèle réutilisable pour tout projet agricole.

link:  https://tchatakourah-hash.github.io/Outil-SE/

## Structure du site

```
├── index.html       → page de connexion (mot de passe)
├── dashboard.html    → le tableau de bord (structure HTML uniquement, vide de données)
├── config.js         → ★ TOUTES les données du projet — SEUL FICHIER À MODIFIER ★
├── charts.js          → moteur de graphiques SVG générique (ne pas modifier)
├── app.js              → moteur de rendu générique (ne pas modifier)
├── style.css            → habillage visuel (couleurs, typographie, mise en page)
└── assets/                → dossier pour vos futurs logos (images)
```

## Personnaliser pour un nouveau projet

**Ouvrez uniquement `config.js`.** Ce fichier est découpé en 9 sections numérotées et commentées :

1. Authentification (mot de passe)
2. Identité du projet (nom, logos, contact)
3. Filtres (régions, campagnes)
4. Cartes KPI
5. Risques suivis (le cœur de l'outil — indicateur, seuils, historique par risque)
6. Sources de données
7. Alertes actives
8. Protocole de réponse
9. Glossaire

Pour **ajouter ou retirer un risque**, dupliquez ou supprimez un objet dans la section 5 : sa carte, sa bulle dans la matrice et son graphique de seuil se génèrent automatiquement — aucune autre ligne de code à toucher.

Aucune connaissance en HTML/CSS n'est nécessaire pour personnaliser l'outil : `config.js` ne contient que du texte, des nombres et des couleurs.

## Mot de passe

Modifiez la ligne suivante dans `config.js` :
```js
auth: { motDePasse: "mais2026" }
```

⚠️ **Important** : cette protection est côté client (JavaScript). Elle empêche un accès direct au lien par une personne non avertie, mais n'est pas une sécurité de niveau serveur — n'y placez aucune donnée réellement confidentielle.

## Déployer gratuitement sur GitHub Pages

Depuis un terminal, dans ce dossier :

```bash
git init
git add .
git commit -m "Premier déploiement — SAP-Maïs"
git branch -M main
git remote add origin https://github.com/VOTRE-NOM-UTILISATEUR/sap-mais-2026.git
git push -u origin main
```

Puis, sur github.com :
1. Ouvrez le dépôt créé
2. Allez dans **Settings → Pages**
3. Sous **Branch**, sélectionnez `main` et le dossier `/ (root)`, puis **Save**
4. Après 1 à 2 minutes, votre site sera en ligne à l'adresse :

```
https://VOTRE-NOM-UTILISATEUR.github.io/sap-mais-2026/
```

C'est ce lien que vous partagerez — il pointera automatiquement vers `index.html` (la page de connexion).

### Mettre à jour le site après une modification

Après avoir modifié `config.js` :
```bash
git add config.js
git commit -m "Mise à jour des données du projet"
git push
```
Le site en ligne se met à jour automatiquement en 1 à 2 minutes.

## Licence / usage

Modèle produit dans le cadre d'un mémoire de Master en Suivi-Évaluation (Université de Kara, FaSEG). Libre de réutilisation et d'adaptation pour tout projet de suivi-évaluation.
