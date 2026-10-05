<template>
  <div class="container mt-5">
    <h1 class="text-center mb-4">
      Get All Book API
    </h1>

    <div
      v-if="errorMessage"
      class="alert alert-danger"
    >
      {{ errorMessage }}
    </div>

    <pre
      v-if="jsondata"
      class="api-output"
    >{{ JSON.stringify(jsondata, null, 2) }}</pre>
  </div>
</template>

<script setup>
import {
  onMounted,
  ref
} from 'vue'

import axios from 'axios'

const jsondata = ref(null)
const errorMessage = ref('')

const getAllBookAPI = async () => {
  try {
    const response = await axios.get(
      'https://us-central1-fit5032-6fb55.cloudfunctions.net/getAllBooks'
    )

    jsondata.value = response.data
  } catch (error) {
    console.error(
      'Error retrieving books:',
      error
    )

    errorMessage.value =
      'Unable to retrieve books.'
  }
}

onMounted(() => {
  getAllBookAPI()
})
</script>

<style scoped>
.api-output {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f8f9fa;
  font-size: 16px;
  white-space: pre-wrap;
}
</style>