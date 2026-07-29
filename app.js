/* =====================================================================================
   RENDU DU TABLEAU DE BORD — lit exclusivement CONFIG (config.js).
   Ne pas modifier ce fichier pour personnaliser un projet : voir config.js.
   ===================================================================================== */

const BADGE_LABEL = { ok: "Conforme", warn: "Vigilance", crit: "Critique", resolved: "Résolue" };

function renderHeader(){
  document.getElementById("pageTitle").textContent = CONFIG.projet.sigleOutil + " · " + CONFIG.projet.titre;
  document.getElementById("headerTitle").textContent = CONFIG.projet.sigleOutil + " · " + CONFIG.projet.titre;
  document.getElementById("headerSubtitle").textContent = CONFIG.projet.sousTitre;
  document.getElementById("lastUpdate").textContent = "Dernière synchronisation : " + CONFIG.projet.derniereSynchronisation;

  const nbCrit = CONFIG.alertes.filter(a=>a.niveau==="crit").length;
  const nbWarn = CONFIG.alertes.filter(a=>a.niveau==="warn").length;
  document.getElementById("alertCountLabel").textContent = (nbCrit+nbWarn) + " alerte" + ((nbCrit+nbWarn)>1?"s":"") + " active" + ((nbCrit+nbWarn)>1?"s":"");

  document.getElementById("logoRow").innerHTML = CONFIG.projet.partenaires.map(p=>
    `<div class="logo-mark ${p.couleur}" title="${p.nom}">${p.sigle}</div>`
  ).join("");

  document.getElementById("syntheseSub").textContent =
    "Situation consolidée sur les zones suivies — " + (CONFIG.filtres.campagnes[0] ? CONFIG.filtres.campagnes[0].label : "");

  document.getElementById("footerNote").innerHTML = CONFIG.projet.mentionFooter + " Contact : " + CONFIG.projet.contact;
  document.getElementById("footerVersion").textContent = CONFIG.projet.version + " · Généré le " + CONFIG.projet.derniereSynchronisation.split(" — ")[0];
}

function renderFiltres(){
  document.getElementById("fRegion").innerHTML = CONFIG.filtres.regions.map(r=>`<option value="${r.value}">${r.label}</option>`).join("");
  document.getElementById("fCampagne").innerHTML = CONFIG.filtres.campagnes.map(c=>`<option value="${c.value}">${c.label}</option>`).join("");

  const categories = [...new Set(CONFIG.risques.map(r=>r.categorie))];
  const sel = document.getElementById("fRisque");
  categories.forEach(cat=>{
    const opt = document.createElement("option");
    opt.value = cat.toLowerCase();
    opt.textContent = cat;
    sel.appendChild(opt);
  });
}

function renderKPIs(){
  document.getElementById("kpiGrid").innerHTML = CONFIG.kpis.map(k => `
    <div class="kpi-card" style="--accent:var(--${k.accent})">
      <div class="kpi-label">${k.label}</div>
      <div class="kpi-value" style="${k.petit? 'font-size:22px;':''}">${k.valeur}${k.unite?`<span class="unit">${k.unite}</span>`:""}</div>
      <div class="kpi-target">${k.cible}</div>
      <div class="kpi-delta ${k.deltaClass}">${k.delta}</div>
    </div>
  `).join("");
}

function renderRiskCards(){
  document.getElementById("riskCardsGrid").innerHTML = CONFIG.risques.map(r => `
    <div class="risk-card">
      <div class="risk-top">
        <div>
          <div class="risk-name">${r.nom}</div>
          <div class="risk-cat">${r.categorie}</div>
        </div>
        <span class="badge ${r.statut}">${BADGE_LABEL[r.statut]}</span>
      </div>
      <div class="risk-value">${r.valeurActuelle}<span style="font-size:14px; color:var(--text-muted);"> ${r.unite}</span></div>
      <div class="risk-sub">${r.seuilTexte}</div>
    </div>
  `).join("");
}

function renderRiskCharts(){
  const grid = document.getElementById("riskChartsGrid");
  grid.innerHTML = CONFIG.risques.map(r => `
    <div class="card">
      <h3>${r.indicateurNom}</h3>
      <p class="card-note">${r.indicateurNote}</p>
      <div id="chart_${r.id}" style="width:100%; height:230px;"></div>
    </div>
  `).join("");
  CONFIG.risques.forEach(r => {
    lineChartThreshold("chart_"+r.id, r.historiqueLabels, r.historiqueValeurs, r.couleurCourbe, r.bandes, r.yMin, r.yMax, r.ySuffix);
  });
}

function renderMatrix(){
  renderRiskMatrix("riskMatrix", CONFIG.risques);
}

function renderSources(){
  const nomParId = {};
  CONFIG.risques.forEach(r => nomParId[r.id] = r.categorie);
  document.getElementById("sourcesBody").innerHTML = CONFIG.sources.map(s => `
    <tr>
      <td>${s.nom}</td>
      <td>${s.type}</td>
      <td>${s.frequence}</td>
      <td>${s.risquesCouverts.map(id => `<span class="badge">${nomParId[id]||id}</span>`).join(" ")}</td>
    </tr>
  `).join("");
}

function renderAlertes(){
  document.getElementById("alertsList").innerHTML = CONFIG.alertes.map(a => {
    const cls = a.niveau === "resolved" ? "resolved" : (a.niveau === "warn" ? "warn" : "");
    const badgeNiveau = a.niveau === "resolved" ? "ok" : a.niveau;
    return `
    <div class="alert-item ${cls}">
      <div class="alert-top">
        <span class="alert-title">${a.titre}</span>
        <span class="badge ${badgeNiveau}">${BADGE_LABEL[a.niveau]}</span>
      </div>
      ${a.detail ? `<div>${a.detail}</div>` : ""}
      <div class="alert-meta">${a.meta}</div>
      ${a.recommandation ? `<div class="alert-reco"><b>Protocole activé :</b> ${a.recommandation}</div>` : ""}
    </div>`;
  }).join("");
}

function renderProtocole(){
  document.getElementById("protocolBody").innerHTML = CONFIG.protocole.map(p => `
    <tr>
      <td><span class="badge ${p.niveau}">${BADGE_LABEL[p.niveau]}</span></td>
      <td>${p.action}</td>
      <td>${p.responsable}</td>
      <td>${p.delai}</td>
    </tr>
  `).join("");
}

function renderSeuils(){
  document.getElementById("seuilsBody").innerHTML = CONFIG.risques.map(r => {
    const b = r.bandes;
    return `<tr>
      <td>${r.categorie}</td>
      <td>${r.indicateurNom.split(" — ")[0]}</td>
      <td>Conforme</td>
      <td>Vigilance</td>
      <td>${r.seuilTexte}</td>
    </tr>`;
  }).join("");
}

function renderGlossaire(){
  document.getElementById("glossaryList").innerHTML = CONFIG.glossaire.map(g => `
    <dt>${g.terme}</dt><dd>${g.definition}</dd>
  `).join("");
}

function onFilterChange(){
  // Point d'extension : dans une version connectée à de vraies données,
  // filtrer CONFIG.risques par région/catégorie ici avant de ré-appeler
  // renderRiskCards(), renderRiskCharts() et renderMatrix().
  renderRiskCards();
  renderRiskCharts();
  renderMatrix();
}

window.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFiltres();
  renderKPIs();
  renderRiskCards();
  renderRiskCharts();
  renderMatrix();
  renderSources();
  renderAlertes();
  renderProtocole();
  renderSeuils();
  renderGlossaire();

  document.getElementById("fRegion").addEventListener("change", onFilterChange);
  document.getElementById("fRisque").addEventListener("change", onFilterChange);
});
