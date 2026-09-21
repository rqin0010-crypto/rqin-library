<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8 text-center">
        <h1 class="mb-4">Book Counter</h1>

        <button
          class="btn btn-primary mb-4"
          @click="getBookCount"
        >
          Get Book Count
        </button>

        <div
          v-if="count !== null"
          class="alert alert-success"
        >
          Total number of books: {{ count }}
        </div>

        <div
          v-if="errorMessage"
          class="alert alert-danger"
        >
          {{ errorMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'

const count = ref<number | null>(null)
const errorMessage = ref('')

const getBookCount = async () => {
  count.value = null
  errorMessage.value = ''

  try {
    const response = await axios.get(
      'https://us-central1-fit5032-6fb55.cloudfunctions.net/countBooks'
    )

    count.value = response.data.count
  } catch (error) {
    console.error('Error getting book count:', error)

    errorMessage.value =
      'Unable to get book count.'
  }
}
</script>
