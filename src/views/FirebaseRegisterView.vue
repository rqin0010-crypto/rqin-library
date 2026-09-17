<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <h1 class="text-center mb-4">Create an Account</h1>

        <div class="mb-3">
          <label for="email" class="form-label">
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
          <label for="password" class="form-label">
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

        <button
          class="btn btn-primary"
          @click="register"
        >
          Save to Firebase
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  getAuth,
  createUserWithEmailAndPassword
} from 'firebase/auth'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const errorMessage = ref('')

const router = useRouter()
const auth = getAuth()

const register = () => {
  errorMessage.value = ''

  createUserWithEmailAndPassword(
    auth,
    email.value,
    password.value
  )
    .then(() => {
      console.log('Firebase Register Successful!')
      router.push('/FireLogin')
    })
    .catch((error) => {
      console.log(error.code)
      errorMessage.value = error.code
    })
}
</script>