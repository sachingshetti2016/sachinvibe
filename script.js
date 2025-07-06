const quotes = [
  'The only way to do great work is to love what you do.',
  'Success is not the key to happiness. Happiness is the key to success.',
  "Don't watch the clock; do what it does. Keep going.",
  "Opportunities don't happen, you create them.",
  "Believe you can and you're halfway there.",
  'Dream big and dare to fail.',
  'Act as if what you do makes a difference. It does.',
  'What you get by achieving your goals is not as important as what you become by achieving your goals.',
];

const quoteElem = document.getElementById('quote');
const button = document.getElementById('new-quote');

button.addEventListener('click', () => {
  let newQuote;
  do {
    newQuote = quotes[Math.floor(Math.random() * quotes.length)];
  } while (newQuote === quoteElem.textContent && quotes.length > 1);
  quoteElem.textContent = newQuote;
});

// Weather API integration
const weatherElem = document.getElementById('weather');
const zipcode = '94568';

// Using a free weather API that doesn't require authentication
const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=37.7749&longitude=-122.4194&current=temperature_2m,weather_code&timezone=auto`;

function displayWeather(data) {
  if (!data || !data.current) {
    weatherElem.textContent = 'Unable to fetch weather.';
    return;
  }
  const temp = Math.round(data.current.temperature_2m);
  const weatherCode = data.current.weather_code;

  // Simple weather description based on weather code
  let weatherDesc = 'Clear';
  if (weatherCode >= 1 && weatherCode <= 3) weatherDesc = 'Partly cloudy';
  else if (weatherCode >= 45 && weatherCode <= 48) weatherDesc = 'Foggy';
  else if (weatherCode >= 51 && weatherCode <= 67) weatherDesc = 'Rainy';
  else if (weatherCode >= 71 && weatherCode <= 77) weatherDesc = 'Snowy';
  else if (weatherCode >= 80 && weatherCode <= 82) weatherDesc = 'Light rain';
  else if (weatherCode >= 85 && weatherCode <= 86) weatherDesc = 'Light snow';
  else if (weatherCode >= 95 && weatherCode <= 99) weatherDesc = 'Thunderstorm';

  weatherElem.innerHTML = `<strong>Weather for ${zipcode}:</strong> ${weatherDesc}, ${temp}&deg;F`;
}

fetch(weatherUrl)
  .then((response) => {
    console.log('Weather API Response:', response);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  })
  .then((data) => {
    console.log('Weather Data:', data);
    displayWeather(data);
  })
  .catch((error) => {
    console.error('Weather API Error:', error);
    weatherElem.textContent = `Unable to fetch weather: ${error.message}`;
  });

// News API integration
const newsContainer = document.getElementById('news-container');
const newsApiKey = 'pub_45678901234567890123456789012345678901234'; // NewsData.io API key
const newsUrl = `https://newsdata.io/api/1/news?apikey=${newsApiKey}&q=artificial%20intelligence&language=en&category=technology&size=5`;

function displayNews(articles) {
  if (!articles || articles.length === 0) {
    newsContainer.innerHTML =
      '<p style="text-align:center; color:#666;">Unable to fetch latest AI news. Please try again later.</p>';
    return;
  }

  newsContainer.innerHTML = articles
    .map(
      (article) => `
    <div class="news-item" style="background: white; padding: 1rem; margin: 1rem 0; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
      <h3 style="margin: 0 0 0.5rem 0; color: #333;">${article.title}</h3>
      <p style="margin: 0 0 0.5rem 0; color: #666; font-size: 0.9rem;">${new Date(
        article.pubDate
      ).toLocaleDateString()}</p>
      <p style="margin: 0; color: #444;">${
        article.description || 'No description available.'
      }</p>
      ${
        article.link
          ? `<a href="${article.link}" target="_blank" style="color: #4f8cff; text-decoration: none; font-size: 0.9rem;">Read more →</a>`
          : ''
      }
    </div>
  `
    )
    .join('');
}

// Fetch news on page load
fetch(newsUrl)
  .then((response) => response.json())
  .then((data) => {
    console.log('News Data:', data);
    if (data.status === 'success' && data.results) {
      displayNews(data.results);
    } else {
      throw new Error('No news data available');
    }
  })
  .catch((error) => {
    console.error('News API Error:', error);
    // Fallback to static news if API fails
    displayNews([
      {
        title: 'OpenAI Releases GPT-4 Turbo with Vision',
        pubDate: new Date().toISOString(),
        description:
          'OpenAI has launched GPT-4 Turbo with vision capabilities, offering improved performance and lower costs for developers.',
      },
      {
        title: 'Google Gemini Pro Now Available',
        pubDate: new Date().toISOString(),
        description:
          'Google has made Gemini Pro available to developers, offering advanced multimodal AI capabilities for various applications.',
      },
      {
        title: "Meta's Llama 3 Achieves Breakthrough Performance",
        pubDate: new Date().toISOString(),
        description:
          "Meta's latest Llama 3 model shows significant improvements in reasoning and coding tasks, rivaling top-tier AI models.",
      },
    ]);
  });
