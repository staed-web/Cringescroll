// Import node-fetch (required for Netlify Functions)
import fetch from 'node-fetch';

// Define all meme APIs
const apiOptions = [
  {
    name: 'giphy',
    url: 'https://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC&tag=cringe&rating=g'
  },
  {
    name: 'imgflip',
    url: 'https://api.imgflip.com/get_memes'
  },
  {
    name: 'reddit',
    url: 'https://www.reddit.com/r/cringetopia/hot.json?limit=1'
  },
  {
    name: 'tenor',
    url: 'https://tenor.googleapis.com/v2/search?q=cringe&key=AIzaSyB5ZVjvNQYAEbqF8sD7yKd9EeTqXwRkSdw&limit=1&media_filter=gif_basic'
  }
];

exports.handler = async () => {
  // Pick a random API to use
  const randomApi = apiOptions[Math.floor(Math.random() * apiOptions.length)];

  try {
    // Fetch data from selected API
    const res = await fetch(randomApi.url);
    
    if (!res.ok) {
      throw new Error(`${randomApi.name} returned ${res.status}`);
    }

    const data = await res.json();

    let result;

    switch (randomApi.name) {
      case 'giphy':
        if (!data.data || !data.data.images) {
          throw new Error("Invalid GIPHY response");
        }
        result = {
          url: data.data.images.original.url,
          title: data.data.title || "GIF Cringe Moment"
        };
        break;

      case 'imgflip':
        if (!data.data || !data.data.memes || data.data.memes.length === 0) {
          throw new Error("No memes from Imgflip");
        }
        const meme = data.data.memes[Math.floor(Math.random() * data.data.memes.length)];
        result = {
          url: meme.url,
          title: meme.name || "Classic Meme"
        };
        break;

      case 'reddit':
        if (!data.data || !data.data.children || data.data.children.length === 0) {
          throw new Error("No posts from Reddit");
        }
        const post = data.data.children[0].data;
        // Only allow direct image links
        if (!post.url.match(/\.(jpg|jpeg|png|gif)$/i)) {
          throw new Error("Not an image");
        }
        result = {
          url: post.url,
          title: post.title.length > 100 ? post.title.slice(0, 100) + "..." : post.title
        };
        break;

      case 'tenor':
        if (!data.results || data.results.length === 0) {
          throw new Error("No results from Tenor");
        }
        const gif = data.results[0];
        result = {
          url: gif.media_formats.gif.url,
          title: gif.title || "Tenor Cringe"
        };
        break;

      default:
        throw new Error("Unknown API");
    }

    // Return success response
    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };

  } catch (err) {
    console.error("API Error:", err.message);

    // Fallback meme if all else fails
    return {
      statusCode: 200,
      body: JSON.stringify({
        url: "https://i.imgur.com/8l9kx7q6s6v01.jpg",
        title: "Fallback Cringe: I'm not sad, I'm just crying for no reason"
      })
    };
  }
};