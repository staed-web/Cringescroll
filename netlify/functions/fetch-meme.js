import fetch from 'node-fetch';

exports.handler = async () => {
  const apiKey = "dc6zaTOxFJmzC";
  const tags = ["cringe", "awkward", "embarrassing", "secondhand embarrassment"];
  const tag = tags[Math.floor(Math.random() * tags.length)];
  const url = `https://api.giphy.com/v1/gifs/random?api_key=${apiKey}&tag=${encodeURIComponent(tag)}&rating=g`;

  try {
    // Add User-Agent header to bypass GIPHY's block
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    
    const data = await res.json();
    if (!data.data || !data.data.images) throw new Error("Invalid response");

    return {
      statusCode: 200,
      body: JSON.stringify({
        url: data.data.images.original.url,
        title: data.data.title || `${tag.toUpperCase()} Moment`
      })
    };
  } catch (err) {
    console.error("Error fetching from GIPHY:", err.message);
    return {
      statusCode: 200,
      body: JSON.stringify({
        url: "https://i.imgur.com/8l9kx7q6s6v01.jpg",
        title: "Fallback Cringe: I'm not sad, I'm just crying for no reason"
      })
    };
  }
};