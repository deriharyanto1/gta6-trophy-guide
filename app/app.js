// Leonida Trophy Guide — tracker and guide for GTA VI's 55 PlayStation trophies.
// Loads the trophy and roadmap data, renders the checklist, and saves progress in localStorage.
const STORAGE_KEY = 'leonida-trophy-guide-v2';
const ONLINE_NOTE = 'No online trophies in the official 55 — GTA VI launches as a single-player story, and GTA Online arrives separately.';

const searchInput = document.getElementById('search');
const kindFilter = document.getElementById('kindFilter');
const gradeFilter = document.getElementById('gradeFilter');
const earnedFilter = document.getElementById('earnedFilter');
const spoilerBox = document.getElementById('spoiler');
const filterNote = document.getElementById('filterNote');
const trophyList = document.getElementById('trophyList');
const emptyNote = document.getElementById('emptyNote');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const gradeCounts = document.getElementById('gradeCounts');

let trophies = [];
let roadmap = { stages: [] };
let earned = new Set(loadStored());

function loadStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.filter((n) => typeof n === 'string') : [];
  } catch {
    return [];
  }
}

function saveStored() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...earned]));
}

function gradeLabel(g) {
  return g.charAt(0).toUpperCase() + g.slice(1);
}

function isHiddenBySpoiler(t) {
  return spoilerBox.checked && t.kind === 'story' && !earned.has(t.name);
}

function trophyMatches(t) {
  const q = searchInput.value.trim().toLowerCase();
  if (kindFilter.value === 'online') return false;
  if (kindFilter.value !== 'all' && t.kind !== kindFilter.value) return false;
  if (gradeFilter.value !== 'all' && t.grade !== gradeFilter.value) return false;
  if (earnedFilter.value === 'earned' && !earned.has(t.name)) return false;
  if (earnedFilter.value === 'unearned' && earned.has(t.name)) return false;
  if (!q) return true;
  const hay = [t.name, t.description, t.guide, (t.steps || []).join(' ')].join(' ').toLowerCase();
  return hay.includes(q);
}

function renderProgress() {
  const total = trophies.length;
  const done = trophies.filter((t) => earned.has(t.name)).length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  progressFill.style.width = pct + '%';
  progressText.textContent = done + ' of ' + total + ' earned' + (done === total && total ? ' — Leonida Legend!' : '');
  const byGrade = ['platinum', 'gold', 'silver', 'bronze'].map((g) => {
    const all = trophies.filter((t) => t.grade === g).length;
    const got = trophies.filter((t) => t.grade === g && earned.has(t.name)).length;
    return gradeLabel(g) + ' ' + got + '/' + all;
  });
  gradeCounts.textContent = byGrade.join(' · ');
}

function cardElement(t) {
  const details = document.createElement('details');
  details.className = 'card' + (earned.has(t.name) ? ' earned' : '');
  const summary = document.createElement('summary');
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = earned.has(t.name);
  box.setAttribute('aria-label', isHiddenBySpoiler(t) ? 'Mark this hidden story trophy as earned' : 'Mark ' + t.name + ' as earned');
  box.addEventListener('click', (ev) => {
    ev.stopPropagation();
    if (box.checked) earned.add(t.name);
    else earned.delete(t.name);
    saveStored();
    renderProgress();
    details.classList.toggle('earned', box.checked);
    if (spoilerBox.checked && t.kind === 'story') renderList();
  });
  const head = document.createElement('div');
  head.className = 'head';
  const nameEl = document.createElement('span');
  nameEl.className = 'name';
  const descEl = document.createElement('div');
  descEl.className = 'desc';
  if (isHiddenBySpoiler(t)) {
    nameEl.textContent = 'Hidden story trophy — earn it to reveal';
    descEl.textContent = 'Spoiler mode is on. Tick the box when you earn it and its name appears.';
  } else {
    nameEl.textContent = t.name;
    descEl.textContent = t.description;
  }
  const gradeBadge = document.createElement('span');
  gradeBadge.className = 'badge ' + t.grade;
  gradeBadge.textContent = gradeLabel(t.grade);
  nameEl.append(gradeBadge);
  const kindBadge = document.createElement('span');
  kindBadge.className = 'badge kind';
  kindBadge.textContent = t.kind;
  if (t.kind !== t.grade) nameEl.append(kindBadge);
  if (t.missable) {
    const miss = document.createElement('span');
    miss.className = 'badge miss';
    miss.textContent = 'Missable';
    nameEl.append(miss);
  }
  if (typeof t.count === 'number') {
    const count = document.createElement('span');
    count.className = 'count';
    count.textContent = ' ×' + t.count.toLocaleString('en-US');
    nameEl.append(count);
  }
  head.append(nameEl, descEl);
  summary.append(box, head);
  details.append(summary);

  const body = document.createElement('div');
  body.className = 'body';
  const guideH = document.createElement('h4');
  guideH.textContent = 'Guide';
  const guideP = document.createElement('p');
  guideP.textContent = t.guide;
  body.append(guideH, guideP);
  if (Array.isArray(t.steps) && t.steps.length) {
    const stepsH = document.createElement('h4');
    stepsH.textContent = 'Steps';
    const stepsOl = document.createElement('ol');
    for (const s of t.steps) {
      const li = document.createElement('li');
      li.textContent = s;
      stepsOl.append(li);
    }
    body.append(stepsH, stepsOl);
  }
  const srcP = document.createElement('p');
  srcP.className = 'sources';
  srcP.textContent = 'Sources: ' + (t.sources || []).join(' · ');
  body.append(srcP);
  details.append(body);
  return details;
}

function renderRoadmap() {
  const ol = document.getElementById('roadmap');
  ol.replaceChildren();
  for (const stage of roadmap.stages) {
    const li = document.createElement('li');
    const h = document.createElement('h3');
    h.textContent = stage.title;
    const goal = document.createElement('p');
    goal.textContent = stage.goal;
    const tip = document.createElement('p');
    tip.textContent = 'Tip: ' + stage.tip;
    const names = document.createElement('p');
    names.className = 'stageTrophies';
    names.textContent = stage.ids
      .map((id) => {
        const t = trophies.find((x) => x.id === id);
        return t ? t.name : '#' + id;
      })
      .join(' · ');
    li.append(h, goal, tip, names);
    ol.append(li);
  }
}

function renderMissables() {
  const ul = document.getElementById('missables');
  ul.replaceChildren();
  for (const t of trophies.filter((x) => x.missable)) {
    const li = document.createElement('li');
    const strong = document.createElement('strong');
    strong.textContent = t.name;
    li.append(strong, document.createTextNode(' — ' + t.description + ' (full guide in the list below)'));
    ul.append(li);
  }
}

function renderList() {
  trophyList.replaceChildren();
  let shown = 0;
  for (const t of trophies) {
    if (!trophyMatches(t)) continue;
    trophyList.append(cardElement(t));
    shown += 1;
  }
  emptyNote.hidden = shown !== 0;
  if (kindFilter.value === 'online') {
    filterNote.textContent = ONLINE_NOTE;
  } else if (shown === 0) {
    filterNote.textContent = 'No trophies match — clear the search or change the filters.';
  } else {
    filterNote.textContent = 'Showing ' + shown + ' of ' + trophies.length + ' trophies.';
  }
}

function renderAll() {
  renderProgress();
  renderRoadmap();
  renderMissables();
  renderList();
}

for (const el of [searchInput, kindFilter, gradeFilter, earnedFilter]) {
  el.addEventListener('input', renderList);
}
spoilerBox.addEventListener('change', renderList);

document.getElementById('exportBtn').addEventListener('click', () => {
  const blob = new Blob([JSON.stringify([...earned], null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'leonida-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
});

document.getElementById('importFile').addEventListener('change', (ev) => {
  const file = ev.target.files && ev.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const arr = JSON.parse(String(reader.result));
      if (!Array.isArray(arr)) throw new Error('not an array');
      const names = new Set(trophies.map((t) => t.name));
      earned = new Set(arr.filter((n) => typeof n === 'string' && names.has(n)));
      saveStored();
      renderAll();
      filterNote.textContent = 'Imported ' + earned.size + ' earned trophies.';
    } catch {
      filterNote.textContent = 'That file is not a progress export — nothing was imported.';
    }
    ev.target.value = '';
  };
  reader.readAsText(file);
});

document.getElementById('resetBtn').addEventListener('click', () => {
  if (!earned.size) return;
  if (window.confirm('Clear all ' + earned.size + ' earned trophies?')) {
    earned = new Set();
    saveStored();
    renderAll();
  }
});

const data = await Promise.all([
  fetch('data/trophies.json').then((r) => r.json()),
  fetch('data/roadmap.json').then((r) => r.json()),
]);
trophies = data[0].trophies;
roadmap = data[1];
renderAll();
