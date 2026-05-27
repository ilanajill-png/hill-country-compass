const moodWeights = {
  balanced: { garden: 1, music: 1, food: 1, history: 1, code: 1, weirdness: 0.7 },
  garden: { garden: 2.5, food: 0.7, history: 0.8, music: 0.4, code: 0.8, weirdness: 0.5 },
  music: { music: 2.6, food: 1, history: 0.8, garden: 0.2, code: 0.4, weirdness: 0.8 },
  food: { food: 2.5, history: 1, music: 0.8, garden: 0.4, code: 0.3, weirdness: 0.7 },
  history: { history: 2.5, weirdness: 1.4, food: 0.8, garden: 0.5, music: 0.4, code: 0.4 },
  code: { code: 4, food: 0.35, history: 0.25, music: 0.2, garden: 0.25, weirdness: 0.35 }
};

const metrics = ["garden", "music", "food", "history", "code"];
const platforms = [
  {
    id: "spotify",
    name: "Spotify",
    url: (track) =>
      `https://open.spotify.com/search/${encodeURIComponent(`${track.title} ${track.artist}`)}`
  },
  {
    id: "apple",
    name: "Apple Music",
    url: (track) =>
      `https://music.apple.com/us/search?term=${encodeURIComponent(`${track.title} ${track.artist}`)}`
  },
  {
    id: "soundcloud",
    name: "SoundCloud",
    url: (track) =>
      `https://soundcloud.com/search?q=${encodeURIComponent(`${track.title} ${track.artist}`)}`
  }
];

const moodNames = {
  balanced: "Balanced",
  garden: "Garden brain",
  music: "Live music",
  food: "Good food",
  history: "Weird history",
  code: "Code/lifehack"
};

const state = {
  mood: "balanced",
  drive: 120,
  data: null
};

const moodSelect = document.querySelector("#mood");
const driveSelect = document.querySelector("#drive");
const cards = document.querySelector("#cards");
const bestTitle = document.querySelector("#best-title");
const bestCopy = document.querySelector("#best-copy");
const gardenTask = document.querySelector("#garden-task");
const playlistTitle = document.querySelector("#playlist-title");
const playlistCopy = document.querySelector("#playlist-copy");
const playlists = document.querySelector("#playlists");

function scorePlace(place) {
  const weights = moodWeights[state.mood];
  const interestScore = Object.entries(weights).reduce((sum, [key, weight]) => {
    return sum + (place[key] || 0) * weight;
  }, 0);
  const drivePenalty = Math.max(0, place.distanceFromSchertzMinutes - 35) / 18;
  const overlapBonus =
    state.mood === "code"
      ? metrics.filter((metric) => metric !== "code" && place[metric] >= 3).length * 0.35
      : metrics.filter((metric) => place[metric] >= 3).length * 1.4;
  const weakCodePenalty = state.mood === "code" && place.code < 3 ? 7 : 0;
  const energyPenalty = place.energy > 3 ? 0.8 : 0;
  return (
    Math.round(
      (interestScore + overlapBonus - drivePenalty - energyPenalty - weakCodePenalty) * 10
    ) / 10
  );
}

function visiblePlaces() {
  return state.data.places
    .filter((place) => place.distanceFromSchertzMinutes <= state.drive)
    .map((place) => ({ ...place, score: scorePlace(place) }))
    .sort((a, b) => b.score - a.score);
}

function renderBars(place) {
  return metrics
    .map((metric) => {
      const value = place[metric];
      return `
        <div class="bar">
          <span>${metric}</span>
          <span class="track"><span class="fill" style="width: ${value * 20}%"></span></span>
          <span>${value}</span>
        </div>
      `;
    })
    .join("");
}

function renderPlaceActions(place) {
  const time = place.timeNote
    ? `<p class="time-note"><strong>Time:</strong> ${place.timeNote}</p>`
    : "";
  const link = place.learnMoreUrl
    ? `<a class="learn-more" href="${place.learnMoreUrl}" target="_blank" rel="noreferrer">Learn more</a>`
    : "";

  return `${time}${link}`;
}

function driveMinutesForPlaylist() {
  if (state.drive <= 35) return 35;
  if (state.drive <= 75) return 75;
  return 105;
}

function playlistLength() {
  if (state.drive <= 35) return 5;
  if (state.drive <= 75) return 8;
  return 12;
}

function tracksForMood() {
  const basePool = state.data.playlistPools[state.mood] || state.data.playlistPools.balanced;
  const balancedPool = state.data.playlistPools.balanced || [];
  const pool = state.mood === "balanced" ? basePool : [...basePool, ...balancedPool];
  const count = playlistLength();
  const tracks = [];

  for (let index = 0; tracks.length < count; index += 1) {
    tracks.push(pool[index % pool.length]);
  }

  return tracks;
}

function renderPlaylists() {
  const tracks = tracksForMood();
  const driveMinutes = driveMinutesForPlaylist();
  const label = moodNames[state.mood] || "Balanced";

  playlistTitle.textContent = `${label} drive playlist`;
  playlistCopy.textContent = `${tracks.length} tracks tuned for about ${driveMinutes} minutes of Hill Country driving. Links open searches in each service so the list works without account auth.`;

  playlists.innerHTML = platforms
    .map((platform) => {
      const availableTracks = tracks.filter((track) => track.platforms.includes(platform.id));
      const trackList = availableTracks
        .map(
          (track, index) => `
            <li>
              <span class="track-number">${index + 1}</span>
              <div>
                <strong>${track.title}</strong>
                <span>${track.artist}</span>
              </div>
              <a href="${platform.url(track)}" target="_blank" rel="noreferrer">Open</a>
            </li>
          `
        )
        .join("");

      const query = availableTracks.map((track) => `${track.title} ${track.artist}`).join(" ");

      return `
        <article class="playlist-card">
          <div>
            <p class="eyebrow">${platform.name}</p>
            <h3>${label} route mix</h3>
            <p>${availableTracks.length} searchable tracks for this service.</p>
          </div>
          <ol>${trackList}</ol>
          <a class="playlist-search" href="${platform.url({ title: query, artist: "" })}" target="_blank" rel="noreferrer">
            Search full mix
          </a>
        </article>
      `;
    })
    .join("");
}

function render() {
  const ranked = visiblePlaces();
  const best = ranked[0];

  bestTitle.textContent = best ? best.name : "No match in that drive range";
  bestCopy.textContent = best
    ? `${best.city} - ${best.vibe}. ${best.why}`
    : "Try a wider drive range or add more local seed data.";

  const month = new Date().toLocaleString("en-US", { month: "long" });
  const task =
    state.data.gardenTasks.find((item) => item.month === month) || state.data.gardenTasks[0];
  gardenTask.textContent = `${task.task} ${task.why}`;

  cards.innerHTML = ranked
    .map(
      (place) => `
        <article class="card">
          <div class="card-top">
            <div class="meta">
              <span class="pill">${place.city}</span>
              <span class="pill">${place.timeWindow}</span>
              <span class="pill">${place.distanceFromSchertzMinutes} min</span>
            </div>
            <h2>${place.name}</h2>
            <p class="score">Fit score ${place.score}</p>
            <p class="why">${place.why}</p>
            <div class="place-actions">${renderPlaceActions(place)}</div>
          </div>
          <div class="bars">${renderBars(place)}</div>
        </article>
      `
    )
    .join("");

  renderPlaylists();
}

async function boot() {
  const response = await fetch("data/seed.json");
  state.data = await response.json();
  render();
}

moodSelect.addEventListener("change", (event) => {
  state.mood = event.target.value;
  render();
});

driveSelect.addEventListener("change", (event) => {
  state.drive = Number(event.target.value);
  render();
});

boot();
