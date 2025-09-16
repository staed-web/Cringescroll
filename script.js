const container = document.getElementById("container");

window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 600) {
    fetchMeme();
  }
});

fetchMeme(); // Load first meme

async function fetchMeme() {
  try {
    const res = await fetch("/.netlify/functions/fetch-meme");
    const data = await res.json();

    // Default fallback if title is missing
    const title = data.title || "Cringe Moment";
    const url = data.url || "https://via.placeholder.com/500x300?text=Failed+to+load";

    const meme = document.createElement("div");
    meme.className = "meme";
    meme.innerHTML = `
      <h3>${title}</h3>
      <img src="${url}" loading="lazy">
    `;
    container.appendChild(meme);

    // Add AdSense every 3rd item
    if (container.children.length % 3 === 0) {
      const ad = document.createElement("div");
      ad.className = "ad";
      ad.innerHTML = "[ ADSENSE GOES HERE ]";
      container.appendChild(ad);
    }

  } catch (err) {
    console.error("Failed:", err);
    
    const fallback = document.createElement("div");
    fallback.className = "meme";
    fallback.innerHTML = `
      <h3>Fallback Cringe</h3>
      <img src="https://i.imgur.com/8l9kx7q6s6v01.jpg" loading="lazy">
    `;
    container.appendChild(fallback);
  }
}