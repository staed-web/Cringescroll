const container = document.getElementById("container");

// GIPHY API (public key)
const apiKey = "dc6zaTOxFJmzC";

// Cringe tags
const tags = ["cringe", "awkward", "embarrassing", "social anxiety"];

// Try to fetch meme
async function fetchMeme() {
  const tag = tags[Math.floor(Math.random() * tags.length)];
  const url = `https://api.giphy.com/v1/gifs/random?api_key=${apiKey}&tag=${encodeURIComponent(tag)}&rating=g`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    
    const data = await res.json();
    if (!data.data || !data.data.images) throw new Error("Invalid response");

    const gif = data.data;
    const imageUrl = gif.images.original.url;
    const title = gif.title || `${tag.toUpperCase()} Moment`;

    // Create meme card
    const card = document.createElement("div");
    card.className = "meme-card";

    const titleEl = document.createElement("div");
    titleEl.className = "title";
    titleEl.textContent = title;
    card.appendChild(titleEl);

    const img = document.createElement("img");
    img.src = imageUrl;
    img.alt = title;
    img.loading = "lazy";
    img.onerror = () => {
      img.src = "https://via.placeholder.com/500x300?text=Image+Failed";
    };
    card.appendChild(img);

    container.appendChild(card);

    // Insert ad every 3rd item
    if (container.children.length % 3 === 0) {
      const ad = document.createElement("div");
      ad.className = "ad-unit";
      ad.innerHTML = "[ GOOGLE ADSENSE WILL GO HERE ]";
      container.appendChild(ad);
    }

  } catch (err) {
    console.warn("Failed:", err.message);

    // Show error message
    const errorDiv = document.createElement("div");
    errorDiv.className = "error";
    errorDiv.innerHTML = `
      <span style="font-size: 2rem;">❌</span>
      <br>
      <strong>Failed to load meme</strong>
      <br>
      Trying again...
    `;
    container.appendChild(errorDiv);

    // Retry after 3 seconds
    setTimeout(() => {
      if (errorDiv.parentNode) errorDiv.remove();
      fetchMeme();
    }, 3000);
  }
}

// Load first meme on open
fetchMeme();

// Load more when scrolling
window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 600) {
    fetchMeme();
  }
});