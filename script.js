// You can edit ALL of the code here

function setup() {
  const allEpisodesList = getAllEpisodes();
  const searchBox = document.getElementById("episode-search-input");

  // Initial render
  renderEpisodes(allEpisodesList);

  // Requirement 3: Update immediately on each keystroke
  searchBox.addEventListener("input", (event) => {
    const searchTerm = event.target.value.toLowerCase(); // Requirement 2: Case-insensitive

    const filteredEpisodes = allEpisodesList.filter((episode) => {
      const episodeName = episode.name.toLowerCase();
      const episodeSummary = (episode.summary || "").toLowerCase();

      // Requirement 1 & 5: Match name OR summary. If empty, all will return true.
      return episodeName.includes(searchTerm) || episodeSummary.includes(searchTerm);
    });

    renderEpisodes(filteredEpisodes);
    updateSearchCount(filteredEpisodes.length, allEpisodesList.length);
  });
}

function updateSearchCount(matchCount, totalCount) {
  const countDisplay = document.getElementById("search-count-display");
  // Requirement 4: Display how many match
  countDisplay.innerText = `Displaying ${matchCount} / ${totalCount} episodes`;
}

function renderEpisodes(episodesToDisplay) {
  const rootElement = document.getElementById("root");
  rootElement.innerHTML = "";

  // Layout styling
  rootElement.style.display = "flex";
  rootElement.style.flexWrap = "wrap";
  rootElement.style.gap = "20px";
  rootElement.style.padding = "20px";
  rootElement.style.justifyContent = "center";

  episodesToDisplay.forEach((episode) => {
    // Clearer variable names for formatting
    const seasonPadded = String(episode.season).padStart(2, "0");
    const numberPadded = String(episode.number).padStart(2, "0");
    const episodeCode = `S${seasonPadded}E${numberPadded}`;

    const episodeCard = document.createElement("div");
    episodeCard.style.width = "250px";
    episodeCard.style.background = "#fff";
    episodeCard.style.padding = "10px";
    episodeCard.style.border = "1px solid #ccc";
    episodeCard.style.borderRadius = "8px";
    episodeCard.style.color = "black";

    episodeCard.innerHTML = `
      <div style="background:#eaeaea; padding:8px; border-radius:6px; font-weight:bold; text-align:center; margin-bottom:10px;">
        ${episodeCode} — ${episode.name}
      </div>
      <img src="${episode.image?.medium}" alt="${episode.name}" style="width:100%; border-radius:6px;">
      <p>${episode.summary}</p>
      <p><a href="${episode.url}" target="_blank">View on TVMaze</a></p>
    `;

    rootElement.appendChild(episodeCard);
  });

  // Re-add attribution
  const footerAttribution = document.createElement("p");
  footerAttribution.style.width = "100%";
  footerAttribution.style.textAlign = "center";
  footerAttribution.innerHTML = `Data originally from <a href="https://www.tvmaze.com/" target="_blank">TVMaze.com</a>.`;
  rootElement.appendChild(footerAttribution);
}

window.onload = setup;
