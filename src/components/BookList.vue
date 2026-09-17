<template>
  <div class="mt-5">
    <h2>Books Query Result</h2>

    <p class="text-muted">
      ISBN &gt; 1000, ordered by ISBN ascending,
      limited to 3 results.
    </p>

    <div
      v-if="loading"
      class="alert alert-info"
    >
      Loading books...
    </div>

    <div
      v-if="errorMessage"
      class="alert alert-danger"
    >
      {{ errorMessage }}
    </div>

    <table
      v-if="!loading && books.length"
      class="table table-bordered table-striped mt-3"
    >
      <thead>
        <tr>
          <th>ISBN</th>
          <th>Book Name</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="book in books"
          :key="book.id"
        >
          <td>{{ book.isbn }}</td>
          <td>{{ book.name }}</td>
        </tr>
      </tbody>
    </table>

    <p
      v-if="!loading && !books.length && !errorMessage"
    >
      No matching books found.
    </p>

    <button
      class="btn btn-outline-primary mt-2"
      @click="loadBooks"
    >
      Refresh Query
    </button>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where
} from 'firebase/firestore'

import db from '../firebase/init'

interface Book {
  id: string
  isbn: number
  name: string
}

const props = defineProps<{
  refreshKey?: number
}>()

const books = ref<Book[]>([])
const loading = ref(false)
const errorMessage = ref('')

const loadBooks = async () => {
  loading.value = true
  errorMessage.value = ''

  try {
    const booksRef = collection(
      db,
      'books'
    )

    const bookQuery = query(
      booksRef,

      // Only retrieve books with ISBN greater than 1000
      where('isbn', '>', 1000),

      // Sort ISBN from smallest to largest
      orderBy('isbn', 'asc'),

      // Only return the first 3 matching books
      limit(3)
    )

    const querySnapshot =
      await getDocs(bookQuery)

    books.value =
      querySnapshot.docs.map((document) => {
        const data = document.data()

        return {
          id: document.id,
          isbn: data.isbn,
          name: data.name
        } as Book
      })

    console.log(
      'Firestore query results:',
      books.value
    )
  } catch (error) {
    console.error(
      'Error querying books:',
      error
    )

    errorMessage.value =
      'Failed to retrieve books.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadBooks()
})

watch(
  () => props.refreshKey,
  () => {
    loadBooks()
  }
)
</script>