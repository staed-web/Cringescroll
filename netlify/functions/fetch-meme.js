import fetch from 'node-fetch';

exports.handler = async () => {
  const apiKey = "dc6zaTOxFJmzC";
  const tag = ["cringe", "awkward", "embarrassing"][Math.floor(Math.random() * 3)];
  const url = `https://api.giphy.com/v1/gifs/random?api_key=${apiKey}&tag=${encodeURIComponent(tag)}&rating=g`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    
    const data = await res.json();
    if (!data.data || !data.data.images) throw new Error("Invalid response");

    return {
      statusCode: 200,
      body: JSON.stringify({
        url: data.data.images.original.url,
        title: data.data.title || "Cringe Moment"
      })
    };
  } catch (err) {
    console.error("Error:", err.message);
    return {
      statusCode: 200,
      body: JSON.stringify({
        url: "https://i.imgur.com/8l9kx7q6s6v01.jpg",
        title: "Fallback Cringe"
      })
    };
  }
};