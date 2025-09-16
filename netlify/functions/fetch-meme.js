import fetch from 'node-fetch';

const imgurEndpoints = [
  'https://api.imgur.com/3/gallery/random',
  'https://api.imgur.com/3/gallery/hot'
];

exports.handler = async () => {
  const endpoint = imgurEndpoints[Math.floor(Math.random() * imgurEndpoints.length)];
  
  try {
    const res = await fetch(endpoint, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    
    const data = await res.json();
    if (!data.data || !data.data[0].link) throw new Error("Invalid response");

    return {
      statusCode: 200,
      body: JSON.stringify({
        url: data.data[0].link,
        title: data.data[0].title || "Random Cringe"
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