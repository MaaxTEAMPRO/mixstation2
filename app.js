// ---------- Helpers de armazenamento ----------
const STORE_LAST = 'ms_last_station';
const STORE_VOLUME = 'ms_volume';
const STORE_FAVS = 'ms_favorites';
const STORE_THEME = 'ms_theme';

function loadJSON(key, fallback) {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
        return fallback;
    }
}
function saveJSON(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
        /* armazenamento indisponível */
    }
}

// ---------- Estado global ----------
const state = {
    currentStation: null,
    favorites: loadJSON(STORE_FAVS, []),
    favoritesOnly: false,
    genre: 'all',
    driveListMode: 'all' // 'all' | 'favs'
};

function isFavorite(station) {
    return state.favorites.includes(station.name);
}

// ---------- Toast (volume / erros) ----------
function showToast(message) {
    const el = document.getElementById('volume-popup');
    clearTimeout(el._timer);
    el.textContent = message;
    el.style.display = 'block';
    el.style.opacity = '1';
    el._timer = setTimeout(() => {
        el.style.opacity = '0';
        setTimeout(() => { el.style.display = 'none'; }, 400);
    }, 1500);
}

// ---------- Fallback de imagem (rádio sem logo) ----------
function installIconFallback(img, container) {
    img.addEventListener('error', () => {
        img.style.display = 'none';
        const old = container.querySelector('.icon-fallback');
        if (old) old.remove();
        const emoji = document.createElement('span');
        emoji.className = 'icon-fallback';
        emoji.textContent = '📻';
        emoji.setAttribute('aria-hidden', 'true');
        container.appendChild(emoji);
    });
}

// ---------- Temas ----------
const THEMES = ['default', 'oceano', 'floresta', 'neon', 'pioneer'];

function setTheme(name) {
    if (!THEMES.includes(name)) name = 'default';
    document.body.setAttribute('data-theme', name);
    const select = document.getElementById('theme-select');
    if (select) select.value = name;
    saveJSON(STORE_THEME, name);
}

function initTheme() {
    const saved = loadJSON(STORE_THEME, 'default');
    setTheme(saved);
}

// ---------- Modo Direção ----------
const WEEKDAYS = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
const MONTHS = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

function pad2(n) {
    return (n < 10 ? '0' : '') + n;
}

function updateDriveClock() {
    const d = new Date();
    const timeEl = document.getElementById('drive-time');
    const dateEl = document.getElementById('drive-date');
    if (timeEl) timeEl.textContent = `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
    if (dateEl) dateEl.textContent = `${WEEKDAYS[d.getDay()]}, ${d.getDate()} de ${MONTHS[d.getMonth()]}`;
}

let driveTimer = null;
function startDriveClock() {
    updateDriveClock();
    clearInterval(driveTimer);
    driveTimer = setInterval(updateDriveClock, 1000);
}

function updateDriveNow(station) {
    const icon = document.getElementById('drive-icon');
    const nameEl = document.getElementById('drive-station-name');
    const driveNow = document.querySelector('#drive-mode .drive-now');
    if (!station) {
        if (icon) icon.style.display = 'none';
        if (nameEl) nameEl.textContent = 'Nenhuma rádio';
        return;
    }
    const oldFallback = driveNow ? driveNow.querySelector('.icon-fallback') : null;
    if (oldFallback) oldFallback.remove();
    if (icon) {
        icon.style.display = 'inline-block';
        icon.src = station.icon;
        if (driveNow) installIconFallback(icon, driveNow);
    }
    if (nameEl) nameEl.textContent = station.name;
}

function openDriveMode() {
    const overlay = document.getElementById('drive-mode');
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    startDriveClock();
    updateDriveNow(state.currentStation);
    closeDriveList();
    renderDriveList();
    const driveSlider = document.getElementById('drive-slider');
    const player = document.getElementById('player');
    if (driveSlider) driveSlider.value = Math.round(player.volume * 100);
    document.body.style.overflow = 'hidden';
}

function closeDriveMode() {
    const overlay = document.getElementById('drive-mode');
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    clearInterval(driveTimer);
    closeDriveList();
    document.body.style.overflow = '';
}

function getDriveStations() {
    return state.driveListMode === 'favs' ? stations.filter((s) => isFavorite(s)) : stations.slice();
}

function nextRadio() {
    const list = getDriveStations();
    if (list.length === 0) return;
    const cur = state.currentStation;
    const idx = cur ? list.findIndex((s) => s.name === cur.name) : -1;
    playStation(list[(idx + 1) % list.length]);
}

function prevRadio() {
    const list = getDriveStations();
    if (list.length === 0) return;
    const cur = state.currentStation;
    const idx = cur ? list.findIndex((s) => s.name === cur.name) : -1;
    playStation(list[(idx - 1 + list.length) % list.length]);
}

// ---------- Renderização da lista ----------
function createStationCard(station) {
    const li = document.createElement('li');
    li.dataset.name = station.name;
    li.classList.toggle('playing', !!(state.currentStation && state.currentStation.name === station.name));

    const favBtn = document.createElement('button');
    favBtn.className = 'fav-button';
    favBtn.title = isFavorite(station) ? 'Remover dos favoritos' : 'Adicionar aos favoritos';
    favBtn.setAttribute('aria-label', favBtn.title);
    favBtn.classList.toggle('active', isFavorite(station));
    favBtn.innerHTML = `<i class="${isFavorite(station) ? 'fas' : 'fa-regular'} fa-star"></i>`;
    favBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleFavorite(station);
    });

    const info = document.createElement('div');
    info.className = 'station-info';

    const img = document.createElement('img');
    img.src = station.icon;
    img.alt = station.name;
    img.loading = 'lazy';
    installIconFallback(img, info);

    const name = document.createElement('p');
    name.textContent = station.name;

    const genre = document.createElement('span');
    genre.className = 'station-genre';
    genre.textContent = station.genre;

    info.appendChild(img);
    info.appendChild(name);
    info.appendChild(genre);

    li.appendChild(favBtn);
    li.appendChild(info);
    li.addEventListener('click', () => playStation(station));
    return li;
}

function renderStations(list) {
    const listEl = document.getElementById('stations');
    listEl.innerHTML = '';
    if (list.length === 0) {
        const empty = document.createElement('li');
        empty.className = 'empty';
        empty.textContent = 'Nenhuma rádio encontrada.';
        listEl.appendChild(empty);
        return;
    }
    list.forEach((station) => listEl.appendChild(createStationCard(station)));
}

function renderFavorites() {
    const section = document.getElementById('favorites-section');
    const listEl = document.getElementById('favorites-list');
    const favs = stations.filter((s) => isFavorite(s));
    if (favs.length === 0) {
        section.hidden = true;
        listEl.innerHTML = '';
        return;
    }
    section.hidden = false;
    listEl.innerHTML = '';
    favs.forEach((station) => listEl.appendChild(createStationCard(station)));
}

// ---------- Filtros (busca + gênero + favoritos) ----------
function getVisibleStations() {
    const query = document.getElementById('search-bar').value.toLowerCase().trim();
    return stations.filter((s) => {
        if (state.genre !== 'all' && s.genre !== state.genre) return false;
        if (state.favoritesOnly && !isFavorite(s)) return false;
        if (query && !s.name.toLowerCase().includes(query)) return false;
        return true;
    });
}

function applyFilters() {
    renderStations(getVisibleStations());
}

function populateGenreFilter() {
    const select = document.getElementById('genre-filter');
    GENRES.forEach((genre) => {
        const option = document.createElement('option');
        option.value = genre;
        option.textContent = genre;
        select.appendChild(option);
    });
}

function renderDriveList() {
    const panel = document.getElementById('drive-list-panel');
    if (!panel) return;
    const container = panel.querySelector('.drive-popup-list') || panel;
    const list = getDriveStations();
    container.innerHTML = '';
    if (list.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'drive-list-empty';
        empty.textContent = state.driveListMode === 'favs'
            ? 'Nenhuma rádio favorita ainda. Marque ⭐ em alguma rádio.'
            : 'Nenhuma rádio disponível.';
        container.appendChild(empty);
        return;
    }
    list.forEach((station) => {
        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'drive-list-item';
        item.dataset.name = station.name;
        item.classList.toggle('current', !!(state.currentStation && state.currentStation.name === station.name));
        const img = document.createElement('img');
        img.src = station.icon;
        img.alt = '';
        img.loading = 'lazy';
        const name = document.createElement('span');
        name.textContent = station.name;
        installIconFallback(img, item);
        item.appendChild(img);
        item.appendChild(name);
        item.addEventListener('click', () => {
            playStation(station);
            closeDriveList();
        });
        container.appendChild(item);
    });
}

function openDriveList() {
    const panel = document.getElementById('drive-list-panel');
    if (!panel) return;
    renderDriveList();
    panel.hidden = false;
    requestAnimationFrame(() => panel.classList.add('open'));
    const btn = document.getElementById('drive-station');
    if (btn) btn.classList.add('open');
}

function closeDriveList() {
    const panel = document.getElementById('drive-list-panel');
    if (panel) {
        panel.classList.remove('open');
        panel.hidden = true;
    }
    const btn = document.getElementById('drive-station');
    if (btn) btn.classList.remove('open');
}

function toggleDriveList() {
    const panel = document.getElementById('drive-list-panel');
    if (panel.hidden) openDriveList();
    else closeDriveList();
}

function toggleDriveListMode() {
    state.driveListMode = state.driveListMode === 'all' ? 'favs' : 'all';
    const btn = document.getElementById('drive-toggle-list');
    if (btn) {
        btn.textContent = state.driveListMode === 'all' ? 'Todos' : 'Favoritas';
        btn.setAttribute('aria-pressed', state.driveListMode === 'favs' ? 'true' : 'false');
    }
    renderDriveList();
}

function setDriveAnim(on) {
    const overlay = document.getElementById('drive-mode');
    if (overlay) overlay.classList.toggle('anim-on', on);
    const btn = document.getElementById('drive-anim-btn');
    if (btn) {
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
        btn.classList.toggle('on', on);
    }
}

function setDriveBw(on) {
    const overlay = document.getElementById('drive-mode');
    if (overlay) overlay.classList.toggle('bw', on);
    const btn = document.getElementById('drive-bw-btn');
    if (btn) {
        btn.setAttribute('aria-pressed', on ? 'true' : 'false');
        btn.classList.toggle('on', on);
    }
}

// ---------- Favoritos ----------
function toggleFavorite(station) {
    const idx = state.favorites.indexOf(station.name);
    if (idx >= 0) {
        state.favorites.splice(idx, 1);
        showToast(`${station.name} removida dos favoritos`);
    } else {
        state.favorites.push(station.name);
        showToast(`${station.name} adicionada aos favoritos`);
    }
    saveJSON(STORE_FAVS, state.favorites);
    renderFavorites();
    renderDriveList();
    applyFilters();
}

// ---------- Player ----------
function updateNowPlaying(station) {
    document.getElementById('current-radio').textContent = station.name;
    document.getElementById('current-station').textContent = station.name;
    const nowPlaying = document.getElementById('now-playing');
    const oldFallback = nowPlaying.querySelector('.icon-fallback');
    if (oldFallback) oldFallback.remove();
    const icon = document.getElementById('current-icon');
    icon.style.display = 'inline-block';
    icon.src = station.icon;
    installIconFallback(icon, nowPlaying);
    updateDriveNow(station);
}

function highlightActive() {
    document.querySelectorAll('#stations li, #favorites-list li').forEach((li) => {
        li.classList.toggle('playing', !!(state.currentStation && state.currentStation.name === li.dataset.name));
    });
}

function setMediaSession(station) {
    if (!('mediaSession' in navigator)) return;
    navigator.mediaSession.metadata = new MediaMetadata({
        title: station.name,
        artist: 'MixStation',
        album: 'Webradio',
        artwork: [
            { src: station.icon, sizes: '96x96' },
            { src: station.icon, sizes: '128x128' }
        ]
    });
}

function playStation(station) {
    const player = document.getElementById('player');
    state.currentStation = station;
    player.src = station.url;
    player.play().catch(() => { /* autoplay ou conexão tratados pelo listener de erro */ });
    updateNowPlaying(station);
    setMediaSession(station);
    saveJSON(STORE_LAST, station.name);
    highlightActive();
}

function stopPlayer() {
    const player = document.getElementById('player');
    player.pause();
    player.currentTime = 0;
}

function setVolume(value) {
    const player = document.getElementById('player');
    const clamped = Math.min(1, Math.max(0, value));
    player.volume = clamped;
    const slider = document.getElementById('volume-slider');
    if (slider) slider.value = Math.round(clamped * 100);
    const driveSlider = document.getElementById('drive-slider');
    if (driveSlider) {
        driveSlider.value = Math.round(clamped * 100);
        driveSlider.style.setProperty('--fill', `${Math.round(clamped * 100)}%`);
    }
    saveJSON(STORE_VOLUME, clamped);
}

// ---------- Inicialização ----------
document.addEventListener('DOMContentLoaded', () => {
    const player = document.getElementById('player');
    const playPauseBtn = document.getElementById('play-pause');
    const stopBtn = document.getElementById('stop');
    const slider = document.getElementById('volume-slider');
    const genreFilter = document.getElementById('genre-filter');
    const searchBar = document.getElementById('search-bar');
    const favoritesToggle = document.getElementById('favorites-toggle');

    // Volume persistido
    const savedVolume = loadJSON(STORE_VOLUME, 1);
    setVolume(savedVolume);

    // Renderiza lista e filtros
    initTheme();
    populateGenreFilter();
    renderDriveList();
    applyFilters();
    renderFavorites();

    // Busca e filtros
    searchBar.addEventListener('input', applyFilters);
    genreFilter.addEventListener('change', () => {
        state.genre = genreFilter.value;
        applyFilters();
    });
    favoritesToggle.addEventListener('click', () => {
        state.favoritesOnly = !state.favoritesOnly;
        favoritesToggle.setAttribute('aria-pressed', state.favoritesOnly ? 'true' : 'false');
        favoritesToggle.classList.toggle('active', state.favoritesOnly);
        applyFilters();
    });

    // Controles do player (card + painel flutuante)
    const playPauseFloating = document.getElementById('play-pause-floating');
    const volumeUpBtn = document.getElementById('volume-up');
    const volumeDownBtn = document.getElementById('volume-down');

    function syncPlayButtons(isPlaying) {
        const icon = isPlaying ? 'fa-pause' : 'fa-play';
        playPauseBtn.innerHTML = `<i class="fas ${icon}"></i>`;
        playPauseFloating.innerHTML = `<i class="fas ${icon}"></i>`;
        playPauseFloating.classList.toggle('playing', isPlaying);
        const drivePlayBtn = document.getElementById('drive-play');
        if (drivePlayBtn) {
            drivePlayBtn.innerHTML = `<i class="fas ${icon}"></i>`;
            drivePlayBtn.classList.toggle('playing', isPlaying);
        }
    }

    function changeVolume(delta) {
        const next = Math.min(1, Math.max(0, player.volume + delta));
        setVolume(next); // atualiza player + slider + storage
        showToast(`Volume: ${Math.round(next * 100)}%`);
    }

    function togglePlayback() {
        if (player.paused) {
            if (!player.src) { showToast('Selecione uma rádio primeiro.'); return; }
            player.play();
        } else {
            player.pause();
        }
    }

    playPauseBtn.addEventListener('click', togglePlayback);
    playPauseFloating.addEventListener('click', togglePlayback);
    stopBtn.addEventListener('click', stopPlayer);

    volumeUpBtn.addEventListener('click', () => changeVolume(0.1));
    volumeDownBtn.addEventListener('click', () => changeVolume(-0.1));

    slider.addEventListener('input', () => changeVolume(0));

    // Sincroniza ambos os botões play/pause com o estado do player
    player.addEventListener('play', () => syncPlayButtons(true));
    player.addEventListener('pause', () => syncPlayButtons(false));

    // Tratamento de erro de conexão
    player.addEventListener('error', () => {
        syncPlayButtons(false);
        const st = state.currentStation;
        showToast(st ? `Não foi possível conectar em "${st.name}".` : 'Erro ao conectar.');
    });

    // Rola suavemente para o topo ao clicar no cabeçalho
    document.getElementById('page-header').addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Tema
    const themeSelect = document.getElementById('theme-select');
    themeSelect.addEventListener('click', (e) => e.stopPropagation());
    themeSelect.addEventListener('change', () => setTheme(themeSelect.value));

    // Modo Direção
    const driveBtn = document.getElementById('drive-mode-button');
    driveBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openDriveMode();
    });
    document.getElementById('drive-exit').addEventListener('click', closeDriveMode);
    document.getElementById('drive-prev').addEventListener('click', prevRadio);
    document.getElementById('drive-next').addEventListener('click', nextRadio);
    document.getElementById('drive-play').addEventListener('click', togglePlayback);
    document.getElementById('drive-vol-up').addEventListener('click', () => changeVolume(0.1));
    document.getElementById('drive-vol-down').addEventListener('click', () => changeVolume(-0.1));
    document.getElementById('drive-slider').addEventListener('input', () => changeVolume(0));
    document.getElementById('drive-station').addEventListener('click', toggleDriveList);
    document.getElementById('drive-toggle-list').addEventListener('click', toggleDriveListMode);
    document.getElementById('drive-list-close').addEventListener('click', closeDriveList);
    document.getElementById('drive-list-panel').addEventListener('click', (e) => {
        if (e.target === document.getElementById('drive-list-panel')) closeDriveList();
    });

    document.getElementById('drive-anim-btn').addEventListener('click', () => {
        setDriveAnim(!document.getElementById('drive-mode').classList.contains('anim-on'));
    });
    document.getElementById('drive-bw-btn').addEventListener('click', () => {
        setDriveBw(!document.getElementById('drive-mode').classList.contains('bw'));
    });

    // Fechar modo direção com Esc
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeDriveMode();
    });

    // Restaura última rádio (o autoplay pode ser bloqueado pelo navegador)
    const lastName = loadJSON(STORE_LAST, null);
    if (lastName) {
        const lastStation = stations.find((s) => s.name === lastName);
        if (lastStation) {
            playStation(lastStation);
            player.pause();
            syncPlayButtons(false);
        }
    }
});
