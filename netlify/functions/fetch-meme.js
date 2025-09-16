import fetch from 'node-fetch';

const subreddits = ["cringetopia", "teenagers", "facebookstories"];
const randomSub = subreddits[Math.floor(Math.random() * subreddits.length)];

export async function handler() {
  try {
    const res = await fetch(`https://www.reddit.com/r/${randomSub}/hot.json?limit=1`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const data = await res.json();
    const post = data.data.children[0].data;

    // Only allow image links
    if (!post.url.includes("i.redd.it")) {
      throw new Error("Not an image");
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        url: post.url,
        title: post.title
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
}