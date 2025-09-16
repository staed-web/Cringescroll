const fetch = require('node-fetch');

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
      url: 'https://tenor.googleapis.com/v2/search?q=cringe&key=AIzaSyB5ZVjvNQYAEbqF8sD7yKd9EeTqXwRkSdw'
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
        const imgflipMeme = data.data.memes[Math.floor(Math.random() * data.data.memes.length)];
        return {
          statusCode: 200,
          body: JSON.stringify({
            url: imgflipMeme.url,
            title: imgflipMeme.title
          })
        };

      case 'reddit':
        const redditPost = data.data.children[0].data;
        return {
          statusCode: 200,
          body: JSON.stringify({
            url: redditPost.url,
            title: redditPost.title
          })
        };

      case 'tenor':
        const tenorGif = data.results[Math.floor(Math.random() * data.results.length)];
        return {
          statusCode: 200,
          body: JSON.stringify({
            url: tenorGif.media[0].gif.url,
            title: tenorGif.title
          })
        };

      default:
        throw new Error("Unknown API");
    }

  } catch (err) {
    console.error("API Error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch meme" })
    };
  }
};
