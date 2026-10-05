<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <h1 class="text-center mb-4">
          WEATHER APP
        </h1>

        <!-- Search by city -->
        <div class="input-group mb-3">
          <input
            v-model="city"
            type="text"
            class="form-control"
            placeholder="Enter city name, e.g. Clayton, AU"
            @keyup.enter="searchByCity"
          />

          <button
            class="btn btn-primary"
            type="button"
            @click="searchByCity"
          >
            Search
          </button>
        </div>

        <!-- Current location -->
        <div class="text-center mb-4">
          <button
            class="btn btn-secondary"
            type="button"
            @click="getCurrentLocationWeather"
          >
            Get Current Location Weather
          </button>
        </div>

        <!-- Loading -->
        <div
          v-if="loading"
          class="alert alert-info text-center"
        >
          Loading weather...
        </div>

        <!-- Error -->
        <div
          v-if="errorMessage"
          class="alert alert-danger"
        >
          {{ errorMessage }}
        </div>

        <!-- Weather result -->
        <main v-if="weatherData">
          <div class="card text-center p-4">
            <h2>
              {{ weatherData.name }},
              {{ weatherData.sys.country }}
            </h2>

            <img
              :src="iconUrl"
              alt="Weather Icon"
              class="weather-icon"
            />

            <h3>
              {{ temperature }} °C
            </h3>

            <p class="weather-description">
              {{ weatherData.weather[0].description }}
            </p>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang>
import {
  computed,
  ref
} from 'vue'

import axios from 'axios'

const apiKey =
  import.meta.env.VITE_OPENWEATHER_API_KEY

const city = ref('')
const weatherData = ref(null)

const loading = ref(false)
const errorMessage = ref('')

// Convert Kelvin to Celsius
const temperature = computed(() => {
  if (!weatherData.value) {
    return null
  }

  return Math.floor(
    weatherData.value.main.temp - 273.15
  )
})

// Weather icon URL
const iconUrl = computed(() => {
  if (!weatherData.value) {
    return ''
  }

  const icon =
    weatherData.value.weather[0].icon

  return `https://openweathermap.org/img/wn/${icon}@2x.png`
})

// Search weather by city
const searchByCity = async () => {
  if (!city.value.trim()) {
    errorMessage.value =
      'Please enter a city.'

    return
  }

  loading.value = true
  errorMessage.value = ''
  weatherData.value = null

  try {
    const response = await axios.get(
      'https://api.openweathermap.org/data/2.5/weather',
      {
        params: {
          q: city.value.trim(),
          appid: apiKey
        }
      }
    )

    weatherData.value = response.data
  } catch (error) {
    console.error(
      'Weather API error:',
      error
    )

    errorMessage.value =
      'Unable to find weather for this city.'
  } finally {
    loading.value = false
  }
}

// Get weather using current location
const getCurrentLocationWeather = () => {
  errorMessage.value = ''

  if (!navigator.geolocation) {
    errorMessage.value =
      'Geolocation is not supported by this browser.'

    return
  }

  loading.value = true

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const latitude =
          position.coords.latitude

        const longitude =
          position.coords.longitude

        const response = await axios.get(
          'https://api.openweathermap.org/data/2.5/weather',
          {
            params: {
              lat: latitude,
              lon: longitude,
              appid: apiKey
            }
          }
        )

        weatherData.value = response.data
      } catch (error) {
        console.error(
          'Weather API error:',
          error
        )

        errorMessage.value =
          'Unable to retrieve weather information.'
      } finally {
        loading.value = false
      }
    },
    (error) => {
      console.error(
        'Location error:',
        error
      )

      errorMessage.value =
        'Unable to access your current location.'

      loading.value = false
    }
  )
}
</script>

<style scoped>
.card {
  max-width: 500px;
  margin: 0 auto;
}

.weather-icon {
  width: 100px;
  height: 100px;
  margin: 10px auto;
}

.weather-description {
  text-transform: capitalize;
  font-size: 1.2rem;
}
</style>