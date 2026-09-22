// ==========================================
// EMOJI GACHA SIMULATOR - GAME ENGINE (game.js)
// ==========================================

// --- AUDIO SYSTEM (Web Audio API) ---
let audioCtx = null;
let sfxEnabled = true;
let sfxVolume = 1.0;
let fastModeEnabled = false;
let laptopIntroEnabled = true;

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended' || audioCtx.state === 'interrupted') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Automatically resume the audio system upon screen interaction or when switching back to the app
['click', 'touchstart', 'touchend', 'pointerdown'].forEach(evt => {
  window.addEventListener(evt, () => {
    try {
      const ctx = getAudioContext();
      if (ctx && ctx.state !== 'running') {
        ctx.resume();
      }
    } catch(e){}
  }, { passive: true });
});

document.addEventListener('visibilitychange', () => {
  if (!document.hidden && audioCtx && audioCtx.state !== 'running') {
    audioCtx.resume();
  }
});

function getChannelVol(type) {
  const vols = (state && state.sfxChannelVol) || { tick: 100, typing: 100, bass: 100, fanfare: 100 };
  let channel = 'fanfare';
  if (type === 'tick') channel = 'tick';
  else if (type === 'typing') channel = 'typing';
  else if (type === 'ur_laptop') channel = 'bass';
  return (vols[channel] ?? 100) / 100;
}

function playSound(type) {
  if (!sfxEnabled) return;
  if (type === 'tick' && state.sfxTicks === false) return;
  if (type === 'typing' && state.sfxTyping === false) return;
  if (type === 'ur_laptop' && state.sfxBass === false) return;
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const masterVol = sfxVolume * getChannelVol(type);

      if (type === 'tick') {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.frequency.setValueAtTime(440, now);
          gain.gain.setValueAtTime(0.12 * masterVol, now); 
          gain.gain.linearRampToValueAtTime(0.0001, now + 0.08);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.08);
    } else if (type === 'typing') {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(540 + Math.random() * 80, now);
          gain.gain.setValueAtTime(0.32 * masterVol, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.08);
    } else if (type === 'pop') {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.frequency.setValueAtTime(360, now);
          gain.gain.setValueAtTime(0.15 * masterVol, now);
          gain.gain.linearRampToValueAtTime(0.0001, now + 0.12);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.12);
    } else if (type === 'ssr') {
      [523.25, 659.25, 783.99].forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = f;
        gain.gain.setValueAtTime(0.18 * masterVol, now + i * 0.08);
        gain.gain.linearRampToValueAtTime(0.0001, now + 0.4 + i * 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + 0.45 + i * 0.08);
      });
    } else if (type === 'ur_laptop') {
      const bass = ctx.createOscillator();
      const bassGain = ctx.createGain();
      bass.type = 'sawtooth';
      bass.frequency.setValueAtTime(160, now);
      bass.frequency.exponentialRampToValueAtTime(28, now + 1.3);
      bassGain.gain.setValueAtTime(0.45 * masterVol, now);
      bassGain.gain.linearRampToValueAtTime(0.0001, now + 1.3);
      bass.connect(bassGain);
      bassGain.connect(ctx.destination);
      bass.start(now);
      bass.stop(now + 1.35);

      [329.63, 440, 554.37, 659.25, 880].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0.15 * masterVol, now + idx * 0.06);
        gain.gain.linearRampToValueAtTime(0.0001, now + idx * 0.06 + 0.9);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.95);
      });
    } else if (type === 'ur') {
      const bass = ctx.createOscillator();
      const bassGain = ctx.createGain();
      bass.type = 'sawtooth';
      bass.frequency.setValueAtTime(150, now);
      bass.frequency.linearRampToValueAtTime(30, now + 1.4);
      bassGain.gain.setValueAtTime(0.45 * masterVol, now);
      bassGain.gain.linearRampToValueAtTime(0.0001, now + 1.4);
      bass.connect(bassGain);
      bassGain.connect(ctx.destination);
      bass.start(now);
      bass.stop(now + 1.45);

      [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51, 1567.98].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.001, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.24 * masterVol, now + idx * 0.08 + 0.04);
        gain.gain.linearRampToValueAtTime(0.0001, now + idx * 0.08 + 1.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 1.35);
      });
    } else if (type === 'promote') {
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        gain.gain.setValueAtTime(0.01, now + idx * 0.07);
        gain.gain.linearRampToValueAtTime(0.18 * masterVol, now + idx * 0.07 + 0.03);
        gain.gain.linearRampToValueAtTime(0.0001, now + idx * 0.07 + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.55);
      });
    } else if (type === 'promote_rainbow') {
      [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.01, now + idx * 0.08);
        gain.gain.linearRampToValueAtTime(0.2 * masterVol, now + idx * 0.08 + 0.04);
        gain.gain.linearRampToValueAtTime(0.0001, now + idx * 0.08 + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 1.25);
      });
    } else if (type === 'suspense') {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(55, now);
      gain.gain.setValueAtTime(0.35 * masterVol, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.9);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.9);
    } else if (type === 'glass_shatter') {
      for (let i = 0; i < 4; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(1200 + Math.random() * 2000, now + i * 0.04);
        gain.gain.setValueAtTime(0.25 * masterVol, now + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.04);
        osc.stop(now + i * 0.04 + 0.16);
      }
    }
  } catch (e) {}
}

// --- GAME STATE DEFINITION ---
function getDefaultState() {
  const now = new Date();
  return {
    gems: 25000,
    scrPity: 0,
    urPity: 0,
    ssrPity: 0,
    totalPulls: 0,
    mineClicks: 0,
    dailyClaimed: false,
    dailyPullsCount: 0,
    dailyPullClaimed: false,
    dailyPromotesCount: 0,
    dailyPromoteClaimed: false,
    redeemedCodes: [],
    inventory: {},
    calendarMonthKey: `${now.getFullYear()}-${now.getMonth()}`,
    claimedCalendarDays: [],
    sfx: true,
    sfxVol: 100,
    sfxTicks: true,
    sfxTyping: true,
    sfxBass: true,
    sfxChannelVol: { tick: 100, typing: 100, bass: 100, fanfare: 100 },
    showShareBtn: true,
    fakeoutEnabled: true,
    fastMode: false,
    skipDuplicateUr: true,
    skipScrCutscenes: false,
    laptopIntro: true,
    layout: 'tablet',
    mascot: '✨',
    avatarFrame: 'default',
    username: 'Summoner',
    hasUnlockedScr: false,
    wpOpacity: 70,
    wpPosX: 50,
    wpPosY: 50,
    currentBannerId: 'cosmos',
    focusTargets: { cosmos: null, faces: null, all: null, ssr: null, scr: null },
    pullLog: [],
    pullSessions: [],
    tenPullSummons: 0,
    unlockedAchievements: [],
    pullsSinceLastExport: 0,
    clockConfig: { showDate: true, showTime: true, showUtc: true, showLocation: true },
    lang: 'en'
  };
}

let state = getDefaultState();
let currentFilter = 'ALL';
let currentSeriesFilter = 'ALL';
let codexFilter = 'ALL';
let codexSeriesFilter = 'ALL';
let currentSessionPulls = [];
let currentRevealIndex = 0;
let selectedEmoji = null;
let pendingUrCutscenes = [];
let pendingScrCutscenes = [];
let currentPickupTierTab = 'UR';
let currentMascotFilter = 'ALL';
let devForcedNextTier = null;


// --- LOCAL STORAGE ---
function saveState() {
  try {
    localStorage.setItem('emoji_gacha_v270_save', JSON.stringify(state));
  } catch (e) {
    console.warn("Save storage quota exceeded", e);
  }
  checkAchievements();
  checkExportReminder();
  renderUI();
}

// --- TOAST NOTIFICATIONS ---
function showToast(html, durationMs = 4200) {
  let host = document.getElementById('toastHost');
  if (!host) {
    host = document.createElement('div');
    host.id = 'toastHost';
    host.className = 'fixed bottom-4 left-1/2 -translate-x-1/2 z-[70] flex flex-col items-center gap-2 pointer-events-none w-full px-4';
    document.body.appendChild(host);
  }
  const toast = document.createElement('div');
  toast.className = 'pointer-events-auto max-w-sm w-full bg-slate-900/95 border border-indigo-500/40 shadow-xl shadow-black/40 rounded-2xl px-4 py-3 text-sm text-slate-100 backdrop-blur-md animate-[cardPop_0.3s_ease-out]';
  toast.innerHTML = html;
  host.appendChild(toast);
  setTimeout(() => {
    toast.style.transition = 'opacity 0.4s ease';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 400);
  }, durationMs);
}

// --- ACHIEVEMENTS SYSTEM ---
function checkAchievements() {
  ACHIEVEMENTS.forEach(a => {
    if (!state.unlockedAchievements.includes(a.id) && a.check(state)) {
      state.unlockedAchievements.push(a.id);
      try { localStorage.setItem('emoji_gacha_v270_save', JSON.stringify(state)); } catch (e) {}
      showToast(`<div class="flex items-center gap-3"><span class="text-3xl">${a.icon}</span><div><div class="font-black text-amber-300 text-xs uppercase tracking-wide">Achievement Unlocked</div><div class="font-bold text-white text-sm">${a.name}</div></div></div>`);
    }
  });
}

function openAchievementsModal() {
  renderAchievements();
  document.getElementById('achievementsModal').classList.remove('hidden');
}
function closeAchievementsModal() { document.getElementById('achievementsModal').classList.add('hidden'); }

function renderAchievements() {
  const list = document.getElementById('achievementsList');
  if (!list) return;
  list.innerHTML = ACHIEVEMENTS.map(a => {
    const unlocked = state.unlockedAchievements.includes(a.id);
    return `
      <div class="flex items-center gap-3 p-3 rounded-xl border ${unlocked ? 'bg-amber-500/10 border-amber-500/40' : 'bg-slate-800/50 border-slate-700/60 opacity-60'}">
        <span class="text-2xl">${unlocked ? a.icon : '🔒'}</span>
        <div class="flex-1">
          <div class="text-sm font-bold ${unlocked ? 'text-amber-300' : 'text-slate-400'}">${a.name}</div>
          <div class="text-[11px] text-slate-400">${a.desc}</div>
        </div>
        ${unlocked ? '<span class="text-emerald-400 text-xs font-bold">✓</span>' : ''}
      </div>`;
  }).join('');
}

// --- EXPORT-SAVE REMINDER ---
function checkExportReminder() {
  if (state.pullsSinceLastExport > 0 && state.pullsSinceLastExport % 200 === 0) {
    showToast(`<div class="flex items-center gap-3"><span class="text-2xl">💾</span><div class="flex-1"><div class="font-bold text-white text-sm">Backup Reminder!</div><div class="text-[11px] text-slate-400 mb-1.5">You've performed many pulls. Copy your Save Data string to prevent progress loss!</div><button onclick="document.getElementById('toastHost').innerHTML='';openSettingsModal();" class="text-[11px] bg-indigo-600 hover:bg-indigo-500 px-2.5 py-1 rounded-lg font-bold">Go to Settings</button></div></div>`, 6000);
  }
}

// --- EXPANDED PICK-UP TARGET MODAL WITH SILHOUETTES ---
function openPickupModal() {
  setPickupTierTab(currentPickupTierTab);
  document.getElementById('pickupModal').classList.remove('hidden');
}

function closePickupModal() {
  document.getElementById('pickupModal').classList.add('hidden');
}

function setPickupTierTab(tier) {
  currentPickupTierTab = tier;
  ['UR', 'SSR', 'SCR'].forEach(t => {
    const btn = document.getElementById(`pickupTab_${t}`);
    if (btn) {
      btn.className = (t === tier)
        ? 'px-2.5 py-1 rounded-lg bg-indigo-600 text-white transition'
        : 'px-2.5 py-1 rounded-lg text-slate-400 hover:bg-slate-800 transition';
    }
  });

  const scrTab = document.getElementById('pickupTab_SCR');
  if (scrTab) {
    scrTab.classList.toggle('hidden', !state.hasUnlockedScr);
  }

  renderPickupModal();
}

function selectPickupTarget(emoji) {
  if (currentPickupTierTab === 'UR') {
    state.focusTargets[state.currentBannerId] = emoji;
  } else if (currentPickupTierTab === 'SSR') {
    state.focusTargets.ssr = emoji;
  } else if (currentPickupTierTab === 'SCR') {
    state.focusTargets.scr = emoji;
  }
  saveState();
  renderBannerUI();
  closePickupModal();
}

function clearPickupTarget() {
  if (currentPickupTierTab === 'UR') {
    state.focusTargets[state.currentBannerId] = null;
  } else if (currentPickupTierTab === 'SSR') {
    state.focusTargets.ssr = null;
  } else if (currentPickupTierTab === 'SCR') {
    state.focusTargets.scr = null;
  }
  saveState();
  renderBannerUI();
  closePickupModal();
}

function renderPickupModal() {
  const grid = document.getElementById('pickupModalGrid');
  if (!grid) return;

  const activePool = BANNER_POOLS[state.currentBannerId] || POOL;
  let poolList = [];
  let currentFocused = null;

  if (currentPickupTierTab === 'SCR') {
    poolList = SCR_POOL;
    currentFocused = state.focusTargets.scr;
  } else if (currentPickupTierTab === 'SSR') {
    poolList = activePool.SSR;
    currentFocused = state.focusTargets.ssr;
  } else {
    poolList = activePool.UR;
    currentFocused = state.focusTargets[state.currentBannerId];
  }

  grid.innerHTML = poolList.map(item => {
    const isOwned = !!state.inventory[item.emoji];
    const isSel = (currentFocused === item.emoji);

    return `
      <button onclick="selectPickupTarget('${item.emoji}')" class="flex items-center gap-3 p-2.5 rounded-2xl border transition active:scale-95 text-left ${isSel ? 'bg-amber-500/20 border-amber-400 text-amber-200' : 'bg-slate-800 hover:bg-slate-700/80 border-slate-700 text-slate-200'}">
        <span class="text-3xl ${isOwned ? '' : 'filter grayscale brightness-50 opacity-40'}">${item.emoji}</span>
        <div class="flex-1 min-w-0">
          <div class="text-xs font-bold truncate">${isOwned ? item.name : '??? (Unobtained)'}</div>
          <div class="text-[10px] ${isSel ? 'text-amber-300 font-bold' : 'text-slate-400'}">${isSel ? '✓ Active Focus' : 'Tap to target (2x)'}</div>
        </div>
      </button>
    `;
  }).join('');
}

function switchBanner(id) {
  if (!BANNER_POOLS[id]) return;
  state.currentBannerId = id;
  bannerEmojiIndex = 0;
  renderBannerUI();
  saveState();
}

function renderBannerUI() {
  const banner = BANNERS.find(b => b.id === state.currentBannerId) || BANNERS[0];
  const titleEl = document.getElementById('bannerTitle');
  const taglineEl = document.getElementById('bannerTagline');
  if (titleEl) titleEl.innerText = banner.title;
  if (taglineEl) taglineEl.innerText = banner.tagline;

  document.querySelectorAll('.bannerTabBtn').forEach(btn => {
    const isActive = btn.dataset.bannerId === state.currentBannerId;
    btn.className = 'bannerTabBtn text-xs font-bold px-3 py-1.5 rounded-full border transition active:scale-95 ' +
      (isActive ? 'bg-indigo-600 border-indigo-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white');
  });

  const activePool = BANNER_POOLS[state.currentBannerId] || POOL;
  const focusedUr = state.focusTargets[state.currentBannerId];
  const focusedSsr = state.focusTargets.ssr;
  const focusedScr = state.focusTargets.scr;

  const displayEl = document.getElementById('bannerFocusDisplay');
  if (displayEl) {
    const activeTargets = [];
    if (focusedScr && state.hasUnlockedScr) {
      activeTargets.push(`<span class="text-rose-400 font-bold">${focusedScr} SCR</span>`);
    }
    if (focusedUr) {
      activeTargets.push(`<span class="text-pink-400 font-bold">${focusedUr} UR</span>`);
    }
    if (focusedSsr) {
      activeTargets.push(`<span class="text-amber-400 font-bold">${focusedSsr} SSR</span>`);
    }

    displayEl.innerHTML = activeTargets.length > 0
      ? activeTargets.join(' · ') + ' (2x rate)'
      : 'None (Standard Rates)';
  }
}

// --- OUT OF GEMS MODAL ---
function openOutOfGemsModal() { document.getElementById('outOfGemsModal').classList.remove('hidden'); }
function closeOutOfGemsModal() { document.getElementById('outOfGemsModal').classList.add('hidden'); }
function goToQuestsFromGemsModal() {
  closeOutOfGemsModal();
  const el = document.getElementById('questsSection');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// --- PULL LOG ---
let pullLogUrOnly = false;
function openPullLogModal() {
  renderPullLog();
  document.getElementById('pullLogModal').classList.remove('hidden');
}
function closePullLogModal() { document.getElementById('pullLogModal').classList.add('hidden'); }
function togglePullLogFilter() {
  pullLogUrOnly = !pullLogUrOnly;
  renderPullLog();
}
function renderPullLog() {
  const list = document.getElementById('pullLogList');
  const filterBtn = document.getElementById('pullLogFilterBtn');
  if (filterBtn) {
    filterBtn.className = 'text-xs font-bold px-3 py-1.5 rounded-full border transition active:scale-95 ' +
      (pullLogUrOnly ? 'bg-pink-600 border-pink-400 text-white' : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white');
    filterBtn.innerText = pullLogUrOnly ? '🌟 Showing Packs with UR' : '🌟 Show UR Packs Only';
  }
  if (!list) return;

  let sessions = state.pullSessions || [];
  if (pullLogUrOnly) {
    sessions = sessions.filter(s => s.items.some(it => it.tier === 'UR'));
  }

  if (sessions.length === 0) {
    list.innerHTML = `<div class="py-8 text-center text-xs text-slate-500 italic">${pullLogUrOnly ? 'No packs contain UR yet — keep summoning!' : 'No summons recorded yet.'}</div>`;
    return;
  }

  list.innerHTML = sessions.map(s => {
    const d = new Date(s.ts);
    const timeStr = `${d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} · ${d.toTimeString().slice(0, 8)}`;
    const banner = BANNERS.find(b => b.id === s.bannerId) || { tabLabel: 'Standard' };
    const hasUr = s.items.some(i => i.tier === 'UR');

    const cardsHtml = s.items.map(it => {
      let glow = 'bg-slate-800/80 border-slate-700 text-slate-300';
      if (it.tier === 'UR') glow = 'glow-ur border-pink-400 text-pink-200';
      else if (it.tier === 'SSR') glow = 'glow-ssr border-amber-400 text-amber-200';
      else if (it.tier === 'SR') glow = 'glow-sr border-purple-400 text-purple-200';

      return `
        <div class="p-1.5 rounded-xl border flex flex-col items-center justify-center text-center aspect-square ${glow}">
          <span class="text-xl sm:text-2xl">${it.emoji}</span>
          <span class="text-[8px] font-mono font-bold uppercase mt-0.5">${it.tier}</span>
        </div>
      `;
    }).join('');

    return `
      <div class="bg-slate-950/60 border ${hasUr ? 'border-pink-500/40' : 'border-slate-800'} rounded-2xl p-3 space-y-2">
        <div class="flex items-center justify-between text-[11px] font-mono">
          <span class="font-bold text-slate-300 flex items-center gap-1.5">
            <span>📦 ${s.times}x Pull</span>
            <span class="text-indigo-400">(${banner.tabLabel})</span>
          </span>
          <span class="text-slate-500">${timeStr}</span>
        </div>
        <div class="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
          ${cardsHtml}
        </div>
      </div>
    `;
  }).join('');
}

// --- SOUND CHANNEL VOLUME ---
function handleChannelVolume(channel, val) {
  state.sfxChannelVol[channel] = Number(val);
  const label = document.getElementById(`sfxChanVal_${channel}`);
  if (label) label.innerText = `${val}%`;
  saveState();
}
function previewChannelSound(channel) {
  getAudioContext();
  const map = { tick: 'tick', typing: 'typing', bass: 'ur_laptop', fanfare: 'ssr' };
  playSound(map[channel] || 'tick');
}

function loadState() {
  const saved = localStorage.getItem('emoji_gacha_v270_save');
  if (saved) {
    try {
      state = Object.assign(getDefaultState(), JSON.parse(saved));
      const currentMonthKey = `${new Date().getFullYear()}-${new Date().getMonth()}`;
      if (state.calendarMonthKey !== currentMonthKey) {
        state.calendarMonthKey = currentMonthKey;
        state.claimedCalendarDays = [];
        state.dailyClaimed = false;
        state.dailyPullsCount = 0;
        state.dailyPullClaimed = false;
        state.dailyPromotesCount = 0;
        state.dailyPromoteClaimed = false;
      }
      sfxEnabled = state.sfx ?? true;
      sfxVolume = (state.sfxVol ?? 100) / 100;
      state.sfxTicks = state.sfxTicks ?? true;
      state.sfxTyping = state.sfxTyping ?? true;
      state.sfxBass = state.sfxBass ?? true;
      state.sfxChannelVol = Object.assign({ tick: 100, typing: 100, bass: 100, fanfare: 100 }, state.sfxChannelVol || {});
      state.showShareBtn = state.showShareBtn ?? true;
      fastModeEnabled = state.fastMode ?? false;
      laptopIntroEnabled = state.laptopIntro ?? true;
      state.currentBannerId = BANNER_POOLS[state.currentBannerId] ? state.currentBannerId : 'cosmos';
      state.focusTargets = Object.assign({ cosmos: null, faces: null, all: null, ssr: null, scr: null }, state.focusTargets || {});
      state.hasUnlockedScr = !!state.hasUnlockedScr || Object.values(state.inventory || {}).some(i => i.tier === 'SCR');
      state.pullLog = Array.isArray(state.pullLog) ? state.pullLog : [];
      state.tenPullSummons = state.tenPullSummons ?? 0;
      state.unlockedAchievements = Array.isArray(state.unlockedAchievements) ? state.unlockedAchievements : [];
      state.pullsSinceLastExport = state.pullsSinceLastExport ?? 0;
    } catch (e) {
      console.error(e);
    }
  }
  applyLayout(state.layout || 'tablet');
  loadSeparateMedia();
  renderBannerUI();
  renderUI();
}

// --- REALTIME DIGITAL CLOCK WITH DATE, UTC & TIMEZONE ---
function updateDigitalClock() {
  const cfg = (state && state.clockConfig) || { showDate: true, showTime: true, showUtc: true, showLocation: true };
  const now = new Date();
  const pad = (n) => n.toString().padStart(2, '0');
  
  const parts = [];

  if (cfg.showDate) {
    parts.push(now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }));
  }

  if (cfg.showTime) {
    parts.push(`${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`);
  }

  if (cfg.showUtc) {
    const offsetMinutes = -now.getTimezoneOffset();
    const offsetSign = offsetMinutes >= 0 ? '+' : '-';
    const absOffset = Math.abs(offsetMinutes);
    const offsetHours = Math.floor(absOffset / 60);
    const offsetMins = absOffset % 60;
    parts.push(`UTC${offsetSign}${offsetHours}${offsetMins ? `:${String(offsetMins).padStart(2, '0')}` : ''}`);
  }

  if (cfg.showLocation) {
    let zoneLabel = 'Local';
    try {
      const zone = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      const countryMap = {
        'Asia/Bangkok': 'Thailand', 'Asia/Tokyo': 'Japan', 'Asia/Seoul': 'South Korea',
        'Asia/Shanghai': 'China', 'Asia/Hong_Kong': 'Hong Kong', 'Asia/Singapore': 'Singapore',
        'Asia/Taipei': 'Taiwan', 'Europe/London': 'UK', 'Europe/Paris': 'France',
        'Europe/Berlin': 'Germany', 'America/New_York': 'USA', 'America/Los_Angeles': 'USA',
        'Australia/Sydney': 'Australia'
      };
      zoneLabel = countryMap[zone] || zone.split('/')[1]?.replace(/_/g, ' ') || 'Local';
    } catch (e) {}
    parts.push(zoneLabel);
  }

  const clockEl = document.getElementById('digitalClock');
  if (clockEl) {
    clockEl.innerText = parts.length > 0 ? parts.join(' · ') : '--:--';
  }
}

function toggleClockSetting(key, val) {
  if (!state.clockConfig) state.clockConfig = { showDate: true, showTime: true, showUtc: true, showLocation: true };
  state.clockConfig[key] = val;
  saveState();
  updateDigitalClock();
}
setInterval(updateDigitalClock, 1000);
updateDigitalClock();

// --- BANNER PREVIEW CYCLING ---
let bannerEmojiIndex = 0;
setInterval(() => {
  const el = document.getElementById('bannerPreviewEmoji');
  if (!el) return;
  const urList = (BANNER_POOLS[state.currentBannerId] || POOL).UR;
  bannerEmojiIndex = (bannerEmojiIndex + 1) % urList.length;
  el.style.opacity = '0';
  setTimeout(() => {
    el.innerText = urList[bannerEmojiIndex].emoji;
    el.style.opacity = '1';
  }, 250);
}, 2500);

// --- SEPARATE MEDIA (WALLPAPER & BGM) ---
let localWallpaperData = null;

function loadSeparateMedia() {
  localWallpaperData = localStorage.getItem('emoji_gacha_local_wp');
  applyWallpaper();
}

function handleWallpaperUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    const img = new Image();
    img.onload = function() {
      const canvas = document.createElement('canvas');
      const maxDim = 1280;
      let w = img.width, h = img.height;
      if (w > maxDim || h > maxDim) {
        if (w > h) { h = Math.round((h * maxDim) / w); w = maxDim; }
        else { w = Math.round((w * maxDim) / h); h = maxDim; }
      }
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, w, h);
      
      localWallpaperData = canvas.toDataURL('image/jpeg', 0.85);
      try {
        localStorage.setItem('emoji_gacha_local_wp', localWallpaperData);
      } catch (e) {
        console.warn("Wallpaper exceeds localStorage quota");
      }
      applyWallpaper();
    };
    img.src = evt.target.result;
  };
  reader.readAsDataURL(file);
}

function removeWallpaper() {
  localWallpaperData = null;
  localStorage.removeItem('emoji_gacha_local_wp');
  document.getElementById('wallpaperFileInput').value = '';
  applyWallpaper();
}

function handleOpacityChange(e) {
  state.wpOpacity = parseInt(e.target.value);
  document.getElementById('wpOpacityVal').innerText = `${state.wpOpacity}%`;
  saveState();
  applyWallpaper();
}

function handlePosChange(e) {
  state.wpPosX = parseInt(document.getElementById('wpPosXSlider').value);
  state.wpPosY = parseInt(document.getElementById('wpPosYSlider').value);
  document.getElementById('wpPosXVal').innerText = `${state.wpPosX}%`;
  document.getElementById('wpPosYVal').innerText = `${state.wpPosY}%`;
  saveState();
  applyWallpaper();
}

function applyWallpaper() {
  const layer = document.getElementById('wallpaperLayer');
  const dim = document.getElementById('wallpaperDimOverlay');
  const removeBtn = document.getElementById('removeWpBtn');

  const op = state.wpOpacity ?? 70;
  const posX = state.wpPosX ?? 50;
  const posY = state.wpPosY ?? 50;

  if (document.getElementById('wpOpacitySlider')) document.getElementById('wpOpacitySlider').value = op;
  if (document.getElementById('wpOpacityVal')) document.getElementById('wpOpacityVal').innerText = `${op}%`;
  if (document.getElementById('wpPosXSlider')) document.getElementById('wpPosXSlider').value = posX;
  if (document.getElementById('wpPosXVal')) document.getElementById('wpPosXVal').innerText = `${posX}%`;
  if (document.getElementById('wpPosYSlider')) document.getElementById('wpPosYSlider').value = posY;
  if (document.getElementById('wpPosYVal')) document.getElementById('wpPosYVal').innerText = `${posY}%`;

  if (localWallpaperData) {
    layer.style.backgroundImage = `url(${localWallpaperData})`;
    layer.style.backgroundPosition = `${posX}% ${posY}%`;
    layer.style.opacity = '1';
    dim.style.backgroundColor = `rgba(2, 6, 23, ${op / 100})`;
    if (removeBtn) removeBtn.classList.remove('hidden');
  } else {
    layer.style.backgroundImage = 'none';
    layer.style.opacity = '0';
    dim.style.backgroundColor = 'transparent';
    if (removeBtn) removeBtn.classList.add('hidden');
  }
}

// --- RELIABLE BGM PLAYER ---
let currentBgmBlobUrl = null;

function handleBgmUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const audio = document.getElementById('bgmAudio');
  if (currentBgmBlobUrl) URL.revokeObjectURL(currentBgmBlobUrl);
  currentBgmBlobUrl = URL.createObjectURL(file);

  audio.src = currentBgmBlobUrl;
  document.getElementById('bgmTrackTitle').innerText = file.name;
  audio.volume = 0.7;

  audio.play().then(() => {
    document.getElementById('bgmPlayBtn').innerText = '⏸ Pause';
  }).catch(err => {
    console.log("Audio waiting for user gesture", err);
    document.getElementById('bgmPlayBtn').innerText = '▶ Play';
  });
}

function toggleBgmPlay() {
  const audio = document.getElementById('bgmAudio');
  const btn = document.getElementById('bgmPlayBtn');
  if (!audio.src) {
    alert("Please choose a music file (.mp3, .wav) first!");
    return;
  }

  if (audio.paused) {
    audio.play().then(() => {
      btn.innerText = '⏸ Pause';
    }).catch(err => alert("Audio playback blocked. Tap anywhere first!"));
  } else {
    audio.pause();
    btn.innerText = '▶ Play';
  }
}

function handleBgmVolume(e) {
  const audio = document.getElementById('bgmAudio');
  audio.volume = parseInt(e.target.value) / 100;
}

function handleSfxVolume(e) {
  const val = parseInt(e.target.value);
  state.sfxVol = val;
  sfxVolume = val / 100;
  document.getElementById('sfxVolumeVal').innerText = `${val}%`;
  saveState();
}

// --- ZEN MODE TOGGLE ---
function toggleHideUI(e) {
  if (e) e.stopPropagation();
  document.body.classList.add('ui-hidden');
}

function handleGlobalClick(e) {
  if (document.body.classList.contains('ui-hidden')) {
    document.body.classList.remove('ui-hidden');
  }
}

// --- AFK SCREENSAVER (5 MINUTES = 300,000ms) ---
let afkTimer = null;
let isAfkActive = false;
let rainInterval = null;

function resetAfkTimer() {
  if (isAfkActive) return;
  clearTimeout(afkTimer);
  afkTimer = setTimeout(triggerScreensaver, 300000);
}

['mousemove', 'keydown', 'touchstart'].forEach(evt => {
  window.addEventListener(evt, resetAfkTimer, { passive: true });
});

function triggerScreensaver() {
  isAfkActive = true;
  document.getElementById('screensaverStage').classList.remove('hidden');
  startEmojiRain();
}

function exitScreensaver() {
  isAfkActive = false;
  clearInterval(rainInterval);
  document.getElementById('screensaverStage').classList.add('hidden');
  document.getElementById('screensaverRainBox').innerHTML = '';
  
  // Wake up the audio system immediately upon successful unlock via slider
  try {
    const ctx = getAudioContext();
    if (ctx && ctx.state !== 'running') {
      ctx.resume();
    }
  } catch(e){}

  resetAfkTimer();
}

function startEmojiRain() {
  const container = document.getElementById('screensaverRainBox');
  container.innerHTML = '';

  rainInterval = setInterval(() => {
    if (!isAfkActive) return;
    const drop = document.createElement('div');
    const isShining = Math.random() < 0.18;
    
    const allPools = [...POOL.UR, ...POOL.SSR, ...POOL.SR, ...POOL.R];
    const randomItem = allPools[Math.floor(Math.random() * allPools.length)];

    drop.style.position = 'absolute';
    drop.style.left = `${Math.random() * 90}%`;
    drop.style.top = '-60px';
    drop.style.transition = 'transform 8s linear, opacity 8s linear';
    drop.style.cursor = isShining ? 'pointer' : 'default';

    const inner = document.createElement('span');
    inner.innerText = isShining ? (Math.random() < 0.5 ? '💠' : '💎') : randomItem.emoji;
    const size = isShining ? 38 : Math.floor(Math.random() * 20) + 22;
    inner.style.fontSize = `${size}px`;
    inner.style.display = 'inline-block';

    if (isShining) {
      inner.className = 'shining-sparkle z-20 select-none';
      drop.onclick = (e) => {
        e.stopPropagation();
        state.gems += 1000;
        saveState();
        playSound('ssr');
        inner.style.transform = 'scale(2.2)';
        drop.style.opacity = '0';
        setTimeout(() => drop.remove(), 250);
      };
    } else {
      drop.style.opacity = '0.35';
    }

    drop.appendChild(inner);
    container.appendChild(drop);

    setTimeout(() => {
      drop.style.transform = `translateY(${window.innerHeight + 100}px)`;
    }, 30);

    setTimeout(() => {
      if (drop.parentNode) drop.remove();
    }, 8200);
  }, 700);
}

// --- SLIDER DRAG TO UNLOCK ---
const sliderThumb = document.getElementById('sliderThumb');
let isDraggingThumb = false;
let thumbStartX = 0;

function onThumbStart(e) {
  isDraggingThumb = true;
  thumbStartX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
}

function onThumbMove(e) {
  if (!isDraggingThumb) return;
  const currentX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
  const diff = Math.max(0, Math.min(240, currentX - thumbStartX));
  sliderThumb.style.transform = `translateX(${diff}px)`;

  if (diff >= 230) {
    isDraggingThumb = false;
    sliderThumb.style.transform = 'translateX(0px)';
    exitScreensaver();
  }
}

function onThumbEnd() {
  if (!isDraggingThumb) return;
  isDraggingThumb = false;
  sliderThumb.style.transform = 'translateX(0px)';
}

sliderThumb.addEventListener('mousedown', onThumbStart);
sliderThumb.addEventListener('touchstart', onThumbStart, { passive: true });
window.addEventListener('mousemove', onThumbMove);
window.addEventListener('touchmove', onThumbMove, { passive: true });
window.addEventListener('mouseup', onThumbEnd);
window.addEventListener('touchend', onThumbEnd);

// --- LAYOUT SWITCHER ---
function setLayout(mode) {
  state.layout = mode;
  saveState();
  applyLayout(mode);
}

function applyLayout(mode) {
  const container = document.getElementById('mainContainer');
  const bannerSec = document.getElementById('bannerSection');
  const asideSec = document.getElementById('asideSection');
  const grid = document.getElementById('inventoryGrid');

  ['mobile', 'tablet', 'desktop'].forEach(m => {
    const btn = document.getElementById(`layoutBtn_${m}`);
    if (btn) {
      if (m === mode) btn.className = 'py-2 rounded-xl border border-indigo-500 bg-indigo-600/30 text-indigo-300 transition flex flex-col items-center gap-1';
      else btn.className = 'py-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-400 hover:text-white transition flex flex-col items-center gap-1';
    }
  });

  if (mode === 'mobile') {
    container.className = 'max-w-md mx-auto px-3 mt-6 flex flex-col gap-6 transition-all duration-300 relative z-10';
    bannerSec.className = 'space-y-6 w-full';
    asideSec.className = 'space-y-6 w-full';
    grid.className = 'grid grid-cols-3 gap-2 max-h-96 overflow-y-auto pr-1';
  } else if (mode === 'desktop') {
    container.className = 'max-w-6xl mx-auto px-4 mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 transition-all duration-300 relative z-10';
    bannerSec.className = 'lg:col-span-2 space-y-6';
    asideSec.className = 'space-y-6';
    grid.className = 'grid grid-cols-3 sm:grid-cols-5 gap-2.5 max-h-96 overflow-y-auto pr-1';
  } else {
    container.className = 'max-w-4xl mx-auto px-4 mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 transition-all duration-300 relative z-10';
    bannerSec.className = 'md:col-span-2 space-y-6';
    asideSec.className = 'space-y-6';
    grid.className = 'grid grid-cols-3 sm:grid-cols-4 gap-2.5 max-h-96 overflow-y-auto pr-1';
  }
}

// --- PROFILE & MASCOT STUDIO ENGINE ---
function openMascotModal() {
  const usernameInput = document.getElementById('usernameInput');
  if (usernameInput) usernameInput.value = state.username || 'Summoner';

  renderAvatarFrames();
  setMascotFilter(currentMascotFilter);

  const scrTab = document.getElementById('mascotTab_SCR');
  if (scrTab) scrTab.classList.toggle('hidden', !state.hasUnlockedScr);

  document.getElementById('mascotModal').classList.remove('hidden');
}

function closeMascotModal() {
  document.getElementById('mascotModal').classList.add('hidden');
}

function saveUsername() {
  const input = document.getElementById('usernameInput');
  const val = input.value.trim();
  if (val) {
    state.username = val;
    saveState();
    playSound('pop');
    showToast(`✓ Username updated to: <strong>${val}</strong>`);
  }
}

function setAvatarFrame(frameId) {
  state.avatarFrame = frameId;
  saveState();
  renderAvatarFrames();
  playSound('pop');
}

function renderAvatarFrames() {
  const grid = document.getElementById('avatarFrameGrid');
  if (!grid) return;

  const uniqueSsr = Object.values(state.inventory).filter(i => i.tier === 'SSR').length;
  const uniqueUr = Object.values(state.inventory).filter(i => i.tier === 'UR').length;
  const hasScr = state.hasUnlockedScr || Object.values(state.inventory).some(i => i.tier === 'SCR');

  grid.innerHTML = AVATAR_FRAMES.map(frame => {
    let isUnlocked = true;
    if (frame.id === 'gold' && uniqueSsr < 10) isUnlocked = false;
    if (frame.id === 'prismatic' && uniqueUr < 5) isUnlocked = false;
    if (frame.id === 'abyssal' && !hasScr) isUnlocked = false;

    const isSelected = (state.avatarFrame || 'default') === frame.id;

    return `
      <div onclick="${isUnlocked ? `setAvatarFrame('${frame.id}')` : ''}" class="p-2.5 rounded-2xl border transition ${isUnlocked ? 'cursor-pointer active:scale-95' : 'opacity-40 cursor-not-allowed'} ${isSelected ? 'bg-indigo-600/30 border-indigo-400' : 'bg-slate-950/60 border-slate-800'}">
        <div class="flex items-center gap-2">
          <div class="w-7 h-7 rounded-xl ${frame.class} bg-slate-900 flex items-center justify-center text-sm">✨</div>
          <div class="flex-1 min-w-0">
            <div class="text-[11px] font-bold text-white truncate">${frame.name}</div>
            <div class="text-[9px] text-slate-500">${isUnlocked ? (isSelected ? '✓ Equipped' : 'Equip') : '🔒 Locked'}</div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function setMascotFilter(tier) {
  currentMascotFilter = tier;
  ['ALL', 'SCR', 'UR', 'SSR', 'SR', 'R'].forEach(t => {
    const btn = document.getElementById(`mascotTab_${t}`);
    if (btn) {
      btn.className = (t === tier)
        ? 'px-2 py-0.5 rounded-lg bg-indigo-600 text-white transition'
        : 'px-2 py-0.5 rounded-lg text-slate-400 hover:text-white transition';
    }
  });
  renderMascotGrid();
}

function renderMascotGrid() {
  const grid = document.getElementById('mascotGrid');
  if (!grid) return;
  grid.innerHTML = '';

  let entries = Object.entries(state.inventory);
  if (currentMascotFilter !== 'ALL') {
    entries = entries.filter(([_, data]) => data.tier === currentMascotFilter);
  }

  if (entries.length === 0) {
    grid.innerHTML = '<div class="col-span-full py-4 text-xs text-slate-500 italic text-center">No unlocked emojis in this category.</div>';
    return;
  }

  grid.innerHTML = entries.map(([emoji, data]) => {
    let borderStyle = 'border-slate-700 bg-slate-800';
    if (data.tier === 'SCR') borderStyle = 'border-rose-400 bg-rose-950/40 glow-scr';
    else if (data.tier === 'UR') borderStyle = 'border-pink-400/50 bg-slate-800 glow-ur';
    else if (data.tier === 'SSR') borderStyle = 'border-amber-400/50 bg-slate-800 glow-ssr';

    return `
      <button onclick="setMascot('${emoji}')" title="${data.name}" class="p-2 text-2xl hover:bg-slate-700 active:scale-95 rounded-xl border transition flex items-center justify-center ${borderStyle}">
        ${emoji}
      </button>
    `;
  }).join('');
}

function setMascot(emoji) {
  state.mascot = emoji;
  saveState();
  closeMascotModal();
}

// --- STAR FORMATTING HELPER ---
// --- 5-SLOT OVERLAPPING STAR FORMATTER (CRK STYLE) ---
function getStarsHtml(stars, isRainbow, tier = 'R') {
  if (isRainbow) {
    return `<div class="flex items-center justify-center gap-0.5"><span class="star-rainbow-icon text-xs sm:text-sm font-black tracking-tighter">★★★★★</span></div>`;
  }

  // SCR max stars = 5
  if (tier === 'SCR') {
    let slots = '';
    for (let i = 1; i <= 5; i++) {
      slots += (i <= stars)
        ? `<span class="star-awakened text-xs sm:text-sm">★</span>`
        : `<span class="star-empty text-xs sm:text-sm">★</span>`;
    }
    return `<div class="flex items-center justify-center gap-0.5">${slots}</div>`;
  }

  // Standard tiers (1-10 Stars looping over 5 slots)
  let slots = '';
  if (stars <= 5) {
    for (let i = 1; i <= 5; i++) {
      slots += (i <= stars)
        ? `<span class="star-gold text-xs sm:text-sm">★</span>`
        : `<span class="star-empty text-xs sm:text-sm">★</span>`;
    }
  } else {
    const awakenedCount = stars - 5;
    for (let i = 1; i <= 5; i++) {
      slots += (i <= awakenedCount)
        ? `<span class="star-awakened text-xs sm:text-sm">★</span>`
        : `<span class="star-gold text-xs sm:text-sm">★</span>`;
    }
  }
  return `<div class="flex items-center justify-center gap-0.5">${slots}</div>`;
}

// --- REBALANCED PULL LOGIC (UR 0.8%, SSR 3.2%, SR 32%, R 64% - SSR PITY = 40) ---
// --- REBALANCED SUMMON RNG ENGINE WITH SCR & DEV RIGS ---
function getSinglePull(is10thGuaranteed = false) {
  state.scrPity = (state.scrPity || 0) + 1;
  state.urPity++;
  state.ssrPity++;
  state.totalPulls++;
  state.dailyPullsCount++;

  let tier = 'R';
  const isPityScr = (state.scrPity >= 1000);
  const isPityUr = (state.urPity >= 100);

    // Dev Tool Forced Tier Override
  if (devForcedNextTier) {
    tier = devForcedNextTier;
    devForcedNextTier = null;
  }
  // 1. Secret Rare (SCR): 0.02% base chance or 1,000 Pity
  else if (isPityScr || Math.random() < 0.0002) {
    tier = 'SCR';
  }
  // 2. Ultra Rare (UR): 0.80% base chance or 100 Pity
  else if (isPityUr || Math.random() < 0.008) {
    tier = 'UR';
    state.urPity = 0;
    state.ssrPity = 0;
  } 
  // 3. Super Special Rare (SSR): 3.20% base chance or 40 Pity
  else if (state.ssrPity >= 40 || Math.random() < 0.032) {
    tier = 'SSR';
    state.ssrPity = 0;
  } 
  // 4. Special Rare (SR): 32% base chance or 10-pull guarantee
  else if (is10thGuaranteed || Math.random() < 0.32) {
    tier = 'SR';
  } else {
    tier = 'R';
  }

  // Automatic SCR Unlocking and Pity Reset
  if (tier === 'SCR') {
    state.hasUnlockedScr = true;
    state.scrPity = 0;
    state.urPity = 0;
    state.ssrPity = 0;
  }

  // Pool Selection & Focus Targets
  const activePool = BANNER_POOLS[state.currentBannerId] || POOL;
  let poolList = [];
  let focusEmoji = null;

  if (tier === 'SCR') {
    poolList = SCR_POOL;
    focusEmoji = state.focusTargets.scr;
  } else {
    poolList = activePool[tier];
    if (tier === 'UR') focusEmoji = state.focusTargets[state.currentBannerId];
    else if (tier === 'SSR') focusEmoji = state.focusTargets.ssr;
  }

  const chosen = pickFromPool(poolList, focusEmoji);
  let isNew = false;
  let addedShards = 0;

  if (!state.inventory[chosen.emoji]) {
    state.inventory[chosen.emoji] = {
      name: chosen.name,
      tier: tier,
      count: 1,
      shards: 0,
      stars: 1,
      isRainbow: false,
      isPinned: false
    };
    isNew = true;
  } else {
    const item = state.inventory[chosen.emoji];
    item.count++;
    addedShards = DUPLICATE_SHARDS[tier] || 5;
    item.shards += addedShards;
  }

  const currentItem = state.inventory[chosen.emoji];

  // FAKEOUT SYSTEM: SCR has no fakeout. UR triggers fakeout if enabled and not hard pity.
  let isFakeout = false;
  let fakeoutDisguise = null;
  if (state.fakeoutEnabled && tier === 'UR' && !isPityUr && Math.random() < 0.35) {
    isFakeout = true;
    const disguisePool = Math.random() < 0.6 ? activePool.SR : activePool.R;
    fakeoutDisguise = disguisePool[Math.floor(Math.random() * disguisePool.length)];
  }

  const pullResult = {
    emoji: chosen.emoji,
    name: chosen.name,
    tier: tier,
    isNew: isNew,
    addedShards: addedShards,
    stars: currentItem.stars,
    isRainbow: currentItem.isRainbow,
    isFakeout: isFakeout,
    fakeoutClicks: 0,
    disguiseEmoji: fakeoutDisguise ? fakeoutDisguise.emoji : null,
    disguiseName: fakeoutDisguise ? fakeoutDisguise.name : null,
    disguiseTier: fakeoutDisguise ? (activePool.SR.includes(fakeoutDisguise) ? 'SR' : 'R') : null
  };

  logPull(pullResult);
  return pullResult;
}

// --- WEIGHTED PICK (2x rate for chosen Pick-up focus target) ---
function pickFromPool(poolList, focusEmoji) {
  if (!focusEmoji) return poolList[Math.floor(Math.random() * poolList.length)];
  const idx = poolList.findIndex(p => p.emoji === focusEmoji);
  if (idx === -1) return poolList[Math.floor(Math.random() * poolList.length)];
  const totalWeight = poolList.length + 1;
  let r = Math.random() * totalWeight;
  for (let i = 0; i < poolList.length; i++) {
    const w = (i === idx) ? 2 : 1;
    if (r < w) return poolList[i];
    r -= w;
  }
  return poolList[idx];
}

// --- PULL LOG ---
function logPull(pull) {
  state.pullLog.unshift({
    emoji: pull.emoji,
    name: pull.name,
    tier: pull.tier,
    bannerId: state.currentBannerId,
    ts: Date.now()
  });
  if (state.pullLog.length > 300) state.pullLog.length = 300;
  state.pullsSinceLastExport++;
}

// --- TRIGGER SUMMON FLOW ---
function startSummon(times) {
  const cost = times * 100;
  if (state.gems < cost) {
    openOutOfGemsModal();
    return;
  }

  getAudioContext();
  state.gems -= cost;
  if (times === 10) state.tenPullSummons = (state.tenPullSummons || 0) + 1;

  currentSessionPulls = [];
  for (let i = 0; i < times; i++) {
    const isGuaranteed = (times === 10 && i === 9 && !currentSessionPulls.some(p => p.tier === 'SR' || p.tier === 'SSR' || p.tier === 'UR' || p.tier === 'SCR'));
    currentSessionPulls.push(getSinglePull(isGuaranteed));
  }

  if (!state.pullSessions) state.pullSessions = [];
  state.pullSessions.unshift({
    id: Date.now(),
    bannerId: state.currentBannerId,
    times: times,
    items: currentSessionPulls.map(p => ({ emoji: p.emoji, name: p.name, tier: p.tier })),
    ts: Date.now()
  });
  if (state.pullSessions.length > 60) state.pullSessions.length = 60;

  saveState();

  const hasApparentScr = currentSessionPulls.some(p => p.tier === 'SCR');
  const hasApparentUr = currentSessionPulls.some(p => p.tier === 'UR' && !p.isFakeout);
  const hasApparentSsr = currentSessionPulls.some(p => p.tier === 'SSR');
  const hasApparentSr = currentSessionPulls.some(p => p.tier === 'SR' || (p.tier === 'UR' && p.isFakeout && p.disguiseTier === 'SR'));

  if (laptopIntroEnabled) {
    playLaptopIntro(hasApparentScr, hasApparentUr, hasApparentSsr, hasApparentSr);
  } else {
    proceedToReveal();
  }
}

function playLaptopIntro(hasScr, hasUr, hasSsr, hasSr) {
  const stage = document.getElementById('laptopStage');
  const container = document.getElementById('laptopContainer');
  const bloom = document.getElementById('laptopRadialBloom');
  const msg = document.getElementById('laptopStatusMsg');

  stage.classList.remove('hidden');
  bloom.style.opacity = '0';
  container.className = 'relative flex items-center justify-center laptop-smooth-zoom';

  if (hasScr) {
    msg.innerText = '🌌 CRITICAL ANOMALY: DIMENSION COLLAPSING... 🌌';
    msg.className = 'mt-12 font-mono tracking-widest text-xs uppercase text-rose-300 font-black animate-pulse relative z-20';
    bloom.style.background = 'radial-gradient(circle, rgba(244, 63, 94, 1) 0%, rgba(147, 51, 234, 0.8) 35%, rgba(6, 182, 212, 0.5) 65%, transparent 75%)';
    playSound('ur_laptop');
  } else if (hasUr) {
    msg.innerText = '⚠️ COSMIC MATRIX WARPING... ⚠️';
    msg.className = 'mt-12 font-mono tracking-widest text-xs uppercase text-pink-300 font-black animate-pulse relative z-20';
    bloom.style.background = 'radial-gradient(circle, rgba(244, 114, 182, 0.95) 0%, rgba(168, 85, 247, 0.75) 30%, rgba(56, 189, 248, 0.4) 55%, transparent 72%)';
    playSound('ur_laptop');
  } else if (hasSsr) {
    msg.innerText = '⚡ GOLDEN ANOMALY ENGAGED...';
    msg.className = 'mt-12 font-mono tracking-widest text-xs uppercase text-amber-300 font-bold relative z-20';
    bloom.style.background = 'radial-gradient(circle, rgba(251, 191, 36, 0.95) 0%, rgba(245, 158, 11, 0.65) 35%, rgba(217, 119, 6, 0.3) 60%, transparent 75%)';
    playSound('ssr');
  } else if (hasSr) {
    msg.innerText = 'EPIC SIGNAL ACQUIRED.';
    msg.className = 'mt-12 font-mono tracking-widest text-xs uppercase text-purple-300 relative z-20';
    bloom.style.background = 'radial-gradient(circle, rgba(168, 85, 247, 0.9) 0%, rgba(147, 51, 234, 0.6) 35%, transparent 70%)';
    playSound('pop');
  } else {
    msg.innerText = 'RECEIVING PACKETS...';
    msg.className = 'mt-12 font-mono tracking-widest text-xs uppercase text-sky-400 relative z-20';
    bloom.style.background = 'radial-gradient(circle, rgba(56, 189, 248, 0.8) 0%, rgba(14, 165, 233, 0.5) 35%, transparent 70%)';
    playSound('tick');
  }

  setTimeout(() => {
    bloom.style.opacity = '1';
  }, 550);

  setTimeout(() => {
    stage.classList.add('hidden');
    container.className = 'relative flex items-center justify-center';
    proceedToReveal();
  }, 1650);
}

// --- REVEAL FLOW WITH SCR & UR CUTSCENE SEQUENCING ---
function proceedToReveal() {
  if (fastModeEnabled) {
    const scrItems = currentSessionPulls.filter(p => p.tier === 'SCR');
    const urItems = currentSessionPulls.filter(p => p.tier === 'UR');

    if (scrItems.length > 0 && !state.skipScrCutscenes) {
      pendingScrCutscenes = [...scrItems];
      triggerNextScrCutscene();
    } else if (urItems.length > 0) {
      pendingUrCutscenes = [...urItems];
      triggerNextUrCutsceneWithTyping();
    } else {
      showSummaryModal();
    }
    return;
  }

  currentRevealIndex = 0;
  document.getElementById('revealStage').classList.remove('hidden');
  displayCurrentCard();
}

function displayCurrentCard() {
  if (currentRevealIndex >= currentSessionPulls.length) {
    document.getElementById('revealStage').classList.add('hidden');
    showSummaryModal();
    return;
  }

  const item = currentSessionPulls[currentRevealIndex];
  const card = document.getElementById('revealCard');
  const starsEl = document.getElementById('revealCardStars');
  const emojiEl = document.getElementById('revealCardEmoji');
  const nameEl = document.getElementById('revealCardName');
  const badgeEl = document.getElementById('revealCardTierBadge');
  const noticeEl = document.getElementById('revealUpgradeNotice');
  const hintText = document.getElementById('revealCardHintText');
  const progressText = document.getElementById('revealProgressText');

  progressText.innerText = `PULL ${currentRevealIndex + 1} / ${currentSessionPulls.length}`;
  card.classList.remove('card-pop-in', 'card-float-slam', 'fakeout-card', 'dimension-shatter');
  void card.offsetWidth;

  if (item.isFakeout) {
    if (item.disguiseTier === 'SR') {
      card.className = 'card-pop-in relative w-68 sm:w-80 aspect-[3/4] rounded-3xl border-2 flex flex-col items-center justify-center p-6 text-center transition-all duration-300 glow-sr';
      starsEl.innerHTML = '<span class="star-gold text-xs">★★</span>';
      badgeEl.className = 'text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/40';
    } else {
      card.className = 'card-pop-in relative w-68 sm:w-80 aspect-[3/4] rounded-3xl border-2 flex flex-col items-center justify-center p-6 text-center transition-all duration-300 glow-r';
      starsEl.innerHTML = '<span class="star-gold text-xs">★</span>';
      badgeEl.className = 'text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700';
    }

    emojiEl.innerText = item.disguiseEmoji;
    nameEl.innerText = item.disguiseName;
    badgeEl.innerText = item.disguiseTier;
    noticeEl.classList.add('hidden');

    if (item.fakeoutClicks === 0) {
      hintText.innerText = '[ TAP SCREEN TO NEXT ]';
      hintText.className = 'mt-8 text-xs tracking-widest text-slate-400 animate-pulse pointer-events-none font-mono';
    } else if (item.fakeoutClicks === 1) {
      card.classList.add('fakeout-card');
      hintText.innerText = '⚡ UNSTABLE SIGNAL DETECTED! (1/3) ⚡';
      hintText.className = 'mt-8 text-xs tracking-widest text-pink-400 font-black animate-pulse font-mono';
    } else if (item.fakeoutClicks === 2) {
      card.classList.add('fakeout-card');
      hintText.innerText = '💥 FRACTURE DETECTED! TAP TO SHATTER! (2/3) 💥';
      hintText.className = 'mt-8 text-xs tracking-widest text-amber-300 font-black animate-bounce font-mono';
    }

    playSound(item.disguiseTier === 'SR' ? 'pop' : 'tick');
    return;
  }

  hintText.innerText = '[ TAP SCREEN TO NEXT ]';
  hintText.className = 'mt-8 text-xs tracking-widest text-slate-400 animate-pulse pointer-events-none font-mono';

  emojiEl.innerText = item.emoji;
  nameEl.innerText = item.name;
  starsEl.innerHTML = getStarsHtml(item.stars, item.isRainbow, item.tier);

  noticeEl.classList.add('hidden');
  if (item.isNew) {
    noticeEl.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
    noticeEl.innerText = 'NEW!';
    noticeEl.classList.remove('hidden');
  } else {
    noticeEl.className = 'text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40';
    noticeEl.innerText = `+${item.addedShards} Shards`;
    noticeEl.classList.remove('hidden');
  }

  if (item.tier === 'SCR') {
    card.className = 'card-float-slam relative w-68 sm:w-80 aspect-[3/4] rounded-3xl border-2 flex flex-col items-center justify-center p-6 text-center transition-all duration-300 glow-scr';
    badgeEl.innerText = 'SECRET RARE';
    badgeEl.className = 'text-[11px] font-black uppercase tracking-widest px-3.5 py-1 rounded-full bg-rose-500/30 text-rose-300 border border-rose-400/70 shadow-lg';
    if (!state.skipScrCutscenes) {
      triggerScrTerminalAndCutscene(item);
    } else {
      playSound('ur');
    }
  } else if (item.tier === 'UR') {
    card.className = 'card-float-slam relative w-68 sm:w-80 aspect-[3/4] rounded-3xl border-2 flex flex-col items-center justify-center p-6 text-center transition-all duration-300 glow-ur';
    badgeEl.innerText = 'UR COSMIC';
    badgeEl.className = 'text-[11px] font-black uppercase tracking-widest px-3.5 py-1 rounded-full bg-pink-500/30 text-pink-300 border border-pink-400/60';
    if (state.skipDuplicateUr && !item.isNew) {
      playSound('ur');
    } else {
      triggerUrWithTyping(item);
    }
  } else if (item.tier === 'SSR') {
    card.className = 'card-float-slam relative w-68 sm:w-80 aspect-[3/4] rounded-3xl border-2 flex flex-col items-center justify-center p-6 text-center transition-all duration-300 glow-ssr';
    badgeEl.innerText = 'SSR GOLD';
    badgeEl.className = 'text-[11px] font-black uppercase tracking-widest px-3.5 py-1 rounded-full bg-amber-500/30 text-amber-300 border border-amber-400/50';
    playSound('ssr');
  } else if (item.tier === 'SR') {
    card.className = 'card-pop-in relative w-68 sm:w-80 aspect-[3/4] rounded-3xl border-2 flex flex-col items-center justify-center p-6 text-center transition-all duration-300 glow-sr';
    badgeEl.innerText = 'SR PURPLE';
    badgeEl.className = 'text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/40';
    playSound('pop');
  } else {
    card.className = 'card-pop-in relative w-68 sm:w-80 aspect-[3/4] rounded-3xl border-2 flex flex-col items-center justify-center p-6 text-center transition-all duration-300 glow-r';
    badgeEl.innerText = 'R COMMON';
    badgeEl.className = 'text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-slate-800 text-slate-400 border border-slate-700';
    playSound('tick');
  }
}

function onRevealScreenTapped(e) {
  if (e.target.closest('button')) return;

  const item = currentSessionPulls[currentRevealIndex];
  if (item && item.isFakeout) {
    item.fakeoutClicks++;
    if (item.fakeoutClicks < 3) {
      playSound('pop');
      displayCurrentCard();
      return;
    } else {
      item.isFakeout = false;
      playSound('glass_shatter');
      document.getElementById('appBody').classList.add('shake-screen');
      setTimeout(() => document.getElementById('appBody').classList.remove('shake-screen'), 450);
      displayCurrentCard();
      return;
    }
  }

  currentRevealIndex++;
  displayCurrentCard();
}

function skipAllReveals() {
  const remainingPulls = currentSessionPulls.slice(currentRevealIndex);
  const remainingScrs = remainingPulls.filter(p => p.tier === 'SCR');
  const remainingUrs = remainingPulls.filter(p => p.tier === 'UR');

  document.getElementById('revealStage').classList.add('hidden');

  if (remainingScrs.length > 0 && !state.skipScrCutscenes) {
    pendingScrCutscenes = [...remainingScrs];
    triggerNextScrCutscene();
  } else if (remainingUrs.length > 0) {
    // If skip duplicate UR is enabled, only play cutscene for unowned URs
    const targets = state.skipDuplicateUr ? remainingUrs.filter(p => p.isNew) : remainingUrs;
    if (targets.length > 0) {
      pendingUrCutscenes = [...targets];
      triggerNextUrCutsceneWithTyping();
    } else {
      showSummaryModal();
    }
  } else {
    showSummaryModal();
  }
}

// --- DRAMATIC SCR TERMINAL & DIMENSIONAL CUTSCENE ---
function triggerScrTerminalAndCutscene(item) {
  const term = document.getElementById('scrTerminalStage');
  const textEl = document.getElementById('scrTypingText');
  const preview = document.getElementById('scrImpactEmojiPreview');

  if (!term || !textEl || !preview) {
    showScrCutsceneDirect(item);
    return;
  }

  term.classList.remove('hidden');
  textEl.innerText = '';
  preview.innerText = '';
  preview.style.opacity = '0';
  preview.style.transform = 'scale(0.5)';

  playSound('ur_laptop');

  const phrase = "BREACHING PARALLEL REALM . . . ";
  let idx = 0;

  const timer = setInterval(() => {
    if (idx < phrase.length) {
      textEl.innerText += phrase[idx];
      playSound('typing');
      idx++;
    } else {
      clearInterval(timer);
      setTimeout(() => {
        preview.innerText = item.emoji;
        preview.style.opacity = '1';
        preview.style.transform = 'scale(1.4)';
        playSound('ur');

        setTimeout(() => {
          term.classList.add('hidden');
          showScrCutsceneDirect(item);
        }, 800);
      }, 500);
    }
  }, 60);
}

function triggerNextScrCutscene() {
  if (pendingScrCutscenes.length === 0) {
    showSummaryModal();
    return;
  }
  const item = pendingScrCutscenes.shift();
  triggerScrTerminalAndCutscene(item);
}

function showScrCutsceneDirect(item) {
  const stage = document.getElementById('scrCutsceneStage');
  if (!stage) return;
  document.getElementById('scrCutsceneEmoji').innerText = item.emoji;
  document.getElementById('scrCutsceneName').innerText = item.name;

  stage.classList.remove('hidden');
  stage.classList.add('dimension-shatter');
  setTimeout(() => stage.classList.remove('dimension-shatter'), 750);

  playSound('ur');
}

function dismissScrCutscene() {
  const stage = document.getElementById('scrCutsceneStage');
  if (stage) stage.classList.add('hidden');

  if (pendingScrCutscenes.length > 0) {
    triggerNextScrCutscene();
  }
}

// --- UR TERMINAL TYPING CUTSCENE ---
function triggerUrWithTyping(item) {
  const terminalStage = document.getElementById('urTerminalStage');
  const typingEl = document.getElementById('urTypingText');
  const previewEl = document.getElementById('urImpactEmojiPreview');

  terminalStage.classList.remove('hidden');
  typingEl.innerText = '';
  previewEl.innerText = '';
  previewEl.style.opacity = '0';
  previewEl.style.transform = 'scale(0.5)';

  playSound('suspense');

  const textToType = "The UR is . . . ";
  let charIdx = 0;

  const typingTimer = setInterval(() => {
    if (charIdx < textToType.length) {
      typingEl.innerText += textToType[charIdx];
      playSound('typing');
      charIdx++;
    } else {
      clearInterval(typingTimer);
      setTimeout(() => {
        previewEl.innerText = item.emoji;
        previewEl.style.opacity = '1';
        previewEl.style.transform = 'scale(1.2)';
        playSound('ssr');

        setTimeout(() => {
          terminalStage.classList.add('hidden');
          showUrCutsceneDirect(item);
        }, 750);
      }, 450);
    }
  }, 70);
}

function triggerNextUrCutsceneWithTyping() {
  if (pendingUrCutscenes.length === 0) {
    showSummaryModal();
    return;
  }
  const item = pendingUrCutscenes.shift();
  triggerUrWithTyping(item);
}

function showUrCutsceneDirect(item) {
  const cutscene = document.getElementById('cutsceneStage');
  document.getElementById('cutsceneEmoji').innerText = item.emoji;
  document.getElementById('cutsceneItemName').innerText = item.name;

  cutscene.classList.remove('hidden');
  cutscene.classList.add('shake-screen');
  setTimeout(() => cutscene.classList.remove('shake-screen'), 400);

  playSound('ur');
}

function dismissCutscene() {
  document.getElementById('cutsceneStage').classList.add('hidden');
  if (pendingUrCutscenes.length > 0) {
    triggerNextUrCutsceneWithTyping();
  }
}

// --- SUMMARY MODAL ---
function showSummaryModal() {
  const modal = document.getElementById('resultModal');
  const grid = document.getElementById('modalItemsGrid');
  grid.innerHTML = '';

  currentSessionPulls.forEach(item => {
    const itemEl = document.createElement('div');
    let cardStyle = 'bg-slate-800 border border-slate-700 text-slate-300';

    if (item.tier === 'UR') {
      cardStyle = 'glow-ur text-pink-200 font-bold';
    } else if (item.tier === 'SSR') {
      cardStyle = 'glow-ssr text-amber-200 font-semibold';
    } else if (item.tier === 'SR') {
      cardStyle = 'glow-sr text-purple-200';
    }

    itemEl.className = `p-2 rounded-2xl flex flex-col items-center justify-center aspect-square text-center ${cardStyle}`;
    itemEl.innerHTML = `
      <div class="text-3xl mb-0.5">${item.emoji}</div>
      <div class="text-[9px] font-black tracking-tighter truncate w-full">${item.name}</div>
      <div class="text-[8px] opacity-90 mt-0.5">${item.isNew ? '<span class="text-emerald-400 font-bold">NEW</span>' : `<span class="text-amber-300">+${item.addedShards} Shards</span>`}</div>
    `;
    grid.appendChild(itemEl);
  });

  modal.classList.remove('hidden');
}

function closeSummaryModal() {
  document.getElementById('resultModal').classList.add('hidden');
}

// --- CODEX (SILHOUETTE MODE) ---
function openCodexModal() {
  renderCodex();
  document.getElementById('codexModal').classList.remove('hidden');
}

function closeCodexModal() {
  document.getElementById('codexModal').classList.add('hidden');
}

function setCodexFilter(filter) {
  codexFilter = filter;
  ['ALL', 'UR', 'SSR', 'SR', 'R'].forEach(tab => {
    const btn = document.getElementById(`codexTab_${tab}`);
    if (tab === filter) {
      btn.className = 'px-3 py-1 rounded-lg bg-indigo-600 text-white transition';
    } else {
      btn.className = 'px-3 py-1 rounded-lg text-slate-400 hover:bg-slate-700 transition';
    }
  });
  renderCodex();
}

function setCodexSeriesFilter(series) {
  codexSeriesFilter = series;
  ['ALL', 'cosmos', 'faces'].forEach(tab => {
    const btn = document.getElementById(`codexSeries_${tab}`);
    if (btn) {
      btn.className = (tab === series)
        ? 'px-2.5 py-1 rounded-lg bg-indigo-600 text-white transition'
        : 'px-2.5 py-1 rounded-lg text-slate-400 hover:text-white transition';
    }
  });
  renderCodex();
}

function renderCodex() {
  const grid = document.getElementById('codexGrid');
  if (!grid) return;
  grid.innerHTML = '';

  const allEntries = [];
  if (state.hasUnlockedScr) {
    SCR_POOL.forEach(item => allEntries.push({ ...item, tier: 'SCR', series: 'scr' }));
  }
  Object.keys(POOL).forEach(tier => {
    POOL[tier].forEach(item => allEntries.push({ ...item, tier, series: 'cosmos' }));
  });
  Object.keys(FACES_POOL).forEach(tier => {
    FACES_POOL[tier].forEach(item => allEntries.push({ ...item, tier, series: 'faces' }));
  });

  const totalCount = allEntries.length;
  const discoveredCount = allEntries.filter(e => state.inventory[e.emoji]).length;
  const percentage = Math.round((discoveredCount / totalCount) * 100);
  document.getElementById('codexProgressText').innerText = `Discovered: ${discoveredCount} / ${totalCount} (${percentage}%)`;

  let filtered = allEntries;
  if (codexSeriesFilter !== 'ALL') {
    filtered = filtered.filter(e => e.series === codexSeriesFilter);
  }
  if (codexFilter !== 'ALL') {
    filtered = filtered.filter(e => e.tier === codexFilter);
  }

  filtered.forEach(entry => {
    const isDiscovered = !!state.inventory[entry.emoji];
    const itemData = state.inventory[entry.emoji];
    const card = document.createElement('div');

    if (isDiscovered) {
      let borderStyle = 'border-slate-700 bg-slate-800/80';
      if (entry.tier === 'SCR') borderStyle = 'glow-scr border-rose-400/80';
      else if (entry.tier === 'UR') borderStyle = 'glow-ur border-pink-400/60';
      else if (entry.tier === 'SSR') borderStyle = 'glow-ssr border-amber-400/60';
      else if (entry.tier === 'SR') borderStyle = 'glow-sr border-purple-400/50';

      card.className = `p-2.5 rounded-2xl border flex flex-col items-center justify-center text-center cursor-pointer active:scale-95 transition ${borderStyle}`;
      card.onclick = () => { closeCodexModal(); openEmojiModal(entry.emoji); };
      card.innerHTML = `
        <div class="text-3xl mb-1">${entry.emoji}</div>
        <div class="text-[10px] font-bold text-white truncate w-full">${entry.name}</div>
        <div class="mt-1">${getStarsHtml(itemData.stars, itemData.isRainbow, itemData.tier)}</div>
      `;
    } else {
      card.className = 'p-2.5 rounded-2xl border border-slate-800 bg-slate-950/60 flex flex-col items-center justify-center text-center opacity-40';
      card.innerHTML = `
        <div class="text-3xl mb-1 filter grayscale brightness-50 opacity-40 select-none">${entry.emoji}</div>
        <div class="text-[10px] font-mono text-slate-500 truncate w-full">???</div>
        <span class="text-[8px] font-mono text-slate-600 mt-1 uppercase">${entry.tier}</span>
      `;
    }

    grid.appendChild(card);
  });
}

// --- EMOJI DETAILS, PIN & REPLAY ---
function openEmojiModal(emoji) {
  const item = state.inventory[emoji];
  if (!item) return;
  selectedEmoji = emoji;

  document.getElementById('emojiModalEmoji').innerText = emoji;
  document.getElementById('emojiModalName').innerText = item.name;
  
  const tierBadge = document.getElementById('emojiModalTier');
  tierBadge.innerText = item.tier;
  if (item.tier === 'UR') tierBadge.className = 'text-[10px] font-black px-2.5 py-0.5 rounded-full bg-pink-500/30 text-pink-300 border border-pink-400/50';
  else if (item.tier === 'SSR') tierBadge.className = 'text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-500/30 text-amber-300 border border-amber-400/50';
  else if (item.tier === 'SR') tierBadge.className = 'text-[10px] font-black px-2.5 py-0.5 rounded-full bg-purple-500/30 text-purple-300 border border-purple-400/50';
  else tierBadge.className = 'text-[10px] font-black px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700';

  const replayBtn = document.getElementById('emojiModalReplayBtn');
  if (item.tier === 'UR' || item.tier === 'SSR') {
    replayBtn.classList.remove('hidden');
  } else {
    replayBtn.classList.add('hidden');
  }

  updateEmojiModalContent();
  document.getElementById('emojiModal').classList.remove('hidden');
}

function togglePinCurrentEmoji() {
  const item = state.inventory[selectedEmoji];
  if (!item) return;

  item.isPinned = !item.isPinned;
  saveState();
  updateEmojiModalContent();
  playSound('pop');
}

function replayCurrentEmojiCutscene() {
  const item = state.inventory[selectedEmoji];
  if (!item) return;
  closeEmojiModal();

  if (item.tier === 'UR') {
    triggerUrWithTyping({ emoji: selectedEmoji, name: item.name });
  } else if (item.tier === 'SSR') {
    document.getElementById('revealStage').classList.remove('hidden');
    currentSessionPulls = [{ emoji: selectedEmoji, name: item.name, tier: 'SSR', stars: item.stars, isRainbow: item.isRainbow, isNew: false, addedShards: 0 }];
    currentRevealIndex = 0;
    displayCurrentCard();
  }
}

function updateEmojiModalContent() {
  const item = state.inventory[selectedEmoji];
  if (!item) return;

  document.getElementById('emojiModalStars').innerHTML = getStarsHtml(item.stars, item.isRainbow);
  
  const pinText = document.getElementById('emojiModalPinText');
  const pinBtn = document.getElementById('emojiModalPinBtn');
  if (item.isPinned) {
    pinText.innerText = 'Pinned';
    pinBtn.className = 'absolute top-4 left-4 text-xs font-bold px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-400/50 transition flex items-center gap-1 shadow-sm';
  } else {
    pinText.innerText = 'Pin';
    pinBtn.className = 'absolute top-4 left-4 text-xs font-bold px-2.5 py-1 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700 transition flex items-center gap-1';
  }

  const shardText = document.getElementById('emojiModalShardText');
  const shardBar = document.getElementById('emojiModalShardBar');
  const btn = document.getElementById('emojiModalPromoteBtn');

  if (item.isRainbow) {
    shardText.innerText = `${item.shards} Shards`;
    shardBar.style.width = '100%';
    btn.disabled = true;
    btn.className = 'w-full py-3 rounded-xl font-black text-sm bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700';
    btn.innerHTML = '<span>🌈 Maximum Ascension Reached</span>';
    return;
  }

  const needed = STAR_REQUIREMENTS[item.stars] || 10;
  shardText.innerText = `${item.shards} / ${needed}`;
  const percentage = Math.min(100, Math.round((item.shards / needed) * 100));
  shardBar.style.width = `${percentage}%`;

  if (item.shards >= needed) {
    btn.disabled = false;
    if (item.stars === 10) {
      btn.className = 'w-full py-3 rounded-xl font-black text-sm bg-gradient-to-r from-rose-500 via-amber-400 to-indigo-500 hover:opacity-90 active:scale-95 text-white transition shadow-lg cursor-pointer animate-pulse';
      btn.innerHTML = `<span>🌈 Ascend to Rainbow Star (Cost: ${needed})</span>`;
    } else {
      const nextStar = item.stars + 1;
      btn.className = 'w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 active:scale-95 text-white transition shadow-lg cursor-pointer';
      btn.innerHTML = `<span>⭐ Promote to ${nextStar}★ (Cost: ${needed})</span>`;
    }
  } else {
    btn.disabled = true;
    btn.className = 'w-full py-3 rounded-xl font-bold text-sm bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700';
    btn.innerHTML = `<span>Need ${needed - item.shards} more Shards</span>`;
  }
}

// --- PROMOTION ENGINE (SCR 5★ TO RAINBOW ASCENSION) ---
function promoteCurrentEmoji() {
  const item = state.inventory[selectedEmoji];
  if (!item || item.isRainbow) return;

  const isScr = (item.tier === 'SCR');
  const needed = isScr
    ? (STAR_REQUIREMENTS[item.stars] || 20)
    : (STAR_REQUIREMENTS[item.stars] || 10);

  if (item.shards >= needed) {
    item.shards -= needed;
    state.dailyPromotesCount++;

    // SCR caps out at 5 Stars and ascends straight to Rainbow
    if (isScr) {
      if (item.stars >= 4) {
        item.stars = 5;
        item.isRainbow = true;
        playSound('promote_rainbow');
      } else {
        item.stars++;
        playSound('promote');
      }
    } else {
      if (item.stars === 10) {
        item.isRainbow = true;
        playSound('promote_rainbow');
      } else {
        item.stars++;
        playSound('promote');
      }
    }

    saveState();
    updateEmojiModalContent();
  }
}

function closeEmojiModal() {
  document.getElementById('emojiModal').classList.add('hidden');
}

// --- BULK PROMOTION (PROMOTE ALL) ---
function checkAvailablePromotions() {
  let normalUpgradesAvailable = 0;
  let rainbowAscensionsAvailable = 0;

  Object.values(state.inventory).forEach(item => {
    if (!item.isRainbow) {
      if (item.stars < 10) {
        const needed = STAR_REQUIREMENTS[item.stars] || 10;
        if (item.shards >= needed) normalUpgradesAvailable++;
      } else if (item.stars === 10) {
        const needed = STAR_REQUIREMENTS[10] || 300;
        if (item.shards >= needed) rainbowAscensionsAvailable++;
      }
    }
  });

  return { normal: normalUpgradesAvailable, rainbow: rainbowAscensionsAvailable };
}

function updatePromoteAllBtnUI() {
  const { normal, rainbow } = checkAvailablePromotions();
  const btn = document.getElementById('promoteAllBtn');
  const text = document.getElementById('promoteAllBtnText');

  if (normal > 0) {
    btn.className = 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black px-2.5 py-1 rounded-xl text-xs flex items-center gap-1 active:scale-95 shadow-md shadow-amber-500/20 transition cursor-pointer';
    text.innerText = 'Promote All (to 10★)';
  } else if (rainbow > 0) {
    btn.className = 'bg-gradient-to-r from-rose-500 via-amber-400 to-indigo-500 hover:opacity-90 text-white font-black px-2.5 py-1 rounded-xl text-xs flex items-center gap-1 active:scale-95 shadow-md shadow-rose-500/30 transition cursor-pointer animate-pulse';
    text.innerText = '🌈 Ascend All (Rainbow)';
  } else {
    btn.className = 'bg-slate-800 text-slate-500 font-bold px-2.5 py-1 rounded-xl text-xs flex items-center gap-1 cursor-default border border-slate-700';
    text.innerText = 'Promote All';
  }
}

function promoteAllEmojis() {
  const { normal, rainbow } = checkAvailablePromotions();
  const summaryList = [];

  if (normal > 0) {
    Object.keys(state.inventory).forEach(emoji => {
      const item = state.inventory[emoji];
      const initialStars = item.stars;

      while (!item.isRainbow && item.stars < 10) {
        const needed = STAR_REQUIREMENTS[item.stars] || 10;
        if (item.shards >= needed) {
          item.shards -= needed;
          item.stars++;
          state.dailyPromotesCount++;
        } else {
          break;
        }
      }

      if (item.stars > initialStars) {
        summaryList.push({
          emoji: emoji,
          name: item.name,
          from: `${initialStars}★`,
          to: `${item.stars}★`,
          isRainbow: false
        });
      }
    });

    playSound('promote');
    saveState();
    updatePromoteAllBtnUI();
    showPromoteSummaryModal(summaryList, false);
    return;
  }

  if (rainbow > 0) {
    Object.keys(state.inventory).forEach(emoji => {
      const item = state.inventory[emoji];
      if (!item.isRainbow && item.stars === 10) {
        const needed = STAR_REQUIREMENTS[10] || 300;
        if (item.shards >= needed) {
          item.shards -= needed;
          item.isRainbow = true;
          state.dailyPromotesCount++;
          summaryList.push({
            emoji: emoji,
            name: item.name,
            from: '10★',
            to: '🌈 Rainbow Star',
            isRainbow: true
          });
        }
      }
    });

    playSound('promote_rainbow');
    saveState();
    updatePromoteAllBtnUI();
    showPromoteSummaryModal(summaryList, true);
    return;
  }

  alert("No emojis currently have enough Shards to promote.");
}

function showPromoteSummaryModal(summaryList, isRainbowStage) {
  const modal = document.getElementById('promoteSummaryModal');
  const container = document.getElementById('promoteSummaryList');
  container.innerHTML = '';

  summaryList.forEach(info => {
    const row = document.createElement('div');
    row.className = 'flex items-center justify-between p-2.5 bg-slate-800/80 border border-slate-700 rounded-xl';
    row.innerHTML = `
      <div class="flex items-center gap-2">
        <span class="text-2xl">${info.emoji}</span>
        <span class="font-bold text-white text-xs">${info.name}</span>
      </div>
      <div class="text-right font-mono text-[11px]">
        <span class="text-slate-400">${info.from}</span>
        <span class="text-slate-500 mx-1">➔</span>
        <span class="${info.isRainbow ? 'rainbow-text font-black' : 'text-amber-400 font-bold'}">${info.to}</span>
      </div>
    `;
    container.appendChild(row);
  });

  modal.classList.remove('hidden');
}

function closePromoteSummaryModal() {
  document.getElementById('promoteSummaryModal').classList.add('hidden');
}

// --- MODALS & SETTINGS LOGIC ---
function openRatesModal() { document.getElementById('ratesModal').classList.remove('hidden'); }
function closeRatesModal() { document.getElementById('ratesModal').classList.add('hidden'); }

function openSettingsModal() { 
  updateSettingsUI();
    const exportPayload = {
    v: 29,
    g: state.gems,
    scp: state.scrPity || 0,
    p: state.urPity,
    sp: state.ssrPity,
    tp: state.totalPulls,
    m: state.mineClicks,
    d: state.dailyClaimed,
    dpc: state.dailyPullsCount,
    dpr: state.dailyPromotesCount,
    rc: state.redeemedCodes,
    cd: state.claimedCalendarDays,
    inv: state.inventory,
    mascot: state.mascot,
    u: state.username || 'Summoner',
    af: state.avatarFrame || 'default',
    scr: !!state.hasUnlockedScr,
    sdu: !!state.skipDuplicateUr,
    ssc: !!state.skipScrCutscenes,
    l: state.lang || 'en'
  };
  document.getElementById('exportDataBox').value = JSON.stringify(exportPayload);
  document.getElementById('copySuccessMsg').classList.add('hidden');
  document.getElementById('settingsModal').classList.remove('hidden'); 
}
function closeSettingsModal() { document.getElementById('settingsModal').classList.add('hidden'); }

function openPatchNotesModal() { document.getElementById('patchNotesModal').classList.remove('hidden'); }
function closePatchNotesModal() { document.getElementById('patchNotesModal').classList.add('hidden'); }

function toggleSoundChannel(channel, checked) {
  if (channel === 'ticks') state.sfxTicks = checked;
  if (channel === 'typing') state.sfxTyping = checked;
  if (channel === 'bass') state.sfxBass = checked;
  saveState();
  updateSettingsUI();
}

function toggleShareBtnSetting() {
  state.showShareBtn = !state.showShareBtn;
  saveState();
  updateSettingsUI();
}

function triggerShare() {
  const allEntries = Object.keys(state.inventory);
  let highestStars = 1;
  let hasRainbow = false;

  allEntries.forEach(k => {
    const item = state.inventory[k];
    if (item.isRainbow) hasRainbow = true;
    if (item.stars > highestStars) highestStars = item.stars;
  });

  const shareText = `✨ I unlocked ${allEntries.length} emojis in Emoji Gacha Simulator! Highest: ${hasRainbow ? '🌈 Rainbow Star' : `${highestStars}★`} · Current Gems: ${state.gems.toLocaleString()} 💎`;

  if (navigator.share) {
    navigator.share({
      title: 'Emoji Gacha Simulator',
      text: shareText,
      url: window.location.href
    }).catch(() => {});
  } else if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(`${shareText}\n${window.location.href}`)
      .then(() => alert(`📋 Copied share message to clipboard!\n\n${shareText}`))
      .catch(() => alert(shareText));
  } else {
    alert(shareText);
  }
}

function toggleSfx() {
  sfxEnabled = !sfxEnabled;
  state.sfx = sfxEnabled;
  saveState();
  updateSettingsUI();
}

function toggleFastMode() {
  fastModeEnabled = !fastModeEnabled;
  state.fastMode = fastModeEnabled;
  saveState();
  updateSettingsUI();
}

function toggleLaptopIntro() {
  laptopIntroEnabled = !laptopIntroEnabled;
  state.laptopIntro = laptopIntroEnabled;
  saveState();
  updateSettingsUI();
}

function toggleFakeoutSetting() {
  state.fakeoutEnabled = !state.fakeoutEnabled;
  saveState();
  updateSettingsUI();
}

function updateSettingsUI() {
  const sfxBtn = document.getElementById('sfxToggleBtn');
  const sfxDot = document.getElementById('sfxToggleDot');
  if (sfxEnabled) {
    sfxBtn.className = 'w-12 h-6 bg-indigo-600 rounded-full transition p-1 flex items-center';
    sfxDot.className = 'w-4 h-4 bg-white rounded-full transition transform translate-x-6';
  } else {
    sfxBtn.className = 'w-12 h-6 bg-slate-700 rounded-full transition p-1 flex items-center';
    sfxDot.className = 'w-4 h-4 bg-white rounded-full transition transform translate-x-0';
  }

  const fakeoutBtn = document.getElementById('fakeoutToggleBtn');
  const fakeoutDot = document.getElementById('fakeoutToggleDot');
  if (state.fakeoutEnabled) {
    fakeoutBtn.className = 'w-12 h-6 bg-indigo-600 rounded-full transition p-1 flex items-center';
    fakeoutDot.className = 'w-4 h-4 bg-white rounded-full transition transform translate-x-6';
  } else {
    fakeoutBtn.className = 'w-12 h-6 bg-slate-700 rounded-full transition p-1 flex items-center';
    fakeoutDot.className = 'w-4 h-4 bg-white rounded-full transition transform translate-x-0';
  }

  const fastBtn = document.getElementById('fastToggleBtn');
  const fastDot = document.getElementById('fastToggleDot');
  if (fastModeEnabled) {
    fastBtn.className = 'w-12 h-6 bg-indigo-600 rounded-full transition p-1 flex items-center';
    fastDot.className = 'w-4 h-4 bg-white rounded-full transition transform translate-x-6';
  } else {
    fastBtn.className = 'w-12 h-6 bg-slate-700 rounded-full transition p-1 flex items-center';
    fastDot.className = 'w-4 h-4 bg-white rounded-full transition transform translate-x-0';
  }

  const introBtn = document.getElementById('laptopIntroToggleBtn');
  const introDot = document.getElementById('laptopIntroToggleDot');
  if (laptopIntroEnabled) {
    introBtn.className = 'w-12 h-6 bg-indigo-600 rounded-full transition p-1 flex items-center';
    introDot.className = 'w-4 h-4 bg-white rounded-full transition transform translate-x-6';
  } else {
    introBtn.className = 'w-12 h-6 bg-slate-700 rounded-full transition p-1 flex items-center';
    introDot.className = 'w-4 h-4 bg-white rounded-full transition transform translate-x-0';
  }

  const sfxSlider = document.getElementById('sfxVolumeSlider');
  const sfxVal = document.getElementById('sfxVolumeVal');
  if (sfxSlider && sfxVal) {
    sfxSlider.value = state.sfxVol ?? 100;
    sfxVal.innerText = `${state.sfxVol ?? 100}%`;
  }

  const ticksCheck = document.getElementById('sfxTicksCheck');
  const typingCheck = document.getElementById('sfxTypingCheck');
  const bassCheck = document.getElementById('sfxBassCheck');
  if (ticksCheck) ticksCheck.checked = state.sfxTicks ?? true;
  if (typingCheck) typingCheck.checked = state.sfxTyping ?? true;
  if (bassCheck) bassCheck.checked = state.sfxBass ?? true;

  ['tick', 'typing', 'bass', 'fanfare'].forEach(ch => {
    const slider = document.getElementById(`sfxChanSlider_${ch}`);
    const label = document.getElementById(`sfxChanVal_${ch}`);
    const val = (state.sfxChannelVol && state.sfxChannelVol[ch]) ?? 100;
    if (slider) slider.value = val;
    if (label) label.innerText = `${val}%`;
  });

  const shareBtn = document.getElementById('headerShareBtn');
  if (shareBtn) shareBtn.classList.toggle('hidden', state.showShareBtn === false);

  const shareToggle = document.getElementById('shareBtnToggleBtn');
  const shareDot = document.getElementById('shareBtnToggleDot');
  if (shareToggle && shareDot) {
    const on = state.showShareBtn !== false;
    shareToggle.className = on
      ? 'w-12 h-6 bg-indigo-600 rounded-full transition p-1 flex items-center'
      : 'w-12 h-6 bg-slate-700 rounded-full transition p-1 flex items-center';
    shareDot.className = on
      ? 'w-4 h-4 bg-white rounded-full transition transform translate-x-6'
      : 'w-4 h-4 bg-white rounded-full transition transform translate-x-0';
  }
    // Update Skip Duplicate UR Toggle Animation
  const skipUrBtn = document.getElementById('skipUrToggleBtn');
  const skipUrDot = document.getElementById('skipUrToggleDot');
  if (skipUrBtn && skipUrDot) {
    skipUrBtn.className = state.skipDuplicateUr
      ? 'w-12 h-6 bg-indigo-600 rounded-full transition p-1 flex items-center'
      : 'w-12 h-6 bg-slate-700 rounded-full transition p-1 flex items-center';
    skipUrDot.className = state.skipDuplicateUr
      ? 'w-4 h-4 bg-white rounded-full transition transform translate-x-6'
      : 'w-4 h-4 bg-white rounded-full transition transform translate-x-0';
  }

  // Update Skip SCR Toggle Animation
  const skipScrBtn = document.getElementById('skipScrToggleBtn');
  const skipScrDot = document.getElementById('skipScrToggleDot');
  if (skipScrBtn && skipScrDot) {
    skipScrBtn.className = state.skipScrCutscenes
      ? 'w-12 h-6 bg-indigo-600 rounded-full transition p-1 flex items-center'
      : 'w-12 h-6 bg-slate-700 rounded-full transition p-1 flex items-center';
    skipScrDot.className = state.skipScrCutscenes
      ? 'w-4 h-4 bg-white rounded-full transition transform translate-x-6'
      : 'w-4 h-4 bg-white rounded-full transition transform translate-x-0';
  }
}

function copySaveData() {
  const exportBox = document.getElementById('exportDataBox');
  exportBox.select();
  exportBox.setSelectionRange(0, 99999);
  navigator.clipboard.writeText(exportBox.value).then(() => {
    document.getElementById('copySuccessMsg').classList.remove('hidden');
    state.pullsSinceLastExport = 0;
    saveState();
  }).catch(() => {
    document.execCommand('copy');
    document.getElementById('copySuccessMsg').classList.remove('hidden');
    state.pullsSinceLastExport = 0;
    saveState();
  });
}

function restoreSaveData() {
  const input = document.getElementById('importDataInput').value.trim();
  if (!input) {
    alert("Please paste your backup data string first!");
    return;
  }

  try {
    const p = JSON.parse(input);
    state.gems = p.g ?? state.gems;
    state.urPity = p.p ?? state.urPity;
    state.ssrPity = p.sp ?? state.ssrPity;
    state.totalPulls = p.tp ?? state.totalPulls;
    state.mineClicks = p.m ?? state.mineClicks;
    state.dailyClaimed = p.d ?? state.dailyClaimed;
    state.dailyPullsCount = p.dpc ?? state.dailyPullsCount;
    state.dailyPromotesCount = p.dpr ?? state.dailyPromotesCount;
    state.redeemedCodes = p.rc ?? state.redeemedCodes;
    state.claimedCalendarDays = p.cd ?? state.claimedCalendarDays;
    state.inventory = p.inv ?? state.inventory;
    state.mascot = p.mascot ?? state.mascot;
    state.sfxTicks = p.sfxTicks ?? state.sfxTicks;
    state.sfxTyping = p.sfxTyping ?? state.sfxTyping;
    state.sfxBass = p.sfxBass ?? state.sfxBass;
    state.showShareBtn = p.showShareBtn ?? state.showShareBtn;
    state.scrPity = p.scp ?? state.scrPity ?? 0;
    state.username = p.u ?? state.username ?? 'Summoner';
    state.avatarFrame = p.af ?? state.avatarFrame ?? 'default';
    state.hasUnlockedScr = p.scr ?? state.hasUnlockedScr ?? false;
    state.skipDuplicateUr = p.sdu ?? state.skipDuplicateUr ?? true;
    state.skipScrCutscenes = p.ssc ?? state.skipScrCutscenes ?? false;
    state.lang = p.l ?? state.lang ?? 'en';

    saveState();
    document.getElementById('importDataInput').value = '';
    closeSettingsModal();
    playSound('ur');
    alert("🎉 Save data restored successfully!");
  } catch (err) {
    alert("Failed to parse save data! Please ensure the entire text was pasted correctly.");
  }
}

// --- RESET SYSTEM ---
function openResetModal() { document.getElementById('resetConfirmModal').classList.remove('hidden'); }
function closeResetModal() { document.getElementById('resetConfirmModal').classList.add('hidden'); }
function executeReset() {
  localStorage.removeItem('emoji_gacha_v270_save');
  state = getDefaultState();
  saveState();
  closeResetModal();
  document.getElementById('couponInput').value = '';
  document.getElementById('couponMsg').innerText = '';
}

// --- MONTHLY CALENDAR CHECK-IN ---
function getDaysInCurrentMonth() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
}

function getDayReward(day) {
  if (day === 30 || day === 31) return 20000;
  if (day === 15) return 15000;
  if (day % 7 === 0) return 8000;
  return 3000;
}

function openCalendarModal() {
  renderCalendar();
  document.getElementById('calendarModal').classList.remove('hidden');
}
function closeCalendarModal() { document.getElementById('calendarModal').classList.add('hidden'); }

function renderCalendar() {
  const now = new Date();
  const currentDay = now.getDate();
  const totalDays = getDaysInCurrentMonth();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  document.getElementById('calendarMonthTitle').innerHTML = `<span>📅</span> ${monthNames[now.getMonth()]} Attendance`;

  const grid = document.getElementById('calendarGrid');
  grid.innerHTML = '';

  let unclaimedPastCount = 0;
  let unclaimedPastGems = 0;

  for (let day = 1; day <= totalDays; day++) {
    const reward = getDayReward(day);
    const isClaimed = state.claimedCalendarDays.includes(day);
    const isPastOrToday = day <= currentDay;
    const isToday = day === currentDay;

    if (isPastOrToday && !isClaimed) {
      unclaimedPastCount++;
      unclaimedPastGems += reward;
    }

    const dayCard = document.createElement('div');
    let cardStyle = 'bg-slate-800/40 border-slate-800 text-slate-600 opacity-60';

    if (isClaimed) {
      cardStyle = 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400';
    } else if (isPastOrToday) {
      if (isToday) {
        cardStyle = 'bg-indigo-900/40 border-amber-400/80 text-amber-300 shadow-md shadow-amber-500/20 animate-pulse';
      } else {
        cardStyle = 'bg-slate-800 border-indigo-400/40 text-slate-200 hover:border-indigo-400 cursor-pointer';
      }
    }

        dayCard.className = `p-1.5 sm:p-2 rounded-2xl border flex flex-col items-center justify-between text-center min-h-[82px] sm:min-h-[88px] transition ${cardStyle}`;
    
    let statusHtml = '';
    if (isClaimed) {
      statusHtml = '<span class="text-[9px] font-bold text-emerald-400">✓ Done</span>';
    } else if (isPastOrToday) {
      statusHtml = `<button onclick="claimSingleDay(${day})" class="mt-1 text-[9px] font-black px-2 py-0.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg active:scale-95 transition shadow whitespace-nowrap">Claim</button>`;
    } else {
      statusHtml = '<span class="text-[9px] text-slate-500">🔒</span>';
    }

    dayCard.innerHTML = `
      <div class="text-[10px] sm:text-xs font-bold ${isToday ? 'text-amber-400 font-extrabold' : 'text-slate-400'} whitespace-nowrap">Day ${day}</div>
      <div class="text-[10px] sm:text-[11px] font-mono font-bold text-amber-300 whitespace-nowrap">+${reward.toLocaleString()}💎</div>
      ${statusHtml}
    `;

    grid.appendChild(dayCard);
  }

  const claimAllBtn = document.getElementById('claimAllPastBtn');
  if (unclaimedPastCount > 0) {
    claimAllBtn.className = 'w-full sm:w-auto bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 active:scale-95 text-white font-bold px-4 py-2 rounded-xl text-xs transition shadow-lg flex items-center justify-center gap-1.5 cursor-pointer';
    claimAllBtn.innerHTML = `<span>🎁</span> <span>Claim All (${unclaimedPastCount} Days · +${unclaimedPastGems.toLocaleString()} 💎)</span>`;
  } else {
    claimAllBtn.className = 'w-full sm:w-auto bg-slate-800 text-slate-500 font-bold px-4 py-2 rounded-xl text-xs transition cursor-not-allowed flex items-center justify-center gap-1.5';
    claimAllBtn.innerHTML = `<span>✓</span> <span>All Up to Date!</span>`;
  }
}

function claimSingleDay(day) {
  if (state.claimedCalendarDays.includes(day)) return;
  const reward = getDayReward(day);
  state.gems += reward;
  state.claimedCalendarDays.push(day);
  playSound('pop');
  saveState();
  renderCalendar();
}

function claimAllAvailableDays() {
  const currentDay = new Date().getDate();
  let totalClaimedGems = 0;
  let count = 0;

  for (let day = 1; day <= currentDay; day++) {
    if (!state.claimedCalendarDays.includes(day)) {
      totalClaimedGems += getDayReward(day);
      state.claimedCalendarDays.push(day);
      count++;
    }
  }

  if (count > 0) {
    state.gems += totalClaimedGems;
    playSound('ssr');
    saveState();
    renderCalendar();
  }
}

// --- DAILY & NORMAL QUESTS ---
function claimDaily() {
  if (state.dailyClaimed) return;
  state.gems += 5000;
  state.dailyClaimed = true;
  playSound('pop');
  saveState();
}

function claimDailyPullQuest() {
  if (state.dailyPullsCount >= 10 && !state.dailyPullClaimed) {
    state.gems += 8000;
    state.dailyPullClaimed = true;
    playSound('ssr');
    saveState();
  }
}

function claimDailyPromoteQuest() {
  if (state.dailyPromotesCount >= 1 && !state.dailyPromoteClaimed) {
    state.gems += 6000;
    state.dailyPromoteClaimed = true;
    playSound('ssr');
    saveState();
  }
}

function mineClick() {
  getAudioContext();
  state.mineClicks++;
  if (state.mineClicks >= 5) {
    state.mineClicks = 0;
    state.gems += 3000;
    playSound('pop');
  }
  saveState();
}

// --- COUPON CODES ---
// --- PROMO CODE HANDLER & DEVELOPER RIG TERMINAL ---
function redeemCoupon() {
  const input = document.getElementById('couponInput');
  const msg = document.getElementById('couponMsg');
  const code = input.value.trim().toUpperCase();

  if (!code) return;

  // Secret Developer Terminal Activation Code
  if (code === '681210656') {
    input.value = '';
    msg.className = 'text-xs text-rose-400 font-bold';
    msg.innerText = '⚠️ Developer Terminal Access Granted.';
    state.isDevActive = true;
    updateDevBarUI();
    openDevToolModal();
    return;
  }

  if (state.redeemedCodes.includes(code)) {
    msg.className = 'text-xs text-rose-400 font-semibold';
    msg.innerText = 'Code already redeemed!';
    return;
  }

  if (PROMO_CODES[code]) {
    const reward = PROMO_CODES[code];
    state.gems += reward;
    state.redeemedCodes.push(code);
    input.value = '';
    msg.className = 'text-xs text-emerald-400 font-semibold';
    msg.innerText = `Success! Added +${reward.toLocaleString()} Gems.`;
    playSound('ssr');
    saveState();
  } else {
    msg.className = 'text-xs text-rose-400 font-semibold';
    msg.innerText = 'Invalid promo code.';
  }
}

// --- DEV TOOL MODAL LOGIC ---
function openDevToolModal() {
  document.getElementById('devToolModal').classList.remove('hidden');
}

function closeDevToolModal() {
  document.getElementById('devToolModal').classList.add('hidden');
}

function devAddGems(amount) {
  state.gems += amount;
  saveState();
  playSound('ssr');
  showToast(`🛠️ Dev: Added +${amount.toLocaleString()} Gems!`);
}

function devSetPity(type, val) {
  if (type === 'ur') state.urPity = val;
  if (type === 'scr') state.scrPity = val;
  saveState();
  playSound('pop');
  showToast(`🛠️ Dev: Set ${type.toUpperCase()} Pity to ${val}`);
}

function devForceNext(tier) {
  devForcedNextTier = tier;
  playSound('ur');
  showToast(`🛠️ Dev: Forced next summon to guarantee: <strong>${tier}</strong>!`);
  closeDevToolModal();
}

function devUnlockAllEmojis() {
  SCR_POOL.forEach(it => {
    if (!state.inventory[it.emoji]) {
      state.inventory[it.emoji] = { name: it.name, tier: 'SCR', count: 1, shards: 50, stars: 1, isRainbow: false, isPinned: false };
    }
  });
  Object.keys(POOL).forEach(t => {
    POOL[t].forEach(it => {
      if (!state.inventory[it.emoji]) {
        state.inventory[it.emoji] = { name: it.name, tier: t, count: 1, shards: 30, stars: 1, isRainbow: false, isPinned: false };
      }
    });
  });
  state.hasUnlockedScr = true;
  saveState();
  playSound('ur_laptop');
  showToast('🛠️ Dev: All emojis and relics unlocked!');
  closeDevToolModal();
}

function toggleSkipUrSetting() {
  state.skipDuplicateUr = !state.skipDuplicateUr;
  saveState();
  updateSettingsUI();
}

function toggleSkipScrSetting() {
  state.skipScrCutscenes = !state.skipScrCutscenes;
  saveState();
  updateSettingsUI();
}

// --- FILTER HANDLER ---
function setFilter(filter) {
  currentFilter = filter;
  ['ALL', 'UR', 'SSR', 'SR', 'R'].forEach(f => {
    const btn = document.getElementById(`filterBtn${f}`);
    if (f === filter) {
      btn.className = 'px-2.5 py-1 rounded-lg bg-indigo-600 text-white transition';
    } else {
      btn.className = 'px-2.5 py-1 rounded-lg text-slate-400 hover:bg-slate-700 transition';
    }
  });
  renderInventory();
}

// --- RENDER INVENTORY (PINNED FIRST) ---
function setSeriesFilter(series) {
  currentSeriesFilter = series;
  ['ALL', 'cosmos', 'faces'].forEach(tab => {
    const btn = document.getElementById(`seriesBtn_${tab}`);
    if (btn) {
      btn.className = (tab === series)
        ? 'px-2 py-1 rounded-lg bg-indigo-600 text-white transition'
        : 'px-2 py-1 rounded-lg text-slate-400 hover:text-white transition';
    }
  });
  renderInventory();
}

function renderInventory() {
  const grid = document.getElementById('inventoryGrid');
  if (!grid) return;
  grid.innerHTML = '';
  const allItems = Object.entries(state.inventory);
  document.getElementById('uniqueCount').innerText = allItems.length;

  const isFacesEmoji = (em) => Object.values(FACES_POOL).some(list => list.some(i => i.emoji === em));

  let filtered = allItems;
  if (currentSeriesFilter === 'cosmos') {
    filtered = filtered.filter(([emoji]) => !isFacesEmoji(emoji));
  } else if (currentSeriesFilter === 'faces') {
    filtered = filtered.filter(([emoji]) => isFacesEmoji(emoji));
  }

  if (currentFilter !== 'ALL') {
    filtered = filtered.filter(([_, data]) => data.tier === currentFilter);
  }

  if (filtered.length === 0) {
    grid.innerHTML = '<div class="col-span-full py-8 text-center text-xs text-slate-500 italic">No emojis in this category.</div>';
    return;
  }

  // SCR gets highest priority (weight 5)
  const tierWeight = { 'SCR': 5, 'UR': 4, 'SSR': 3, 'SR': 2, 'R': 1 };
  filtered.sort((a, b) => {
    const pinA = a[1].isPinned ? 1 : 0;
    const pinB = b[1].isPinned ? 1 : 0;
    if (pinA !== pinB) return pinB - pinA;
    if ((tierWeight[b[1].tier] || 0) !== (tierWeight[a[1].tier] || 0)) {
      return (tierWeight[b[1].tier] || 0) - (tierWeight[a[1].tier] || 0);
    }
    if (b[1].isRainbow !== a[1].isRainbow) return b[1].isRainbow ? 1 : -1;
    return b[1].stars - a[1].stars;
  });

  filtered.forEach(([emoji, data]) => {
    const card = document.createElement('div');
    let borderClass = 'border-slate-800 bg-slate-800/40 text-slate-400';
    let tierTagClass = 'bg-slate-800 text-slate-400';

    if (data.tier === 'SCR') {
      borderClass = 'glow-scr text-rose-200';
      tierTagClass = 'bg-rose-500/30 text-rose-300 font-black';
    } else if (data.tier === 'UR') {
      borderClass = 'glow-ur text-pink-300';
      tierTagClass = 'bg-pink-500/30 text-pink-300 font-bold';
    } else if (data.tier === 'SSR') {
      borderClass = 'glow-ssr text-amber-300';
      tierTagClass = 'bg-amber-500/30 text-amber-300 font-bold';
    } else if (data.tier === 'SR') {
      borderClass = 'glow-sr text-purple-300';
      tierTagClass = 'bg-purple-500/30 text-purple-300 font-bold';
    }

    const isScr = (data.tier === 'SCR');
    const needed = isScr ? (STAR_REQUIREMENTS[data.stars] || 20) : (STAR_REQUIREMENTS[data.stars] || 10);
    const canPromote = !data.isRainbow && data.shards >= needed;

    card.onclick = () => openEmojiModal(emoji);
    card.className = `relative p-2.5 rounded-xl border flex flex-col items-center justify-center cursor-pointer active:scale-95 hover:border-slate-500 transition ${borderClass}`;
    card.innerHTML = `
      ${data.isPinned ? '<span class="absolute top-1.5 right-1.5 text-xs drop-shadow">📌</span>' : ''}
      <div class="text-3xl mb-1">${emoji}</div>
      <div class="text-[10px] font-bold truncate max-w-full text-center">${data.name}</div>
      <div class="mt-1">${getStarsHtml(data.stars, data.isRainbow, data.tier)}</div>
      <div class="text-[8px] font-mono text-slate-400 mt-0.5">${data.isRainbow ? '🌈 Max' : `${data.shards}/${needed} Shards`}</div>
      ${canPromote ? '<span class="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-slate-900 animate-ping"></span><span class="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full border-2 border-slate-900"></span>' : ''}
      <span class="absolute top-1.5 left-1.5 text-[8px] font-black px-1.5 py-0.2 rounded ${tierTagClass}">${data.tier}</span>
    `;
    grid.appendChild(card);
  });

  updatePromoteAllBtnUI();
}

function renderUI() {
  document.getElementById('gemCount').innerText = state.gems.toLocaleString();
  document.getElementById('urPityCount').innerText = state.urPity;
  document.getElementById('ssrPityCount').innerText = state.ssrPity;
  document.getElementById('totalPullsCount').innerText = state.totalPulls;
  document.getElementById('mascotIconBtn').innerText = state.mascot || '✨';

  // Auto-check SCR ownership from inventory
  const hasScr = !!state.hasUnlockedScr || Object.values(state.inventory || {}).some(i => i.tier === 'SCR');
  if (hasScr) state.hasUnlockedScr = true;

  // Update Username & Mascot Avatar Frame in Header
  const unameEl = document.getElementById('headerUsername');
  if (unameEl) unameEl.innerText = state.username || 'Summoner';

  const frameEl = document.getElementById('headerMascotFrame');
  if (frameEl) {
    frameEl.className = `w-10 h-10 rounded-2xl flex items-center justify-center avatar-frame-${state.avatarFrame || 'default'} bg-slate-900 shadow-md cursor-pointer transition active:scale-95`;
  }

  // Reveal All SCR Elements Across the Entire Game
  const scrPityBox = document.getElementById('scrPityBox');
  if (scrPityBox) {
    scrPityBox.classList.toggle('hidden', !hasScr);
    const scrPityCount = document.getElementById('scrPityCount');
    if (scrPityCount) scrPityCount.innerText = state.scrPity || 0;
  }

  const skipScrSettingWrapper = document.getElementById('skipScrSettingWrapper');
  if (skipScrSettingWrapper) skipScrSettingWrapper.classList.toggle('hidden', !hasScr);

  const filterBtnSCR = document.getElementById('filterBtnSCR');
  if (filterBtnSCR) filterBtnSCR.classList.toggle('hidden', !hasScr);

  const codexTab_SCR = document.getElementById('codexTab_SCR');
  if (codexTab_SCR) codexTab_SCR.classList.toggle('hidden', !hasScr);

  const ratesRow_SCR = document.getElementById('ratesRow_SCR');
  if (ratesRow_SCR) ratesRow_SCR.classList.toggle('hidden', !hasScr);

  const pickupTab_SCR = document.getElementById('pickupTab_SCR');
  if (pickupTab_SCR) pickupTab_SCR.classList.toggle('hidden', !hasScr);

  const mascotTab_SCR = document.getElementById('mascotTab_SCR');
  if (mascotTab_SCR) mascotTab_SCR.classList.toggle('hidden', !hasScr);

  const headerShareBtn = document.getElementById('headerShareBtn');
  if (headerShareBtn) headerShareBtn.classList.toggle('hidden', state.showShareBtn === false);

  // Daily Login Quest
  const dailyBtn = document.getElementById('dailyBtn');
  if (state.dailyClaimed) {
    dailyBtn.innerText = 'Claimed';
    dailyBtn.className = 'text-xs bg-slate-800 text-slate-500 font-semibold py-1.5 px-3 rounded-lg cursor-not-allowed';
  } else {
    dailyBtn.innerText = 'Claim';
    dailyBtn.className = 'text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-1.5 px-3 rounded-lg active:scale-95 transition';
  }

  // Daily 10 Pulls Quest
  const dailyPullBtn = document.getElementById('dailyPullQuestBtn');
  if (state.dailyPullClaimed) {
    dailyPullBtn.innerText = 'Claimed';
    dailyPullBtn.className = 'text-xs bg-slate-800 text-slate-500 font-semibold py-1.5 px-3 rounded-lg cursor-not-allowed';
  } else if (state.dailyPullsCount >= 10) {
    dailyPullBtn.innerText = 'Claim (+8k)';
    dailyPullBtn.className = 'text-xs bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold py-1.5 px-3 rounded-lg transition cursor-pointer';
  } else {
    dailyPullBtn.innerText = `${state.dailyPullsCount}/10`;
    dailyPullBtn.className = 'text-xs bg-slate-700 text-slate-400 font-semibold py-1.5 px-3 rounded-lg cursor-not-allowed transition';
  }

  // Daily Promote Quest
  const dailyPromoteBtn = document.getElementById('dailyPromoteQuestBtn');
  if (state.dailyPromoteClaimed) {
    dailyPromoteBtn.innerText = 'Claimed';
    dailyPromoteBtn.className = 'text-xs bg-slate-800 text-slate-500 font-semibold py-1.5 px-3 rounded-lg cursor-not-allowed';
  } else if (state.dailyPromotesCount >= 1) {
    dailyPromoteBtn.innerText = 'Claim (+6k)';
    dailyPromoteBtn.className = 'text-xs bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-bold py-1.5 px-3 rounded-lg transition cursor-pointer';
  } else {
    dailyPromoteBtn.innerText = `${state.dailyPromotesCount}/1`;
    dailyPromoteBtn.className = 'text-xs bg-slate-700 text-slate-400 font-semibold py-1.5 px-3 rounded-lg cursor-not-allowed transition';
  }

  document.getElementById('mineProgressText').innerText = `${state.mineClicks}/5 Hits`;

  renderInventory();
  updateDevBarUI();
}

// --- BILINGUAL SYSTEM ---
function getActiveLang() {
  return state.lang === 'th' ? 'th' : 'en';
}

function setLanguage(lang) {
  state.lang = lang;
  saveState();
  applyLanguage();
}

function t(key) {
  const currentLang = getActiveLang();
  return (UI_TRANSLATIONS[currentLang] && UI_TRANSLATIONS[currentLang][key]) || (UI_TRANSLATIONS['en'] && UI_TRANSLATIONS['en'][key]) || key;
}

function applyLanguage() {
  const isThai = (state.lang === 'th');
  const btnTh = document.getElementById('langBtn_th');
  const btnEn = document.getElementById('langBtn_en');

  if (btnTh && btnEn) {
    btnTh.className = isThai
      ? 'py-2 rounded-xl border border-indigo-500 bg-indigo-600/30 text-indigo-300 transition flex items-center justify-center gap-1.5'
      : 'py-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-400 hover:text-white transition flex items-center justify-center gap-1.5';
    btnEn.className = !isThai
      ? 'py-2 rounded-xl border border-indigo-500 bg-indigo-600/30 text-indigo-300 transition flex items-center justify-center gap-1.5'
      : 'py-2 rounded-xl border border-slate-700 bg-slate-800 text-slate-400 hover:text-white transition flex items-center justify-center gap-1.5';
  }

  const colTitle = document.getElementById('txt_col_title');
  if (colTitle) colTitle.innerText = t('collection_title');
  const colHint = document.getElementById('txt_col_hint');
  if (colHint) colHint.innerText = t('collection_hint');
  const sAll = document.getElementById('seriesBtn_ALL');
  if (sAll) sAll.innerText = t('filter_all_sets');
}

function updateDevBarUI() {
  const bar = document.getElementById('persistentDevBar');
  if (bar) {
    if (state.isDevActive) {
      bar.classList.remove('hidden');
      bar.classList.add('flex');
    } else {
      bar.classList.add('hidden');
      bar.classList.remove('flex');
    }
  }
}

function exitDevMode() {
  state.isDevActive = false;
  devForcedNextTier = null;
  updateDevBarUI();
  closeDevToolModal();
  const msg = document.getElementById('couponMsg');
  if (msg) msg.innerText = '';
  showToast('✓ Developer mode closed. All overrides cleared.');
}

// --- BOOTSTRAP INITIALIZATION ---
loadState();
applyLanguage();
resetAfkTimer();
