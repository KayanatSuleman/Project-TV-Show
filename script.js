// You can edit ALL of the code here

let allEpisodes = [];

function formatEpisodeCode(season, episodeNumber) {
  const formattedSeason = String(season).padStart(2, "0");
  const formattedEpisodeNumber = String(episodeNumber).padStart(2, "0");
  return `S${formattedSeason}E${formattedEpisodeNumber}`;
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
  episodeSummary.innerHTML = episode.summary;

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

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  const episodeCountElem = document.getElementById("episode-count");

  rootElem.innerHTML = "";
  episodeCountElem.textContent = `Displaying ${episodeList.length} episode(s)`;

  episodeList.forEach(function (episode) {
    const episodeCard = createEpisodeCard(episode);
    rootElem.appendChild(episodeCard);
  });
}

function showLoadingMessage() {
  const rootElem = document.getElementById("root");
  const episodeCountElem = document.getElementById("episode-count");

  rootElem.innerHTML = "<p>Loading episodes, please wait...</p>";
  episodeCountElem.textContent = "";
}

function showErrorMessage() {
  const rootElem = document.getElementById("root");
  const episodeCountElem = document.getElementById("episode-count");

  rootElem.innerHTML =
    "<p>Sorry, we could not load the episode data right now.</p>";
  episodeCountElem.textContent = "";
}

async function fetchEpisodes() {
  const response = await fetch("https://api.tvmaze.com/shows/82/episodes");

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  return response.json();
}

async function setup() {
  showLoadingMessage();

  try {
    allEpisodes = await fetchEpisodes();
    makePageForEpisodes(allEpisodes);
  } catch (error) {
    showErrorMessage();
  }
}

window.onload = setup;