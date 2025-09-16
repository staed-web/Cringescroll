// Use ES6 import (preferred by Netlify)
import fetch from 'node-fetch';

exports.handler = async () => {
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
      url: 'https://tenor.googleapis.com/v2/search?q=cringe&key=AIzaSyB5ZVjvNQYAEbqF8sD7yKd9EeTqXwRkSdw&limit=1'
    }
  ];

  const randomApi = apiOptions[Math.floor(Math.random() * apiOptions.length)];

  try {
    const res = await fetch(randomApi.url);
    const data = await res.json();

    switch (randomApi.name) {
      case 'giphy':
        return {
          statusCode: 200,
          body: JSON.stringify({
            url: data.data.images.original.url,
            title: data.data.title || "GIF Cringe"
          })
        };
      
      case 'imgflip':
        const meme = data.data.memes[Math.floor(Math.random() * data.data.memes.length)];
        return {
          statusCode: 200,
          body: JSON.stringify({
            url: meme.url,
            title: meme.name || "Imgflip Meme"
          })
        };

      case 'reddit':
        const post = data.data.children[0].data;
        // Only allow image links
        if (!post.url.includes("i.redd.it")) break;
        return {
          statusCode: 200,
          body: JSON.stringify({
            url: post.url,
            title: post.title
          })
        };

      case 'tenor':
        const gif = data.results[0];
        return {
          statusCode: 200,
          body: JSON.stringify({
            url: gif.media_formats.gif.url,
            title: gif.title || "Tenor Cringe"
          })
        };

      default:
        throw new Error("Unknown API");
    }

  } catch (err) {
    console.error("API Error:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: "Failed to fetch meme", 
        fallback: "https://i.imgur.com/8l9kx7q6s6v01.jpg",
        title: "Cringe Engine Overloaded"
      })
    };
  }
};