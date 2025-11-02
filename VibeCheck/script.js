const SPOTIFY_TOKEN = "YOUR_SPOTIFY_TOKEN"; // temporary token for testing

// All genre tags for mood.html
const tags = ['00s', '60s', '70s', '80s', '90s', 'acoustic', 'alternative', 'alternative rock', 'ambient', 'black metal', 'blues', 'blues rock', 'britpop', 'chill', 'chillout', 'classic rock', 'classical', 'country', 'dance', 'dark ambient', 'death metal', 'doom metal', 'downtempo', 'drum and bass', 'electronic', 'emo', 'experimental', 'folk', 'funk', 'gothic', 'grunge', 'hard-rock', 'hardcore', 'heavy metal', 'hip-hop', 'house', 'idm', 'indie', 'indie pop', 'indie rock', 'instrumental', 'jazz', 'love', 'mellow', 'metal', 'metalcore', 'new wave', 'nu metal', 'oldies', 'pop', 'pop-rock', 'post rock', 'power metal', 'progressive metal', 'progressive rock', 'psychedelic', 'punk', 'punk rock', 'rap', 'reggae', 'rnb', 'rock', 'screamo', 'soul', 'soundtrack', 'symphonic metal', 'synthpop', 'techno', 'thrash metal', 'trance', 'trip hop'];

document.addEventListener("DOMContentLoaded", () => {
  const tagContainer = document.getElementById("tagContainer");
  if (tagContainer) {
    tags.forEach(tag => {
      const checkbox = document.createElement("label");
      checkbox.innerHTML = `<input type="checkbox" value="${tag}"> ${tag}`;
      tagContainer.appendChild(checkbox);
    });
  }

  // Song search
  const songBtn = document.getElementById("songSearchBtn");
  if (songBtn) {
    songBtn.addEventListener("click", async () => {
      const songName = document.getElementById("songInput").value;
      if (!songName) return alert("Enter a song name!");

      const results = document.getElementById("results");
      results.innerHTML = "<p>Loading...</p>";

      try {
        const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(songName)}&type=track&limit=1`, {
          headers: { Authorization: `Bearer ${SPOTIFY_TOKEN}` },
        });
        const data = await response.json();
        if (!data.tracks.items.length) return (results.innerHTML = "No song found!");

        const track = data.tracks.items[0];
        const seedTrack = track.id;

        const recs = await fetch(`https://api.spotify.com/v1/recommendations?limit=10&seed_tracks=${seedTrack}`, {
          headers: { Authorization: `Bearer ${SPOTIFY_TOKEN}` },
        });
        const recData = await recs.json();

        results.innerHTML = recData.tracks
          .map(t => `<div class="song"><strong>${t.name}</strong> - ${t.artists[0].name}<br><a href="${t.external_urls.spotify}" target="_blank">🎵 Listen on Spotify</a></div>`)
          .join("");
      } catch (err) {
        results.innerHTML = "Error fetching recommendations.";
      }
    });
  }

  // Mood + tags search
  const moodBtn = document.getElementById("moodSearchBtn");
  if (moodBtn) {
    moodBtn.addEventListener("click", async () => {
      const mood = document.getElementById("moodSelect").value.toLowerCase();
      const selectedTags = Array.from(document.querySelectorAll(".tags input:checked")).map(cb => cb.value);

      if (!mood) return alert("Select a mood!");
      if (!selectedTags.length) return alert("Pick at least one tag!");

      const genreSeed = selectedTags.slice(0, 5).join(",");

      const moodResults = document.getElementById("moodResults");
      moodResults.innerHTML = "<p>Loading...</p>";

      try {
        const recs = await fetch(`https://api.spotify.com/v1/recommendations?limit=10&seed_genres=${genreSeed}`, {
          headers: { Authorization: `Bearer ${SPOTIFY_TOKEN}` },
        });
        const recData = await recs.json();

        moodResults.innerHTML = recData.tracks
          .map(t => `<div class="song"><strong>${t.name}</strong> - ${t.artists[0].name}<br><a href="${t.external_urls.spotify}" target="_blank">🎧 Listen on Spotify</a></div>`)
          .join("");
      } catch (err) {
        moodResults.innerHTML = "Error fetching mood recommendations.";
      }
    });
  }
});
