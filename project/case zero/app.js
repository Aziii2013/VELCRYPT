// ===== DOM HELPERS =====
function $(sel) { return document.querySelector(sel); }
function $$(sel) { return document.querySelectorAll(sel); }

function esc(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ===== TOAST SYSTEM WITH ANIMATIONS =====
function toast(msg, type = 'info') {
  const container = $('#toasts');
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  
  // Color coding for different types
  if (type === 'success') {
    el.style.borderColor = 'rgba(95,174,126,.6)';
    el.style.color = '#9ad5b3';
    el.style.boxShadow = '0 0 40px -10px rgba(95,174,126,.4)';
  } else if (type === 'error') {
    el.style.borderColor = 'rgba(200,50,63,.6)';
    el.style.color = '#e79aa2';
    el.style.boxShadow = '0 0 40px -10px rgba(200,50,63,.4)';
  } else if (type === 'warning') {
    el.style.borderColor = 'rgba(217,164,65,.6)';
    el.style.color = '#e6c07b';
    el.style.boxShadow = '0 0 40px -10px rgba(217,164,65,.4)';
  }
  
  container.appendChild(el);
  
  // Animate out
  setTimeout(() => {
    el.classList.add('out');
    setTimeout(() => { el.remove(); }, 400);
  }, 3000);
}

// ===== MODAL SYSTEM =====
function openModal(title, bodyHTML, footerHTML) {
  const modal = $('#modal');
  const titleEl = $('#modalTitle');
  const bodyEl = $('#modalBody');
  const footEl = $('#modalFoot');
  
  titleEl.textContent = title;
  bodyEl.innerHTML = bodyHTML;
  footEl.innerHTML = footerHTML || '';
  modal.classList.remove('hidden');
  
  // Trigger animation
  const panel = modal.querySelector('.modal-panel');
  if (panel) {
    panel.style.animation = 'none';
    void panel.offsetHeight;
    panel.style.animation = 'modalPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
  }
  
  $$('[data-close]').forEach(el => {
    el.addEventListener('click', closeModal);
  });
}

function closeModal() {
  const modal = $('#modal');
  const panel = modal.querySelector('.modal-panel');
  if (panel) {
    panel.style.animation = 'modalPopOut 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards';
    setTimeout(() => {
      modal.classList.add('hidden');
      panel.style.animation = '';
    }, 300);
  } else {
    modal.classList.add('hidden');
  }
}

// ===== LIGHTNING FLAKES EFFECT FOR LOADING SCREEN =====
let lightningAnimationId = null;
let lightningCanvasCtx = null;

function startLightning() {
  const canvas = $('#lightningFx');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  lightningCanvasCtx = ctx;
  
  const resize = () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  };
  resize();
  window.addEventListener('resize', resize);
  
  // Particles (Blue Flakes/Sparkles)
  const particles = [];
  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 3 + 0.5;
      this.speedX = (Math.random() - 0.5) * 1.5;
      this.speedY = (Math.random() - 0.5) * 1.5;
      this.life = Math.random() * 100;
      this.maxLife = this.life;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life--;

      // Random flicker/flare
      if (Math.random() < 0.005) {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
      }

      if (this.life <= 0 || this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }
    draw() {
      // Blue glow effect
      ctx.fillStyle = `rgba(80, 160, 255, ${this.life / this.maxLife * 0.8})`;
      ctx.shadowBlur = 15;
      ctx.shadowColor = "rgba(80, 160, 255, 0.8)";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < 120; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw lightning streaks
    ctx.strokeStyle = "rgba(80, 160, 255, 0.25)";
    ctx.lineWidth = 1;
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#50A0FF";
    for (let i = 0; i < 12; i++) {
      ctx.beginPath();
      let x = Math.random() * canvas.width;
      let y = Math.random() * canvas.height;
      ctx.moveTo(x, y);
      for (let j = 0; j < 6; j++) {
        x += (Math.random() - 0.5) * 50;
        y += (Math.random() - 0.5) * 50;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    lightningAnimationId = requestAnimationFrame(animate);
  }
  animate();
}

function stopLightning() {
  if (lightningAnimationId) {
    cancelAnimationFrame(lightningAnimationId);
    lightningAnimationId = null;
  }
  if (lightningCanvasCtx) {
    lightningCanvasCtx.clearRect(0, 0, lightningCanvasCtx.canvas.width, lightningCanvasCtx.canvas.height);
  }
}

// ===== MUSIC ENGINE =====
let isMusicPlaying = false;

async function startMusic() {
  const audio = document.getElementById('bgMusic');

  if (!audio) {
    console.error('Background music element not found.');
    return false;
  }

  try {
    audio.volume = 1.0;

    // Make sure the audio is ready
    audio.load();

    await audio.play();

    isMusicPlaying = true;

    const soundBtn = $('#soundToggle');
    if (soundBtn) {
      soundBtn.textContent = '🔊 SOUND: ON';
    }

    console.log('🎵 Background music started.');
    return true;

  } catch (error) {
    isMusicPlaying = false;
    console.error('🎵 Music could not start:', error);
    return false;
  }
}

function stopMusic() {
  const audio = document.getElementById('bgMusic');

  if (audio) {
    audio.pause();
  }

  isMusicPlaying = false;

  const soundBtn = $('#soundToggle');
  if (soundBtn) {
    soundBtn.textContent = '🔇 SOUND: OFF';
  }
}

function toggleMusic() {
  if (isMusicPlaying) {
    stopMusic();
  } else {
    startMusic();
  }
}
// ===== DATA =====
const KEY = 'black_orchid_data';

const EVIDENCE = [
  { 
    id: 'E-01', 
    title: 'Security Footage - Gallery 4', 
    cat: 'VIDEO', 
    desc: 'Camera captures a figure in black at 23:47. The glass case is open at 23:52.',
    loc: 'Main Gallery',
    notes: 'Masked figure, identifiable gait pattern. The figure walks with a slight limp.',
    time: '23:47'
  },
  { 
    id: 'E-02', 
    title: 'Broken Display Case', 
    cat: 'PHYSICAL', 
    desc: 'The reinforced glass case was cut with precision tools. No alarm triggered.',
    loc: 'Main Gallery',
    notes: 'Professional job, tool marks indicate diamond cutter. Clean cut, no glass fragments inside the case.',
    time: '23:50'
  },
  { 
    id: 'E-03', 
    title: 'Security Guard Statement', 
    cat: 'WITNESS', 
    desc: 'Guard was at the east entrance during the theft. Heard a faint sound but dismissed it.',
    loc: 'Security Office',
    notes: 'Guard was alone, no backup called. He reported hearing what sounded like glass cutting at 23:48.',
    time: '23:45'
  },
  { 
    id: 'E-04', 
    title: 'Museum Floor Plan', 
    cat: 'DOCUMENT', 
    desc: 'The facility has three access points. The west corridor was undergoing maintenance.',
    loc: 'Archives',
    notes: 'Maintenance crew had keys to all galleries. The west corridor leads directly to Gallery 4.',
    time: '22:00'
  },
  { 
    id: 'E-05', 
    title: 'Fingerprint Analysis', 
    cat: 'FORENSIC', 
    desc: 'Partial prints found on the display case. Matches a museum staff member.',
    loc: 'Lab',
    notes: 'Partial match to a staff member. Not enough for a definitive match, but highly suspicious.',
    time: '01:00'
  },
  { 
    id: 'E-06', 
    title: 'Artifact Catalogue', 
    cat: 'DOCUMENT', 
    desc: 'The Black Orchid was discovered in an Aztec tomb. Valued at $50 million.',
    loc: 'Records',
    notes: 'Shipped from Mexico three weeks ago. Insurance policy valued at $50 million.',
    time: 'N/A'
  },
  { 
    id: 'E-07', 
    title: 'Alarm System Log', 
    cat: 'LOG', 
    desc: 'The gallery alarm was disabled for 12 minutes during the heist.',
    loc: 'Security Office',
    notes: 'System override used - inside job suspected. The override code was entered from a staff terminal.',
    time: '23:46'
  },
  { 
    id: 'E-08', 
    title: 'Maintenance Schedule', 
    cat: 'DOCUMENT', 
    desc: 'West corridor was scheduled for maintenance but was canceled last minute.',
    loc: 'Archives',
    notes: 'Canceled at 16:30. Claimed the work could wait until after the exhibition.',
    time: '18:00'
  }
];

const SUSPECTS = [
  { 
    id: 'S-01', 
    name: 'Dr. Helena Vance', 
    role: 'Museum Curator',
    statement: 'I was in my office reviewing acquisition documents from 23:00 to 00:30.',
    motive: 'Financial difficulties. The museum was struggling financially.',
    obs: 'Nervous during questioning. Avoided eye contact. Sweating despite cool temperature.',
    moves: 'Stationary in office, but office near west corridor',
    alibi: 'Unconfirmed - no one saw her in her office'
  },
  { 
    id: 'S-02', 
    name: 'Marcus Webb', 
    role: 'Head of Security',
    statement: 'I was monitoring the cameras from the main desk from 22:30 until 00:15.',
    motive: 'Could have disabled alarms easily, may have been paid off',
    obs: 'Knew about alarm system vulnerabilities. Was unusually calm during questioning.',
    moves: 'Stationary at security desk',
    alibi: 'Confirmed - other guards saw him at his desk'
  },
  { 
    id: 'S-03', 
    name: 'Dr. Sarah Chen', 
    role: 'Lead Archaeologist',
    statement: 'I was analyzing artifacts in the conservation lab until 00:00.',
    motive: 'Wanted to study the Black Orchid further, felt museum was selling it improperly',
    obs: 'Had access to excavation records, passionate about the artifact.',
    moves: 'Mobile between labs and galleries',
    alibi: 'Partially confirmed - seen in lab at 23:30'
  },
  { 
    id: 'S-04', 
    name: 'James Okafor', 
    role: 'Maintenance Supervisor',
    statement: 'I was at home. I had the day off and was with my family.',
    motive: 'Had keys to all galleries, knowledge of maintenance schedules',
    obs: 'His team had access to every room. Keys were never returned after the canceled maintenance.',
    moves: 'Claimed to be home, no alibi confirmed',
    alibi: 'Unconfirmed - family was asleep'
  },
  { 
    id: 'S-05', 
    name: 'Elena Vasquez', 
    role: 'Exhibition Designer',
    statement: 'I was preparing the new exhibition layout in the design office from 22:00 to 00:30.',
    motive: 'Knew the case specifications and security measures intimately',
    obs: 'Had blueprints of all display cases. Left work early the next day.',
    moves: 'Mobile between galleries',
    alibi: 'Confirmed by cleaning staff'
  }
];

const EVENTS = [
  { t: '22:30', label: 'Museum Closes to Public', st: 'CONFIRMED' },
  { t: '23:30', label: 'Last Staff Leaves Main Area', st: 'CONFIRMED' },
  { t: '23:40', label: 'Gallery 4 Lights Turn Off', st: 'REPORTED' },
  { t: '23:45', label: 'Security Guard Reports to East Entrance', st: 'CONFIRMED' },
  { t: '23:46', label: 'Alarm System Override Initiated', st: 'CONFIRMED' },
  { t: '23:47', label: 'Figure Seen on Camera Approaching Display', st: 'UNVERIFIED' },
  { t: '23:52', label: 'Glass Case Opened - Artifact Removed', st: 'REPORTED' },
  { t: '23:58', label: 'Security Guard Returns - Notices Empty Case', st: 'CONFIRMED' },
  { t: '00:15', label: 'Police Notified', st: 'CONFIRMED' },
  { t: '00:30', label: 'Crime Scene Secured', st: 'CONFIRMED' }
];

const LOCATIONS = [
  { id: 'L-01', name: 'Main Gallery', access: 'Restricted', note: 'Display location of Black Orchid', events: ['23:47', '23:52'] },
  { id: 'L-02', name: 'Security Office', access: 'Restricted', note: 'Camera monitoring station', events: ['23:45', '23:46', '23:58'] },
  { id: 'L-03', name: 'West Corridor', access: 'Staff', note: 'Maintenance access, unauthorized entry point', events: ['22:30'] },
  { id: 'L-04', name: 'Conservation Lab', access: 'Staff', note: 'Where artifacts are analyzed', events: ['23:30'] },
  { id: 'L-05', name: 'Archive Room', access: 'Staff', note: 'Old records and floor plans', events: ['22:00'] }
];

const MESSAGES = [
  { t: '23:35', from: 'Marcus Webb', to: 'Security Desk', body: 'West corridor camera is flickering. Might need maintenance.' },
  { t: '23:38', from: 'Elena Vasquez', to: 'Dr. Helena Vance', body: 'The new exhibition design is ready. Can we review tomorrow?' },
  { t: '23:42', from: 'Dr. Sarah Chen', to: 'Dr. Helena Vance', body: 'I need more time with the Black Orchid. Rushing this is a mistake.' },
  { t: '23:50', from: 'Dr. Helena Vance', to: 'Dr. Sarah Chen', body: 'The schedule is final. We proceed with the sale.' },
  { t: '23:55', from: 'Marcus Webb', to: 'Security Team', body: 'Everything quiet tonight. All systems normal.' },
  { t: '00:10', from: 'James Okafor', to: 'Dispatch', body: 'I was at home all night. I can confirm with neighbors.' }
];

const CLUES = [
  'Alarm system override was an inside job',
  'West corridor camera was tampered with',
  'Glass cut with precision tools',
  'Partial fingerprint match to staff member',
  'Maintenance schedule was canceled',
  'Arguments about selling the artifact',
  'Security guard heard glass cutting'
];

const SOLUTION = {
  suspect: 'Dr. Helena Vance',
  time: '23:46',
  timeRange: ['23:44', '23:50'],
  evidence: ['E-02', 'E-04', 'E-05', 'E-07', 'E-08'],
  contradictionKeys: ['alarm', 'override', 'maintenance', 'fingerprint', 'glass', 'cut']
};

// ===== STATE =====
const defaults = {
  view: 'overview',
  board: [],
  links: [],
  notes: [],
  seenEvidence: [],
  seenSuspects: [],
  seenEvents: [],
  clues: [],
  theory: null,
  secret: false,
  entered: false,
  importantEvidence: []
};

let S = { ...defaults };
let selPin = null;

// ===== SAVE / LOAD =====
function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(S));
  } catch (e) {}
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const data = JSON.parse(raw);
      S = { ...defaults, ...data };
      return true;
    }
  } catch (e) {}
  return false;
}

// ===== NAVIGATION =====
function go(view) {
  S.view = view;
  save();
  render(view);
}

function pinLabel(kind, ref) {
  if (kind === 'evidence') {
    const e = EVIDENCE.find(x => x.id === ref);
    return ['EVIDENCE', e ? e.title : ref];
  } else if (kind === 'suspect') {
    const s = SUSPECTS.find(x => x.id === ref);
    return ['SUSPECT', s ? s.name : ref];
  } else if (kind === 'location') {
    const l = LOCATIONS.find(x => x.id === ref);
    return ['LOCATION', l ? l.name : ref];
  }
  return ['CARD', ref];
}

// ===== ADD PIN WITH GRID POSITIONING AND ANIMATION =====
function addPin(kind, ref) {
  const key = kind + '-' + ref + '-' + Date.now();
  
  const board = $('#board');
  let x = 20, y = 20;
  
  if (board) {
    const pinWidth = 186;
    const pinHeight = 75;
    const padding = 16;
    const boardWidth = board.clientWidth || 800;
    const cols = Math.max(1, Math.floor((boardWidth - padding) / (pinWidth + padding)));
    const index = S.board.length;
    const col = index % cols;
    const row = Math.floor(index / cols);
    x = padding + col * (pinWidth + padding);
    y = padding + row * (pinHeight + padding);
  }
  
  S.board.push({
    key,
    kind,
    ref,
    x: x,
    y: y
  });
  
  save();
  go('board');
  
  // Trigger toast with animation
  const name = pinLabel(kind, ref)[1];
  toast('📌 PIN ADDED: ' + name, 'success');
}

// ===== OPEN FUNCTIONS WITH MODALS =====
function openEvidence(id) {
  const e = EVIDENCE.find(x => x.id === id);
  if (!e) return;
  
  if (!S.seenEvidence.includes(id)) {
    S.seenEvidence.push(id);
    save();
    toast('📋 EVIDENCE REVIEWED: ' + e.id, 'info');
  }
  
  const isImportant = S.importantEvidence && S.importantEvidence.includes(id);
  
  openModal(
    'EVIDENCE: ' + e.id,
    `
      <div class="evidence-detail">
        <h3 style="font-size:20px;margin-bottom:4px;">${esc(e.title)}</h3>
        <p class="mono micro dim">CATEGORY: ${e.cat} · LOCATION: ${e.loc}</p>
        ${e.time !== 'N/A' ? `<p class="mono micro dim">TIME: ${e.time}</p>` : ''}
        <div style="border:1px solid var(--line);border-radius:var(--r);padding:12px;margin:12px 0;background:rgba(0,0,0,0.2);">
          <p class="desc">${esc(e.desc)}</p>
        </div>
        <div style="border-left:2px solid var(--amber);padding:8px 12px;background:rgba(217,164,65,0.05);">
          <p class="mono micro dim">NOTES</p>
          <p class="small">${esc(e.notes)}</p>
        </div>
        ${isImportant ? '<p class="tag amber">⭐ IMPORTANT EVIDENCE</p>' : ''}
      </div>
    `,
    `
      <button class="btn small" onclick="markImportant('${id}')">${isImportant ? 'REMOVE IMPORTANT' : 'MARK IMPORTANT'}</button>
      <button class="btn small" onclick="addPin('evidence','${id}');closeModal();">ADD TO BOARD</button>
      <button class="btn small primary" onclick="closeModal();go('evidence');">BACK</button>
    `
  );
}

function openSuspect(id) {
  const s = SUSPECTS.find(x => x.id === id);
  if (!s) return;
  
  if (!S.seenSuspects.includes(id)) {
    S.seenSuspects.push(id);
    save();
    toast('🔍 SUSPECT EXAMINED: ' + s.name, 'info');
  }
  
  openModal(
    'SUSPECT: ' + s.id,
    `
      <div class="suspect-detail">
        <div style="display:flex;align-items:center;gap:16px;margin-bottom:12px;">
          <div class="avatar" style="width:60px;height:60px;font-size:24px;margin:0;">${s.name[0]}</div>
          <div>
            <h3 style="font-size:20px;margin:0;">${esc(s.name)}</h3>
            <p class="mono micro dim">${esc(s.role)}</p>
          </div>
        </div>
        <div style="border:1px solid var(--line);border-radius:var(--r);padding:12px;margin:8px 0;">
          <p class="mono micro dim">STATEMENT</p>
          <p class="desc">${esc(s.statement)}</p>
        </div>
        <div style="border:1px solid var(--line);border-radius:var(--r);padding:12px;margin:8px 0;border-color:rgba(200,50,63,0.3);">
          <p class="mono micro dim">MOTIVE</p>
          <p class="desc">${esc(s.motive)}</p>
        </div>
        <div style="border:1px solid var(--line);border-radius:var(--r);padding:12px;margin:8px 0;">
          <p class="mono micro dim">OBSERVATIONS</p>
          <p class="desc">${esc(s.obs)}</p>
        </div>
        <div style="border:1px solid var(--line);border-radius:var(--r);padding:12px;margin:8px 0;">
          <p class="mono micro dim">ALIBI</p>
          <p class="desc">${esc(s.alibi)}</p>
        </div>
      </div>
    `,
    `
      <button class="btn small" onclick="addPin('suspect','${id}');closeModal();">ADD TO BOARD</button>
      <button class="btn small primary" onclick="closeModal();go('suspects');">BACK</button>
    `
  );
}

function openLocation(id) {
  const l = LOCATIONS.find(x => x.id === id);
  if (!l) return;
  
  openModal(
    'LOCATION: ' + l.id,
    `
      <div class="location-detail">
        <h3 style="font-size:20px;margin-bottom:4px;">${esc(l.name)}</h3>
        <p class="mono micro dim">ACCESS: ${l.access}</p>
        <div style="border:1px solid var(--line);border-radius:var(--r);padding:12px;margin:12px 0;">
          <p class="desc">${esc(l.note)}</p>
        </div>
        ${l.events ? `<p class="mono micro dim">EVENTS: ${l.events.join(', ')}</p>` : ''}
      </div>
    `,
    `
      <button class="btn small" onclick="addPin('location','${id}');closeModal();">ADD TO BOARD</button>
      <button class="btn small primary" onclick="closeModal();go('locations');">BACK</button>
    `
  );
}

function openEvent(idx) {
  const e = EVENTS[idx];
  if (!e) return;
  
  if (!S.seenEvents.includes(idx)) {
    S.seenEvents.push(idx);
    save();
    toast('⏱️ TIMELINE EVENT REVIEWED', 'info');
  }
  
  openModal(
    'TIMELINE EVENT',
    `
      <div class="event-detail">
        <h3 style="font-size:20px;margin-bottom:4px;">${e.t}</h3>
        <p class="desc" style="font-size:18px;margin:8px 0;">${esc(e.label)}</p>
        <p class="tag ${e.st === 'CONFIRMED' ? 'green' : e.st === 'REPORTED' ? 'amber' : 'red'}">${e.st}</p>
      </div>
    `,
    `
      <button class="btn small primary" onclick="closeModal();go('timeline');">BACK</button>
    `
  );
}

function markImportant(id) {
  if (!S.importantEvidence) S.importantEvidence = [];
  const idx = S.importantEvidence.indexOf(id);
  if (idx > -1) {
    S.importantEvidence.splice(idx, 1);
    toast('⭐ REMOVED IMPORTANT FLAG', 'warning');
  } else {
    S.importantEvidence.push(id);
    toast('⭐ MARKED AS IMPORTANT', 'success');
  }
  save();
  openEvidence(id);
}

// ===== RENDER ENGINE =====
function render(view) {
  $$('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.view === view);
  });
  
  const main = $('#main');
  main.style.animation = 'none';
  void main.offsetHeight;
  main.style.animation = 'fadeInContent 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
  
  switch(view) {
    case 'overview': renderOverview(main); break;
    case 'evidence': renderEvidence(main); break;
    case 'suspects': renderSuspects(main); break;
    case 'timeline': renderTimeline(main); break;
    case 'locations': renderLocations(main); break;
    case 'messages': renderMessages(main); break;
    case 'board': renderBoard(main); break;
    case 'notes': renderNotes(main); break;
    case 'theory': renderTheory(main); break;
    default: main.innerHTML = '<p>VIEW NOT FOUND</p>';
  }
  
  renderProgress();
}

// ===== VIEW RENDERERS =====
function renderOverview(main) {
  const solved = S.theory && S.theory.score >= 85;
  const evidenceCount = S.seenEvidence.length;
  const totalEvidence = EVIDENCE.length;
  const suspectCount = S.seenSuspects.length;
  const totalSuspects = SUSPECTS.length;
  
  main.innerHTML = `
    <div class="section-head">
      <h2>⚡ THE BLACK ORCHID · MUSEUM HEIST</h2>
      <span class="mono micro dim">CASE FILE #2024-01</span>
    </div>
    
    <div class="panel" style="border-color:rgba(217,164,65,0.3);">
      <p class="mono micro dim">INCIDENT SUMMARY</p>
      <p>On the night of <b>December 14th</b>, the legendary <b>Black Orchid</b> artifact was stolen from the Museum of Ancient History. 
      Discovered in an Aztec tomb after <b>300 years</b>, the artifact was valued at <b>$50 million</b>.</p>
      <p class="desc small">The perpetrator disabled the alarm system, cut through reinforced glass, and vanished with the artifact.</p>
      <div class="meta">
        <div><span class="dim">STATUS</span> <span class="${solved ? 'ok' : 'warn'}">${solved ? 'SOLVED ✓' : 'OPEN'}</span></div>
        <div><span class="dim">PRIORITY</span> <span class="warn">CRITICAL</span></div>
        <div><span class="dim">EVIDENCE</span> <span class="${evidenceCount === totalEvidence ? 'ok' : ''}">${evidenceCount}/${totalEvidence}</span></div>
        <div><span class="dim">SUSPECTS</span> <span class="${suspectCount === totalSuspects ? 'ok' : ''}">${suspectCount}/${totalSuspects}</span></div>
      </div>
    </div>
    
    <div class="panel" style="border-color:rgba(200,220,255,0.15); background: radial-gradient(ellipse at center, rgba(200,220,255,0.03), rgba(0,0,0,0.5));">
      <p class="mono micro dim" style="color: rgba(200,220,255,0.4);">⚡ THE BLACK ORCHID · AZTEC ARTIFACT</p>
      <div class="artifact-container">
        <div class="artifact-3d">
          <!-- White glow behind -->
          <div class="artifact-glow"></div>
          
          <!-- Glow rings -->
          <div class="glow-ring glow-ring-1"></div>
          <div class="glow-ring glow-ring-2"></div>
          <div class="glow-ring glow-ring-3"></div>
          
          <!-- Floating particles -->
          <div class="particles">
            <div class="particle"></div>
            <div class="particle"></div>
            <div class="particle"></div>
            <div class="particle"></div>
            <div class="particle"></div>
            <div class="particle"></div>
            <div class="particle"></div>
            <div class="particle"></div>
            <div class="particle"></div>
            <div class="particle"></div>
          </div>
          
          <!-- Danger symbols - FRONT -->
          <div class="danger-symbol symbol-1">⚡</div>
          <div class="danger-symbol symbol-2">☠</div>
          <div class="danger-symbol symbol-3">⚠</div>
          
          <!-- Danger symbols - BACK -->
          <div class="danger-symbol-back symbol-4">⚡</div>
          <div class="danger-symbol-back symbol-5">☠</div>
          <div class="danger-symbol-back symbol-6">⚠</div>
          
          <!-- SOLID BODY - The complete filled core -->
          <div class="artifact-solid-body"></div>
          
          <!-- Side rings to hide edges -->
          <div class="side-ring side-ring-1"></div>
          <div class="side-ring side-ring-2"></div>
          <div class="side-ring side-ring-3"></div>
          
          <!-- The BLACK ORCHID - FRONT FACE -->
          <div class="artifact-core">
            <!-- ===== VEIN TEXTURE OVERLAY - Lightning veins like a heart ===== -->
            <div class="vein-overlay">
              <!-- Main trunk - thick central vein -->
              <div class="vein-trunk"></div>
              
              <!-- Main branches -->
              <div class="vein-branch vein-branch-1"></div>
              <div class="vein-branch vein-branch-2"></div>
              <div class="vein-branch vein-branch-3"></div>
              <div class="vein-branch vein-branch-4"></div>
              <div class="vein-branch vein-branch-5"></div>
              <div class="vein-branch vein-branch-6"></div>
              
              <!-- Secondary forks -->
              <div class="vein-fork vein-fork-1"></div>
              <div class="vein-fork vein-fork-2"></div>
              <div class="vein-fork vein-fork-3"></div>
              <div class="vein-fork vein-fork-4"></div>
              <div class="vein-fork vein-fork-5"></div>
              <div class="vein-fork vein-fork-6"></div>
              
              <!-- Capillary dots -->
              <div class="vein-capillary vein-capillary-1"></div>
              <div class="vein-capillary vein-capillary-2"></div>
              <div class="vein-capillary vein-capillary-3"></div>
              <div class="vein-capillary vein-capillary-4"></div>
              <div class="vein-capillary vein-capillary-5"></div>
              <div class="vein-capillary vein-capillary-6"></div>
              <div class="vein-capillary vein-capillary-7"></div>
              <div class="vein-capillary vein-capillary-8"></div>
              <div class="vein-capillary vein-capillary-9"></div>
              <div class="vein-capillary vein-capillary-10"></div>
              <div class="vein-capillary vein-capillary-11"></div>
              <div class="vein-capillary vein-capillary-12"></div>
              
              <!-- Glow nodes -->
              <div class="vein-node vein-node-1"></div>
              <div class="vein-node vein-node-2"></div>
              <div class="vein-node vein-node-3"></div>
              <div class="vein-node vein-node-4"></div>
              <div class="vein-node vein-node-5"></div>
              <div class="vein-node vein-node-6"></div>
              <div class="vein-node vein-node-7"></div>
              <div class="vein-node vein-node-8"></div>
              <div class="vein-node vein-node-9"></div>
              <div class="vein-node vein-node-10"></div>
            </div>
            
            <!-- Electric stripes - horizontal FRONT -->
            <div class="electric-stripe"></div>
            <div class="electric-stripe"></div>
            <div class="electric-stripe"></div>
            <div class="electric-stripe"></div>
            <div class="electric-stripe"></div>
            
            <!-- Electric stripes - vertical FRONT -->
            <div class="electric-stripe-vertical"></div>
            <div class="electric-stripe-vertical"></div>
            <div class="electric-stripe-vertical"></div>
            
            <!-- Electric stripes - diagonal FRONT -->
            <div class="electric-stripe-diagonal"></div>
            <div class="electric-stripe-diagonal"></div>
            
            <!-- Electric nodes - FRONT -->
            <div class="electric-node"></div>
            <div class="electric-node"></div>
            <div class="electric-node"></div>
            <div class="electric-node"></div>
            <div class="electric-node"></div>
            
            <!-- Dark petals - FRONT -->
            <div class="petal petal-1"></div>
            <div class="petal petal-2"></div>
            <div class="petal petal-3"></div>
            <div class="petal petal-4"></div>
            <div class="petal petal-5"></div>
            
            <!-- Dark center - FRONT -->
            <div class="flower-center"></div>
          </div>
          
          <!-- The BLACK ORCHID - BACK FACE -->
          <div class="artifact-core-back">
            <!-- Electric stripes - horizontal BACK -->
            <div class="electric-stripe-back"></div>
            <div class="electric-stripe-back"></div>
            <div class="electric-stripe-back"></div>
            <div class="electric-stripe-back"></div>
            <div class="electric-stripe-back"></div>
            
            <!-- Electric stripes - vertical BACK -->
            <div class="electric-stripe-vertical-back"></div>
            <div class="electric-stripe-vertical-back"></div>
            <div class="electric-stripe-vertical-back"></div>
            
            <!-- Electric stripes - diagonal BACK -->
            <div class="electric-stripe-diagonal-back"></div>
            <div class="electric-stripe-diagonal-back"></div>
            
            <!-- Electric nodes - BACK -->
            <div class="electric-node-back"></div>
            <div class="electric-node-back"></div>
            <div class="electric-node-back"></div>
            <div class="electric-node-back"></div>
            <div class="electric-node-back"></div>
            
            <!-- Dark petals - BACK -->
            <div class="petal-back petal-back-1"></div>
            <div class="petal-back petal-back-2"></div>
            <div class="petal-back petal-back-3"></div>
            <div class="petal-back petal-back-4"></div>
            <div class="petal-back petal-back-5"></div>
            
            <!-- Dark center - BACK -->
            <div class="flower-center-back"></div>
          </div>
        </div>
      </div>
      <div style="text-align: center; margin-top: 5px;">
        <span class="artifact-label">⚡ THE BLACK ORCHID</span>
        <br>
        <span class="warning-badge">⚠️ UNKNOWN POWER SOURCE · ELECTRICAL ANOMALY DETECTED</span>
      </div>
      <p class="desc small" style="text-align: center; margin-top: 10px; color: rgba(200,220,255,0.3);">
        "A flower of obsidian and shadow — pulsing with forbidden energy"
      </p>
    </div>
    
    <div class="panel">
      <p class="mono micro dim">QUICK ACTIONS</p>
      <div class="row">
        <button class="btn primary" onclick="go('evidence')">📋 REVIEW EVIDENCE</button>
        <button class="btn" onclick="go('suspects')">🔍 EXAMINE SUSPECTS</button>
        <button class="btn" onclick="go('board')">📊 OPEN CASE BOARD</button>
      </div>
    </div>
  `;
}
function renderEvidence(main) {
  let html = `
    <div class="section-head">
      <h2>📋 EVIDENCE · BLACK ORCHID HEIST</h2>
      <span class="mono micro dim">${S.seenEvidence.length}/${EVIDENCE.length} REVIEWED</span>
    </div>
    <div class="grid g2">
  `;
  
  EVIDENCE.forEach((e, index) => {
    const seen = S.seenEvidence.includes(e.id);
    const important = S.importantEvidence && S.importantEvidence.includes(e.id);
    const critical = e.id === 'E-02' || e.id === 'E-07' || e.id === 'E-05';
    const delay = index * 50;
    
    html += `
      <div class="card ${seen ? 'seen' : ''} ${important ? 'important' : ''} ${critical ? 'important' : ''}" 
           onclick="openEvidence('${e.id}')"
           style="animation-delay:${delay}ms;">
        <div class="thumb doc">${e.id}</div>
        <h3>${esc(e.title)}</h3>
        <p class="small">
          <span class="tag ${e.cat === 'DOCUMENT' ? 'steel' : e.cat === 'VIDEO' ? 'amber' : e.cat === 'PHYSICAL' ? 'red' : e.cat === 'FORENSIC' ? 'green' : 'steel'}">${e.cat}</span>
          ${e.loc}
        </p>
        <p class="desc">${esc(e.desc)}</p>
        ${important ? '<span class="tag amber">⭐ IMPORTANT</span>' : ''}
        ${critical && !important ? '<span class="tag red">🔑 KEY EVIDENCE</span>' : ''}
      </div>
    `;
  });
  html += '</div>';
  main.innerHTML = html;
}

function renderSuspects(main) {
  let html = `
    <div class="section-head">
      <h2>🔍 SUSPECTS · MUSEUM STAFF</h2>
      <span class="mono micro dim">${S.seenSuspects.length}/${SUSPECTS.length} EXAMINED</span>
    </div>
    <div class="grid g2">
  `;
  
  SUSPECTS.forEach((s, index) => {
    const seen = S.seenSuspects.includes(s.id);
    const delay = index * 50;
    
    html += `
      <div class="card ${seen ? 'seen' : ''}" onclick="openSuspect('${s.id}')" style="animation-delay:${delay}ms;">
        <div class="avatar">${s.name[0]}</div>
        <h3>${esc(s.name)}</h3>
        <p class="small dim">${esc(s.role)}</p>
        <p class="desc" style="font-size:12px;"><span class="dim">Statement:</span> ${esc(s.statement.substring(0,60))}...</p>
      </div>
    `;
  });
  html += '</div>';
  main.innerHTML = html;
}

function renderTimeline(main) {
  let html = `
    <div class="section-head">
      <h2>⏱️ TIMELINE · THE NIGHT OF THE HEIST</h2>
    </div>
    <div class="panel">
      <div class="tl">
  `;
  
  EVENTS.forEach((e, i) => {
    const seen = S.seenEvents.includes(i);
    const critical = i === 4 || i === 5 || i === 6;
    
    html += `
      <div class="tl-item ${e.st} ${seen ? 'seen' : ''}" onclick="openEvent(${i})" 
           style="${critical ? 'border-left:3px solid var(--crimson);padding-left:12px;' : ''}">
        <strong>${e.t}</strong> — ${e.label}
        <span class="tag ${e.st === 'CONFIRMED' ? 'green' : e.st === 'REPORTED' ? 'amber' : 'red'}">${e.st}</span>
        ${critical ? '<span class="tag red">🔑 KEY</span>' : ''}
      </div>
    `;
  });
  html += '</div></div>';
  main.innerHTML = html;
}

function renderLocations(main) {
  let html = `
    <div class="section-head">
      <h2>📍 LOCATIONS · MUSEUM MAP</h2>
    </div>
    <div class="map">
  `;
  
  LOCATIONS.forEach(l => {
    html += `
      <div class="zone ${l.access === 'Restricted' ? 'restricted' : ''}" onclick="openLocation('${l.id}')">
        <strong>${esc(l.name)}</strong>
        <span class="tag">${l.access}</span>
        <p class="desc">${esc(l.note)}</p>
        ${l.id === 'L-01' ? '<span class="tag amber">🔴 CRIME SCENE</span>' : ''}
        ${l.id === 'L-03' ? '<span class="tag amber">⚠️ ENTRY POINT</span>' : ''}
      </div>
    `;
  });
  html += '</div>';
  main.innerHTML = html;
}

function renderMessages(main) {
  let html = `
    <div class="section-head">
      <h2>💬 MESSAGES · COMMUNICATIONS LOG</h2>
    </div>
    <div class="grid g2">
  `;
  
  MESSAGES.forEach((m, index) => {
    const suspicious = (m.from === 'Marcus Webb' && m.t === '23:55') || 
                       (m.from === 'Dr. Helena Vance' && m.to === 'Dr. Sarah Chen');
    const delay = index * 80;
    
    html += `
      <div class="msg" style="${suspicious ? 'border-color:rgba(200,50,63,0.4);' : ''} animation-delay:${delay}ms;">
        <div class="msg-head">
          <span>${esc(m.from)} → ${esc(m.to)}</span>
          <span class="dim">${m.t}</span>
        </div>
        <p class="desc">"${esc(m.body)}"</p>
        ${suspicious ? '<span class="tag red">⚠️ SUSPICIOUS</span>' : ''}
      </div>
    `;
  });
  html += '</div>';
  main.innerHTML = html;
}

// ===== BOARD RENDER WITH GRID =====
function renderBoard(main) {
  main.innerHTML = `
    <div class="section-head">
      <h2>📊 CASE BOARD · BLACK ORCHID</h2>
      <div class="row">
        <select id="addSel" class="small">
          ${EVIDENCE.map(e => `<option value="evidence|${e.id}">${e.id} — ${e.title}</option>`).join('')}
          ${SUSPECTS.map(s => `<option value="suspect|${s.id}">${s.id} — ${s.name}</option>`).join('')}
          ${LOCATIONS.map(l => `<option value="location|${l.id}">${l.id} — ${l.name}</option>`).join('')}
        </select>
        <button id="addPin" class="btn small">➕ ADD PIN</button>
        <button id="clearLinks" class="btn small danger">🗑️ CLEAR LINKS</button>
        <button id="resetBoard" class="btn small">🔄 RESET POSITIONS</button>
      </div>
    </div>
    <div id="board" class="board">
      <svg id="wires"></svg>
    </div>
  `;
  
  const addPinBtn = $('#addPin');
  if (addPinBtn) {
    addPinBtn.addEventListener('click', function() {
      const v = $('#addSel').value.split('|');
      addPin(v[0], v[1]);
    });
  }
  
  const clearLinksBtn = $('#clearLinks');
  if (clearLinksBtn) {
    clearLinksBtn.addEventListener('click', function() {
      S.links = [];
      save();
      go('board');
      toast('🗑️ ALL LINKS CLEARED', 'warning');
    });
  }
  
  const resetBoardBtn = $('#resetBoard');
  if (resetBoardBtn) {
    resetBoardBtn.addEventListener('click', function() {
      resetBoardPositions();
      go('board');
      toast('🔄 BOARD POSITIONS RESET', 'info');
    });
  }
  
  setTimeout(renderPins, 50);
}

function renderPins() {
  const board = $('#board');
  if (!board) return;
  
  board.querySelectorAll('.pin').forEach(el => el.remove());
  
  if (S.board.length === 0) {
    const emptyMsg = document.createElement('div');
    emptyMsg.style.cssText = 'position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);color:var(--dim);font-family:var(--mono);font-size:14px;text-align:center;pointer-events:none;';
    emptyMsg.innerHTML = '📋 No pins on the board<br><span class="micro">Add evidence or suspects to get started</span>';
    board.appendChild(emptyMsg);
    return;
  }
  
  const pinWidth = 186;
  const pinHeight = 75;
  const padding = 16;
  const boardWidth = board.clientWidth || 800;
  const cols = Math.max(1, Math.floor((boardWidth - padding) / (pinWidth + padding)));
  
  S.board.forEach((p, index) => {
    const [tag, name] = pinLabel(p.kind, p.ref);
    
    const el = document.createElement('div');
    el.className = 'pin';
    
    const col = index % cols;
    const row = Math.floor(index / cols);
    const gridX = padding + col * (pinWidth + padding);
    const gridY = padding + row * (pinHeight + padding);
    
    let x = p.x;
    let y = p.y;
    
    if (x === undefined || x === null || x < 0 || y === undefined || y === null || y < 0) {
      x = gridX;
      y = gridY;
      p.x = x;
      p.y = y;
      save();
    }
    
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.dataset.key = p.key;
    el.tabIndex = 0;
    el.style.animationDelay = (index * 50) + 'ms';
    
    el.innerHTML = `
      <button class="x" aria-label="Remove card">×</button>
      <div class="t">${esc(tag)}</div>
      <div class="n">${esc(name)}</div>
    `;
    
    board.appendChild(el);
    
    el.querySelector('.x').addEventListener('click', function(ev) {
      ev.stopPropagation();
      S.board = S.board.filter(b => b.key !== p.key);
      S.links = S.links.filter(l => l.a !== p.key && l.b !== p.key);
      save();
      go('board');
      toast('🗑️ PIN REMOVED: ' + name, 'warning');
    });
    
    let drag = null;
    
    el.addEventListener('pointerdown', function(ev) {
      if (ev.target.classList.contains('x')) return;
      drag = {
        dx: ev.clientX - el.offsetLeft,
        dy: ev.clientY - el.offsetTop,
        moved: false
      };
      el.setPointerCapture(ev.pointerId);
      el.style.zIndex = 20;
      el.style.transform = 'scale(1.05)';
      el.style.boxShadow = '0 16px 60px rgba(0,0,0,0.6)';
    });
    
    el.addEventListener('pointermove', function(ev) {
      if (!drag) return;
      drag.moved = true;
      const r = board.getBoundingClientRect();
      const x = Math.max(0, Math.min(r.width - pinWidth, ev.clientX - drag.dx));
      const y = Math.max(0, Math.min(r.height - pinHeight, ev.clientY - drag.dy));
      el.style.left = x + 'px';
      el.style.top = y + 'px';
      drawWires();
    });
    
    el.addEventListener('pointerup', function() {
      if (drag && drag.moved) {
        const b = S.board.find(b => b.key === p.key);
        if (b) {
          b.x = el.offsetLeft;
          b.y = el.offsetTop;
          save();
        }
      } else {
        selectPin(p.key);
      }
      drag = null;
      el.style.zIndex = '';
      el.style.transform = '';
      el.style.boxShadow = '';
    });
    
    el.addEventListener('keydown', function(ev) {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        selectPin(p.key);
      }
    });
  });
  
  drawWires();
}

function resetBoardPositions() {
  const board = $('#board');
  if (!board) return;
  
  const pinWidth = 186;
  const pinHeight = 75;
  const padding = 16;
  const boardWidth = board.clientWidth || 800;
  const cols = Math.max(1, Math.floor((boardWidth - padding) / (pinWidth + padding)));
  
  S.board.forEach((p, index) => {
    const col = index % cols;
    const row = Math.floor(index / cols);
    p.x = padding + col * (pinWidth + padding);
    p.y = padding + row * (pinHeight + padding);
  });
  
  save();
}

function renderNotes(main) {
  let html = `
    <div class="section-head">
      <h2>📝 INVESTIGATION NOTES</h2>
      <span class="mono micro dim">${S.notes.length} NOTES</span>
    </div>
    <div class="panel">
      <label class="f">NEW NOTE</label>
      <textarea id="noteIn" placeholder="Enter your observations about the heist..." rows="3"></textarea>
      <button id="addNote" class="btn primary" style="margin-top:8px">➕ ADD NOTE</button>
    </div>
    <div class="grid">
  `;
  
  if (S.notes.length === 0) {
    html += `<p class="dim desc">No notes yet. Start investigating!</p>`;
  } else {
    S.notes.forEach(n => {
      html += `
        <div class="note">
          <div class="mono micro dim">${n.id} · ${n.t}</div>
          <p>${esc(n.body)}</p>
          <div class="row">
            <button class="btn small" data-editnote="${n.id}">✏️ EDIT</button>
            <button class="btn small danger" data-delnote="${n.id}">🗑️ DELETE</button>
          </div>
        </div>
      `;
    });
  }
  html += '</div>';
  main.innerHTML = html;
  
  wireNotes();
}

function renderTheory(main) {
  if (S.theory) {
    const score = S.theory.score;
    const solved = score >= 85;
    
    let suspectName = '';
    if (solved) {
      const suspect = SUSPECTS.find(s => s.name === SOLUTION.suspect);
      suspectName = suspect ? suspect.name : 'Unknown';
    }
    
    main.innerHTML = `
      <div class="section-head">
        <h2>⚔️ FINAL THEORY · THE BLACK ORCHID</h2>
      </div>
      <div class="panel" style="${solved ? 'border-color:var(--green);' : 'border-color:var(--amber);'}">
        <div class="verdict ${solved ? 'ok' : 'warn'}">${solved ? '✅ CASE SOLVED' : '⚠️ INVESTIGATION INCOMPLETE'}</div>
        ${solved ? `<p class="ok mono">The culprit has been identified as <b>${suspectName}</b></p>` : ''}
        <div class="readout">
          <div><span class="dim">CASE STRENGTH</span><br><span class="verdict" style="font-size:24px">${score}%</span></div>
          <div><span class="dim">SUSPECT ID</span><br>${S.theory.idOk ? '✓ MATCH' : '✗ MISMATCH'}</div>
          <div><span class="dim">TIME ANALYSIS</span><br>${S.theory.time}</div>
          <div><span class="dim">EVIDENCE STRENGTH</span><br>${S.theory.ev}</div>
          <div><span class="dim">METHOD</span><br>${S.theory.how}</div>
          <div><span class="dim">CONTRADICTIONS</span><br>${S.theory.con ? '✓ FOUND' : '✗ NONE'}</div>
        </div>
        <button id="reopen" class="btn">🔁 REOPEN INVESTIGATION</button>
      </div>
    `;
    
    setTimeout(() => {
      const re = $('#reopen');
      if (re) {
        re.addEventListener('click', function() {
          S.theory = null;
          save();
          go('theory');
          toast('🔁 CASE REOPENED', 'info');
        });
      }
    }, 0);
  } else {
    main.innerHTML = `
      <div class="section-head">
        <h2>⚔️ FINAL THEORY · SUBMIT YOUR ANALYSIS</h2>
      </div>
      <div class="panel">
        <p class="desc">Submit your final analysis to close the Black Orchid case.</p>
        
        <label class="f">PRIMARY SUSPECT</label>
        <input id="tSusp" placeholder="Enter full name of the suspect..." />
        
        <label class="f">HOW WAS THE HEIST EXECUTED?</label>
        <input id="tHow" placeholder="Describe the method used (e.g., alarm override, glass cutting)..." />
        
        <label class="f">TIME OF THEFT (HH:MM)</label>
        <input id="tTime" placeholder="23:46" />
        
        <label class="f">SUPPORTING EVIDENCE (Select all that apply)</label>
        <div class="checks">
          ${EVIDENCE.map(e => `
            <label class="chk">
              <input type="checkbox" class="tEv" value="${e.id}" /> 
              ${e.id} — ${e.title.substring(0,25)}...
            </label>
          `).join('')}
        </div>
        
        <label class="f">KEY CONTRADICTIONS</label>
        <input id="tCon" placeholder="List the contradictions you found (e.g., alarm override, maintenance schedule)..." />
        
        <button id="submitTheory" class="btn primary" style="margin-top:16px">🎯 SUBMIT THEORY</button>
      </div>
    `;
    
    setTimeout(function() {
      wireTheory();
    }, 100);
  }
}

// ===== SELECT PIN =====
function selectPin(key) {
  if (selPin === null) {
    selPin = key;
  } else if (selPin === key) {
    selPin = null;
  } else {
    const exists = S.links.find(l =>
      (l.a === selPin && l.b === key) ||
      (l.a === key && l.b === selPin)
    );
    
    if (exists) {
      S.links = S.links.filter(l => l !== exists);
      toast('🔗 CONNECTION REMOVED', 'warning');
    } else {
      S.links = [...S.links, { a: selPin, b: key }];
      toast('🔗 CONNECTION ESTABLISHED', 'success');
    }
    selPin = null;
    save();
  }
  
  $$('.pin').forEach(p => {
    p.classList.toggle('sel', p.dataset.key === selPin);
  });
  drawWires();
}

// ===== DRAW WIRES =====
function drawWires() {
  const svg = $('#wires');
  const board = $('#board');
  if (!svg || !board) return;
  
  const r = board.getBoundingClientRect();
  svg.setAttribute('width', r.width);
  svg.setAttribute('height', r.height);
  svg.innerHTML = '';
  
  S.links.forEach(l => {
    const a = board.querySelector(`.pin[data-key="${CSS.escape(l.a)}"]`);
    const b = board.querySelector(`.pin[data-key="${CSS.escape(l.b)}"]`);
    if (!a || !b) return;
    
    const ln = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    ln.setAttribute('x1', a.offsetLeft + 90);
    ln.setAttribute('y1', a.offsetTop + 30);
    ln.setAttribute('x2', b.offsetLeft + 90);
    ln.setAttribute('y2', b.offsetTop + 30);
    ln.setAttribute('stroke', 'rgba(200,50,63,.55)');
    ln.setAttribute('stroke-width', '1.2');
    
    // Add animation to wires
    const length = Math.sqrt(
      Math.pow((b.offsetLeft + 90) - (a.offsetLeft + 90), 2) + 
      Math.pow((b.offsetTop + 30) - (a.offsetTop + 30), 2)
    );
    ln.style.strokeDasharray = length;
    ln.style.strokeDashoffset = length;
    ln.style.animation = `wireDraw 0.6s ease forwards`;
    
    svg.appendChild(ln);
  });
}

// Add wire animation keyframe to CSS via JavaScript
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes wireDraw {
    to { stroke-dashoffset: 0; }
  }
`;
document.head.appendChild(styleSheet);

// ===== WIRE NOTES =====
function wireNotes() {
  const ta = $('#noteIn');
  if (!ta) return;
  
  const addBtn = $('#addNote');
  if (addBtn) {
    addBtn.addEventListener('click', function() {
      const body = (ta.value || '').trim();
      if (!body) {
        toast('⚠️ EMPTY ENTRY DISCARDED', 'warning');
        return;
      }
      S.notes = [
        {
          id: 'N-' + String(S.notes.length + 1).padStart(2, '0'),
          t: new Date().toLocaleString(),
          body
        },
        ...S.notes
      ];
      save();
      go('notes');
      toast('📝 NOTE ADDED', 'success');
    });
  }
  
  $$('[data-delnote]').forEach(function(b) {
    b.addEventListener('click', function() {
      S.notes = S.notes.filter(n => n.id !== b.dataset.delnote);
      save();
      go('notes');
      toast('🗑️ NOTE DELETED', 'warning');
    });
  });
  
  $$('[data-editnote]').forEach(function(b) {
    b.addEventListener('click', function() {
      const n = S.notes.find(x => x.id === b.dataset.editnote);
      if (!n) return;
      openModal(
        'EDIT ' + n.id,
        `<textarea id="editArea">${esc(n.body)}</textarea>`,
        `<button class="btn" id="saveEdit">💾 SAVE</button>
         <button class="btn ghost" data-close>CANCEL</button>`
      );
      setTimeout(function() {
        const saveBtn = $('#saveEdit');
        if (saveBtn) {
          saveBtn.addEventListener('click', function() {
            n.body = $('#editArea').value.trim() || n.body;
            n.t = new Date().toLocaleString();
            save();
            closeModal();
            go('notes');
            toast('📝 NOTE UPDATED', 'success');
          });
        }
      }, 0);
    });
  });
}

// ===== WIRE THEORY =====
function wireTheory() {
  const btn = $('#submitTheory');
  if (!btn) return;
  
  const newBtn = btn.cloneNode(true);
  btn.parentNode.replaceChild(newBtn, btn);
  
  newBtn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const susp = $('#tSusp').value.trim();
    const how = ($('#tHow').value || '').toLowerCase();
    const time = $('#tTime').value || '';
    const evCheckboxes = $$('.tEv');
    const ev = Array.from(evCheckboxes).filter(c => c.checked).map(c => c.value);
    const con = ($('#tCon').value || '').toLowerCase();
    
    if (!susp) {
      toast('⚠️ PLEASE ENTER A SUSPECT NAME', 'warning');
      return;
    }
    
    if (!time) {
      toast('⚠️ PLEASE ENTER A TIME', 'warning');
      return;
    }
    
    if (ev.length === 0) {
      toast('⚠️ PLEASE SELECT AT LEAST ONE PIECE OF EVIDENCE', 'warning');
      return;
    }
    
    const idOk = susp.toLowerCase() === SOLUTION.suspect.toLowerCase();
    const inRange = time >= SOLUTION.timeRange[0] && time <= SOLUTION.timeRange[1];
    const tScore = time === SOLUTION.time ? 'STRONG' : inRange ? 'PARTIAL' : 'WEAK';
    const hit = ev.filter(x => SOLUTION.evidence.includes(x)).length;
    const eScore = hit >= 4 ? 'STRONG' : hit >= 2 ? 'PARTIAL' : 'WEAK';
    const conOk = SOLUTION.contradictionKeys.filter(k => con.includes(k.toLowerCase())).length >= 2;
    
    const howKeys = ['alarm', 'override', 'glass', 'cut', 'corridor', 'maintenance', 'keys', 'fingerprint'];
    const howHit = howKeys.filter(k => how.includes(k)).length;
    const hScore = howHit >= 4 ? 'STRONG' : howHit >= 2 ? 'PARTIAL' : 'WEAK';
    
    let score = (idOk ? 42 : 0) +
      (tScore === 'STRONG' ? 18 : tScore === 'PARTIAL' ? 9 : 0) +
      (eScore === 'STRONG' ? 18 : eScore === 'PARTIAL' ? 9 : 0) +
      (conOk ? 12 : 0) +
      (hScore === 'STRONG' ? 10 : hScore === 'PARTIAL' ? 5 : 0);
    
    score = Math.max(4, Math.min(100, score));
    
    S.theory = {
      score,
      idOk,
      time: tScore,
      ev: eScore,
      con: conOk,
      how: hScore,
      at: new Date().toISOString()
    };
    
    save();
    go('theory');
    
    if (score >= 85) {
      toast('🎉 CASE CLOSED — BLACK ORCHID RECOVERED!', 'success');
    } else if (idOk) {
      toast('🔍 PRIMARY SUSPECT IDENTIFIED — Need more evidence', 'info');
    } else {
      toast('⚠️ CASE REMAINS UNSOLVED — Review your findings', 'warning');
    }
  });
}

// ===== RESET CASE =====
function wireReset() {
  const resetBtn = $('#resetCase');
  if (!resetBtn) return;
  
  const newResetBtn = resetBtn.cloneNode(true);
  resetBtn.parentNode.replaceChild(newResetBtn, resetBtn);
  
  newResetBtn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    
    openModal(
      'RESET CASE',
      `<p class="small">
        This permanently clears all reviewed evidence, flags, board cards,
        connections, notes and submitted theories for the Black Orchid case.
      </p>
      <p class="mono micro dim" style="color:var(--crimson);">
        ⚠️ ACTION CANNOT BE UNDONE.
      </p>`,
      `<button class="btn danger" id="confirmReset">
        ✅ CONFIRM RESET
      </button>
      <button class="btn ghost" data-close>
        ❌ CANCEL
      </button>`
    );
    
    setTimeout(function() {
      const confirmBtn = $('#confirmReset');
      if (confirmBtn) {
        const newConfirmBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
        
        newConfirmBtn.addEventListener('click', function() {
          try {
            localStorage.removeItem(KEY);
          } catch (e) {}
          
          S = {
            ...defaults,
            entered: true
          };
          
          save();
          closeModal();
          go('overview');
          
          toast('🗑️ CASE FILE RESET · BLACK ORCHID REOPENED', 'warning');
          
          setTimeout(wireReset, 100);
        });
      }
    }, 100);
  });
}

// ===== RENDER PROGRESS WITH ANIMATIONS =====
function renderProgress() {
  const list = $('#progList');
  if (!list) return;
  
  const parts = [
    S.seenEvidence.length / EVIDENCE.length,
    S.seenSuspects.length / SUSPECTS.length,
    S.seenEvents.length / EVENTS.length,
    Math.min(1, S.clues.length / 7),
    Math.min(1, S.notes.length / 3),
    Math.min(1, S.links.length / 3)
  ];
  
  const pct = Math.round((parts.reduce((a, b) => a + b, 0) / parts.length) * 100);
  
  const progBar = $('#progBar');
  const progPct = $('#progPct');
  if (progBar) {
    // Animate progress bar
    progBar.style.transition = 'width 1.2s cubic-bezier(0.4, 0, 0.2, 1)';
    progBar.style.width = pct + '%';
  }
  if (progPct) {
    progPct.textContent = pct + '%';
    // Pop animation
    progPct.classList.remove('pop');
    void progPct.offsetHeight;
    progPct.classList.add('pop');
  }
  
  list.innerHTML = `
    <li>📋 EVIDENCE REVIEWED: ${S.seenEvidence.length}/${EVIDENCE.length}</li>
    <li>🔍 SUSPECTS EXAMINED: ${S.seenSuspects.length}/${SUSPECTS.length}</li>
    <li>⏱️ TIMELINE EVENTS: ${S.seenEvents.length}/${EVENTS.length}</li>
    <li>🔗 CONNECTIONS: ${S.links.length}</li>
    <li>📝 NOTES CREATED: ${S.notes.length}</li>
    <li>💡 CLUES FOUND: ${S.clues.length}/7</li>
  `;
}

// ===== COMMAND PALETTE =====
function corpus() {
  const out = [];
  
  EVIDENCE.forEach(e =>
    out.push({
      label: `${e.id} — ${e.title}`,
      hint: 'EVIDENCE',
      text: `${e.id} ${e.title} ${e.cat} ${e.desc} ${e.loc} ${e.notes} ${e.time}`,
      run: () => openEvidence(e.id)
    })
  );
  
  SUSPECTS.forEach(s =>
    out.push({
      label: `${s.id} — ${s.name}`,
      hint: 'SUSPECT',
      text: `${s.name} ${s.role} ${s.statement} ${s.motive} ${s.obs} ${s.moves}`,
      run: () => openSuspect(s.id)
    })
  );
  
  LOCATIONS.forEach(l =>
    out.push({
      label: `${l.id} — ${l.name}`,
      hint: 'LOCATION',
      text: `${l.name} ${l.access} ${l.note} ${l.events.join(' ')}`,
      run: () => openLocation(l.id)
    })
  );
  
  EVENTS.forEach((e, i) =>
    out.push({
      label: `${e.t} — ${e.label}`,
      hint: 'TIMELINE',
      text: `${e.t} ${e.label} ${e.st}`,
      run: () => openEvent(i)
    })
  );
  
  MESSAGES.forEach(m =>
    out.push({
      label: `${m.t} — ${m.from} → ${m.to}`,
      hint: 'MESSAGE',
      text: `${m.from} ${m.to} ${m.body}`,
      run: () => go('messages')
    })
  );
  
  [
    ['📋 Open Evidence', 'evidence'],
    ['🔍 Open Suspects', 'suspects'],
    ['⏱️ Open Timeline', 'timeline'],
    ['📍 Open Locations', 'locations'],
    ['💬 Open Messages', 'messages'],
    ['📊 Open Case Board', 'board'],
    ['📝 Open Notes', 'notes'],
    ['🎯 Open Final Theory', 'theory'],
    ['🏠 Return to Overview', 'overview']
  ].forEach(([l, v]) => {
    out.push({
      label: l,
      hint: 'COMMAND',
      text: l + ' ' + v,
      run: () => go(v)
    });
  });
  
  return out;
}

let palIdx = 0;
let palItems = [];

function openPalette() {
  $('#palette').classList.remove('hidden');
  const i = $('#paletteInput');
  i.value = '';
  renderPalette('');
  i.focus();
}

function closePalette() {
  $('#palette').classList.add('hidden');
}

function renderPalette(q) {
  const all = corpus();
  const s = q.trim().toLowerCase();
  palItems = s
    ? all.filter(x => x.text.toLowerCase().includes(s)).slice(0, 40)
    : all.filter(x => x.hint === 'COMMAND');
  palIdx = 0;
  
  const list = $('#paletteList');
  list.innerHTML = palItems.length
    ? palItems.map((x, i) => `
        <li class="${i === 0 ? 'on' : ''}" data-i="${i}">
          <span>${esc(x.label)}</span>
          <span class="dim">${x.hint}</span>
        </li>
      `).join('')
    : `<li class="dim">NO RESULTS · ANALYSIS REQUIRED</li>`;
  
  $$('#paletteList li[data-i]').forEach(li => {
    li.addEventListener('click', function() {
      const it = palItems[+li.dataset.i];
      closePalette();
      it.run();
    });
  });
}

// ===== PALETTE EVENTS =====
$('#paletteInput').addEventListener('input', function(e) {
  renderPalette(e.target.value);
});

$('#palette').addEventListener('click', function(e) {
  if (e.target.hasAttribute('data-close-palette')) {
    closePalette();
  }
});

$('#openSearch').addEventListener('click', openPalette);

document.addEventListener('keydown', function(e) {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
    e.preventDefault();
    if ($('#app').classList.contains('hidden')) return;
    openPalette();
    return;
  }
  
  if (e.key === 'Escape') {
    if (!$('#palette').classList.contains('hidden')) {
      closePalette();
    } else if (!$('#modal').classList.contains('hidden')) {
      closeModal();
    }
  }
  
  if ($('#palette').classList.contains('hidden')) return;
  
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    e.preventDefault();
    if (!palItems.length) return;
    palIdx = (palIdx + (e.key === 'ArrowDown' ? 1 : -1) + palItems.length) % palItems.length;
    $$('#paletteList li[data-i]').forEach(function(li) {
      li.classList.toggle('on', +li.dataset.i === palIdx);
    });
  }
  
  if (e.key === 'Enter' && palItems[palIdx]) {
    const it = palItems[palIdx];
    closePalette();
    it.run();
  }
});

// ===== SECRET EASTER EGG =====
let clicks = 0;
let clickTimer = null;

function logoClick() {
  clicks++;
  clearTimeout(clickTimer);
  clickTimer = setTimeout(function() { clicks = 0; }, 1200);
  
  if (clicks >= 5) {
    clicks = 0;
    S.secret = true;
    save();
    toast('📜 SECRET UNLOCKED!', 'success');
    openModal(
      '📜 SECRET ARCHIVE · BLACK ORCHID JOURNAL',
      `
        <p class="mono small warn">✧ ENCRYPTED ENTRY ✧</p>
        <p class="small">
          <i>"The Black Orchid is not just an artifact — it's a key. 
          The Aztec priests hid knowledge within its obsidian petals. 
          Whoever stole it knows what it truly unlocks."</i>
        </p>
        <p class="desc small dim">— Dr. Miguel Reyes, Expedition Log, Day 47</p>
        <div style="border:1px solid var(--line);border-radius:var(--r);padding:12px;margin:12px 0;background:rgba(0,0,0,0.3);">
          <p class="mono micro dim">LOCATION: Tomb of the Obsidian Priest · Depth: 47m</p>
          <p class="desc small">"The flower that blooms in darkness holds the light of a thousand years."</p>
        </div>
      `,
      `<button class="btn ghost" data-close>CLOSE</button>`
    );
  }
}

// ===== WINDOW EVENTS =====
window.addEventListener('resize', function() {
  if (S.view === 'board') {
    drawWires();
  }
});

// ===== APP INIT =====
function initApp() {
  load();
  
  // Add glow orbs to body
  const orbs = document.createElement('div');
  orbs.innerHTML = `
    <div class="glow-orb"></div>
    <div class="glow-orb"></div>
    <div class="glow-orb"></div>
  `;
  document.body.prepend(orbs);
  
  const boot = $('#boot');
  const login = $('#login'); // Get the login section
  const landing = $('#landing');
  const app = $('#app');
  const soundToggle = $('#soundToggle');

if (soundToggle) {
  soundToggle.addEventListener('click', function() {
    toggleMusic();
  });
}
  
  const bootLog = $('#bootLog');
  const messages = [
    '> INITIALIZING SECURE TERMINAL...',
    '> SYSTEM CHECK: OK',
    '> LOADING CASE FILE: BLACK ORCHID...',
    '> VERIFYING CREDENTIALS...',
    '> ACCESS GRANTED.',
    '> MUSEUM HEIST INVESTIGATION — READY.',
    '> ARTIFACT: BLACK ORCHID · 3,000 YEARS OLD',
    '> LAST SEEN: DECEMBER 14TH · 23:52'
  ];
  
  let i = 0;
  
  // START THE LIGHTNING EFFECT ON BOOT
  startLightning();
  
  const bootInterval = setInterval(function() {
    if (i < messages.length) {
      const line = document.createElement('div');
      line.className = 'line';
      line.textContent = messages[i];
      bootLog.appendChild(line);
      i++;
    } else {
      clearInterval(bootInterval);
      setTimeout(function() {
        // STOP LIGHTNING AND SHOW LOGIN SCREEN
        stopLightning();
        boot.classList.add('hidden');
        login.classList.remove('hidden'); 
        setupLogin(); // Initialize the login form
      }, 600);
    }
  }, 400);
  
  $('#skipBoot').addEventListener('click', function() {
    clearInterval(bootInterval);
    // STOP THE LIGHTNING EFFECT ON SKIP
    stopLightning();
    boot.classList.add('hidden');
    login.classList.remove('hidden');
    setupLogin();
  });
  
  $('#enterCase').addEventListener('click', function() {
    S.entered = true;
    save();
    landing.classList.add('hidden');
    app.classList.remove('hidden');
    render('overview');
    setTimeout(function() {
      wireReset();
    }, 300);
    toast('🌺 BLACK ORCHID CASE OPENED', 'success');
  });
  
  $$('.nav-item').forEach(function(el) {
    el.addEventListener('click', function() {
      go(el.dataset.view);
      $('#nav').classList.remove('open');
      if (el.dataset.view === 'overview') {
        setTimeout(function() {
          wireReset();
        }, 300);
      }
    });
  });
  
  $('#navToggle').addEventListener('click', function() {
    $('#nav').classList.toggle('open');
  });
  
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      if (!$('#palette').classList.contains('hidden')) {
        closePalette();
      } else if (!$('#modal').classList.contains('hidden')) {
        closeModal();
      }
    }
  });
  
  const logo = $('#logo');
  const logo2 = $('#logo2');
  if (logo) logo.addEventListener('click', logoClick);
  if (logo2) logo2.addEventListener('click', logoClick);
}

// ===== NEW LOGIN LOGIC =====
function setupLogin() {
  // Set up the Captcha (Clicking the cameras)
  const captchaCards = $$('.captcha-card');
  captchaCards.forEach(card => {
    card.addEventListener('click', function() {
      this.classList.toggle('selected');
    });
  });

  const loginBtn = $('#loginBtn');
  
  loginBtn.addEventListener('click', function() {
    const user = $('#loginUser').value.trim();
    const pass = $('#loginPass').value;
    
    // STRICT CHECK: Are ANY "empty" cards selected?
    const selectedEmpty = $$('.captcha-card.selected[data-captcha="empty"]').length;
    
    // Check: Did they select ALL the cameras?
    const selectedCameras = $$('.captcha-card.selected[data-captcha="camera"]').length;
    const totalCameras = $$('.captcha-card[data-captcha="camera"]').length;

    if (!user) {
      toast('⚠️ ENTER CLEARANCE ID', 'warning');
      return;
    }
    if (!pass) {
      toast('⚠️ ENTER PASSCODE', 'warning');
      return;
    }
    
    // If they clicked a single empty card, reject it immediately
    if (selectedEmpty > 0) {
      toast('⚠️ HUMAN CHECK FAILED', 'error');
      const humanCheck = $('#humanCheck');
      humanCheck.style.animation = 'none';
      void humanCheck.offsetHeight;
      humanCheck.style.animation = 'shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97)';
      return;
    }
    
    // If they didn't select all the cameras, reject it
    if (selectedCameras !== totalCameras) {
      toast('⚠️ HUMAN CHECK FAILED', 'error');
      const humanCheck = $('#humanCheck');
      humanCheck.style.animation = 'none';
      void humanCheck.offsetHeight;
      humanCheck.style.animation = 'shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97)';
      return;
    }

    // Success!
loginBtn.disabled = true;
loginBtn.textContent = "🔓 VERIFYING ACCESS...";

// START MUSIC AFTER HUMAN VERIFICATION
startMusic();

setTimeout(() => {
  const login = $('#login');
  login.classList.add('hidden');
  landing.classList.remove('hidden');

  startFX();

  loginBtn.disabled = false;
  loginBtn.textContent = "🔐 ACCESS TERMINAL";

  toast('🟢 CLEARANCE ACCEPTED', 'success');
}, 1200);
  });
}

function startFX() {
  const canvas = $('#fx');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h;
  
  function resize() {
    w = canvas.width = canvas.parentElement.offsetWidth;
    h = canvas.height = canvas.parentElement.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);
  
  const dots = Array.from({ length: 80 }, function() {
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 1
    };
  });
  
  function draw() {
    ctx.clearRect(0, 0, w, h);
    dots.forEach(function(d) {
      d.x += d.vx;
      d.y += d.vy;
      if (d.x < 0 || d.x > w) d.vx *= -1;
      if (d.y < 0 || d.y > h) d.vy *= -1;
      
      const opacity = 0.1 + Math.sin(Date.now() / 2000 + d.x + d.y) * 0.05;
      ctx.fillStyle = `rgba(217,164,65,${opacity})`;
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  draw();
}

document.addEventListener('DOMContentLoaded', initApp);

// ===== LIGHT LEAK BURNOUT EFFECT =====
function createLightLeak(x, y) {
  // Main light leak flash
  const leak = document.createElement('div');
  leak.className = 'light-leak active';
  document.body.appendChild(leak);
  
  // Light leak gradient at click position
  const gradient = document.createElement('div');
  gradient.className = 'light-leak-gradient active';
  gradient.style.setProperty('--mouse-x', x + 'px');
  gradient.style.setProperty('--mouse-y', y + 'px');
  document.body.appendChild(gradient);
  
  // Create light rays (lens flare style)
  const numRays = 8;
  for (let i = 0; i < numRays; i++) {
    const ray = document.createElement('div');
    ray.className = 'light-ray active';
    const angle = (i / numRays) * 360 + Math.random() * 20 - 10;
    const distance = 100 + Math.random() * 200;
    ray.style.width = (80 + Math.random() * 120) + 'px';
    ray.style.height = (2 + Math.random() * 4) + 'px';
    ray.style.left = (x - 40) + 'px';
    ray.style.top = (y - 2) + 'px';
    ray.style.setProperty('--ray-rotate', angle + 'deg');
    ray.style.setProperty('--ray-x', x + 'px');
    ray.style.setProperty('--ray-y', y + 'px');
    ray.style.filter = 'blur(' + (1 + Math.random() * 2) + 'px)';
    ray.style.background = `linear-gradient(${angle}deg, 
      rgba(255, 240, 200, 0.5),
      rgba(255, 220, 150, 0.2),
      transparent
    )`;
    document.body.appendChild(ray);
    
    setTimeout(() => {
      ray.remove();
    }, 800);
  }
  
  // Create light particles
  const numParticles = 25;
  for (let i = 0; i < numParticles; i++) {
    const particle = document.createElement('div');
    particle.className = 'light-particle active';
    
    const angle = Math.random() * Math.PI * 2;
    const dist1 = 20 + Math.random() * 80;
    const dist2 = 60 + Math.random() * 150;
    const dist3 = 100 + Math.random() * 250;
    
    const tx = Math.cos(angle) * dist1;
    const ty = Math.sin(angle) * dist1 - 30;
    const tx2 = Math.cos(angle + 0.3) * dist2;
    const ty2 = Math.sin(angle + 0.3) * dist2 - 60;
    const tx3 = Math.cos(angle + 0.6) * dist3;
    const ty3 = Math.sin(angle + 0.6) * dist3 - 80;
    
    const size = 2 + Math.random() * 6;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = (x - size/2) + 'px';
    particle.style.top = (y - size/2) + 'px';
    particle.style.setProperty('--tx', tx + 'px');
    particle.style.setProperty('--ty', ty + 'px');
    particle.style.setProperty('--tx2', tx2 + 'px');
    particle.style.setProperty('--ty2', ty2 + 'px');
    particle.style.setProperty('--tx3', tx3 + 'px');
    particle.style.setProperty('--ty3', ty3 + 'px');
    particle.style.animationDuration = (0.6 + Math.random() * 0.6) + 's';
    
    // Warm golden/white colors
    const r = 255;
    const g = 200 + Math.random() * 55;
    const b = 100 + Math.random() * 100;
    particle.style.background = `radial-gradient(circle, rgba(${r},${g},${b},0.9), rgba(${r},${g},${b},0))`;
    
    document.body.appendChild(particle);
    
    setTimeout(() => {
      particle.remove();
    }, 1200);
  }
  
  // Create horizontal and vertical light streaks
  const streakH = document.createElement('div');
  streakH.className = 'light-streak-h active';
  streakH.style.left = '0';
  streakH.style.top = y + 'px';
  streakH.style.width = '100%';
  document.body.appendChild(streakH);
  
  const streakV = document.createElement('div');
  streakV.className = 'light-streak-v active';
  streakV.style.left = x + 'px';
  streakV.style.top = '0';
  streakV.style.height = '100%';
  document.body.appendChild(streakV);
  
  // Remove all elements after animation
  setTimeout(() => {
    leak.remove();
    gradient.remove();
    streakH.remove();
    streakV.remove();
  }, 800);
  
  // Gentle camera shake
  document.body.style.transition = 'transform 0.08s ease';
  document.body.style.transform = `translate(${(Math.random() - 0.5) * 4}px, ${(Math.random() - 0.5) * 4}px)`;
  setTimeout(() => {
    document.body.style.transform = 'translate(0, 0)';
  }, 150);
}

// Add click listener to entire document
document.addEventListener('click', function(e) {
  // Don't trigger on buttons or interactive elements
  const target = e.target;
  if (target.closest('button') || target.closest('a') || target.closest('input') || 
      target.closest('select') || target.closest('textarea') || target.closest('.pin')) {
    return;
  }
  
  createLightLeak(e.clientX, e.clientY);
});

// Double click for more intense effect
document.addEventListener('dblclick', function(e) {
  createLightLeak(e.clientX - 30, e.clientY - 30);
  setTimeout(() => {
    createLightLeak(e.clientX + 30, e.clientY + 30);
  }, 100);
});
