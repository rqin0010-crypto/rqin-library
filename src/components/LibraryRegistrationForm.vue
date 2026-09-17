<template>
  <div class="container mt-5">
    <div class="row">
      <div class="col-md-8 offset-md-2">
        <h1 class="text-center">🗄️ W5. Library Registration Form</h1>

        <p class="text-center">
          Let's build some more advanced features into our form.
        </p>

        <form @submit.prevent="submitForm">
          <!-- Username + Gender -->
          <div class="row mb-3">
            <div class="col-md-6 col-sm-6">
              <label for="username" class="form-label">
                Username
              </label>

              <input
                id="username"
                v-model="formData.username"
                type="text"
                class="form-control"
                @blur="() => validateName(true)"
                @input="() => validateName(false)"
              />

              <div
                v-if="errors.username"
                class="text-danger"
              >
                {{ errors.username }}
              </div>
            </div>

            <div class="col-md-6 col-sm-6">
              <label for="gender" class="form-label">
                Gender
              </label>

              <select
                id="gender"
                v-model="formData.gender"
                class="form-select"
                @change="() => validateGender(true)"
              >
                <option value="">Please select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>

              <div
                v-if="errors.gender"
                class="text-danger"
              >
                {{ errors.gender }}
              </div>
            </div>
          </div>

          <!-- Password + Confirm Password -->
          <div class="row mb-3">
            <div class="col-md-6 col-sm-6">
              <label for="password" class="form-label">
                Password
              </label>

              <input
                id="password"
                v-model="formData.password"
                type="password"
                class="form-control"
                @blur="() => validatePassword(true)"
                @input="() => validatePassword(false)"
              />

              <div
                v-if="errors.password"
                class="text-danger"
              >
                {{ errors.password }}
              </div>
            </div>

            <div class="col-md-6 col-sm-6">
              <label for="confirm-password" class="form-label">
                Confirm password
              </label>

              <input
                id="confirm-password"
                v-model="formData.confirmPassword"
                type="password"
                class="form-control"
                @blur="() => validateConfirmPassword(true)"
              />

              <div
                v-if="errors.confirmPassword"
                class="text-danger"
              >
                {{ errors.confirmPassword }}
              </div>
            </div>
          </div>

          <!-- Australian Resident -->
          <div class="mb-3">
            <div class="form-check">
              <input
                id="isAustralian"
                v-model="formData.isAustralian"
                type="checkbox"
                class="form-check-input"
                @change="() => validateResident(true)"
              />

              <label
                class="form-check-label"
                for="isAustralian"
              >
                Australian Resident?
              </label>
            </div>

            <div
              v-if="errors.resident"
              class="text-danger"
            >
              {{ errors.resident }}
            </div>
          </div>

          <!-- Reason for joining -->
          <div class="mb-3">
            <label for="reason" class="form-label">
              Reason for joining
            </label>

            <textarea
              id="reason"
              v-model="formData.reason"
              class="form-control"
              rows="3"
              @blur="() => validateReason(true)"
              @input="handleReasonInput"
            ></textarea>

            <div
              v-if="errors.reason"
              class="text-danger"
            >
              {{ errors.reason }}
            </div>

            <div
              v-if="friendMessage"
              class="text-success"
            >
              {{ friendMessage }}
            </div>
          </div>

          <!-- Suburb: one-way binding for Vue DevTools activity -->
          <div class="mb-3">
            <label for="suburb" class="form-label">
              Suburb
            </label>

            <input
              id="suburb"
              type="text"
              class="form-control"
              :value="formData.suburb"
            />
          </div>

          <!-- Buttons -->
          <div class="text-center">
            <button
              type="submit"
              class="btn btn-primary me-2"
            >
              Submit
            </button>

            <button
              type="button"
              class="btn btn-secondary"
              @click="clearForm"
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- PrimeVue DataTable -->
    <div
      v-if="submittedCards.length"
      class="mt-5"
    >
      <h3>Submitted Users</h3>

      <DataTable
        :value="submittedCards"
        tableStyle="min-width: 50rem"
      >
        <Column
          field="username"
          header="Username"
        />

        <Column
          field="password"
          header="Password"
        />

        <Column header="Australian Resident">
          <template #body="slotProps">
            {{ slotProps.data.isAustralian ? 'Yes' : 'No' }}
          </template>
        </Column>

        <Column
          field="gender"
          header="Gender"
        />

        <Column
          field="reason"
          header="Reason"
        />
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

const formData = ref({
  username: '',
  password: '',
  confirmPassword: '',
  isAustralian: false,
  reason: '',
  gender: '',
  suburb: 'Clayton'
})

const submittedCards = ref([])

const errors = ref({
  username: null,
  password: null,
  confirmPassword: null,
  resident: null,
  gender: null,
  reason: null
})

const friendMessage = ref('')

// Username validation
const validateName = (blur) => {
  if (formData.value.username.length < 3) {
    if (blur) {
      errors.value.username =
        'Name must be at least 3 characters'
    }
  } else {
    errors.value.username = null
  }
}

// Password validation
const validatePassword = (blur) => {
  const password = formData.value.password
  const minLength = 8

  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecialChar =
    /[!@#$%^&*(),.?":{}|<>]/.test(password)

  if (password.length < minLength) {
    if (blur) {
      errors.value.password =
        `Password must be at least ${minLength} characters long.`
    }
  } else if (!hasUppercase) {
    if (blur) {
      errors.value.password =
        'Password must contain at least one uppercase letter.'
    }
  } else if (!hasLowercase) {
    if (blur) {
      errors.value.password =
        'Password must contain at least one lowercase letter.'
    }
  } else if (!hasNumber) {
    if (blur) {
      errors.value.password =
        'Password must contain at least one number.'
    }
  } else if (!hasSpecialChar) {
    if (blur) {
      errors.value.password =
        'Password must contain at least one special character.'
    }
  } else {
    errors.value.password = null
  }
}

// Confirm Password validation
const validateConfirmPassword = (blur) => {
  if (
    formData.value.password !==
    formData.value.confirmPassword
  ) {
    if (blur) {
      errors.value.confirmPassword =
        'Passwords do not match.'
    }
  } else {
    errors.value.confirmPassword = null
  }
}

// Australian Resident validation
const validateResident = (blur) => {
  if (!formData.value.isAustralian) {
    if (blur) {
      errors.value.resident =
        'Please confirm Australian residency.'
    }
  } else {
    errors.value.resident = null
  }
}

// Gender validation
const validateGender = (blur) => {
  if (!formData.value.gender) {
    if (blur) {
      errors.value.gender =
        'Please select a gender.'
    }
  } else {
    errors.value.gender = null
  }
}

// Reason validation
const validateReason = (blur) => {
  if (formData.value.reason.trim().length < 10) {
    if (blur) {
      errors.value.reason =
        'Reason must be at least 10 characters.'
    }
  } else {
    errors.value.reason = null
  }
}

// Week 5: show message when "friend" is entered
const handleReasonInput = () => {
  validateReason(false)

  if (
    formData.value.reason
      .toLowerCase()
      .includes('friend')
  ) {
    friendMessage.value = 'Great to have a friend'
  } else {
    friendMessage.value = ''
  }
}

// Submit form
const submitForm = () => {
  validateName(true)
  validatePassword(true)
  validateConfirmPassword(true)
  validateResident(true)
  validateGender(true)
  validateReason(true)

  if (
    !errors.value.username &&
    !errors.value.password &&
    !errors.value.confirmPassword &&
    !errors.value.resident &&
    !errors.value.gender &&
    !errors.value.reason
  ) {
    submittedCards.value.push({
      ...formData.value
    })

    clearForm()
  }
}

// Clear form
const clearForm = () => {
  formData.value = {
    username: '',
    password: '',
    confirmPassword: '',
    isAustralian: false,
    reason: '',
    gender: '',
    suburb: 'Clayton'
  }

  errors.value = {
    username: null,
    password: null,
    confirmPassword: null,
    resident: null,
    gender: null,
    reason: null
  }

  friendMessage.value = ''
}
</script>

<style scoped>
.text-danger {
  margin-top: 4px;
  font-size: 0.9rem;
}

.text-success {
  margin-top: 4px;
  font-size: 0.9rem;
}
</style>