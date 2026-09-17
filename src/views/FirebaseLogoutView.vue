<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <h1 class="text-center mb-4">
          Firebase Logout
        </h1>

        <div
          v-if="currentUserEmail"
          class="alert alert-info"
        >
          Current user:
          <strong>{{ currentUserEmail }}</strong>
        </div>

        <div
          v-if="message"
          class="alert alert-success"
        >
          {{ message }}
        </div>

        <button
          v-if="currentUserEmail"
          class="btn btn-danger"
          @click="logout"
        >
          Logout
        </button>

        <RouterLink
          v-else
          to="/FireLogin"
          class="btn btn-primary"
        >
          Back to Login
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  getAuth,
  signOut
} from 'firebase/auth'

const auth = getAuth()

const currentUserEmail = ref<string | null>(null)
const message = ref('')

onMounted(() => {
  currentUserEmail.value =
    auth.currentUser?.email ?? null

  console.log(
    'Current user before logout:',
    auth.currentUser
  )

  console.log(
    'Current user email:',
    auth.currentUser?.email
  )
})

const logout = () => {
  console.log(
    'Current user before logout:',
    auth.currentUser
  )

  signOut(auth)
    .then(() => {
      currentUserEmail.value = null
      message.value = 'Logout successful!'

      console.log(
        'Firebase Logout Successful!'
      )

      console.log(
        'Current user after logout:',
        auth.currentUser
      )
    })
    .catch((error) => {
      console.log(
        'Logout error:',
        error.code
      )
    })
}
</script>