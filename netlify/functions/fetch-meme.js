import fetch from 'node-fetch';

// List of fallback URLs if GIPHY fails
const fallbacks = [
  "https://i.imgur.com/8l9kx7q6s6v01.jpg",
  "https://i.redd.it/1hjwv4z6g9t01.jpg",
  "https://i.redd.it/3f7d7e7o6u001.jpg"
];

async function fetchWithRetry(url, retries = 3) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    
    return await res.json();
  } catch (err) {
    if (retries > 0) {
      console.warn(`Failed, retrying... ${retries} left`);
      return fetchWithRetry(url, retries - 1);
    }
    throw err;
  }
}

exports.handler = async () => {
  const apiKey = "dc6zaTOxFJmzC";
  const tags = ["cringe", "awkward", "embarrassing", "secondhand embarrassment"];
  const tag = tags[Math.floor(Math.random() * tags.length)];
  const url = `https://api.giphy.com/v1/gifs/random?api_key=${apiKey}&tag=${encodeURIComponent(tag)}&rating=g`;

  try {
    const data = await fetchWithRetry(url);

    if (!data.data || !data.data.images) {
      throw new Error("Invalid response");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        url: data.data.images.original.url,
        title: data.data.title || `${tag.toUpperCase()} Moment`
      })
    };
  } catch (err) {
    console.error("Final error:", err.message);
    const randomFallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    return {
      statusCode: 200,
      body: JSON.stringify({
        url: randomFallback,
        title: "Fallback Cringe"
      })
    };
  }
};