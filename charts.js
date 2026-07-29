/* =====================================================================================
   MOTEUR DE GRAPHIQUES SVG — générique, ne contient aucune donnée de projet.
   Ne pas modifier ce fichier pour personnaliser un projet : voir config.js.
   ===================================================================================== */

const CHART_W = 600, CHART_H = 220;
const PAD = { l: 36, r: 12, t: 12, b: 26 };
const PLOT_W = CHART_W - PAD.l - PAD.r;
const PLOT_H = CHART_H - PAD.t - PAD.b;
const GRID_COLOR = "rgba(237,231,223,0.08)";
const AXIS_TEXT = "#A79E93";

function thresholdBands(bands, yMin, yMax){
  let svg = "";
  let prev = yMin;
  bands.forEach(b=>{
    const y1 = PAD.t + PLOT_H - ((prev-yMin)/(yMax-yMin))*PLOT_H;
    const y2 = PAD.t + PLOT_H - ((b.to-yMin)/(yMax-yMin))*PLOT_H;
    svg += `<rect x="${PAD.l}" y="${y2.toFixed(1)}" width="${PLOT_W}" height="${(y1-y2).toFixed(1)}" fill="${b.couleur}" opacity="0.10"/>`;
    prev = b.to;
  });
  return svg;
}

function lineChartThreshold(containerId, categories, data, color, bands, yMin, yMax, ySuffix){
  const n = categories.length;
  const step = PLOT_W/(n-1||1);
  const yPos = v => PAD.t + PLOT_H - ((v-yMin)/(yMax-yMin))*PLOT_H;
  const pts = data.map((v,i)=>[PAD.l+step*i, yPos(v)]);
  let svg = `<svg viewBox="0 0 ${CHART_W} ${CHART_H}" preserveAspectRatio="xMidYMid meet" style="width:100%;height:100%;" role="img">`;
  svg += thresholdBands(bands, yMin, yMax);
  for(let i=0;i<=4;i++){
    const val = yMin + (yMax-yMin)*i/4;
    const y = PAD.t + PLOT_H - (i/4)*PLOT_H;
    svg += `<line x1="${PAD.l}" y1="${y.toFixed(1)}" x2="${CHART_W-PAD.r}" y2="${y.toFixed(1)}" stroke="${GRID_COLOR}"/>`;
    svg += `<text x="${PAD.l-6}" y="${(y+3).toFixed(1)}" font-size="9" fill="${AXIS_TEXT}" font-family="JetBrains Mono, monospace" text-anchor="end">${val.toFixed(1)}${ySuffix||""}</text>`;
  }
  categories.forEach((c,i)=>{ if(i%2===0){ svg += `<text x="${(PAD.l+step*i).toFixed(1)}" y="${CHART_H-6}" font-size="8.5" fill="${AXIS_TEXT}" font-family="Work Sans, sans-serif" text-anchor="middle">${c}</text>`; } });
  const path = pts.map((p,i)=>(i===0?"M":"L")+p[0].toFixed(1)+","+p[1].toFixed(1)).join(" ");
  svg += `<path d="${path}" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
  pts.forEach((p,i)=>{ svg += `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${i===pts.length-1?4.5:3}" fill="${color}"/>`; });
  svg += "</svg>";
  document.getElementById(containerId).innerHTML = svg;
}

function renderRiskMatrix(containerId, risques){
  const W=600, H=320, pad=40;
  const plotW = W-pad*2, plotH = H-pad*2;
  const cells = 5;
  const cw = plotW/cells, ch = plotH/cells;
  const colors = {crit:"#C0563B", warn:"#E0A63A", ok:"#6FA85E"};
  let svg = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" style="width:100%;height:100%;" role="img">`;
  for(let px=0; px<cells; px++){
    for(let py=0; py<cells; py++){
      const score = (px+1)+(cells-py);
      let color = "#6FA85E";
      if(score>=9) color="#C0563B"; else if(score>=7) color="#E0A63A";
      const x = pad+px*cw, y = pad+py*ch;
      svg += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${cw.toFixed(1)}" height="${ch.toFixed(1)}" fill="${color}" opacity="0.10"/>`;
    }
  }
  svg += `<line x1="${pad}" y1="${pad}" x2="${pad}" y2="${H-pad}" stroke="${GRID_COLOR}" stroke-width="1.5"/>`;
  svg += `<line x1="${pad}" y1="${H-pad}" x2="${W-pad}" y2="${H-pad}" stroke="${GRID_COLOR}" stroke-width="1.5"/>`;
  svg += `<text x="${W/2}" y="${H-8}" font-size="10" fill="${AXIS_TEXT}" font-family="JetBrains Mono, monospace" text-anchor="middle">Probabilité d'occurrence →</text>`;
  svg += `<text x="14" y="${H/2}" font-size="10" fill="${AXIS_TEXT}" font-family="JetBrains Mono, monospace" text-anchor="middle" transform="rotate(-90 14 ${H/2})">Impact potentiel →</text>`;
  risques.forEach(r=>{
    const x = pad + (r.proba/5)*plotW;
    const y = H-pad - (r.impact/5)*plotH;
    svg += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="16" fill="${colors[r.statut]}" opacity="0.85" stroke="#EDE7DF" stroke-width="1.5"/>`;
    svg += `<text x="${x.toFixed(1)}" y="${(y-22).toFixed(1)}" font-size="10.5" fill="#EDE7DF" font-family="Work Sans, sans-serif" text-anchor="middle" font-weight="600">${r.nom}</text>`;
  });
  svg += "</svg>";
  document.getElementById(containerId).innerHTML = svg;
}
