
// Requirement 6: Cache to store episode data (URL as key) to avoid repeated fetches
const showCache = {};
let allEpisodesCache = [];

async function setup() {
  const rootElement = document.getElementById("root");
  const searchBox = document.getElementById("episode-search-input");
  const showSelector = document.getElementById("show-selector");

  try {
    // Requirement 2: Fetch all available shows
    const showResponse = await fetch("https://api.tvmaze.com/shows");
    let allShows = await showResponse.json();

    // Requirement 5: Sort shows alphabetically, case-insensitive
    allShows.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));

    // Populate show drop-down
    allShows.forEach((show) => {
      const option = document.createElement("option");
      option.value = show.id;
      option.textContent = show.name;
      showSelector.appendChild(option);
    });

  } catch (err) {
    console.error("Error fetching shows", err);
  }

  // Requirement 3: Event listener for selecting a show
  showSelector.addEventListener("change", async (event) => {
    const showId = event.target.value;
    if (!showId) return;

    const episodeUrl = `https://api.tvmaze.com/shows/${showId}/episodes`;

    // Requirement 6: Never fetch the same URL more than once
    if (showCache[episodeUrl]) {
      allEpisodesCache = showCache[episodeUrl];
      renderEpisodes(allEpisodesCache);
    } else {
      rootElement.innerHTML = "<p style='text-align:center;'>Loading episodes...</p>";
      try {
        const response = await fetch(episodeUrl);
        const data = await response.json();

        // Save to cache and update state
        showCache[episodeUrl] = data;
        allEpisodesCache = data;

        renderEpisodes(allEpisodesCache);
      } catch (err) {
        rootElement.innerHTML = `<p style='color:red;'>Error loading episodes: ${err.message}</p>`;
      }
    }

    // Reset search box when changing shows
    searchBox.value = "";
    updateSearchCount(allEpisodesCache.length, allEpisodesCache.length);
  });

  // Requirement 4: Ensure Search listener still works
  searchBox.addEventListener("input", (event) => {
    const searchTerm = event.target.value.toLowerCase();

    const filteredEpisodes = allEpisodesCache.filter((episode) => {
      const episodeName = (episode.name || "").toLowerCase();
      const episodeSummary = (episode.summary || "").toLowerCase();
      return episodeName.includes(searchTerm) || episodeSummary.includes(searchTerm);
    });

    renderEpisodes(filteredEpisodes);
    updateSearchCount(filteredEpisodes.length, allEpisodesCache.length);
  });
}

function updateSearchCount(matchCount, totalCount) {
  const countDisplay = document.getElementById("search-count-display");
  countDisplay.innerText = `Displaying ${matchCount} / ${totalCount} episodes`;
}

function renderEpisodes(episodesToDisplay) {
  const rootElement = document.getElementById("root");
  rootElement.innerHTML = "";

  rootElement.style.display = "flex";
  rootElement.style.flexWrap = "wrap";
  rootElement.style.gap = "20px";
  rootElement.style.padding = "20px";
  rootElement.style.justifyContent = "center";

  if (episodesToDisplay.length === 0) {
    rootElement.innerHTML = "<p>No episodes match your current search.</p>";
    return;
  }

  episodesToDisplay.forEach((episode) => {
    const seasonPadded = String(episode.season).padStart(2, "0");
    const numberPadded = String(episode.number).padStart(2, "0");
    const episodeCode = `S${seasonPadded}E${numberPadded}`;

    const episodeCard = document.createElement("div");
    Object.assign(episodeCard.style, {
      width: "250px",
      background: "#fff",
      padding: "10px",
      border: "1px solid #ccc",
      borderRadius: "8px",
      color: "black"
    });

    const imageUrl = episode.image ? episode.image.medium : "https://via.placeholder.com/210x295?text=No+Image";

    episodeCard.innerHTML = `
      <div style="background:#eaeaea; padding:8px; border-radius:6px; font-weight:bold; text-align:center; margin-bottom:10px;">
        ${episodeCode} — ${episode.name}
      </div>
      <img src="${imageUrl}" alt="${episode.name}" style="width:100%; border-radius:6px;">
      <p style="font-size: 0.9rem;">${episode.summary || "No summary available."}</p>
    `;

    rootElement.appendChild(episodeCard);
  });
}

window.onload = setup;

