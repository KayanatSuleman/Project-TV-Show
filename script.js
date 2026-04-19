let allShows = [];
let allEpisodes = [];
let currentShow = null;

const cache = {
  shows: null,
  episodesByShowId: {},
};

function formatEpisodeCode(season, episodeNumber) {
  const formattedSeason = String(season).padStart(2, "0");
  const formattedEpisodeNumber = String(episodeNumber).padStart(2, "0");
  return `S${formattedSeason}E${formattedEpisodeNumber}`;
}

function stripHtmlTags(htmlString) {
  const tempEl = document.createElement("div");
  tempEl.innerHTML = htmlString;
  return tempEl.textContent || "";
}

/* ---------------- NEW: Show Selector ---------------- */
function populateShowSelector(showList) {
  const showSelector = document.getElementById("show-selector");

  if (!showSelector) return;

  showSelector.innerHTML = "";

  showList.forEach(function (show) {
    const option = document.createElement("option");
    option.value = show.id;
    option.textContent = show.name;
    showSelector.appendChild(option);
  });
}

/* --------------------------------------------------- */

function createShowCard(show) {
  const showCard = document.createElement("article");
  showCard.className = "show-card";

  const showTitle = document.createElement("h2");
  showTitle.className = "show-title";

  const showButton = document.createElement("button");
  showButton.type = "button";
  showButton.textContent = show.name;
  showButton.addEventListener("click", function () {
    openShowEpisodes(show);
  });

  showTitle.appendChild(showButton);

  const showMeta = document.createElement("p");
  showMeta.className = "show-meta";
  showMeta.textContent =
    `Genres: ${show.genres.join(", ") || "N/A"} | ` +
    `Status: ${show.status || "N/A"} | ` +
    `Rating: ${show.rating?.average ?? "N/A"} | ` +
    `Runtime: ${show.runtime ?? "N/A"} mins`;

  const showImage = document.createElement("img");
  showImage.className = "show-image";
  showImage.src = show.image?.medium || "";
  showImage.alt = show.name;

  const showSummary = document.createElement("div");
  showSummary.className = "show-summary";
  showSummary.innerHTML = show.summary || "";

  const showLink = document.createElement("a");
  showLink.className = "show-link";
  showLink.href = show.url;
  showLink.target = "_blank";
  showLink.rel = "noopener noreferrer";
  showLink.textContent = "View this show on TVMaze";

  showCard.appendChild(showTitle);
  showCard.appendChild(showMeta);
  showCard.appendChild(showImage);
  showCard.appendChild(showSummary);
  showCard.appendChild(showLink);

  return showCard;
}

function createEpisodeCard(episode) {
  const episodeCard = document.createElement("article");
  episodeCard.className = "episode-card";

  const episodeTitle = document.createElement("h2");
  episodeTitle.className = "episode-title";
  episodeTitle.textContent = episode.name;

  const episodeDetails = document.createElement("p");
  episodeDetails.className = "episode-details";
  episodeDetails.textContent = `Season ${episode.season}, Episode ${episode.number} (${formatEpisodeCode(
    episode.season,
    episode.number
  )})`;

  const episodeImage = document.createElement("img");
  episodeImage.className = "episode-image";
  episodeImage.src = episode.image?.medium || "";
  episodeImage.alt = episode.name;

  const episodeSummary = document.createElement("div");
  episodeSummary.className = "episode-summary";
  episodeSummary.innerHTML = episode.summary || "";

  const episodeLink = document.createElement("a");
  episodeLink.className = "episode-link";
  episodeLink.href = episode.url;
  episodeLink.target = "_blank";
  episodeLink.rel = "noopener noreferrer";
  episodeLink.textContent = "View this episode on TVMaze";

  episodeCard.appendChild(episodeTitle);
  episodeCard.appendChild(episodeDetails);
  episodeCard.appendChild(episodeImage);
  episodeCard.appendChild(episodeSummary);
  episodeCard.appendChild(episodeLink);

  return episodeCard;
}

function renderShows(showList) {
  const showsRoot = document.getElementById("shows-root");
  const showCount = document.getElementById("show-count");

  showsRoot.innerHTML = "";
  showCount.textContent = `Displaying ${showList.length} show(s)`;

  showList.forEach(function (show) {
    showsRoot.appendChild(createShowCard(show));
  });
}

function renderEpisodes(episodeList) {
  const episodesRoot = document.getElementById("episodes-root");
  const episodeCount = document.getElementById("episode-count");

  episodesRoot.innerHTML = "";
  episodeCount.textContent = `Displaying ${episodeList.length} episode(s)`;

  episodeList.forEach(function (episode) {
    episodesRoot.appendChild(createEpisodeCard(episode));
  });
}

function populateEpisodeSelector(episodeList) {
  const episodeSelect = document.getElementById("episode-select");
  episodeSelect.innerHTML = '<option value="all">All Episodes</option>';

  episodeList.forEach(function (episode) {
    const option = document.createElement("option");
    option.value = formatEpisodeCode(episode.season, episode.number);
    option.textContent = `${formatEpisodeCode(
      episode.season,
      episode.number
    )} - ${episode.name}`;
    episodeSelect.appendChild(option);
  });
}

function showShowsView() {
  document.getElementById("shows-view").classList.remove("hidden");
  document.getElementById("episodes-view").classList.add("hidden");
  document.getElementById("episode-count").textContent = "";
}

function showEpisodesView() {
  document.getElementById("shows-view").classList.add("hidden");
  document.getElementById("episodes-view").classList.remove("hidden");
}

async function fetchShows() {
  if (cache.shows) {
    return cache.shows;
  }

  const response = await fetch("https://api.tvmaze.com/shows");

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  const shows = await response.json();
  cache.shows = shows;
  return shows;
}

async function fetchEpisodesByShowId(showId) {
  if (cache.episodesByShowId[showId]) {
    return cache.episodesByShowId[showId];
  }

  const response = await fetch(`https://api.tvmaze.com/shows/${showId}/episodes`);

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  const episodes = await response.json();
  cache.episodesByShowId[showId] = episodes;
  return episodes;
}

function handleShowSearch() {
  const searchValue = document
    .getElementById("show-search")
    .value.toLowerCase()
    .trim();

  const filteredShows = allShows.filter(function (show) {
    const nameMatches = show.name.toLowerCase().includes(searchValue);
    const genreMatches = show.genres.join(" ").toLowerCase().includes(searchValue);
    const summaryMatches = stripHtmlTags(show.summary || "")
      .toLowerCase()
      .includes(searchValue);

    return nameMatches || genreMatches || summaryMatches;
  });

  renderShows(filteredShows);
}

function handleEpisodeFilter() {
  const episodeSearch = document
    .getElementById("episode-search")
    .value.toLowerCase()
    .trim();

  const selectedEpisode = document.getElementById("episode-select").value;

  let filteredEpisodes = allEpisodes;

  if (selectedEpisode !== "all") {
    filteredEpisodes = filteredEpisodes.filter(function (episode) {
      return (
        formatEpisodeCode(episode.season, episode.number) === selectedEpisode
      );
    });
  }

  if (episodeSearch !== "") {
    filteredEpisodes = filteredEpisodes.filter(function (episode) {
      const nameMatches = episode.name.toLowerCase().includes(episodeSearch);
      const summaryMatches = stripHtmlTags(episode.summary || "")
        .toLowerCase()
        .includes(episodeSearch);

      return nameMatches || summaryMatches;
    });
  }

  renderEpisodes(filteredEpisodes);
}

async function openShowEpisodes(show) {
  currentShow = show;
  showEpisodesView();

  document.getElementById("episode-search").value = "";
  document.getElementById("episode-select").innerHTML =
    '<option value="all">All Episodes</option>';

  try {
    allEpisodes = await fetchEpisodesByShowId(show.id);
    populateEpisodeSelector(allEpisodes);
    renderEpisodes(allEpisodes);
  } catch (error) {
    document.getElementById("episodes-root").innerHTML =
      "<p>Sorry, we could not load the episodes for this show right now.</p>";
    document.getElementById("episode-count").textContent = "";
  }
}

async function setup() {
  document
    .getElementById("show-search")
    .addEventListener("input", handleShowSearch);

  document
    .getElementById("episode-search")
    .addEventListener("input", handleEpisodeFilter);

  document
    .getElementById("episode-select")
    .addEventListener("change", handleEpisodeFilter);

  document
    .getElementById("back-button")
    .addEventListener("click", showShowsView);

  /* NEW: show selector listener */
  const showSelector = document.getElementById("show-selector");
  if (showSelector) {
    showSelector.addEventListener("change", function (event) {
      const selectedShow = allShows.find(function (show) {
        return show.id === Number(event.target.value);
      });

      if (selectedShow) {
        openShowEpisodes(selectedShow);
      }
    });
  }

  try {
    /* UPDATED: sorted shows */
    allShows = (await fetchShows()).slice().sort(function (a, b) {
      return a.name.localeCompare(b.name, undefined, { sensitivity: "base" });
    });

    populateShowSelector(allShows); // NEW
    renderShows(allShows);
    showShowsView();
  } catch (error) {
    document.getElementById("shows-root").innerHTML =
      "<p>Sorry, we could not load the shows right now.</p>";
    document.getElementById("show-count").textContent = "";
  }
}

window.addEventListener("load", setup);