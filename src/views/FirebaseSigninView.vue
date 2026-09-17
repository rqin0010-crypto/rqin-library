<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">

        <h1 class="text-center mb-4">
          Firebase Login
        </h1>

        <div class="mb-3">
          <label
            for="email"
            class="form-label"
          >
            Email
          </label>

          <input
            id="email"
            v-model="email"
            type="email"
            class="form-control"
            placeholder="Email"
          />
        </div>

        <div class="mb-3">
          <label
            for="password"
            class="form-label"
          >
            Password
          </label>

          <input
            id="password"
            v-model="password"
            type="password"
            class="form-control"
            placeholder="Password"
          />
        </div>

        <div
          v-if="errorMessage"
          class="alert alert-danger"
        >
          {{ errorMessage }}
        </div>

        <div
          v-if="successMessage"
          class="alert alert-success"
        >
          {{ successMessage }}
        </div>

        <div
          v-if="currentRole"
          class="alert alert-info"
        >
          Signed in as:
          <strong>{{ currentRole }}</strong>
        </div>

        <button
          class="btn btn-primary"
          @click="signIn"
        >
          Login
        </button>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import {
  getAuth,
  signInWithEmailAndPassword
} from 'firebase/auth'

const email = ref('')
const password = ref('')

const errorMessage = ref('')
const successMessage = ref('')
const currentRole = ref('')

const auth = getAuth()

const getUserRole = (userEmail: string | null) => {
  if (
    userEmail ===
    'admin@greenmelbourne.org.au'
  ) {
    return 'Admin'
  }

  return 'User'
}

const signIn = () => {
  errorMessage.value = ''
  successMessage.value = ''
  currentRole.value = ''

  signInWithEmailAndPassword(
    auth,
    email.value,
    password.value
  )
    .then((userCredential) => {
      const user = userCredential.user

      currentRole.value =
        getUserRole(user.email)

      successMessage.value =
        'Login successful!'

      console.log(
        'Firebase Login Successful!'
      )

      console.log(
        'Current user:',
        user
      )

      console.log(
        'Current user email:',
        user.email
      )

      console.log(
        'Current user role:',
        currentRole.value
      )
    })
    .catch((error) => {
      console.log(error.code)
      errorMessage.value = error.code
    })
}
</script>