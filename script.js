// =====================================================
// WEATHER DASHBOARD
// =====================================================

// Get HTML elements

const weatherForm =
    document.getElementById("weatherForm");

const cityInput =
    document.getElementById("cityInput");

const loading =
    document.getElementById("loading");

const errorMessage =
    document.getElementById("error");

const weatherCard =
    document.getElementById("weatherCard");

const cityName =
    document.getElementById("cityName");

const temperature =
    document.getElementById("temperature");

const condition =
    document.getElementById("condition");

const wind =
    document.getElementById("wind");

const humidity =
    document.getElementById("humidity");

const coordinates =
    document.getElementById("coordinates");


// =====================================================
// FORM EVENT
// =====================================================

weatherForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const city =
            cityInput.value.trim();

        if (city === "") {
            return;
        }

        await getWeather(city);
    }
);


// =====================================================
// GET WEATHER
// =====================================================

async function getWeather(city) {

    try {

        // Show loading

        loading.classList.remove("hidden");

        errorMessage.textContent = "";

        weatherCard.classList.add("hidden");


        // =================================================
        // STEP 1: FIND CITY COORDINATES
        // =================================================

        const geoURL =
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;

        const geoResponse =
            await fetch(geoURL);


        if (!geoResponse.ok) {
            throw new Error(
                "Unable to find city."
            );
        }


        const geoData =
            await geoResponse.json();


        if (
            !geoData.results ||
            geoData.results.length === 0
        ) {

            throw new Error(
                "City not found."
            );
        }


        const location =
            geoData.results[0];


        const latitude =
            location.latitude;

        const longitude =
            location.longitude;


        // =================================================
        // STEP 2: WEATHER API
        // =================================================

        const weatherURL =
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`;


        const weatherResponse =
            await fetch(weatherURL);


        if (!weatherResponse.ok) {
            throw new Error(
                "Unable to fetch weather data."
            );
        }


        // =================================================
        // STEP 3: CONVERT RESPONSE TO JSON
        // =================================================

        const weatherData =
            await weatherResponse.json();


        // =================================================
        // STEP 4: PROCESS JSON DATA
        // =================================================

        const current =
            weatherData.current;


        const temperatureValue =
            current.temperature_2m;

        const humidityValue =
            current.relative_humidity_2m;

        const windValue =
            current.wind_speed_10m;

        const weatherCode =
            current.weather_code;


        // =================================================
        // STEP 5: DISPLAY DATA
        // =================================================

        cityName.textContent =
            `${location.name}, ${location.country}`;

        temperature.textContent =
            temperatureValue;

        humidity.textContent =
            `${humidityValue}%`;

        wind.textContent =
            `${windValue} km/h`;

        coordinates.textContent =
            `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;

        condition.textContent =
            getWeatherCondition(weatherCode);


        // Show card

        weatherCard.classList.remove("hidden");


    } catch (error) {

        // =================================================
        // ERROR HANDLING
        // =================================================

        errorMessage.textContent =
            error.message;

    } finally {

        // Hide loading

        loading.classList.add("hidden");
    }
}


// =====================================================
// WEATHER CONDITION
// =====================================================

function getWeatherCondition(code) {

    if (code === 0) {
        return "Clear Sky";
    }

    if (
        code === 1 ||
        code === 2 ||
        code === 3
    ) {
        return "Partly Cloudy";
    }

    if (
        code >= 51 &&
        code <= 67
    ) {
        return "Rain";
    }

    if (
        code >= 71 &&
        code <= 77
    ) {
        return "Snow";
    }

    if (
        code >= 80 &&
        code <= 82
    ) {
        return "Rain Showers";
    }

    if (
        code >= 95 &&
        code <= 99
    ) {
        return "Thunderstorm";
    }

    return "Unknown Weather";
}