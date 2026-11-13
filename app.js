/**
 * VELPLAY - Video Streaming Platform
 * Pure Vanilla JavaScript (ES6+)
 * Fully functional with LocalStorage persistence, Custom Player,
 * Playlist Management, Category Editing, Backup Import/Export & Theme System
 */

(function () {
  'use strict';

  /* ==========================================================================
     1. CONSTANTS & INITIAL DATA
     ========================================================================== */

  const STORAGE_KEYS = {
    VIDEOS: 'velplay_videos',
    CATEGORIES: 'velplay_categories',
    HISTORY: 'velplay_history',
    POSITIONS: 'velplay_positions',
    FAVORITES: 'velplay_favorites',
    PLAYLISTS: 'velplay_playlists',
    PREFS: 'velplay_prefs',
    ADMIN_SESSION: 'velplay_admin_auth'
  };

  const DEFAULT_CATEGORIES = [
    'All',
    'Animation',
    'Action',
    'Documentary',
    'Sci-Fi',
    'Adventure',
    'Music',
    'Gaming'
  ];

  const SAMPLE_VIDEOS = [
    {
      id: 'vel-vid-1',
      title: 'Big Buck Bunny - Animated Classic',
      description: 'A large and lovable rabbit deals with bullying forest creatures in this iconic open-source Blender Foundation short film. Directed by Sacha Goedegebure.',
      category: 'Animation',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnail: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/BigBuckBunny.jpg',
      duration: '9:56',
      durationSec: 596,
      views: 1245000,
      uploadDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
      status: 'published'
    },
    {
      id: 'vel-vid-2',
      title: 'Elephant Dream - Futuristic Surreal CGI',
      description: 'The world\'s first open-movie computer-animated short film by the Orange Open Movie Project and Blender Foundation. Journey into the giant machine.',
      category: 'Animation',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      thumbnail: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ElephantsDream.jpg',
      duration: '10:54',
      durationSec: 654,
      views: 852000,
      uploadDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
      status: 'published'
    },
    {
      id: 'vel-vid-3',
      title: 'For Bigger Blazes - Extreme Action Teaser',
      description: 'Experience heart-stopping pyrotechnics and explosive movie stunts in ultra-high definition cinematic action.',
      category: 'Action',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      thumbnail: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerBlazes.jpg',
      duration: '0:15',
      durationSec: 15,
      views: 3200000,
      uploadDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      status: 'published'
    },
    {
      id: 'vel-vid-4',
      title: 'For Bigger Escapes - Thrilling Heist Getaway',
      description: 'High-speed pursuits across city streets and narrow alleys. Every second counts in this adrenaline-filled teaser.',
      category: 'Action',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      thumbnail: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/ForBiggerEscapes.jpg',
      duration: '0:15',
      durationSec: 15,
      views: 984000,
      uploadDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8).toISOString(),
      status: 'published'
    },
    {
      id: 'vel-vid-5',
      title: 'Subaru Outback - Street and Dirt Expedition',
      description: 'Documentary test drive pushing the Subaru Outback AWD through muddy trails, mountainous terrain, and modern city asphalt.',
      category: 'Documentary',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
      thumbnail: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/SubaruOutbackOnStreetAndDirt.jpg',
      duration: '0:57',
      durationSec: 57,
      views: 456000,
      uploadDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18).toISOString(),
      status: 'published'
    },
    {
      id: 'vel-vid-6',
      title: 'Tears of Steel - Sci-Fi VFX Showcase',
      description: 'Set in a dystopian future Amsterdam, a squad of warriors and scientists try to rescue the world from rampant cybernetic robots.',
      category: 'Sci-Fi',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      thumbnail: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/TearsOfSteel.jpg',
      duration: '12:14',
      durationSec: 734,
      views: 2150000,
      uploadDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(),
      status: 'published'
    },
    {
      id: 'vel-vid-7',
      title: 'Volkswagen GTI - Engineering & Performance Review',
      description: 'An in-depth review covering turbocharged horsepower, handling dynamics, and modern hot hatch craftsmanship.',
      category: 'Documentary',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
      thumbnail: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/VolkswagenGTIReview.jpg',
      duration: '0:50',
      durationSec: 50,
      views: 673000,
      uploadDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 25).toISOString(),
      status: 'published'
    },
    {
      id: 'vel-vid-8',
      title: 'We Are Going On Bullrun - Rally Road Trip',
      description: 'Follow the supercar rally cross-country through deserts, neon-lit highways, and coastal highways with the Bullrun team.',
      category: 'Adventure',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
      thumbnail: 'https://storage.googleapis.com/gtv-videos-bucket/sample/images/WeAreGoingOnBullrun.jpg',
      duration: '0:59',
      durationSec: 59,
      views: 1540000,
      uploadDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
      status: 'published'
    }
  ];

  /* ==========================================================================
     2. STATE & STORAGE MANAGEMENT
     ========================================================================== */

  const State = {
    videos: [],
    categories: [],
    history: [],
    positions: {},
    favorites: [],
    playlists: [],
    prefs: {
      autoplay: true,
      theatre: false,
      volume: 1.0,
      muted: false,
      playbackRate: 1.0,
      theme: 'dark'
    },
    currentRoute: '',
    routeParams: {},
    activePlayer: null
  };

  function loadStorage() {
    try {
      const v = localStorage.getItem(STORAGE_KEYS.VIDEOS);
      State.videos = v ? JSON.parse(v) : [...SAMPLE_VIDEOS];
      if (!v) saveVideos();

      const cats = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      State.categories = cats ? JSON.parse(cats) : [...DEFAULT_CATEGORIES];
      if (!cats) saveCategories();

      const h = localStorage.getItem(STORAGE_KEYS.HISTORY);
      State.history = h ? JSON.parse(h) : [];

      const p = localStorage.getItem(STORAGE_KEYS.POSITIONS);
      State.positions = p ? JSON.parse(p) : {};

      const f = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      State.favorites = f ? JSON.parse(f) : ['vel-vid-1', 'vel-vid-6'];

      const pl = localStorage.getItem(STORAGE_KEYS.PLAYLISTS);
      State.playlists = pl ? JSON.parse(pl) : [
        {
          id: 'pl-featured',
          title: 'Staff Picks & Best Visuals',
          description: 'A hand-curated collection of groundbreaking open CGI short films.',
          createdAt: new Date().toISOString(),
          videoIds: ['vel-vid-1', 'vel-vid-2', 'vel-vid-6']
        },
        {
          id: 'pl-motors',
          title: 'Motors & Speed',
          description: 'Automotive documentary and action clips.',
          createdAt: new Date().toISOString(),
          videoIds: ['vel-vid-5', 'vel-vid-7', 'vel-vid-8']
        }
      ];

      const pr = localStorage.getItem(STORAGE_KEYS.PREFS);
      if (pr) {
        State.prefs = Object.assign(State.prefs, JSON.parse(pr));
      }
    } catch (e) {
      console.error('Error loading localStorage:', e);
      State.videos = [...SAMPLE_VIDEOS];
      State.categories = [...DEFAULT_CATEGORIES];
    }
  }

  function saveVideos() {
    localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(State.videos));
  }
  function saveCategories() {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(State.categories));
  }
  function saveHistory() {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(State.history));
  }
  function savePositions() {
    localStorage.setItem(STORAGE_KEYS.POSITIONS, JSON.stringify(State.positions));
  }
  function saveFavorites() {
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(State.favorites));
  }
  function savePlaylists() {
    localStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(State.playlists));
  }
  function savePrefs() {
    localStorage.setItem(STORAGE_KEYS.PREFS, JSON.stringify(State.prefs));
  }

  /* ==========================================================================
     3. UTILITY & FORMATTING HELPERS
     ========================================================================== */

  function formatViews(num) {
    if (num == null) return '0 views';
    const n = Number(num);
    if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M views';
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'K views';
    return n + ' views';
  }

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const s = Math.floor(seconds % 60);
    const m = Math.floor((seconds / 60) % 60);
    const h = Math.floor(seconds / 3600);
    const pad = val => String(val).padStart(2, '0');
    if (h > 0) {
      return `${h}:${pad(m)}:${pad(s)}`;
    }
    return `${m}:${pad(s)}`;
  }

  function formatRelativeDate(isoDateStr) {
    if (!isoDateStr) return 'Recently';
    const past = new Date(isoDateStr).getTime();
    const now = Date.now();
    const diffSec = Math.floor((now - past) / 1000);

    if (diffSec < 60) return 'Just now';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin} ${diffMin === 1 ? 'minute' : 'minutes'} ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`;
    const diffWeeks = Math.floor(diffDays / 7);
    if (diffWeeks < 4) return `${diffWeeks} ${diffWeeks === 1 ? 'week' : 'weeks'} ago`;
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) return `${diffMonths} ${diffMonths === 1 ? 'month' : 'months'} ago`;
    const diffYears = Math.floor(diffDays / 365);
    return `${diffYears} ${diffYears === 1 ? 'year' : 'years'} ago`;
  }

  function escapeHtml(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function generateId(prefix = 'vel') {
    return prefix + '-' + Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 5);
  }

  function getVideoById(id) {
    return State.videos.find(v => v.id === id);
  }

  function isFavorite(videoId) {
    return State.favorites.includes(videoId);
  }

  function toggleFavorite(videoId) {
    const idx = State.favorites.indexOf(videoId);
    let added = false;
    if (idx >= 0) {
      State.favorites.splice(idx, 1);
    } else {
      State.favorites.push(videoId);
      added = true;
    }
    saveFavorites();
    showToast(added ? 'Added to Favorites' : 'Removed from Favorites', added ? 'success' : 'info');
    return added;
  }

  function updateHistoryRecord(videoId, position, duration) {
    if (!videoId || !duration) return;
    const percent = Math.min(100, Math.round((position / duration) * 100));
    State.positions[videoId] = position;
    savePositions();

    const existingIdx = State.history.findIndex(h => h.videoId === videoId);
    const item = {
      videoId,
      timestamp: new Date().toISOString(),
      position,
      duration,
      percent
    };

    if (existingIdx >= 0) {
      State.history.splice(existingIdx, 1);
    }
    State.history.unshift(item);
    if (State.history.length > 50) {
      State.history.pop();
    }
    saveHistory();
  }

  function removeHistoryItem(videoId) {
    State.history = State.history.filter(h => h.videoId !== videoId);
    delete State.positions[videoId];
    saveHistory();
    savePositions();
    showToast('Removed from watch history', 'info');
  }

  function clearAllHistory() {
    State.history = [];
    State.positions = {};
    saveHistory();
    savePositions();
    showToast('Watch history cleared', 'info');
  }

  /* ==========================================================================
     4. CATEGORY MANAGEMENT FUNCTIONS
     ========================================================================== */

  function addCategory(name) {
    const trimmed = name.trim();
    if (!trimmed) return false;
    if (State.categories.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
      showToast('Category already exists', 'error');
      return false;
    }
    State.categories.push(trimmed);
    saveCategories();
    populateSidebarCategories();
    showToast(`Category "${trimmed}" added`, 'success');
    return true;
  }

  function renameCategory(oldName, newName) {
    const trimmed = newName.trim();
    if (!trimmed || oldName === 'All') return false;
    const idx = State.categories.indexOf(oldName);
    if (idx === -1) return false;

    State.categories[idx] = trimmed;
    saveCategories();

    // Update all videos with the old category name
    let count = 0;
    State.videos.forEach(v => {
      if (v.category === oldName) {
        v.category = trimmed;
        count++;
      }
    });
    if (count > 0) saveVideos();

    populateSidebarCategories();
    showToast(`Renamed category to "${trimmed}" (${count} videos updated)`, 'success');
    return true;
  }

  function deleteCategory(name) {
    if (name === 'All') {
      showToast('Cannot delete "All" category', 'error');
      return false;
    }
    State.categories = State.categories.filter(c => c !== name);
    saveCategories();

    // Reassign affected videos to 'Animation' or first available category
    const fallback = State.categories.find(c => c !== 'All') || 'General';
    let count = 0;
    State.videos.forEach(v => {
      if (v.category === name) {
        v.category = fallback;
        count++;
      }
    });
    if (count > 0) saveVideos();

    populateSidebarCategories();
    showToast(`Category "${name}" deleted. Videos reassigned to "${fallback}".`, 'info');
    return true;
  }

  /* ==========================================================================
     5. DATA EXPORT & IMPORT (BACKUP & RESTORE)
     ========================================================================== */

  function exportAllData() {
    const data = {
      version: 1,
      appName: 'VELPLAY',
      exportedAt: new Date().toISOString(),
      videos: State.videos,
      categories: State.categories,
      playlists: State.playlists,
      history: State.history,
      positions: State.positions,
      favorites: State.favorites,
      prefs: State.prefs
    };

    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `velplay-backup-${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 100);

    showToast('Platform data exported successfully!', 'success');
  }

  function importDataFromFile(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (!data || typeof data !== 'object') {
          showToast('Invalid backup file format', 'error');
          return;
        }

        const vidCount = Array.isArray(data.videos) ? data.videos.length : 0;
        const plCount = Array.isArray(data.playlists) ? data.playlists.length : 0;
        const catCount = Array.isArray(data.categories) ? data.categories.length : 0;

        showModal({
          title: 'Confirm Data Restoration',
          bodyHtml: `
            <p style="font-size:14px; color:var(--text-secondary); margin-bottom:12px;">
              Found backup from <strong>${data.exportedAt ? new Date(data.exportedAt).toLocaleString() : 'Unknown date'}</strong> containing:
            </p>
            <ul style="font-size:13px; color:var(--text-primary); margin-left:20px; margin-bottom:16px; line-height:1.7;">
              <li><strong>${vidCount}</strong> Videos</li>
              <li><strong>${catCount}</strong> Categories</li>
              <li><strong>${plCount}</strong> Playlists</li>
              <li>Watch history & favorites</li>
            </ul>
            <p style="font-size:13px; color:var(--text-secondary);">
              Do you want to overwrite your current platform data with this backup?
            </p>
          `,
          confirmText: 'Restore Backup',
          confirmClass: 'btn-primary',
          onConfirm: () => {
            if (Array.isArray(data.videos)) State.videos = data.videos;
            if (Array.isArray(data.categories)) State.categories = data.categories;
            if (Array.isArray(data.playlists)) State.playlists = data.playlists;
            if (Array.isArray(data.history)) State.history = data.history;
            if (data.positions && typeof data.positions === 'object') State.positions = data.positions;
            if (Array.isArray(data.favorites)) State.favorites = data.favorites;
            if (data.prefs && typeof data.prefs === 'object') State.prefs = Object.assign(State.prefs, data.prefs);

            saveVideos();
            saveCategories();
            savePlaylists();
            saveHistory();
            savePositions();
            saveFavorites();
            savePrefs();

            populateSidebarCategories();
            applyTheme(State.prefs.theme);
            showToast('All data successfully restored!', 'success');
            handleRoute();
          }
        });
      } catch (err) {
        console.error('Import parse error:', err);
        showToast('Failed to parse JSON backup file', 'error');
      }
    };
    reader.readAsText(file);
  }

  function openBackupRestoreModal() {
    showModal({
      title: 'Platform Backup & Data Management',
      bodyHtml: `
        <div style="font-size:14px; color:var(--text-secondary); margin-bottom:16px;">
          Export your entire VELPLAY library, categories, custom playlists, and watch history to a portable JSON file, or restore a previous backup.
        </div>
        <div style="display:flex; flex-direction:column; gap:12px;">
          <div style="background:var(--bg-card); border:1px solid var(--border); padding:14px; border-radius:var(--radius-sm); display:flex; align-items:center; justify-content:space-between;">
            <div>
              <div style="font-weight:600;">Export Platform Data</div>
              <div style="font-size:12px; color:var(--text-muted);">Download .json backup file with all videos & settings</div>
            </div>
            <button type="button" class="btn-primary" id="modal-export-btn">
              <svg viewBox="0 0 24 24" class="svg-icon"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
              Export JSON
            </button>
          </div>

          <div style="background:var(--bg-card); border:1px solid var(--border); padding:14px; border-radius:var(--radius-sm); display:flex; align-items:center; justify-content:space-between;">
            <div>
              <div style="font-weight:600;">Import / Restore Data</div>
              <div style="font-size:12px; color:var(--text-muted);">Restore videos, playlists & categories from a backup file</div>
            </div>
            <button type="button" class="btn-secondary" id="modal-import-btn">
              <svg viewBox="0 0 24 24" class="svg-icon"><path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/></svg>
              Import JSON
            </button>
          </div>
        </div>
      `,
      confirmText: 'Done',
      confirmClass: 'btn-secondary',
      onConfirm: () => true
    });

    const container = document.getElementById('modal-container');
    const expBtn = container.querySelector('#modal-export-btn');
    const impBtn = container.querySelector('#modal-import-btn');
    const fileInput = document.getElementById('backup-file-input');

    if (expBtn) expBtn.addEventListener('click', exportAllData);
    if (impBtn && fileInput) {
      impBtn.addEventListener('click', () => {
        closeModal();
        fileInput.value = '';
        fileInput.click();
      });
    }
  }

  /* ==========================================================================
     6. TOAST & MODAL SYSTEMS
     ========================================================================== */

  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const iconSvg = type === 'success' 
      ? '<svg viewBox="0 0 24 24" class="svg-icon" style="fill:#00e676;"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>'
      : type === 'error'
      ? '<svg viewBox="0 0 24 24" class="svg-icon" style="fill:#ff3d00;"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>'
      : '<svg viewBox="0 0 24 24" class="svg-icon" style="fill:#3ea6ff;"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>';

    toast.innerHTML = `
      ${iconSvg}
      <span style="flex:1;">${escapeHtml(message)}</span>
    `;

    container.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(60px)';
      setTimeout(() => toast.remove(), 250);
    }, 3200);
  }

  function showModal({ title, bodyHtml, confirmText = 'Confirm', confirmClass = 'btn-primary', onConfirm, onCancel }) {
    const container = document.getElementById('modal-container');
    if (!container) return;

    container.innerHTML = `
      <div class="modal-card" role="dialog" aria-labelledby="modal-title">
        <div class="modal-header">
          <h3 id="modal-title">${escapeHtml(title)}</h3>
          <button class="icon-btn modal-close-btn" aria-label="Close modal">
            <svg viewBox="0 0 24 24" class="svg-icon"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          </button>
        </div>
        <div class="modal-body">
          ${bodyHtml}
        </div>
        <div class="modal-footer">
          <button type="button" class="btn-secondary modal-cancel-btn">Cancel</button>
          ${confirmText ? `<button type="button" class="${confirmClass} modal-confirm-btn">${escapeHtml(confirmText)}</button>` : ''}
        </div>
      </div>
    `;

    container.classList.remove('hidden');

    const close = () => {
      container.classList.add('hidden');
      container.innerHTML = '';
      if (onCancel) onCancel();
    };

    container.querySelector('.modal-close-btn').addEventListener('click', close);
    container.querySelector('.modal-cancel-btn').addEventListener('click', close);

    container.addEventListener('click', (e) => {
      if (e.target === container) close();
    }, { once: true });

    if (confirmText && onConfirm) {
      container.querySelector('.modal-confirm-btn').addEventListener('click', () => {
        const result = onConfirm(container);
        if (result !== false) close();
      });
    }
  }

  function closeModal() {
    const container = document.getElementById('modal-container');
    if (container) {
      container.classList.add('hidden');
      container.innerHTML = '';
    }
  }

  /* ==========================================================================
     7. PLAYLIST MODALS: ADD/REMOVE VIDEOS
     ========================================================================== */

  function openAddToPlaylistModal(videoId) {
    const video = getVideoById(videoId);
    if (!video) return;

    const renderPlaylistsChecklist = () => {
      if (State.playlists.length === 0) {
        return '<p style="font-size:13px; color:var(--text-muted); padding:8px 0;">No playlists yet. Create one below!</p>';
      }
      return State.playlists.map(pl => {
        const has = pl.videoIds.includes(videoId);
        return `
          <label class="playlist-check-item">
            <input type="checkbox" data-playlist-id="${pl.id}" ${has ? 'checked' : ''}>
            <span class="playlist-check-title">${escapeHtml(pl.title)}</span>
            <span class="playlist-check-count">${pl.videoIds.length} videos</span>
          </label>
        `;
      }).join('');
    };

    const bodyHtml = `
      <div style="font-size:14px; color:var(--text-secondary); margin-bottom:12px;">
        Save <strong>${escapeHtml(video.title)}</strong> to:
      </div>
      <div id="playlist-checklist-wrap" class="playlist-checklist">
        ${renderPlaylistsChecklist()}
      </div>
      <div style="margin-top:16px; padding-top:14px; border-top:1px solid var(--border);">
        <label style="font-size:13px; font-weight:600; margin-bottom:6px; display:block;">Create New Playlist</label>
        <div style="display:flex; gap:8px;">
          <input type="text" id="new-playlist-title" placeholder="Playlist title..." style="flex:1;">
          <button type="button" id="btn-create-playlist-quick" class="btn-primary" style="white-space:nowrap;">Create</button>
        </div>
      </div>
    `;

    showModal({
      title: 'Save to Playlist',
      bodyHtml,
      confirmText: 'Done',
      onConfirm: (container) => {
        const checkboxes = container.querySelectorAll('input[type="checkbox"][data-playlist-id]');
        checkboxes.forEach(cb => {
          const plId = cb.getAttribute('data-playlist-id');
          const pl = State.playlists.find(p => p.id === plId);
          if (pl) {
            const has = pl.videoIds.includes(videoId);
            if (cb.checked && !has) {
              pl.videoIds.push(videoId);
            } else if (!cb.checked && has) {
              pl.videoIds = pl.videoIds.filter(id => id !== videoId);
            }
          }
        });
        savePlaylists();
        showToast('Playlists updated successfully', 'success');
        return true;
      }
    });

    const container = document.getElementById('modal-container');
    const createBtn = container.querySelector('#btn-create-playlist-quick');
    const titleInput = container.querySelector('#new-playlist-title');

    createBtn.addEventListener('click', () => {
      const title = titleInput.value.trim();
      if (!title) {
        showToast('Please enter a playlist name', 'error');
        return;
      }
      const newPl = {
        id: generateId('pl'),
        title,
        description: '',
        createdAt: new Date().toISOString(),
        videoIds: [videoId]
      };
      State.playlists.push(newPl);
      savePlaylists();
      showToast(`Created "${title}" & added video`, 'success');
      titleInput.value = '';
      container.querySelector('#playlist-checklist-wrap').innerHTML = renderPlaylistsChecklist();
    });
  }

  // Modal to add any video directly to a specific playlist from the playlist detail page
  function openAddVideosToPlaylistModal(playlistId) {
    const pl = State.playlists.find(p => p.id === playlistId);
    if (!pl) return;

    const renderList = (searchQ = '') => {
      let vids = State.videos.filter(v => v.status === 'published');
      if (searchQ) {
        const q = searchQ.toLowerCase();
        vids = vids.filter(v => v.title.toLowerCase().includes(q) || v.category.toLowerCase().includes(q));
      }

      if (vids.length === 0) {
        return '<p style="padding:16px; text-align:center; color:var(--text-muted); font-size:13px;">No matching videos found</p>';
      }

      return vids.map(v => {
        const inPlaylist = pl.videoIds.includes(v.id);
        return `
          <div style="display:flex; align-items:center; justify-content:space-between; padding:8px 12px; background:var(--bg-secondary); border:1px solid var(--border); border-radius:var(--radius-sm); gap:12px;">
            <div style="display:flex; align-items:center; gap:10px; min-width:0; flex:1;">
              <img src="${escapeHtml(v.thumbnail)}" style="width:64px; aspect-ratio:16/9; object-fit:cover; border-radius:4px;">
              <div style="min-width:0;">
                <div style="font-weight:600; font-size:13px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${escapeHtml(v.title)}</div>
                <div style="font-size:11px; color:var(--text-muted);">${escapeHtml(v.category)} • ${v.duration || '0:00'}</div>
              </div>
            </div>
            <button type="button" class="action-pill-btn btn-toggle-playlist-vid ${inPlaylist ? 'active' : ''}" data-vid="${v.id}" style="padding:4px 12px; font-size:12px; white-space:nowrap;">
              ${inPlaylist ? '✓ Added' : '+ Add'}
            </button>
          </div>
        `;
      }).join('');
    };

    const bodyHtml = `
      <div style="margin-bottom:12px;">
        <input type="text" id="filter-add-videos-input" placeholder="Search videos to add..." style="width:100%;">
      </div>
      <div id="add-videos-list-wrap" style="display:flex; flex-direction:column; gap:8px; max-height:300px; overflow-y:auto; padding:2px;">
        ${renderList()}
      </div>
    `;

    showModal({
      title: `Add Videos to "${pl.title}"`,
      bodyHtml,
      confirmText: 'Done',
      confirmClass: 'btn-primary',
      onConfirm: () => {
        savePlaylists();
        renderPlaylistDetailPage(playlistId);
        return true;
      }
    });

    const container = document.getElementById('modal-container');
    const searchInput = container.querySelector('#filter-add-videos-input');
    const listWrap = container.querySelector('#add-videos-list-wrap');

    searchInput.addEventListener('input', () => {
      listWrap.innerHTML = renderList(searchInput.value.trim());
    });

    listWrap.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-toggle-playlist-vid');
      if (!btn) return;
      const vidId = btn.getAttribute('data-vid');
      const idx = pl.videoIds.indexOf(vidId);
      if (idx >= 0) {
        pl.videoIds.splice(idx, 1);
        btn.classList.remove('active');
        btn.textContent = '+ Add';
        showToast('Removed from playlist', 'info');
      } else {
        pl.videoIds.push(vidId);
        btn.classList.add('active');
        btn.textContent = '✓ Added';
        showToast('Added to playlist', 'success');
      }
      savePlaylists();
    });
  }

  /* ==========================================================================
     8. THEME TOGGLE & MANAGEMENT
     ========================================================================== */

  function applyTheme(themeName) {
    const isLight = themeName === 'light';
    document.body.classList.toggle('theme-light', isLight);
    document.body.classList.toggle('theme-dark', !isLight);
    State.prefs.theme = isLight ? 'light' : 'dark';
    savePrefs();

    const iconEl = document.getElementById('theme-icon');
    const btnEl = document.getElementById('theme-toggle-btn');
    if (iconEl && btnEl) {
      if (isLight) {
        // Moon icon for dark switch
        iconEl.innerHTML = '<path d="M12.3 2a10 10 0 0 0 9.7 13.5A10 10 0 1 1 12.3 2z"/>';
        btnEl.title = 'Switch to Dark Mode';
      } else {
        // Sun icon for light switch
        iconEl.innerHTML = '<path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0s-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06c.39-.39.39-1.03 0-1.41s-1.03-.39-1.41 0z"/>';
        btnEl.title = 'Switch to Light Mode';
      }
    }
  }

  /* ==========================================================================
     9. COMPONENTS: VIDEO CARD RENDERERS
     ========================================================================== */

  function renderVideoCard(video, options = {}) {
    if (!video) return '';
    const pos = State.positions[video.id] || 0;
    const progressPercent = video.durationSec > 0 ? Math.min(100, (pos / video.durationSec) * 100) : 0;
    const fav = isFavorite(video.id);
    const showProgress = options.showProgress && pos > 5;

    return `
      <div class="video-card" data-video-id="${video.id}">
        <div class="video-card-thumb" onclick="location.hash='#/watch?id=${video.id}'">
          <img src="${escapeHtml(video.thumbnail)}" alt="${escapeHtml(video.title)}" loading="lazy" onerror="this.src='data:image/svg+xml,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'320\\' height=\\'180\\' fill=\\'%23222\\'><rect width=\\'100%\\' height=\\'100%\\'/><text x=\\'50%\\' y=\\'50%\\' fill=\\'%23666\\' font-size=\\'16\\' text-anchor=\\'middle\\'>VELPLAY</text></svg>'">
          <span class="card-duration">${video.duration || '0:00'}</span>
          <div class="card-play-overlay">
            <div class="card-play-circle">
              <svg viewBox="0 0 24 24" class="svg-icon"><polygon points="8,5 19,12 8,19"/></svg>
            </div>
          </div>
          ${showProgress ? `<div class="card-progress-bar"><div class="card-progress-fill" style="width:${progressPercent}%;"></div></div>` : ''}
        </div>

        <div class="video-card-details">
          <div class="card-channel-avatar">
            ${escapeHtml(video.category ? video.category.charAt(0) : 'V')}
          </div>
          <div class="card-info-content">
            <h4 class="card-title" title="${escapeHtml(video.title)}" onclick="location.hash='#/watch?id=${video.id}'">
              ${escapeHtml(video.title)}
            </h4>
            <div class="card-meta">
              <span class="card-category-badge">${escapeHtml(video.category || 'General')}</span>
              <span>•</span>
              <span class="card-views">${formatViews(video.views)}</span>
              <span>•</span>
              <span class="card-date">${formatRelativeDate(video.uploadDate)}</span>
            </div>
          </div>

          <div class="relative-container">
            <button class="card-more-btn icon-btn" title="More options" data-card-actions="${video.id}">
              <svg viewBox="0 0 24 24" class="svg-icon"><path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/></svg>
            </button>
            <div class="card-dropdown-menu hidden" id="dropdown-${video.id}">
              <button class="dropdown-item btn-toggle-fav" data-id="${video.id}">
                <svg viewBox="0 0 24 24" class="svg-icon"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                ${fav ? 'Remove Favorite' : 'Save to Favorites'}
              </button>
              <button class="dropdown-item btn-save-playlist" data-id="${video.id}">
                <svg viewBox="0 0 24 24" class="svg-icon"><path d="M14 10H2v2h12v-2zm0-4H2v2h12V6zm4 8v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM2 16h8v-2H2v2z"/></svg>
                Save to Playlist
              </button>
              <button class="dropdown-item btn-copy-link" data-id="${video.id}">
                <svg viewBox="0 0 24 24" class="svg-icon"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>
                Copy Link
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function renderCompactVideoCard(video) {
    if (!video) return '';
    return `
      <div class="compact-video-card" onclick="location.hash='#/watch?id=${video.id}'" title="${escapeHtml(video.title)}">
        <div class="compact-thumb-wrap">
          <img src="${escapeHtml(video.thumbnail)}" alt="${escapeHtml(video.title)}" loading="lazy" onerror="this.src='data:image/svg+xml,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'140\\' height=\\'80\\' fill=\\'%23222\\'><rect width=\\'100%\\' height=\\'100%\\'/></svg>'">
          <span class="card-duration">${video.duration || '0:00'}</span>
        </div>
        <div class="compact-info">
          <h5 class="compact-title">${escapeHtml(video.title)}</h5>
          <div class="compact-meta">${escapeHtml(video.category)}</div>
          <div class="compact-meta">${formatViews(video.views)} • ${formatRelativeDate(video.uploadDate)}</div>
        </div>
      </div>
    `;
  }

  /* ==========================================================================
     10. PAGE VIEW: HOME PAGE
     ========================================================================== */

  function renderHomePage(activeCategory = 'All') {
    const main = document.getElementById('main-content');
    if (!main) return;

    const published = State.videos.filter(v => v.status === 'published');
    const filteredVideos = activeCategory === 'All' 
      ? published 
      : published.filter(v => v.category.toLowerCase() === activeCategory.toLowerCase());

    const continueWatching = [];
    Object.keys(State.positions).forEach(vidId => {
      const pos = State.positions[vidId];
      const vid = getVideoById(vidId);
      if (vid && pos > 5 && pos < (vid.durationSec || 600) * 0.92) {
        continueWatching.push({ ...vid, currentPos: pos });
      }
    });

    const recentlyAdded = [...filteredVideos].sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate)).slice(0, 8);
    const mostPopular = [...filteredVideos].sort((a, b) => b.views - a.views).slice(0, 8);
    const recommended = [...filteredVideos].sort(() => 0.5 - Math.random()).slice(0, 8);
    const favoriteVideos = State.favorites.map(id => getVideoById(id)).filter(v => v && v.status === 'published');

    // Build Categories Chips Bar dynamically from State.categories
    const chipsHtml = State.categories.map(cat => `
      <button class="category-chip ${cat === activeCategory ? 'active' : ''}" data-category="${escapeHtml(cat)}">
        ${escapeHtml(cat)}
      </button>
    `).join('');

    main.innerHTML = `
      <div class="category-chips-bar" id="category-chips-bar">
        ${chipsHtml}
      </div>

      <!-- CONTINUE WATCHING -->
      ${continueWatching.length > 0 ? `
        <section class="home-section">
          <div class="section-header">
            <h3 class="section-title">
              <svg viewBox="0 0 24 24" class="svg-icon section-icon" style="fill:#3ea6ff;"><path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/></svg>
              Continue Watching
            </h3>
            <a href="#/history" class="section-link">View All History →</a>
          </div>
          <div class="horizontal-video-row">
            ${continueWatching.map(v => renderVideoCard(v, { showProgress: true })).join('')}
          </div>
        </section>
      ` : ''}

      <!-- RECENTLY ADDED -->
      <section class="home-section">
        <div class="section-header">
          <h3 class="section-title">
            <svg viewBox="0 0 24 24" class="svg-icon section-icon" style="fill:var(--accent);"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
            Recently Added
          </h3>
          <span class="badge-count" style="position:static;">${recentlyAdded.length}</span>
        </div>
        <div class="video-grid">
          ${recentlyAdded.map(v => renderVideoCard(v)).join('')}
        </div>
      </section>

      <!-- MOST POPULAR -->
      <section class="home-section">
        <div class="section-header">
          <h3 class="section-title">
            <svg viewBox="0 0 24 24" class="svg-icon section-icon" style="fill:#ff9100;"><path d="M19.48 12.35c-1.57-.56-2.54-1.1-2.94-1.63-.4-.53-.6-1.18-.6-1.95 0-1.07.41-2.03 1.23-2.88-1.57.48-2.73 1.34-3.48 2.58-.75 1.24-1.12 2.62-1.12 4.14 0 1.25.32 2.37.96 3.36.64.99 1.52 1.74 2.64 2.25-1.21.43-2.3.43-3.27 0-1.84-.81-2.76-2.31-2.76-4.5 0-1.11.23-2.19.69-3.24.46-1.05 1.1-1.95 1.92-2.7-1.13.39-2.06 1.05-2.79 1.98-.73.93-1.1 2.05-1.1 3.36 0 2.05.74 3.73 2.22 5.04 1.48 1.31 3.31 1.97 5.49 1.97 2.15 0 3.96-.65 5.43-1.95 1.47-1.3 2.21-2.94 2.21-4.92 0-1.13-.26-2.11-.79-2.95-.53-.84-1.27-1.47-2.22-1.89l-.69.2z"/></svg>
            Most Popular
          </h3>
        </div>
        <div class="video-grid">
          ${mostPopular.map(v => renderVideoCard(v)).join('')}
        </div>
      </section>

      <!-- RECOMMENDED VIDEOS -->
      <section class="home-section">
        <div class="section-header">
          <h3 class="section-title">
            <svg viewBox="0 0 24 24" class="svg-icon section-icon" style="fill:#00e676;"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            Recommended for You
          </h3>
        </div>
        <div class="video-grid">
          ${recommended.map(v => renderVideoCard(v)).join('')}
        </div>
      </section>

      <!-- YOUR FAVORITES -->
      ${favoriteVideos.length > 0 ? `
        <section class="home-section">
          <div class="section-header">
            <h3 class="section-title">
              <svg viewBox="0 0 24 24" class="svg-icon section-icon" style="fill:#ff1744;"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
              Your Favorites
            </h3>
            <a href="#/favorites" class="section-link">View All (${favoriteVideos.length}) →</a>
          </div>
          <div class="horizontal-video-row">
            ${favoriteVideos.map(v => renderVideoCard(v)).join('')}
          </div>
        </section>
      ` : ''}
    `;

    const chipsBar = document.getElementById('category-chips-bar');
    if (chipsBar) {
      chipsBar.addEventListener('click', (e) => {
        const chip = e.target.closest('.category-chip');
        if (!chip) return;
        const cat = chip.getAttribute('data-category');
        renderHomePage(cat);
      });
    }

    attachCardActionListeners();
  }

  /* ==========================================================================
     11. PAGE VIEW: WATCH PAGE & ADVANCED VIDEO PLAYER
     ========================================================================== */

  function renderWatchPage(videoId) {
    const main = document.getElementById('main-content');
    if (!main) return;

    const video = getVideoById(videoId) || State.videos[0];
    if (!video) {
      main.innerHTML = `<div class="empty-state"><h3>Video not found</h3><a href="#/home" class="btn-primary" style="margin-top:16px;">Back to Home</a></div>`;
      return;
    }

    const savedPos = State.positions[video.id] || 0;
    const fav = isFavorite(video.id);

    const upNextVideos = State.videos
      .filter(v => v.id !== video.id && v.status === 'published')
      .slice(0, 10);

    const isTheatre = State.prefs.theatre;

    main.innerHTML = `
      <div class="watch-container ${isTheatre ? 'theatre-mode' : ''}" id="watch-container">
        
        <div class="watch-primary-col">
          <div class="player-container" id="player-container" tabindex="0">
            <video 
              id="main-video" 
              class="player-video" 
              src="${escapeHtml(video.url)}" 
              playsinline 
              webkit-playsinline
              preload="metadata"
            ></video>

            <div class="player-top-overlay" id="player-top-overlay">
              <span class="player-top-title" id="player-top-title">${escapeHtml(video.title)}</span>
              <span class="card-category-badge">${escapeHtml(video.category)}</span>
            </div>

            <div class="center-play-indicator" id="center-play-indicator">
              <svg viewBox="0 0 24 24" class="svg-icon play-icon"><polygon points="8,5 19,12 8,19"/></svg>
            </div>

            <div class="player-spinner" id="player-spinner"></div>

            <div class="player-error-overlay" id="player-error-overlay">
              <svg viewBox="0 0 24 24" class="error-icon"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
              <div class="error-title">Playback Error</div>
              <div class="error-desc">The video could not be loaded or network error occurred. Click below to retry.</div>
              <button class="btn-primary" id="player-retry-btn">Retry Playback</button>
            </div>

            <div class="player-bottom-controls" id="player-bottom-controls">
              <div class="seek-bar-container" id="seek-bar-container">
                <div class="seek-bar-track" id="seek-bar-track">
                  <div class="seek-buffer-bar" id="seek-buffer-bar"></div>
                  <div class="seek-progress-bar" id="seek-progress-bar"></div>
                  <div class="seek-thumb" id="seek-thumb"></div>
                </div>
                <div class="seek-tooltip" id="seek-tooltip">0:00</div>
              </div>

              <div class="controls-row">
                <div class="controls-left">
                  <button class="player-btn" id="player-prev-btn" title="Previous Video">
                    <svg viewBox="0 0 24 24" class="svg-icon"><path d="M6 6h2v12H6zm3.5 6l8.5 6V6z"/></svg>
                  </button>

                  <button class="player-btn" id="player-play-btn" title="Play (Space)">
                    <svg viewBox="0 0 24 24" class="svg-icon play-icon"><polygon points="8,5 19,12 8,19"/></svg>
                  </button>

                  <button class="player-btn" id="player-next-btn" title="Next Video">
                    <svg viewBox="0 0 24 24" class="svg-icon"><path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z"/></svg>
                  </button>

                  <div class="volume-control-wrap" id="volume-wrap">
                    <button class="player-btn" id="player-mute-btn" title="Mute (M)">
                      <svg viewBox="0 0 24 24" class="svg-icon vol-high-icon"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
                    </button>
                    <div class="volume-slider-wrap" id="volume-slider-wrap">
                      <input type="range" class="volume-slider" id="volume-slider" min="0" max="1" step="0.05" value="${State.prefs.volume}">
                    </div>
                  </div>

                  <div class="time-display" id="time-display">
                    <span id="current-time">0:00</span> / <span id="total-duration">${video.duration || '0:00'}</span>
                  </div>
                </div>

                <div class="controls-right">
                  <div class="speed-menu-container">
                    <button class="player-btn" id="player-speed-btn" title="Playback Speed" style="font-size:13px; font-weight:700;">
                      <span id="speed-label">${State.prefs.playbackRate}x</span>
                    </button>
                    <div class="speed-dropdown" id="speed-dropdown">
                      <button class="speed-option ${State.prefs.playbackRate === 0.25 ? 'active' : ''}" data-speed="0.25">0.25x</button>
                      <button class="speed-option ${State.prefs.playbackRate === 0.5 ? 'active' : ''}" data-speed="0.5">0.5x</button>
                      <button class="speed-option ${State.prefs.playbackRate === 0.75 ? 'active' : ''}" data-speed="0.75">0.75x</button>
                      <button class="speed-option ${State.prefs.playbackRate === 1 ? 'active' : ''}" data-speed="1">Normal (1x)</button>
                      <button class="speed-option ${State.prefs.playbackRate === 1.25 ? 'active' : ''}" data-speed="1.25">1.25x</button>
                      <button class="speed-option ${State.prefs.playbackRate === 1.5 ? 'active' : ''}" data-speed="1.5">1.5x</button>
                      <button class="speed-option ${State.prefs.playbackRate === 1.75 ? 'active' : ''}" data-speed="1.75">1.75x</button>
                      <button class="speed-option ${State.prefs.playbackRate === 2 ? 'active' : ''}" data-speed="2">2x</button>
                    </div>
                  </div>

                  <button class="player-btn" id="player-theatre-btn" title="Theatre Mode (T)">
                    <svg viewBox="0 0 24 24" class="svg-icon"><path d="M19 6H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 10H5V8h14v8z"/></svg>
                  </button>

                  <button class="player-btn" id="player-fullscreen-btn" title="Fullscreen (F)">
                    <svg viewBox="0 0 24 24" class="svg-icon"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div class="watch-video-info">
            <h1 class="watch-video-title">${escapeHtml(video.title)}</h1>

            <div class="watch-actions-bar">
              <div class="watch-meta-group">
                <span class="card-channel-avatar" style="width:36px; height:36px;">${video.category.charAt(0)}</span>
                <div>
                  <div style="font-weight:700; color:var(--text-primary);">VELPLAY Studios</div>
                  <div style="font-size:12px; color:var(--text-secondary);">${formatViews(video.views)} • ${formatRelativeDate(video.uploadDate)}</div>
                </div>
              </div>

              <div class="watch-buttons-group">
                <button class="action-pill-btn ${fav ? 'active' : ''}" id="btn-watch-favorite">
                  <svg viewBox="0 0 24 24" class="svg-icon"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                  <span id="fav-btn-label">${fav ? 'Favorited' : 'Favorite'}</span>
                </button>

                <button class="action-pill-btn" id="btn-watch-playlist">
                  <svg viewBox="0 0 24 24" class="svg-icon"><path d="M14 10H2v2h12v-2zm0-4H2v2h12V6zm4 8v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM2 16h8v-2H2v2z"/></svg>
                  <span>Save to Playlist</span>
                </button>

                <button class="action-pill-btn" id="btn-watch-share">
                  <svg viewBox="0 0 24 24" class="svg-icon"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/></svg>
                  <span>Share</span>
                </button>
              </div>
            </div>

            <div class="watch-description-box" id="watch-desc-box">
              <div class="desc-header-meta">
                <span>${formatViews(video.views)}</span>
                <span>•</span>
                <span>Published ${new Date(video.uploadDate).toLocaleDateString()}</span>
                <span>•</span>
                <span class="card-category-badge">${escapeHtml(video.category)}</span>
              </div>
              <div class="desc-content collapsed" id="desc-content-text">
                ${escapeHtml(video.description || 'No description provided.')}
              </div>
              <div class="desc-toggle-btn" id="desc-toggle-btn">Show more</div>
            </div>
          </div>
        </div>

        <div class="watch-secondary-col">
          <div class="up-next-header">
            <h3>Up Next</h3>
            <div class="autoplay-toggle-wrap">
              <span>Autoplay</span>
              <label class="switch">
                <input type="checkbox" id="autoplay-checkbox" ${State.prefs.autoplay ? 'checked' : ''}>
                <span class="slider"></span>
              </label>
            </div>
          </div>

          <div class="up-next-list" id="up-next-list">
            ${upNextVideos.map(v => renderCompactVideoCard(v)).join('')}
          </div>
        </div>

      </div>
    `;

    initVideoPlayer(video, savedPos, upNextVideos);

    const favBtn = document.getElementById('btn-watch-favorite');
    if (favBtn) {
      favBtn.addEventListener('click', () => {
        const added = toggleFavorite(video.id);
        favBtn.classList.toggle('active', added);
        document.getElementById('fav-btn-label').textContent = added ? 'Favorited' : 'Favorite';
      });
    }

    const plBtn = document.getElementById('btn-watch-playlist');
    if (plBtn) {
      plBtn.addEventListener('click', () => openAddToPlaylistModal(video.id));
    }

    const shareBtn = document.getElementById('btn-watch-share');
    if (shareBtn) {
      shareBtn.addEventListener('click', () => {
        const url = window.location.href;
        navigator.clipboard.writeText(url).then(() => {
          showToast('Video link copied to clipboard!', 'success');
        }).catch(() => {
          showToast('Link: ' + url, 'info');
        });
      });
    }

    const descBox = document.getElementById('watch-desc-box');
    const descText = document.getElementById('desc-content-text');
    const descToggle = document.getElementById('desc-toggle-btn');
    if (descBox && descText && descToggle) {
      descBox.addEventListener('click', () => {
        const isCollapsed = descText.classList.toggle('collapsed');
        descToggle.textContent = isCollapsed ? 'Show more' : 'Show less';
      });
    }

    const autoCb = document.getElementById('autoplay-checkbox');
    if (autoCb) {
      autoCb.addEventListener('change', (e) => {
        State.prefs.autoplay = e.target.checked;
        savePrefs();
        showToast(e.target.checked ? 'Autoplay enabled' : 'Autoplay disabled', 'info');
      });
    }
  }

  /* ==========================================================================
     12. ADVANCED VIDEO PLAYER LOGIC (HTML5 Video Controls)
     ========================================================================== */

  function initVideoPlayer(videoData, initialPosition = 0, upNextList = []) {
    const container = document.getElementById('player-container');
    const video = document.getElementById('main-video');
    const playBtn = document.getElementById('player-play-btn');
    const prevBtn = document.getElementById('player-prev-btn');
    const nextBtn = document.getElementById('player-next-btn');
    const muteBtn = document.getElementById('player-mute-btn');
    const volSlider = document.getElementById('volume-slider');
    const seekBar = document.getElementById('seek-bar-container');
    const progress = document.getElementById('seek-progress-bar');
    const buffer = document.getElementById('seek-buffer-bar');
    const thumb = document.getElementById('seek-thumb');
    const tooltip = document.getElementById('seek-tooltip');
    const currentTimeEl = document.getElementById('current-time');
    const totalDurationEl = document.getElementById('total-duration');
    const speedBtn = document.getElementById('player-speed-btn');
    const speedLabel = document.getElementById('speed-label');
    const speedDropdown = document.getElementById('speed-dropdown');
    const theatreBtn = document.getElementById('player-theatre-btn');
    const fullscreenBtn = document.getElementById('player-fullscreen-btn');
    const spinner = document.getElementById('player-spinner');
    const errorOverlay = document.getElementById('player-error-overlay');
    const retryBtn = document.getElementById('player-retry-btn');
    const centerIndicator = document.getElementById('center-play-indicator');

    if (!container || !video) return;

    video.volume = State.prefs.volume;
    video.muted = State.prefs.muted;
    video.playbackRate = State.prefs.playbackRate;
    volSlider.value = video.muted ? 0 : video.volume;

    let isScrubbing = false;
    let controlsTimer = null;

    let resumed = false;
    video.addEventListener('loadedmetadata', () => {
      totalDurationEl.textContent = formatTime(video.duration);
      if (initialPosition > 0 && initialPosition < video.duration - 2 && !resumed) {
        resumed = true;
        video.currentTime = initialPosition;
        showToast(`Resumed from ${formatTime(initialPosition)}`, 'info');
      }
    });

    video.addEventListener('timeupdate', () => {
      if (!isScrubbing && video.duration) {
        const pct = (video.currentTime / video.duration) * 100;
        progress.style.width = `${pct}%`;
        thumb.style.left = `${pct}%`;
        currentTimeEl.textContent = formatTime(video.currentTime);
      }
    });

    video.addEventListener('progress', () => {
      if (video.buffered.length > 0 && video.duration) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const bufPct = (bufferedEnd / video.duration) * 100;
        buffer.style.width = `${bufPct}%`;
      }
    });

    function togglePlay() {
      if (video.paused || video.ended) {
        video.play().catch(e => console.warn('Play interrupted:', e));
      } else {
        video.pause();
      }
    }

    function triggerCenterIndicator(isPlay) {
      if (!centerIndicator) return;
      centerIndicator.innerHTML = isPlay 
        ? '<svg viewBox="0 0 24 24" class="svg-icon"><polygon points="8,5 19,12 8,19"/></svg>'
        : '<svg viewBox="0 0 24 24" class="svg-icon"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
      centerIndicator.classList.remove('animate');
      void centerIndicator.offsetWidth;
      centerIndicator.classList.add('animate');
      setTimeout(() => centerIndicator.classList.remove('animate'), 350);
    }

    video.addEventListener('play', () => {
      playBtn.innerHTML = '<svg viewBox="0 0 24 24" class="svg-icon pause-icon"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
      playBtn.title = 'Pause (Space)';
      triggerCenterIndicator(true);
      resetControlsTimer();
    });

    video.addEventListener('pause', () => {
      playBtn.innerHTML = '<svg viewBox="0 0 24 24" class="svg-icon play-icon"><polygon points="8,5 19,12 8,19"/></svg>';
      playBtn.title = 'Play (Space)';
      triggerCenterIndicator(false);
      showControls();
    });

    video.addEventListener('click', togglePlay);
    playBtn.addEventListener('click', togglePlay);

    video.addEventListener('waiting', () => spinner.classList.add('visible'));
    video.addEventListener('canplay', () => spinner.classList.remove('visible'));
    video.addEventListener('playing', () => spinner.classList.remove('visible'));

    video.addEventListener('error', () => {
      spinner.classList.remove('visible');
      errorOverlay.classList.add('visible');
    });

    retryBtn.addEventListener('click', () => {
      errorOverlay.classList.remove('visible');
      video.load();
      video.play().catch(e => console.warn('Retry failed:', e));
    });

    const positionInterval = setInterval(() => {
      if (!video.paused && video.duration > 0) {
        updateHistoryRecord(videoData.id, video.currentTime, video.duration);
      }
    }, 4000);

    const currentIndex = State.videos.findIndex(v => v.id === videoData.id);
    
    function playNextVideo() {
      const nextVid = upNextList[0] || State.videos[(currentIndex + 1) % State.videos.length];
      if (nextVid) {
        location.hash = `#/watch?id=${nextVid.id}`;
      }
    }
    function playPrevVideo() {
      const prevIdx = (currentIndex - 1 + State.videos.length) % State.videos.length;
      const prevVid = State.videos[prevIdx];
      if (prevVid) {
        location.hash = `#/watch?id=${prevVid.id}`;
      }
    }

    nextBtn.addEventListener('click', playNextVideo);
    prevBtn.addEventListener('click', playPrevVideo);

    video.addEventListener('ended', () => {
      updateHistoryRecord(videoData.id, video.duration, video.duration);
      if (State.prefs.autoplay) {
        showToast('Auto-playing next video in 3 seconds...', 'info');
        setTimeout(() => {
          playNextVideo();
        }, 3000);
      }
    });

    function seekToEvent(e) {
      const rect = seekBar.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clickPos = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      if (video.duration) {
        video.currentTime = clickPos * video.duration;
        const pct = clickPos * 100;
        progress.style.width = `${pct}%`;
        thumb.style.left = `${pct}%`;
        currentTimeEl.textContent = formatTime(video.currentTime);
      }
    }

    seekBar.addEventListener('mousedown', (e) => {
      isScrubbing = true;
      seekBar.classList.add('scrubbing');
      seekToEvent(e);
      window.addEventListener('mousemove', onSeekDrag);
      window.addEventListener('mouseup', onSeekUp);
    });

    function onSeekDrag(e) {
      if (isScrubbing) seekToEvent(e);
    }
    function onSeekUp() {
      if (isScrubbing) {
        isScrubbing = false;
        seekBar.classList.remove('scrubbing');
        window.removeEventListener('mousemove', onSeekDrag);
        window.removeEventListener('mouseup', onSeekUp);
      }
    }

    seekBar.addEventListener('touchstart', (e) => {
      isScrubbing = true;
      seekBar.classList.add('scrubbing');
      seekToEvent(e);
    }, { passive: true });

    seekBar.addEventListener('touchmove', (e) => {
      if (isScrubbing) seekToEvent(e);
    }, { passive: true });

    seekBar.addEventListener('touchend', () => {
      isScrubbing = false;
      seekBar.classList.remove('scrubbing');
    });

    seekBar.addEventListener('mousemove', (e) => {
      if (!video.duration) return;
      const rect = seekBar.getBoundingClientRect();
      const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const seekSec = pos * video.duration;
      tooltip.textContent = formatTime(seekSec);
      tooltip.style.left = `${pos * 100}%`;
    });

    function updateVolumeUI() {
      const vol = video.muted ? 0 : video.volume;
      volSlider.value = vol;
      State.prefs.volume = video.volume;
      State.prefs.muted = video.muted;
      savePrefs();

      if (video.muted || vol === 0) {
        muteBtn.innerHTML = '<svg viewBox="0 0 24 24" class="svg-icon"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/></svg>';
      } else if (vol < 0.5) {
        muteBtn.innerHTML = '<svg viewBox="0 0 24 24" class="svg-icon"><path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/></svg>';
      } else {
        muteBtn.innerHTML = '<svg viewBox="0 0 24 24" class="svg-icon"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>';
      }
    }

    muteBtn.addEventListener('click', () => {
      video.muted = !video.muted;
      updateVolumeUI();
    });

    volSlider.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      video.volume = val;
      video.muted = (val === 0);
      updateVolumeUI();
    });

    speedBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      speedDropdown.classList.toggle('visible');
    });

    speedDropdown.addEventListener('click', (e) => {
      const opt = e.target.closest('.speed-option');
      if (!opt) return;
      const rate = parseFloat(opt.getAttribute('data-speed'));
      video.playbackRate = rate;
      State.prefs.playbackRate = rate;
      savePrefs();
      speedLabel.textContent = rate === 1 ? '1x' : `${rate}x`;
      speedDropdown.querySelectorAll('.speed-option').forEach(el => el.classList.remove('active'));
      opt.classList.add('active');
      speedDropdown.classList.remove('visible');
      showToast(`Speed set to ${rate}x`, 'info');
    });

    document.addEventListener('click', () => {
      if (speedDropdown) speedDropdown.classList.remove('visible');
    });

    theatreBtn.addEventListener('click', () => {
      const watchContainer = document.getElementById('watch-container');
      const isTheatre = watchContainer.classList.toggle('theatre-mode');
      State.prefs.theatre = isTheatre;
      savePrefs();
      showToast(isTheatre ? 'Theatre mode on' : 'Theatre mode off', 'info');
    });

    function toggleFullscreen() {
      if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        if (container.requestFullscreen) {
          container.requestFullscreen();
        } else if (container.webkitRequestFullscreen) {
          container.webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        }
      }
    }

    fullscreenBtn.addEventListener('click', toggleFullscreen);
    video.addEventListener('dblclick', toggleFullscreen);

    function showControls() {
      container.classList.remove('controls-hidden');
    }
    function hideControls() {
      if (!video.paused && !isScrubbing && !speedDropdown.classList.contains('visible')) {
        container.classList.add('controls-hidden');
      }
    }
    function resetControlsTimer() {
      showControls();
      clearTimeout(controlsTimer);
      controlsTimer = setTimeout(hideControls, 3000);
    }

    container.addEventListener('mousemove', resetControlsTimer);
    container.addEventListener('touchstart', resetControlsTimer, { passive: true });
    container.addEventListener('mouseleave', () => {
      if (!video.paused) hideControls();
    });

    function onKeyDown(e) {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName)) return;

      switch (e.key) {
        case ' ':
        case 'k':
        case 'K':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
        case 'j':
        case 'J':
          e.preventDefault();
          video.currentTime = Math.max(0, video.currentTime - 10);
          showToast('-10s', 'info');
          break;
        case 'ArrowRight':
        case 'l':
        case 'L':
          e.preventDefault();
          video.currentTime = Math.min(video.duration, video.currentTime + 10);
          showToast('+10s', 'info');
          break;
        case 'ArrowUp':
          e.preventDefault();
          video.volume = Math.min(1, video.volume + 0.1);
          video.muted = false;
          updateVolumeUI();
          showToast(`Volume: ${Math.round(video.volume * 100)}%`, 'info');
          break;
        case 'ArrowDown':
          e.preventDefault();
          video.volume = Math.max(0, video.volume - 0.1);
          updateVolumeUI();
          showToast(`Volume: ${Math.round(video.volume * 100)}%`, 'info');
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          video.muted = !video.muted;
          updateVolumeUI();
          showToast(video.muted ? 'Muted' : 'Unmuted', 'info');
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 't':
        case 'T':
          e.preventDefault();
          theatreBtn.click();
          break;
      }
    }

    window.addEventListener('keydown', onKeyDown);

    State.activePlayer = {
      destroy: () => {
        clearInterval(positionInterval);
        clearTimeout(controlsTimer);
        window.removeEventListener('keydown', onKeyDown);
        window.removeEventListener('mousemove', onSeekDrag);
        window.removeEventListener('mouseup', onSeekUp);
        video.pause();
        video.src = '';
      }
    };
  }

  /* ==========================================================================
     13. PAGE VIEW: HISTORY PAGE
     ========================================================================== */

  function renderHistoryPage() {
    const main = document.getElementById('main-content');
    if (!main) return;

    const historyItems = State.history
      .map(h => ({
        ...h,
        video: getVideoById(h.videoId)
      }))
      .filter(h => h.video);

    main.innerHTML = `
      <div class="history-view-container">
        <div class="page-header-bar">
          <div class="page-title-wrap">
            <h2>Watch History</h2>
            <p>${historyItems.length} videos watched</p>
          </div>
          ${historyItems.length > 0 ? `
            <button class="btn-danger" id="btn-clear-history">
              <svg viewBox="0 0 24 24" class="svg-icon"><path d="M15 16h4v2h-4zm0-8h7v2h-7zm0 4h6v2h-6zM3 18c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V8H3v10zM14 5h-3l-1-1H6L5 5H2v2h12z"/></svg>
              Clear All History
            </button>
          ` : ''}
        </div>

        ${historyItems.length === 0 ? `
          <div class="empty-state">
            <svg viewBox="0 0 24 24" class="empty-icon"><path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/></svg>
            <h3 class="empty-title">Your Watch History is Empty</h3>
            <p class="empty-desc">Videos you watch on VELPLAY will automatically be tracked here so you can pick up where you left off.</p>
            <a href="#/home" class="btn-primary">Explore Videos</a>
          </div>
        ` : `
          <div class="history-list" id="history-items-list">
            ${historyItems.map(item => `
              <div class="history-item-row" data-history-id="${item.videoId}">
                <div class="history-thumb-wrap" onclick="location.hash='#/watch?id=${item.videoId}'">
                  <img src="${escapeHtml(item.video.thumbnail)}" alt="${escapeHtml(item.video.title)}" loading="lazy">
                  <span class="card-duration">${item.video.duration || '0:00'}</span>
                  <div class="card-progress-bar">
                    <div class="card-progress-fill" style="width:${item.percent}%;"></div>
                  </div>
                </div>

                <div class="history-info-wrap">
                  <h4 class="history-title" onclick="location.hash='#/watch?id=${item.videoId}'">${escapeHtml(item.video.title)}</h4>
                  <div class="history-meta-sub">
                    <span class="card-category-badge">${escapeHtml(item.video.category)}</span>
                    <span>•</span>
                    <span>${formatViews(item.video.views)}</span>
                  </div>
                  <div class="history-time-watched">
                    Watched ${formatTime(item.position)} of ${formatTime(item.duration)} (${item.percent}%) • ${formatRelativeDate(item.timestamp)}
                  </div>
                </div>

                <div class="history-actions-wrap">
                  <button class="btn-primary" onclick="location.hash='#/watch?id=${item.videoId}'" style="padding:6px 14px; font-size:13px;">
                    Resume
                  </button>
                  <button class="icon-btn btn-remove-history" data-id="${item.videoId}" title="Remove from history">
                    <svg viewBox="0 0 24 24" class="svg-icon"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        `}
      </div>
    `;

    const clearBtn = document.getElementById('btn-clear-history');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        showModal({
          title: 'Clear Watch History?',
          bodyHtml: '<p style="font-size:14px; color:var(--text-secondary);">This will remove all videos from your watch history and reset all saved resume points. This action cannot be undone.</p>',
          confirmText: 'Clear History',
          confirmClass: 'btn-danger',
          onConfirm: () => {
            clearAllHistory();
            renderHistoryPage();
          }
        });
      });
    }

    const list = document.getElementById('history-items-list');
    if (list) {
      list.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-remove-history');
        if (!btn) return;
        const id = btn.getAttribute('data-id');
        removeHistoryItem(id);
        const row = list.querySelector(`[data-history-id="${id}"]`);
        if (row) row.remove();
        if (list.children.length === 0) renderHistoryPage();
      });
    }
  }

  /* ==========================================================================
     14. PAGE VIEW: FAVORITES PAGE
     ========================================================================== */

  function renderFavoritesPage() {
    const main = document.getElementById('main-content');
    if (!main) return;

    const favoriteVideos = State.favorites
      .map(id => getVideoById(id))
      .filter(v => v);

    main.innerHTML = `
      <div class="favorites-view-container">
        <div class="page-header-bar">
          <div class="page-title-wrap">
            <h2>Your Favorites</h2>
            <p>${favoriteVideos.length} favorite videos saved</p>
          </div>
        </div>

        ${favoriteVideos.length === 0 ? `
          <div class="empty-state">
            <svg viewBox="0 0 24 24" class="empty-icon" style="fill:#ff1744;"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
            <h3 class="empty-title">No Favorites Yet</h3>
            <p class="empty-desc">Click the heart or "Favorite" button on any video to bookmark it here for quick access.</p>
            <a href="#/home" class="btn-primary">Browse Videos</a>
          </div>
        ` : `
          <div class="video-grid">
            ${favoriteVideos.map(v => renderVideoCard(v)).join('')}
          </div>
        `}
      </div>
    `;

    attachCardActionListeners();
  }

  /* ==========================================================================
     15. PAGE VIEW: PLAYLISTS & PLAYLIST DETAIL
     ========================================================================== */

  function renderPlaylistsPage() {
    const main = document.getElementById('main-content');
    if (!main) return;

    main.innerHTML = `
      <div class="favorites-view-container">
        <div class="page-header-bar">
          <div class="page-title-wrap">
            <h2>Your Playlists</h2>
            <p>${State.playlists.length} playlists created</p>
          </div>
          <button class="btn-primary" id="btn-create-playlist-main">
            <svg viewBox="0 0 24 24" class="svg-icon"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
            New Playlist
          </button>
        </div>

        ${State.playlists.length === 0 ? `
          <div class="empty-state">
            <svg viewBox="0 0 24 24" class="empty-icon"><path d="M4 10h12v2H4zm0-4h12v2H4zm0 8h8v2H4zm10 0v6l5-3z"/></svg>
            <h3 class="empty-title">No Playlists Created</h3>
            <p class="empty-desc">Organize your favorite videos into custom playlists for non-stop streaming.</p>
            <button class="btn-primary" id="btn-create-playlist-empty">Create First Playlist</button>
          </div>
        ` : `
          <div class="playlists-grid">
            ${State.playlists.map(pl => {
              const firstVid = pl.videoIds.length > 0 ? getVideoById(pl.videoIds[0]) : null;
              const thumb = firstVid ? firstVid.thumbnail : 'data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'300\' height=\'180\' fill=\'%23222\'><rect width=\'100%\' height=\'100%\'/></svg>';
              return `
                <div class="playlist-card" onclick="location.hash='#/playlist?id=${pl.id}'">
                  <div class="playlist-thumb-stack">
                    <img src="${escapeHtml(thumb)}" alt="${escapeHtml(pl.title)}" loading="lazy">
                    <div class="playlist-overlay-count">
                      <svg viewBox="0 0 24 24" class="svg-icon" style="width:24px; height:24px;"><path d="M4 10h12v2H4zm0-4h12v2H4zm0 8h8v2H4zm10 0v6l5-3z"/></svg>
                      <span>${pl.videoIds.length} videos</span>
                    </div>
                  </div>
                  <div class="playlist-card-details">
                    <h4 class="playlist-card-title">${escapeHtml(pl.title)}</h4>
                    <div class="playlist-card-meta">${escapeHtml(pl.description || 'Custom playlist')}</div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `}
      </div>
    `;

    const onCreate = () => {
      showModal({
        title: 'Create Playlist',
        bodyHtml: `
          <div class="form-group">
            <label>Playlist Title *</label>
            <input type="text" id="modal-pl-title" placeholder="e.g. Best Sci-Fi Clips">
          </div>
          <div class="form-group" style="margin-top:12px;">
            <label>Description</label>
            <textarea id="modal-pl-desc" rows="3" placeholder="What is this playlist about?"></textarea>
          </div>
        `,
        confirmText: 'Create Playlist',
        onConfirm: (container) => {
          const title = container.querySelector('#modal-pl-title').value.trim();
          const desc = container.querySelector('#modal-pl-desc').value.trim();
          if (!title) {
            showToast('Please enter a playlist title', 'error');
            return false;
          }
          State.playlists.push({
            id: generateId('pl'),
            title,
            description: desc,
            createdAt: new Date().toISOString(),
            videoIds: []
          });
          savePlaylists();
          showToast(`Playlist "${title}" created!`, 'success');
          renderPlaylistsPage();
          return true;
        }
      });
    };

    const mainBtn = document.getElementById('btn-create-playlist-main');
    if (mainBtn) mainBtn.addEventListener('click', onCreate);
    const emptyBtn = document.getElementById('btn-create-playlist-empty');
    if (emptyBtn) emptyBtn.addEventListener('click', onCreate);
  }

  function renderPlaylistDetailPage(playlistId) {
    const main = document.getElementById('main-content');
    if (!main) return;

    const pl = State.playlists.find(p => p.id === playlistId);
    if (!pl) {
      main.innerHTML = `<div class="empty-state"><h3>Playlist not found</h3><a href="#/playlists" class="btn-primary" style="margin-top:16px;">Back to Playlists</a></div>`;
      return;
    }

    const videos = pl.videoIds.map(id => getVideoById(id)).filter(v => v);
    const bannerThumb = videos.length > 0 ? videos[0].thumbnail : '';

    main.innerHTML = `
      <div class="playlist-detail-layout">
        
        <div class="playlist-sidebar-card">
          <div class="playlist-banner-thumb">
            <img src="${escapeHtml(bannerThumb || 'data:image/svg+xml,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'300\' height=\'180\' fill=\'%23222\'><rect width=\'100%\' height=\'100%\'/></svg>')}" alt="${escapeHtml(pl.title)}">
          </div>
          <h2 class="playlist-heading-title">${escapeHtml(pl.title)}</h2>
          <p class="playlist-heading-desc">${escapeHtml(pl.description || 'No description provided.')}</p>
          <div class="playlist-stats-text">${videos.length} videos • Created ${new Date(pl.createdAt).toLocaleDateString()}</div>

          <div class="playlist-actions-row">
            ${videos.length > 0 ? `
              <button class="btn-primary" id="btn-play-all-playlist" style="width:100%; justify-content:center;">
                <svg viewBox="0 0 24 24" class="svg-icon"><polygon points="8,5 19,12 8,19"/></svg>
                Play All
              </button>
            ` : ''}

            <button class="btn-primary" id="btn-add-videos-to-pl" style="width:100%; justify-content:center; background:#2e7d32;">
              <svg viewBox="0 0 24 24" class="svg-icon"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
              Add Videos
            </button>

            <button class="btn-secondary" id="btn-rename-playlist" style="width:100%; justify-content:center;">
              <svg viewBox="0 0 24 24" class="svg-icon"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
              Rename Playlist
            </button>

            <button class="btn-danger" id="btn-delete-playlist" style="width:100%; justify-content:center;">
              <svg viewBox="0 0 24 24" class="svg-icon"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
              Delete Playlist
            </button>
          </div>
        </div>

        <div class="playlist-videos-list" id="playlist-videos-list">
          ${videos.length === 0 ? `
            <div class="empty-state">
              <svg viewBox="0 0 24 24" class="empty-icon"><path d="M4 10h12v2H4zm0-4h12v2H4zm0 8h8v2H4zm10 0v6l5-3z"/></svg>
              <h3 class="empty-title">This Playlist is Empty</h3>
              <p class="empty-desc">Click "Add Videos" to select videos from your library.</p>
              <button class="btn-primary" id="btn-empty-add-vids">Add Videos Now</button>
            </div>
          ` : `
            ${videos.map((v, index) => `
              <div class="playlist-video-item" data-index="${index}" data-video-id="${v.id}">
                <span class="playlist-item-index">${index + 1}</span>

                <div class="reorder-btns-col">
                  <button class="reorder-btn btn-reorder-up" data-index="${index}" title="Move up" ${index === 0 ? 'disabled style="opacity:0.3;"' : ''}>
                    <svg viewBox="0 0 24 24" class="svg-icon"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/></svg>
                  </button>
                  <button class="reorder-btn btn-reorder-down" data-index="${index}" title="Move down" ${index === videos.length - 1 ? 'disabled style="opacity:0.3;"' : ''}>
                    <svg viewBox="0 0 24 24" class="svg-icon"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/></svg>
                  </button>
                </div>

                <div class="compact-thumb-wrap" style="width:130px; cursor:pointer;" onclick="location.hash='#/watch?id=${v.id}'">
                  <img src="${escapeHtml(v.thumbnail)}" alt="${escapeHtml(v.title)}" loading="lazy">
                  <span class="card-duration">${v.duration || '0:00'}</span>
                </div>

                <div class="compact-info" style="cursor:pointer;" onclick="location.hash='#/watch?id=${v.id}'">
                  <h4 class="compact-title">${escapeHtml(v.title)}</h4>
                  <div class="compact-meta">${escapeHtml(v.category)} • ${formatViews(v.views)}</div>
                </div>

                <button class="icon-btn btn-remove-from-playlist" data-index="${index}" data-video-id="${v.id}" title="Remove from playlist">
                  <svg viewBox="0 0 24 24" class="svg-icon"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                </button>
              </div>
            `).join('')}
          `}
        </div>

      </div>
    `;

    const playAllBtn = document.getElementById('btn-play-all-playlist');
    if (playAllBtn && videos.length > 0) {
      playAllBtn.addEventListener('click', () => {
        location.hash = `#/watch?id=${videos[0].id}`;
      });
    }

    const addVidsBtn = document.getElementById('btn-add-videos-to-pl');
    if (addVidsBtn) {
      addVidsBtn.addEventListener('click', () => openAddVideosToPlaylistModal(playlistId));
    }

    const emptyAddBtn = document.getElementById('btn-empty-add-vids');
    if (emptyAddBtn) {
      emptyAddBtn.addEventListener('click', () => openAddVideosToPlaylistModal(playlistId));
    }

    const renameBtn = document.getElementById('btn-rename-playlist');
    if (renameBtn) {
      renameBtn.addEventListener('click', () => {
        showModal({
          title: 'Rename Playlist',
          bodyHtml: `
            <div class="form-group">
              <label>Playlist Name</label>
              <input type="text" id="rename-pl-title" value="${escapeHtml(pl.title)}">
            </div>
            <div class="form-group" style="margin-top:12px;">
              <label>Description</label>
              <textarea id="rename-pl-desc" rows="3">${escapeHtml(pl.description || '')}</textarea>
            </div>
          `,
          confirmText: 'Save Changes',
          onConfirm: (container) => {
            const title = container.querySelector('#rename-pl-title').value.trim();
            const desc = container.querySelector('#rename-pl-desc').value.trim();
            if (!title) {
              showToast('Title cannot be empty', 'error');
              return false;
            }
            pl.title = title;
            pl.description = desc;
            savePlaylists();
            showToast('Playlist updated', 'success');
            renderPlaylistDetailPage(playlistId);
            return true;
          }
        });
      });
    }

    const deleteBtn = document.getElementById('btn-delete-playlist');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        showModal({
          title: `Delete "${pl.title}"?`,
          bodyHtml: '<p style="font-size:14px; color:var(--text-secondary);">Are you sure you want to delete this playlist? The videos themselves will not be deleted.</p>',
          confirmText: 'Delete Playlist',
          confirmClass: 'btn-danger',
          onConfirm: () => {
            State.playlists = State.playlists.filter(p => p.id !== playlistId);
            savePlaylists();
            showToast('Playlist deleted', 'info');
            location.hash = '#/playlists';
          }
        });
      });
    }

    const list = document.getElementById('playlist-videos-list');
    if (list) {
      list.addEventListener('click', (e) => {
        const removeBtn = e.target.closest('.btn-remove-from-playlist');
        if (removeBtn) {
          const vId = removeBtn.getAttribute('data-video-id');
          pl.videoIds = pl.videoIds.filter(id => id !== vId);
          savePlaylists();
          showToast('Removed video from playlist', 'info');
          renderPlaylistDetailPage(playlistId);
          return;
        }

        const upBtn = e.target.closest('.btn-reorder-up');
        if (upBtn) {
          const idx = parseInt(upBtn.getAttribute('data-index'), 10);
          if (idx > 0) {
            const temp = pl.videoIds[idx];
            pl.videoIds[idx] = pl.videoIds[idx - 1];
            pl.videoIds[idx - 1] = temp;
            savePlaylists();
            renderPlaylistDetailPage(playlistId);
          }
          return;
        }

        const downBtn = e.target.closest('.btn-reorder-down');
        if (downBtn) {
          const idx = parseInt(downBtn.getAttribute('data-index'), 10);
          if (idx < pl.videoIds.length - 1) {
            const temp = pl.videoIds[idx];
            pl.videoIds[idx] = pl.videoIds[idx + 1];
            pl.videoIds[idx + 1] = temp;
            savePlaylists();
            renderPlaylistDetailPage(playlistId);
          }
          return;
        }
      });
    }
  }

  /* ==========================================================================
     16. PAGE VIEW: SEARCH & CATEGORIES
     ========================================================================== */

  function renderSearchPage(query = '', activeCategory = 'All', sortMode = 'popular') {
    const main = document.getElementById('main-content');
    if (!main) return;

    let results = State.videos.filter(v => v.status === 'published');

    if (query && query.trim()) {
      const q = query.trim().toLowerCase();
      results = results.filter(v => 
        v.title.toLowerCase().includes(q) || 
        (v.description && v.description.toLowerCase().includes(q)) ||
        (v.category && v.category.toLowerCase().includes(q))
      );
    }

    if (activeCategory && activeCategory !== 'All') {
      results = results.filter(v => v.category.toLowerCase() === activeCategory.toLowerCase());
    }

    if (sortMode === 'popular') {
      results.sort((a, b) => b.views - a.views);
    } else if (sortMode === 'newest') {
      results.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
    } else if (sortMode === 'oldest') {
      results.sort((a, b) => new Date(a.uploadDate) - new Date(b.uploadDate));
    }

    const chipsHtml = State.categories.map(cat => `
      <button class="category-chip ${cat === activeCategory ? 'active' : ''}" data-cat="${escapeHtml(cat)}">
        ${escapeHtml(cat)}
      </button>
    `).join('');

    main.innerHTML = `
      <div class="search-results-container">
        <div class="search-filters-bar">
          <div class="category-chips-bar" id="search-cat-chips" style="margin:0; padding:0; flex:1;">
            ${chipsHtml}
          </div>

          <div class="sort-select-wrap">
            <span>Sort by:</span>
            <select id="sort-select" style="background:var(--bg-card); color:var(--text-primary); border:1px solid var(--border); border-radius:var(--radius-sm); padding:6px 10px; cursor:pointer;">
              <option value="popular" ${sortMode === 'popular' ? 'selected' : ''}>Most Popular</option>
              <option value="newest" ${sortMode === 'newest' ? 'selected' : ''}>Newest First</option>
              <option value="oldest" ${sortMode === 'oldest' ? 'selected' : ''}>Oldest First</option>
            </select>
          </div>
        </div>

        <div style="margin-bottom:16px; font-size:14px; color:var(--text-secondary);">
          ${query ? `Showing results for "<strong>${escapeHtml(query)}</strong>" (${results.length} found)` : `Explore all videos (${results.length} available)`}
        </div>

        ${results.length === 0 ? `
          <div class="empty-state">
            <svg viewBox="0 0 24 24" class="empty-icon"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
            <h3 class="empty-title">No matching videos found</h3>
            <p class="empty-desc">Try checking for typos or searching with different keywords or categories.</p>
            <button class="btn-primary" id="btn-reset-search">Clear Search & Filters</button>
          </div>
        ` : `
          <div class="video-grid">
            ${results.map(v => renderVideoCard(v)).join('')}
          </div>
        `}

      </div>
    `;

    const chipsBar = document.getElementById('search-cat-chips');
    if (chipsBar) {
      chipsBar.addEventListener('click', (e) => {
        const chip = e.target.closest('.category-chip');
        if (!chip) return;
        const newCat = chip.getAttribute('data-cat');
        renderSearchPage(query, newCat, sortMode);
      });
    }

    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        renderSearchPage(query, activeCategory, e.target.value);
      });
    }

    const resetBtn = document.getElementById('btn-reset-search');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        const input = document.getElementById('search-input');
        if (input) input.value = '';
        location.hash = '#/search';
      });
    }

    attachCardActionListeners();
  }

  /* ==========================================================================
     17. PAGE VIEW: VIDEO MANAGEMENT & ADMIN PANEL
     ========================================================================== */

  function renderAdminPanel() {
    const main = document.getElementById('main-content');
    if (!main) return;

    const isAuthed = sessionStorage.getItem(STORAGE_KEYS.ADMIN_SESSION) === 'true';
    if (!isAuthed) {
      promptAdminPassword(() => renderAdminPanel(), () => { location.hash = '#/home'; });
      return;
    }

    const totalVideos = State.videos.length;
    const totalViews = State.videos.reduce((sum, v) => sum + (v.views || 0), 0);
    const publishedCount = State.videos.filter(v => v.status === 'published').length;
    const draftCount = State.videos.filter(v => v.status === 'draft').length;
    const editableCats = State.categories.filter(c => c !== 'All');

    main.innerHTML = `
      <div class="admin-container">
        
        <div class="page-header-bar">
          <div class="page-title-wrap">
            <h2>VELPLAY Video Management</h2>
            <p>Admin Dashboard • Create, edit, and organize platform content</p>
          </div>
          <div style="display:flex; gap:10px; flex-wrap:wrap;">
            <button class="btn-primary" id="btn-admin-add-video">
              <svg viewBox="0 0 24 24" class="svg-icon"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
              Upload New Video
            </button>
            <button class="btn-secondary" id="btn-admin-export-data">
              <svg viewBox="0 0 24 24" class="svg-icon"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
              Export Backup
            </button>
            <button class="btn-secondary" id="btn-admin-import-data">
              <svg viewBox="0 0 24 24" class="svg-icon"><path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/></svg>
              Import Backup
            </button>
            <button class="btn-secondary" id="btn-admin-logout" title="Lock Admin Session">
              Lock
            </button>
          </div>
        </div>

        <!-- STATS CARDS -->
        <div class="admin-stats-grid">
          <div class="stat-card">
            <div class="stat-icon-wrap">
              <svg viewBox="0 0 24 24" class="svg-icon"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z"/></svg>
            </div>
            <div class="stat-content">
              <h4>Total Videos</h4>
              <div class="stat-number">${totalVideos}</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon-wrap" style="color:#00e676; background:rgba(0,230,118,0.12);">
              <svg viewBox="0 0 24 24" class="svg-icon"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
            </div>
            <div class="stat-content">
              <h4>Total Views</h4>
              <div class="stat-number">${formatViews(totalViews)}</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon-wrap" style="color:#3ea6ff; background:rgba(62,166,255,0.12);">
              <svg viewBox="0 0 24 24" class="svg-icon"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            </div>
            <div class="stat-content">
              <h4>Published / Drafts</h4>
              <div class="stat-number">${publishedCount} <span style="font-size:16px; color:var(--text-secondary); font-weight:400;">/ ${draftCount}</span></div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon-wrap" style="color:#ffd700; background:rgba(255,215,0,0.12);">
              <svg viewBox="0 0 24 24" class="svg-icon"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
            </div>
            <div class="stat-content">
              <h4>Categories</h4>
              <div class="stat-number">${editableCats.length}</div>
            </div>
          </div>
        </div>

        <!-- CATEGORY MANAGEMENT SECTION -->
        <div class="cat-management-card">
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; flex-wrap:wrap; gap:10px;">
            <div>
              <h3 style="font-size:17px; font-weight:700;">Category Management</h3>
              <p style="font-size:12px; color:var(--text-secondary);">Add, rename, or delete video categories. Changes automatically update existing videos.</p>
            </div>
            <div style="display:flex; gap:8px;">
              <input type="text" id="admin-new-cat-input" placeholder="New category name..." style="padding:6px 10px;">
              <button type="button" class="btn-primary" id="btn-admin-add-cat" style="white-space:nowrap; padding:6px 14px;">Add Category</button>
            </div>
          </div>

          <div class="cat-management-grid" id="cat-management-list">
            ${editableCats.map(cat => {
              const count = State.videos.filter(v => v.category === cat).length;
              return `
                <div class="cat-row-item" data-cat-name="${escapeHtml(cat)}">
                  <div class="cat-row-info">
                    <span class="cat-badge-pill">${escapeHtml(cat)}</span>
                    <span style="font-size:12px; color:var(--text-secondary);">${count} videos</span>
                  </div>
                  <div class="cat-row-actions">
                    <button type="button" class="icon-btn btn-rename-cat" data-cat="${escapeHtml(cat)}" title="Rename category">
                      <svg viewBox="0 0 24 24" class="svg-icon"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                    </button>
                    <button type="button" class="icon-btn btn-delete-cat" data-cat="${escapeHtml(cat)}" title="Delete category" style="color:#ff4444;">
                      <svg viewBox="0 0 24 24" class="svg-icon"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                    </button>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- VIDEO MANAGEMENT TABLE -->
        <div class="admin-table-card" style="margin-top:24px;">
          <div class="admin-table-header">
            <h3>All Video Records (${totalVideos})</h3>
            <span style="font-size:13px; color:var(--text-secondary);">Changes sync directly to LocalStorage</span>
          </div>

          <div class="table-responsive">
            <table class="admin-table">
              <thead>
                <tr>
                  <th style="width:100px;">Thumbnail</th>
                  <th>Title & Details</th>
                  <th>Category</th>
                  <th>Views</th>
                  <th>Status</th>
                  <th>Upload Date</th>
                  <th style="text-align:right;">Actions</th>
                </tr>
              </thead>
              <tbody id="admin-video-tbody">
                ${State.videos.map(v => `
                  <tr data-video-id="${v.id}">
                    <td>
                      <div class="admin-thumb-cell" onclick="location.hash='#/watch?id=${v.id}'" style="cursor:pointer;">
                        <img src="${escapeHtml(v.thumbnail)}" alt="${escapeHtml(v.title)}" loading="lazy">
                      </div>
                    </td>
                    <td>
                      <div class="admin-title-cell">${escapeHtml(v.title)}</div>
                      <div style="font-size:12px; color:var(--text-muted); margin-top:2px;">Duration: ${v.duration || '0:00'}</div>
                    </td>
                    <td><span class="card-category-badge">${escapeHtml(v.category)}</span></td>
                    <td>${formatViews(v.views)}</td>
                    <td>
                      <span class="status-pill ${v.status === 'published' ? 'status-published' : 'status-draft'}">
                        ${v.status || 'published'}
                      </span>
                    </td>
                    <td style="color:var(--text-secondary); font-size:13px;">${new Date(v.uploadDate).toLocaleDateString()}</td>
                    <td style="text-align:right;">
                      <div class="admin-actions-cell" style="justify-content:flex-end;">
                        <button class="icon-btn btn-admin-edit" data-id="${v.id}" title="Edit Video">
                          <svg viewBox="0 0 24 24" class="svg-icon"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                        </button>
                        <button class="icon-btn btn-admin-delete" data-id="${v.id}" title="Delete Video" style="color:#ff4444;">
                          <svg viewBox="0 0 24 24" class="svg-icon"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    `;

    const addBtn = document.getElementById('btn-admin-add-video');
    if (addBtn) addBtn.addEventListener('click', () => openVideoEditModal(null));

    const expBtn = document.getElementById('btn-admin-export-data');
    if (expBtn) expBtn.addEventListener('click', exportAllData);

    const impBtn = document.getElementById('btn-admin-import-data');
    const backupInput = document.getElementById('backup-file-input');
    if (impBtn && backupInput) {
      impBtn.addEventListener('click', () => {
        backupInput.value = '';
        backupInput.click();
      });
    }

    const logoutBtn = document.getElementById('btn-admin-logout');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        sessionStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
        showToast('Admin session locked', 'info');
        location.hash = '#/home';
      });
    }

    // Category add
    const addCatBtn = document.getElementById('btn-admin-add-cat');
    const newCatInput = document.getElementById('admin-new-cat-input');
    if (addCatBtn && newCatInput) {
      addCatBtn.addEventListener('click', () => {
        const val = newCatInput.value.trim();
        if (addCategory(val)) {
          newCatInput.value = '';
          renderAdminPanel();
        }
      });
    }

    // Category rename & delete
    const catList = document.getElementById('cat-management-list');
    if (catList) {
      catList.addEventListener('click', (e) => {
        const renameBtn = e.target.closest('.btn-rename-cat');
        if (renameBtn) {
          const oldCat = renameBtn.getAttribute('data-cat');
          showModal({
            title: `Rename Category "${oldCat}"`,
            bodyHtml: `
              <div class="form-group">
                <label>New Category Name</label>
                <input type="text" id="rename-category-input" value="${escapeHtml(oldCat)}">
              </div>
            `,
            confirmText: 'Save Rename',
            onConfirm: (container) => {
              const newName = container.querySelector('#rename-category-input').value.trim();
              if (renameCategory(oldCat, newName)) {
                renderAdminPanel();
                return true;
              }
              return false;
            }
          });
          return;
        }

        const delBtn = e.target.closest('.btn-delete-cat');
        if (delBtn) {
          const catToDelete = delBtn.getAttribute('data-cat');
          showModal({
            title: `Delete Category "${catToDelete}"?`,
            bodyHtml: `<p style="font-size:14px; color:var(--text-secondary);">Are you sure you want to delete this category? Any videos currently assigned to "${catToDelete}" will be reassigned to another category.</p>`,
            confirmText: 'Delete Category',
            confirmClass: 'btn-danger',
            onConfirm: () => {
              deleteCategory(catToDelete);
              renderAdminPanel();
            }
          });
          return;
        }
      });
    }

    const tbody = document.getElementById('admin-video-tbody');
    if (tbody) {
      tbody.addEventListener('click', (e) => {
        const editBtn = e.target.closest('.btn-admin-edit');
        if (editBtn) {
          const id = editBtn.getAttribute('data-id');
          const vid = getVideoById(id);
          if (vid) openVideoEditModal(vid);
          return;
        }

        const delBtn = e.target.closest('.btn-admin-delete');
        if (delBtn) {
          const id = delBtn.getAttribute('data-id');
          const vid = getVideoById(id);
          if (vid) {
            showModal({
              title: `Delete "${vid.title}"?`,
              bodyHtml: '<p style="font-size:14px; color:var(--text-secondary);">Are you sure you want to permanently delete this video? This will remove it from the platform, playlists, and watch history.</p>',
              confirmText: 'Delete Video',
              confirmClass: 'btn-danger',
              onConfirm: () => {
                State.videos = State.videos.filter(v => v.id !== id);
                saveVideos();
                State.playlists.forEach(pl => {
                  pl.videoIds = pl.videoIds.filter(vId => vId !== id);
                });
                savePlaylists();
                removeHistoryItem(id);
                showToast('Video deleted successfully', 'success');
                renderAdminPanel();
              }
            });
          }
        }
      });
    }
  }

  function promptAdminPassword(onSuccess, onCancel) {
    showModal({
      title: 'Admin Verification',
      bodyHtml: `
        <p style="font-size:14px; color:var(--text-secondary); margin-bottom:12px;">
          Please enter the administrator password to access video management.
        </p>
        <div class="form-group">
          <label>Password (Default: <code>velplay2024</code>)</label>
          <input type="password" id="admin-pass-input" placeholder="Enter password..." autocomplete="current-password">
        </div>
      `,
      confirmText: 'Unlock Dashboard',
      onConfirm: (container) => {
        const pass = container.querySelector('#admin-pass-input').value;
        if (pass === 'velplay2024') {
          sessionStorage.setItem(STORAGE_KEYS.ADMIN_SESSION, 'true');
          showToast('Welcome to VELPLAY Admin', 'success');
          if (onSuccess) onSuccess();
          return true;
        } else {
          showToast('Incorrect password. Try again.', 'error');
          return false;
        }
      },
      onCancel: () => {
        if (onCancel) onCancel();
      }
    });
  }

  function openVideoEditModal(existingVideo = null) {
    const isEdit = !!existingVideo;
    const vid = existingVideo || {
      id: generateId('vel-vid'),
      title: '',
      description: '',
      category: State.categories.find(c => c !== 'All') || 'Animation',
      url: '',
      thumbnail: '',
      duration: '0:00',
      durationSec: 0,
      views: 0,
      uploadDate: new Date().toISOString(),
      status: 'published'
    };

    const categoriesHtml = State.categories.filter(c => c !== 'All').map(cat => `
      <option value="${escapeHtml(cat)}" ${vid.category === cat ? 'selected' : ''}>${escapeHtml(cat)}</option>
    `).join('');

    const bodyHtml = `
      <form id="video-crud-form" onsubmit="return false;" style="display:flex; flex-direction:column; gap:14px;">
        <div class="form-group">
          <label>Video Title *</label>
          <input type="text" id="form-vid-title" value="${escapeHtml(vid.title)}" placeholder="Enter video title..." required>
        </div>

        <div class="form-group">
          <label>Description</label>
          <textarea id="form-vid-desc" rows="3" placeholder="Enter detailed description...">${escapeHtml(vid.description)}</textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Category</label>
            <select id="form-vid-category" style="background:var(--bg-secondary); color:var(--text-primary); border:1px solid var(--border); padding:8px 10px; border-radius:var(--radius-sm);">
              ${categoriesHtml}
            </select>
          </div>

          <div class="form-group">
            <label>Visibility Status</label>
            <select id="form-vid-status" style="background:var(--bg-secondary); color:var(--text-primary); border:1px solid var(--border); padding:8px 10px; border-radius:var(--radius-sm);">
              <option value="published" ${vid.status === 'published' ? 'selected' : ''}>Published</option>
              <option value="draft" ${vid.status === 'draft' ? 'selected' : ''}>Draft</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>Video URL or Local Video File *</label>
          <input type="url" id="form-vid-url" value="${escapeHtml(vid.url)}" placeholder="https://.../video.mp4">
          <div class="file-upload-box">
            <label class="file-upload-label" for="form-vid-file">
              <svg viewBox="0 0 24 24" class="svg-icon"><path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/></svg>
              Or Choose Local Video File
            </label>
            <input type="file" id="form-vid-file" accept="video/mp4,video/webm,video/ogg,video/*">
            <span id="video-file-name" style="font-size:12px; color:var(--text-secondary); max-width:200px; overflow:hidden; text-overflow:ellipsis;"></span>
          </div>
        </div>

        <div class="form-group">
          <label>Thumbnail Image URL or Local File</label>
          <input type="url" id="form-vid-thumb" value="${escapeHtml(vid.thumbnail)}" placeholder="https://.../thumbnail.jpg">
          <div class="file-upload-box">
            <label class="file-upload-label" for="form-thumb-file">
              <svg viewBox="0 0 24 24" class="svg-icon"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
              Or Choose Local Image File
            </label>
            <input type="file" id="form-thumb-file" accept="image/*">
            <span id="thumb-file-name" style="font-size:12px; color:var(--text-secondary); max-width:200px; overflow:hidden; text-overflow:ellipsis;"></span>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Duration Display (e.g. 5:20)</label>
            <input type="text" id="form-vid-duration" value="${escapeHtml(vid.duration || '1:00')}" placeholder="mm:ss">
          </div>
          <div class="form-group">
            <label>Initial Views</label>
            <input type="number" id="form-vid-views" value="${vid.views || 0}" min="0">
          </div>
        </div>
      </form>
    `;

    showModal({
      title: isEdit ? 'Edit Video Details' : 'Upload New Video',
      bodyHtml,
      confirmText: isEdit ? 'Save Changes' : 'Publish Video',
      onConfirm: (container) => {
        const title = container.querySelector('#form-vid-title').value.trim();
        const desc = container.querySelector('#form-vid-desc').value.trim();
        const cat = container.querySelector('#form-vid-category').value;
        const status = container.querySelector('#form-vid-status').value;
        const url = container.querySelector('#form-vid-url').value.trim();
        let thumb = container.querySelector('#form-vid-thumb').value.trim();
        const duration = container.querySelector('#form-vid-duration').value.trim() || '1:00';
        const views = parseInt(container.querySelector('#form-vid-views').value, 10) || 0;

        if (!title) {
          showToast('Please enter a video title', 'error');
          return false;
        }
        if (!url) {
          showToast('Please provide a video URL or local file', 'error');
          return false;
        }

        const parts = duration.split(':').map(p => parseInt(p, 10) || 0);
        let durSec = 60;
        if (parts.length === 2) {
          durSec = parts[0] * 60 + parts[1];
        } else if (parts.length === 3) {
          durSec = parts[0] * 3600 + parts[1] * 60 + parts[2];
        }

        if (!thumb) {
          thumb = 'https://picsum.photos/640/360?random=' + Math.floor(Math.random() * 1000);
        }

        if (isEdit) {
          vid.title = title;
          vid.description = desc;
          vid.category = cat;
          vid.status = status;
          vid.url = url;
          vid.thumbnail = thumb;
          vid.duration = duration;
          vid.durationSec = durSec;
          vid.views = views;
          saveVideos();
          showToast('Video updated successfully!', 'success');
        } else {
          const newVid = {
            id: vid.id,
            title,
            description: desc,
            category: cat,
            status,
            url,
            thumbnail: thumb,
            duration,
            durationSec: durSec,
            views,
            uploadDate: new Date().toISOString()
          };
          State.videos.unshift(newVid);
          saveVideos();
          showToast(`"${title}" added successfully!`, 'success');
        }

        if (location.hash === '#/admin') {
          renderAdminPanel();
        }
        return true;
      }
    });

    const container = document.getElementById('modal-container');
    const vidFileInput = container.querySelector('#form-vid-file');
    const vidUrlInput = container.querySelector('#form-vid-url');
    const vidNameSpan = container.querySelector('#video-file-name');

    vidFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const objUrl = URL.createObjectURL(file);
        vidUrlInput.value = objUrl;
        vidNameSpan.textContent = file.name;
        showToast(`Selected file: ${file.name}`, 'info');
      }
    });

    const thumbFileInput = container.querySelector('#form-thumb-file');
    const thumbUrlInput = container.querySelector('#form-vid-thumb');
    const thumbNameSpan = container.querySelector('#thumb-file-name');

    thumbFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (re) => {
          thumbUrlInput.value = re.target.result;
          thumbNameSpan.textContent = file.name;
          showToast(`Selected thumbnail: ${file.name}`, 'info');
        };
        reader.readAsDataURL(file);
      }
    });
  }

  /* ==========================================================================
     18. LIVE SEARCH & SUGGESTIONS BAR
     ========================================================================== */

  function initLiveSearch() {
    const form = document.getElementById('search-form');
    const input = document.getElementById('search-input');
    const clearBtn = document.getElementById('search-clear-btn');
    const suggestions = document.getElementById('search-suggestions');
    if (!input || !form) return;

    let debounceTimer = null;

    input.addEventListener('input', () => {
      const q = input.value.trim();
      clearBtn.classList.toggle('visible', q.length > 0);

      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        if (!q) {
          suggestions.classList.add('hidden');
          suggestions.innerHTML = '';
          return;
        }

        const matches = State.videos
          .filter(v => v.title.toLowerCase().includes(q.toLowerCase()) || v.category.toLowerCase().includes(q.toLowerCase()))
          .slice(0, 6);

        if (matches.length === 0) {
          suggestions.classList.add('hidden');
          return;
        }

        suggestions.innerHTML = matches.map(m => `
          <div class="suggestion-item" data-id="${m.id}">
            <svg viewBox="0 0 24 24" class="svg-icon"><path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
            <span>${escapeHtml(m.title)}</span>
            <span style="margin-left:auto; font-size:11px; color:var(--text-muted);">${escapeHtml(m.category)}</span>
          </div>
        `).join('');

        suggestions.classList.remove('hidden');
      }, 250);
    });

    suggestions.addEventListener('click', (e) => {
      const item = e.target.closest('.suggestion-item');
      if (!item) return;
      const id = item.getAttribute('data-id');
      suggestions.classList.add('hidden');
      location.hash = `#/watch?id=${id}`;
    });

    clearBtn.addEventListener('click', () => {
      input.value = '';
      clearBtn.classList.remove('visible');
      suggestions.classList.add('hidden');
      input.focus();
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const q = input.value.trim();
      suggestions.classList.add('hidden');
      location.hash = `#/search?q=${encodeURIComponent(q)}`;
    });

    document.addEventListener('click', (e) => {
      if (!form.contains(e.target)) {
        suggestions.classList.add('hidden');
      }
    });
  }

  /* ==========================================================================
     19. GLOBAL CARD ACTION LISTENERS
     ========================================================================== */

  function attachCardActionListeners() {
    document.querySelectorAll('[data-card-actions]').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const vidId = btn.getAttribute('data-card-actions');
        const menu = document.getElementById(`dropdown-${vidId}`);
        if (!menu) return;

        document.querySelectorAll('.card-dropdown-menu').forEach(m => {
          if (m !== menu) m.classList.add('hidden');
        });

        menu.classList.toggle('hidden');
      };
    });

    document.querySelectorAll('.btn-toggle-fav').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        toggleFavorite(id);
        const menu = btn.closest('.card-dropdown-menu');
        if (menu) menu.classList.add('hidden');
        if (location.hash === '#/favorites') renderFavoritesPage();
      };
    });

    document.querySelectorAll('.btn-save-playlist').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const menu = btn.closest('.card-dropdown-menu');
        if (menu) menu.classList.add('hidden');
        openAddToPlaylistModal(id);
      };
    });

    document.querySelectorAll('.btn-copy-link').forEach(btn => {
      btn.onclick = (e) => {
        e.stopPropagation();
        const id = btn.getAttribute('data-id');
        const url = window.location.origin + window.location.pathname + '#/watch?id=' + id;
        navigator.clipboard.writeText(url).then(() => {
          showToast('Link copied to clipboard', 'success');
        });
        const menu = btn.closest('.card-dropdown-menu');
        if (menu) menu.classList.add('hidden');
      };
    });

    document.addEventListener('click', () => {
      document.querySelectorAll('.card-dropdown-menu').forEach(m => m.classList.add('hidden'));
    });
  }

  /* ==========================================================================
     20. SIDEBAR CATEGORIES & NOTIFICATIONS POPUP
     ========================================================================== */

  function populateSidebarCategories() {
    const container = document.getElementById('sidebar-categories');
    if (!container) return;

    container.innerHTML = State.categories.map(cat => `
      <a href="#/search?cat=${encodeURIComponent(cat)}" class="sidebar-category-link">
        <span class="cat-bullet"></span>
        <span class="link-label">${escapeHtml(cat)}</span>
      </a>
    `).join('');
  }

  function initNotificationsDropdown() {
    const btn = document.getElementById('notifications-btn');
    const dropdown = document.getElementById('notifications-dropdown');
    const list = document.getElementById('notifications-list');
    const badge = document.getElementById('notif-badge');
    const clearBtn = document.getElementById('clear-notifications-btn');
    if (!btn || !dropdown) return;

    const notifications = [
      { id: 1, title: 'Welcome to VELPLAY!', text: 'Stream high-definition cinema with your custom player.', time: '10m ago' },
      { id: 2, title: 'New Sci-Fi Upload', text: 'Tears of Steel is available in full HD.', time: '1h ago' },
      { id: 3, title: 'Feature Update', text: 'Category editing and JSON backup now enabled!', time: '1d ago' }
    ];

    function renderList() {
      if (notifications.length === 0) {
        list.innerHTML = '<div style="padding:20px; text-align:center; color:var(--text-muted); font-size:13px;">No new notifications</div>';
        if (badge) badge.style.display = 'none';
      } else {
        list.innerHTML = notifications.map(n => `
          <div class="notif-item">
            <div style="font-weight:600; font-size:13px; color:var(--text-primary);">${escapeHtml(n.title)}</div>
            <div style="font-size:12px; color:var(--text-secondary); margin-top:2px;">${escapeHtml(n.text)}</div>
            <div style="font-size:10px; color:var(--text-muted); margin-top:4px;">${escapeHtml(n.time)}</div>
          </div>
        `).join('');
      }
    }

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('hidden');
      renderList();
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        notifications.length = 0;
        renderList();
        showToast('All notifications marked as read', 'info');
      });
    }

    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target) && !btn.contains(e.target)) {
        dropdown.classList.add('hidden');
      }
    });
  }

  /* ==========================================================================
     21. TOPBAR BUTTONS: THEME SWITCHER, QUICK ADD, BACKUP & ADMIN
     ========================================================================== */

  function initHeaderControls() {
    // Theme toggle
    const themeBtn = document.getElementById('theme-toggle-btn');
    if (themeBtn) {
      themeBtn.addEventListener('click', () => {
        const nextTheme = State.prefs.theme === 'light' ? 'dark' : 'light';
        applyTheme(nextTheme);
        showToast(`Switched to ${nextTheme} mode`, 'info');
      });
    }

    // Quick Add Video Button
    const quickAdd = document.getElementById('quick-add-btn');
    if (quickAdd) {
      quickAdd.addEventListener('click', () => {
        const isAuthed = sessionStorage.getItem(STORAGE_KEYS.ADMIN_SESSION) === 'true';
        if (isAuthed) {
          openVideoEditModal(null);
        } else {
          promptAdminPassword(() => openVideoEditModal(null));
        }
      });
    }

    // Backup & Restore button in topbar
    const backupBtn = document.getElementById('backup-nav-btn');
    if (backupBtn) {
      backupBtn.addEventListener('click', openBackupRestoreModal);
    }

    // Hidden input listener for backup file restore
    const backupFileInput = document.getElementById('backup-file-input');
    if (backupFileInput) {
      backupFileInput.addEventListener('change', (e) => {
        if (e.target.files && e.target.files[0]) {
          importDataFromFile(e.target.files[0]);
        }
      });
    }

    // Admin button
    const adminNavBtn = document.getElementById('admin-nav-btn');
    if (adminNavBtn) {
      adminNavBtn.addEventListener('click', () => {
        location.hash = '#/admin';
      });
    }
  }

  /* ==========================================================================
     22. ROUTER & NAVIGATION CONTROLLER
     ========================================================================== */

  function syncActiveNav(pageName) {
    document.querySelectorAll('#sidebar .sidebar-link').forEach(link => {
      const page = link.getAttribute('data-page');
      link.classList.toggle('active', page === pageName);
    });

    document.querySelectorAll('#bottom-nav .bottom-nav-item').forEach(item => {
      const page = item.getAttribute('data-page');
      item.classList.toggle('active', page === pageName);
    });
  }

  function handleRoute() {
    if (State.activePlayer) {
      State.activePlayer.destroy();
      State.activePlayer = null;
    }

    const hash = window.location.hash || '#/home';
    const [pathPart, queryPart] = hash.split('?');
    const route = pathPart.replace(/^#\/?/, '').toLowerCase() || 'home';

    const params = {};
    if (queryPart) {
      const searchParams = new URLSearchParams(queryPart);
      searchParams.forEach((val, key) => {
        params[key] = val;
      });
    }

    State.currentRoute = route;
    State.routeParams = params;

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (route === 'home' || route === '') {
      syncActiveNav('home');
      renderHomePage('All');
    } else if (route === 'watch') {
      syncActiveNav('home');
      const vidId = params.id || (State.videos[0] ? State.videos[0].id : null);
      renderWatchPage(vidId);
    } else if (route === 'history') {
      syncActiveNav('history');
      renderHistoryPage();
    } else if (route === 'favorites') {
      syncActiveNav('favorites');
      renderFavoritesPage();
    } else if (route === 'playlists') {
      syncActiveNav('playlists');
      renderPlaylistsPage();
    } else if (route === 'playlist') {
      syncActiveNav('playlists');
      renderPlaylistDetailPage(params.id);
    } else if (route === 'search') {
      syncActiveNav('search');
      renderSearchPage(params.q || '', params.cat || 'All', 'popular');
    } else if (route === 'admin') {
      syncActiveNav('admin');
      renderAdminPanel();
    } else {
      syncActiveNav('');
      renderHomePage('All');
    }
  }

  function initSidebar() {
    const toggleBtn = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    if (!toggleBtn || !sidebar) return;

    toggleBtn.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        sidebar.classList.toggle('open');
        overlay.classList.toggle('visible');
      } else {
        sidebar.classList.toggle('collapsed');
        document.body.classList.toggle('sidebar-collapsed');
      }
    });

    if (overlay) {
      overlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        overlay.classList.remove('visible');
      });
    }

    sidebar.addEventListener('click', (e) => {
      if (e.target.closest('a') && window.innerWidth <= 768) {
        sidebar.classList.remove('open');
        overlay.classList.remove('visible');
      }
    });
  }

  /* ==========================================================================
     23. APPLICATION BOOTSTRAP
     ========================================================================== */

  function initApp() {
    loadStorage();
    applyTheme(State.prefs.theme || 'dark');
    initSidebar();
    populateSidebarCategories();
    initLiveSearch();
    initNotificationsDropdown();
    initHeaderControls();

    window.addEventListener('hashchange', handleRoute);
    handleRoute();

    console.log('%cVELPLAY Platform Initialized', 'color:#ff0000; font-size:16px; font-weight:bold;');
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }

})();
