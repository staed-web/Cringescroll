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
    const { url, title } = await res.json();

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
  }
}
