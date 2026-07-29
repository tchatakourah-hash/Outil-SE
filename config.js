/* =====================================================================================
   ██████╗ ███████╗██████╗ ███████╗ ██████╗ ███╗   ██╗███╗   ██╗ █████╗ ██╗     ██╗███████╗ █████╗ ████████╗██╗ ██████╗ ███╗   ██╗
   ██╔══██╗██╔════╝██╔══██╗██╔════╝██╔═══██╗████╗  ██║████╗  ██║██╔══██╗██║     ██║██╔════╝██╔══██╗╚══██╔══╝██║██╔═══██╗████╗  ██║
   ██████╔╝█████╗  ██████╔╝███████╗██║   ██║██╔██╗ ██║██╔██╗ ██║███████║██║     ██║███████╗███████║   ██║   ██║██║   ██║██╔██╗ ██║
   ██╔═══╝ ██╔══╝  ██╔══██╗╚════██║██║   ██║██║╚██╗██║██║╚██╗██║██╔══██║██║     ██║╚════██║██╔══██║   ██║   ██║██║   ██║██║╚██╗██║
   ██║     ███████╗██║  ██║███████║╚██████╔╝██║ ╚████║██║ ╚████║██║  ██║███████╗██║███████║██║  ██║   ██║   ██║╚██████╔╝██║ ╚████║
   ╚═╝     ╚══════╝╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝╚═╝╚══════╝╚═╝  ╚═╝   ╚═╝   ╚═╝ ╚═════╝ ╚═╝  ╚═══╝

   CE FICHIER EST LE SEUL À MODIFIER POUR ADAPTER L'OUTIL À UN NOUVEAU PROJET.
   Aucune autre ligne de code (HTML/CSS/JS de rendu) n'a besoin d'être touchée.

   Structure de ce fichier :
     1. AUTHENTIFICATION       — mot de passe d'accès
     2. IDENTITÉ DU PROJET     — nom, logos, contact
     3. FILTRES                — régions et campagnes proposées dans la barre de filtres
     4. CARTES KPI             — les 4 cartes de la vue synthétique
     5. RISQUES SUIVIS         — le cœur de l'outil : un objet par risque (indicateur,
                                  seuils, historique, courbe). Ajouter/supprimer un risque
                                  ici ajoute/supprime automatiquement sa carte, sa bulle
                                  dans la matrice, et son graphique.
     6. SOURCES DE DONNÉES     — tableau de traçabilité des données
     7. ALERTES ACTIVES        — alertes affichées dans la section Alertes
     8. PROTOCOLE DE RÉPONSE   — actions associées à chaque niveau d'alerte
     9. GLOSSAIRE              — définitions affichées en section Documentation
   ===================================================================================== */

const CONFIG = {

  /* ---------------------------------------------------------------------------------
     1. AUTHENTIFICATION
     Protection simple côté client (empêche un accès direct au lien, ne remplace pas
     une vraie sécurité serveur — ne rien mettre de confidentiel dans cet outil).
  --------------------------------------------------------------------------------- */
  auth: {
    motDePasse: "mais2026"
  },

  /* ---------------------------------------------------------------------------------
     2. IDENTITÉ DU PROJET
  --------------------------------------------------------------------------------- */
  projet: {
    sigleOutil: "SAP-Maïs",
    titre: "Système d'Alerte Précoce",
    sousTitre: "Gestion proactive des risques — Projet Maïs 2026, Togo",
    derniereSynchronisation: "29/07/2026 — 06:50",
    contact: "sap.mais2026@exemple-togo.org",
    mentionFooter: "Outil conçu dans le cadre d'un mémoire de Master en Suivi-Évaluation, Université de Kara (FaSEG). Données de démonstration fictives — à ne pas utiliser pour la prise de décision réelle.",
    version: "SAP-Maïs · v1.0 · Modèle réutilisable",
    // 3 pastilles de logo max affichées dans l'en-tête. "sigle" = texte affiché (2 lettres).
    partenaires: [
      { sigle: "MA", nom: "Ministère de l'Agriculture, de l'Élevage et du Développement Rural", couleur: "ok" },
      { sigle: "IC", nom: "Institut de Conseil et d'Appui Technique (ICAT)", couleur: "gold" },
      { sigle: "UK", nom: "Université de Kara — FaSEG", couleur: "sky" }
    ]
  },

  /* ---------------------------------------------------------------------------------
     3. FILTRES (barre sous l'en-tête)
  --------------------------------------------------------------------------------- */
  filtres: {
    regions: [
      { value: "tous", label: "Toutes les régions" },
      { value: "savanes", label: "Savanes" },
      { value: "kara", label: "Kara" },
      { value: "centrale", label: "Centrale" }
    ],
    campagnes: [
      { value: "2026", label: "Campagne 2026 (en cours)" },
      { value: "2025", label: "Campagne 2025" }
    ]
  },

  /* ---------------------------------------------------------------------------------
     4. CARTES KPI (vue synthétique — 4 cartes)
     accent: "rust" | "gold" | "sky" | "ok"   |   deltaClass: "crit" | "warn" | "ok"
  --------------------------------------------------------------------------------- */
  kpis: [
    { label: "Alertes actives", valeur: "2", unite: "", cible: "1 critique · 1 vigilance", accent: "rust", delta: "▲ +1 vs semaine précédente", deltaClass: "crit" },
    { label: "Risque le plus critique", valeur: "Déficit hydrique", unite: "", cible: "Zone Savanes · indice SPI -1.6", accent: "gold", delta: "Seuil critique franchi", deltaClass: "crit", petit: true },
    { label: "Couverture de la surveillance", valeur: "87", unite: "%", cible: "39 sites-témoins sur 45 actifs", accent: "sky", delta: "▬ conforme au plan", deltaClass: "ok" },
    { label: "Délai moyen alerte → action", valeur: "18", unite: "h", cible: "Cible protocole : 24h (critique)", accent: "ok", delta: "▼ -6h vs cible", deltaClass: "ok" }
  ],

  /* ---------------------------------------------------------------------------------
     5. RISQUES SUIVIS — LE CŒUR DE L'OUTIL
     Pour AJOUTER un risque : dupliquer un objet ci-dessous et modifier ses valeurs.
     Pour SUPPRIMER un risque : supprimer son objet (tout le reste s'adapte seul).

     - proba / impact : notes de 1 à 5, utilisées pour positionner la bulle dans la
       matrice des risques (probabilité × impact).
     - statut : "ok" (vert) | "warn" (orange) | "crit" (rouge) — doit correspondre à la
       position de "valeurActuelle" par rapport aux bandes ci-dessous.
     - bandes : définissent les zones colorées du graphique de seuil, dans l'ordre
       croissant des valeurs, de yMin à yMax.
  --------------------------------------------------------------------------------- */
  risques: [
    {
      id: "hydrique",
      nom: "Déficit hydrique",
      categorie: "Climatique",
      region: "savanes",
      statut: "crit",
      proba: 4,
      impact: 5,
      valeurActuelle: "-1.6",
      unite: "SPI",
      seuilTexte: "Seuil critique : < -1.5",
      indicateurNom: "Indice de stress hydrique — Zone Savanes",
      indicateurNote: "SPI (Standardized Precipitation Index) — 12 dernières semaines",
      couleurCourbe: "#5B8FA8",
      yMin: -2, yMax: 0.5, ySuffix: "",
      bandes: [ { to: -1.5, couleur: "#C0563B" }, { to: -0.5, couleur: "#E0A63A" }, { to: 0.5, couleur: "#6FA85E" } ],
      historiqueLabels: ["S1","S2","S3","S4","S5","S6","S7","S8","S9","S10","S11","S12"],
      historiqueValeurs: [-0.2,-0.3,-0.5,-0.6,-0.8,-1.0,-1.1,-1.3,-1.4,-1.5,-1.5,-1.6]
    },
    {
      id: "chenille",
      nom: "Chenille légionnaire",
      categorie: "Phytosanitaire",
      region: "kara",
      statut: "warn",
      proba: 3,
      impact: 4,
      valeurActuelle: "9",
      unite: "%",
      seuilTexte: "Seuil vigilance : 5 – 15%",
      indicateurNom: "Taux d'infestation — Chenille légionnaire",
      indicateurNote: "% de parcelles-témoins infestées — 12 dernières semaines",
      couleurCourbe: "#D4A72C",
      yMin: 0, yMax: 20, ySuffix: "%",
      bandes: [ { to: 5, couleur: "#6FA85E" }, { to: 15, couleur: "#E0A63A" }, { to: 20, couleur: "#C0563B" } ],
      historiqueLabels: ["S1","S2","S3","S4","S5","S6","S7","S8","S9","S10","S11","S12"],
      historiqueValeurs: [1,1,2,3,3,4,5,6,7,8,8,9]
    },
    {
      id: "logistique",
      nom: "Retard distribution intrants",
      categorie: "Logistique",
      region: "centrale",
      statut: "ok",
      proba: 2,
      impact: 3,
      valeurActuelle: "2",
      unite: "j",
      seuilTexte: "Seuil vigilance : 3 – 7 j",
      indicateurNom: "Retard de distribution des intrants — Zone Centrale",
      indicateurNote: "Nombre de jours de retard vs planning — 12 dernières semaines",
      couleurCourbe: "#6FA85E",
      yMin: 0, yMax: 10, ySuffix: "j",
      bandes: [ { to: 3, couleur: "#6FA85E" }, { to: 7, couleur: "#E0A63A" }, { to: 10, couleur: "#C0563B" } ],
      historiqueLabels: ["S1","S2","S3","S4","S5","S6","S7","S8","S9","S10","S11","S12"],
      historiqueValeurs: [1,0,1,2,3,2,1,2,3,2,1,2]
    },
    {
      id: "marche",
      nom: "Volatilité des prix",
      categorie: "Marché",
      region: "tous",
      statut: "ok",
      proba: 2,
      impact: 2,
      valeurActuelle: "7",
      unite: "%",
      seuilTexte: "Seuil vigilance : 10 – 20%",
      indicateurNom: "Écart au prix moyen saisonnier",
      indicateurNote: "% d'écart du prix producteur vs moyenne des 3 dernières campagnes",
      couleurCourbe: "#A79E93",
      yMin: 0, yMax: 30, ySuffix: "%",
      bandes: [ { to: 10, couleur: "#6FA85E" }, { to: 20, couleur: "#E0A63A" }, { to: 30, couleur: "#C0563B" } ],
      historiqueLabels: ["S1","S2","S3","S4","S5","S6","S7","S8","S9","S10","S11","S12"],
      historiqueValeurs: [4,5,4,6,5,7,6,8,7,6,8,7]
    }
  ],

  /* ---------------------------------------------------------------------------------
     6. SOURCES DE DONNÉES (tableau de traçabilité)
     "risquesCouverts" : tableau d'identifiants correspondant aux "id" définis en (5).
  --------------------------------------------------------------------------------- */
  sources: [
    { nom: "Relevés pluviométriques (stations ANAMET)", type: "Climatique", frequence: "Quotidienne", risquesCouverts: ["hydrique"] },
    { nom: "Chatbot WhatsApp — agents ICAT de terrain", type: "Observations qualitatives, comptages", frequence: "Temps réel", risquesCouverts: ["chenille", "logistique"] },
    { nom: "Rapports de distribution d'intrants (fournisseurs)", type: "Logistique", frequence: "Hebdomadaire", risquesCouverts: ["logistique"] },
    { nom: "Système d'Information sur les Marchés (SIM)", type: "Prix de vente au producteur", frequence: "Hebdomadaire", risquesCouverts: ["marche"] },
    { nom: "Imagerie satellite NDVI (optionnel)", type: "Vigueur végétative", frequence: "Décadaire", risquesCouverts: ["hydrique"] }
  ],

  /* ---------------------------------------------------------------------------------
     7. ALERTES ACTIVES / HISTORIQUE
     niveau : "crit" | "warn" | "resolved"
  --------------------------------------------------------------------------------- */
  alertes: [
    {
      titre: "Déficit hydrique — Zone Savanes",
      niveau: "crit",
      detail: "Indice SPI mesuré : <b>-1.6</b> (seuil critique : < -1.5)",
      meta: "Déclenchée le 24/07/2026 · Source : relevés ANAMET + WhatsApp terrain",
      recommandation: "Mission de terrain sous 24h, évaluation de l'irrigation d'appoint disponible, information des producteurs des zones les plus exposées."
    },
    {
      titre: "Infestation chenille légionnaire — Zone Kara",
      niveau: "warn",
      detail: "Taux d'infestation mesuré : <b>9%</b> (seuil vigilance : 5% – 15%)",
      meta: "Déclenchée le 26/07/2026 · Source : signalements WhatsApp agents ICAT",
      recommandation: "Renforcement de la fréquence de scouting, information du coordonnateur régional sous 48h."
    },
    {
      titre: "Retard de distribution d'intrants — Zone Centrale",
      niveau: "resolved",
      detail: "",
      meta: "Déclenchée le 02/06/2026 · Résolue le 09/06/2026",
      recommandation: ""
    }
  ],

  /* ---------------------------------------------------------------------------------
     8. PROTOCOLE DE RÉPONSE (par niveau d'alerte)
  --------------------------------------------------------------------------------- */
  protocole: [
    { niveau: "ok", action: "Suivi de routine", responsable: "Agent de terrain", delai: "Continu" },
    { niveau: "warn", action: "Collecte renforcée, information du coordonnateur", responsable: "Coordonnateur régional", delai: "48h" },
    { niveau: "crit", action: "Mission terrain, mesures correctives, comité de crise", responsable: "Comité de pilotage", delai: "24h" }
  ],

  /* ---------------------------------------------------------------------------------
     9. GLOSSAIRE
  --------------------------------------------------------------------------------- */
  glossaire: [
    { terme: "SPI (indice de précipitation normalisé)", definition: "Mesure standardisée de l'écart de précipitations par rapport à la moyenne historique d'une zone ; un SPI très négatif signale un déficit hydrique marqué." },
    { terme: "Système d'alerte précoce", definition: "Dispositif combinant collecte de données, seuils calibrés et protocole de réponse, destiné à détecter un risque avant sa pleine matérialisation." },
    { terme: "Risque résiduel", definition: "Niveau de risque subsistant après application des mesures de réponse prévues par le protocole." }
  ]

};
