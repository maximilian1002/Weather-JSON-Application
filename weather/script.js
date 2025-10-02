document.addEventListener("DOMContentLoaded", () => {
    // Selecting input field and display elements
    const cityInput = document.getElementById("cityInput");
    const weatherInfo = document.getElementById("weatherInfo");

    // Selecting elements specific to each weather page
    const temperatureData = document.getElementById("temperatureData");
    const humidityData = document.getElementById("humidityData");
    const uvData = document.getElementById("uvData");
    const windData = document.getElementById("windData");

    // Selecting icons for visual representation
    const tempIcon = document.getElementById("tempIcon");
    const humidityIcon = document.getElementById("humidityIcon");
    const uvIcon = document.getElementById("UVIcon");
    const windIcon = document.getElementById("WindIcon");

    // Button for toggling temperature between Celsius and Fahrenheit
    const toggleTempBtn = document.getElementById("toggleTemp");

    let temperatureCelsius = null; // Stores temperature value
    let isCelsius = true; // Keeps track of temperature unit

    /**
     * Fetches weather data from weather.json based on user input.
     * Saves the selected city's weather data in localStorage for use in other pages.
     */
    async function fetchWeather() {
        const cityName = cityInput.value.trim(); // Get input value and remove spaces
        if (!cityName) {
            alert("Please enter a city name."); // Alert if input is empty
            return;
        }

        try {
            const response = await fetch("weather.json"); // Fetch weather data
            const data = await response.json(); // Convert response to JSON
            const cityWeather = data.find(city => city.cityName.toLowerCase() === cityName.toLowerCase()); // Find city in dataset

            if (cityWeather) {
                localStorage.setItem("selectedCityWeather", JSON.stringify(cityWeather)); // Store selected city's weather data
                displayWeather(cityWeather); // Display data on the current page
            } else {
                alert("City not found in the dataset."); // Alert if city is not found
            }
        } catch (error) {
            console.error("Error fetching weather data:", error); // Log error if fetch fails
        }
    }

    /**
     * Displays the correct weather information based on the current page.
     */
    function displayWeather(cityWeather) {
        if (temperatureData) {
            temperatureCelsius = cityWeather.temperatureCelsius;
            temperatureData.textContent = `Temperature: ${temperatureCelsius}°C`;
            updateTempIcon(cityWeather.temperatureCelsius);
        }

        if (humidityData) {
            humidityData.textContent = `Humidity: ${(cityWeather.humidity * 100).toFixed(1)}%`;
            updateHumidityIcon(cityWeather.humidity);
        }

        if (uvData) {
            uvData.textContent = `UV Index: ${cityWeather.uvIndex}`;
            updateUvIcon(cityWeather.uvIndex);
        }

        if (windData) {
            windData.textContent = `Wind Speed: ${cityWeather.windSpeed}`;
            updateWindIcon(cityWeather.windSpeed);
        }
    }

    /**
     * Loads weather data from localStorage when navigating between pages.
     */
    function loadWeatherFromStorage() {
        const cityWeather = JSON.parse(localStorage.getItem("selectedCityWeather")); // Retrieve stored data
        if (cityWeather) {
            displayWeather(cityWeather); // Display retrieved weather data
        }
    }

    /**
     * Updates the temperature icon color based on temperature value.
     * - Yellow (hue-rotate(60deg)) if temperature > 20°C
     * - Blue (hue-rotate(240deg)) if temperature ≤ 20°C
     */
    function updateTempIcon(temp) {
        if (!tempIcon) return;
        const tempImg = tempIcon.querySelector("img");
        tempImg.style.filter = temp > 20 ? "hue-rotate(60deg)" : "hue-rotate(240deg)";
    }

    /**
     * Updates the humidity icon opacity based on humidity percentage.
     * - High opacity if humidity > 70%
     * - Lower opacity otherwise
     */
    function updateHumidityIcon(humidity) {
        if (!humidityIcon) return;
        const humidityImg = humidityIcon.querySelector("img");
        humidityImg.style.opacity = humidity > 0.7 ? "1" : "0.5";
    }

    /**
     * Updates the UV icon brightness based on UV index value.
     * - Higher brightness if UV index > 5
     * - Lower brightness otherwise
     */
    function updateUvIcon(uvIndex) {
        if (!uvIcon) return;
        const uvImg = uvIcon.querySelector("img");
        uvImg.style.filter = uvIndex > 5 ? "brightness(1.5)" : "brightness(0.8)";
    }

    /**
     * Simulates wind speed by slightly rotating the wind icon.
     */
    function updateWindIcon(windSpeed) {
        if (!windIcon) return;
        const windImg = windIcon.querySelector("img");
        windImg.style.transform = "rotate(360deg)";
    }

    /**
     * Toggles temperature display between Celsius and Fahrenheit.
     */
    if (toggleTempBtn) {
        toggleTempBtn.addEventListener("click", () => {
            if (temperatureCelsius !== null) {
                if (isCelsius) {
                    const fahrenheit = (temperatureCelsius * 9/5) + 32;
                    temperatureData.textContent = `Temperature: ${fahrenheit.toFixed(1)}°F`;
                } else {
                    temperatureData.textContent = `Temperature: ${temperatureCelsius}°C`;
                }
                isCelsius = !isCelsius;
            }
        });
    }

    // Load stored weather data when user navigates to a different weather page
    loadWeatherFromStorage();

    // Attach the fetchWeather function to the global window object for use in index.html
    window.fetchWeather = fetchWeather;
});
