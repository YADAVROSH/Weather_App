window.onload = function () {
  document.getElementById("search").addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      fetchWeather();
    }
  });

  document.getElementById("search-btn").addEventListener("click", function () {
    fetchWeather();
  });
};

async function fetchWeather() {
  let searchInput = document.getElementById("search").value.trim();
  const weatherDataSection = document.getElementById("weather-data");
  weatherDataSection.style.display = "block";

  const apiKey = "1fbe5379cfb7bce6cce7aa9aaaa7026b";

  if (searchInput === "") {
    weatherDataSection.innerHTML = `
      <div style="color: red;">
        <h2>Empty Input!</h2>
        <p>Please enter a valid <u>city name</u>.</p>
      </div>
    `;
    return;
  }

  weatherDataSection.innerHTML = `<p style="color: gray;">⏳ Fetching weather...</p>`;

  const geocodeURL = `https://api.openweathermap.org/geo/1.0/direct?q=${searchInput},91&limit=1&appid=${apiKey}`;

  try {
    const geoResponse = await fetch(geocodeURL);
    if (!geoResponse.ok) {
      weatherDataSection.innerHTML = `<p style="color: red;">❌ Error fetching location data.</p>`;
      return;
    }

    const geoData = await geoResponse.json();
    if (geoData.length === 0) {
      weatherDataSection.innerHTML = `
        <div style="color: red;">
          <h2>Invalid City: "${searchInput}"</h2>
          <p>Please try again with a correct <u>city name</u>.</p>
        </div>
      `;
      return;
    }

    const { lat, lon } = geoData[0];
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    const weatherResponse = await fetch(weatherURL);
    if (!weatherResponse.ok) {
      weatherDataSection.innerHTML = `<p style="color: red;">❌ Error fetching weather data.</p>`;
      return;
    }

    const weatherData = await weatherResponse.json();

    const currentTime = new Date().toLocaleString();

    weatherDataSection.innerHTML = `
      <img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png" alt="${weatherData.weather[0].description}" width="100" />
      <div>
        <h2>${weatherData.name}</h2>
        <p><strong>Temperature:</strong> ${Math.round(weatherData.main.temp - 273.15)}°C</p>
        <p><strong>Description:</strong> ${weatherData.weather[0].description}</p>
        <p><strong>Date & Time:</strong> ${currentTime}</p>
      </div>
    `;

    document.getElementById("search").value = "";

  } catch (error) {
    console.log("Error:", error);
    weatherDataSection.innerHTML = `<p style="color: red;">⚠️ Something went wrong. Please try again.</p>`;
  }
}
