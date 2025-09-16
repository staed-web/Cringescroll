const container = document.getElementById("container");

async function fetchMeme() {
  try {
    const res = await fetch("/.netlify/functions/fetch-meme");
    const data = await res.json();

    const card = document.createElement("div");
    card.className = "meme-card";

    const titleEl = document.createElement("div");
    titleEl.className = "title";
    titleEl.textContent = data.title;
    card.appendChild(titleEl);

    const img = document.createElement("img");
    img.src = data.url;
    img.alt = data.title;
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
    console.error("Failed:", err);
    
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