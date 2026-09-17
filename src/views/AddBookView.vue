<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <h1 class="text-center mb-4">
          Add Book
        </h1>

        <!-- Add / Update Form -->
        <form @submit.prevent="saveBook">
          <div class="mb-3">
            <label
              for="isbn"
              class="form-label"
            >
              ISBN
            </label>

            <input
              id="isbn"
              v-model.number="isbn"
              type="number"
              class="form-control"
              placeholder="Enter ISBN"
              required
            />
          </div>

          <div class="mb-3">
            <label
              for="name"
              class="form-label"
            >
              Book Name
            </label>

            <input
              id="name"
              v-model="name"
              type="text"
              class="form-control"
              placeholder="Enter book name"
              required
            />
          </div>

          <!-- Success Message -->
          <div
            v-if="successMessage"
            class="alert alert-success"
          >
            {{ successMessage }}
          </div>

          <!-- Error Message -->
          <div
            v-if="errorMessage"
            class="alert alert-danger"
          >
            {{ errorMessage }}
          </div>

          <!-- Add / Update Button -->
          <button
            type="submit"
            class="btn btn-primary me-2"
          >
            {{ editingId ? 'Update Book' : 'Add Book' }}
          </button>

          <!-- Cancel Edit -->
          <button
            v-if="editingId"
            type="button"
            class="btn btn-secondary"
            @click="cancelEdit"
          >
            Cancel
          </button>
        </form>

        <!-- All Books -->
        <div class="mt-5">
          <h2>
            Books in Firestore
          </h2>

          <table
            v-if="books.length"
            class="table table-bordered table-striped mt-3"
          >
            <thead>
              <tr>
                <th>ISBN</th>
                <th>Book Name</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              <tr
                v-for="book in books"
                :key="book.id"
              >
                <td>
                  {{ book.isbn }}
                </td>

                <td>
                  {{ book.name }}
                </td>

                <td>
                  <!-- Edit -->
                  <button
                    type="button"
                    class="btn btn-warning btn-sm me-2"
                    @click="editBook(book)"
                  >
                    Edit
                  </button>

                  <!-- Delete -->
                  <button
                    type="button"
                    class="btn btn-danger btn-sm"
                    @click="removeBook(book.id)"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>

          <p v-else>
            No books found.
          </p>
        </div>

        <!--
          Task 8.2 Screenshot Set 2
          Firestore query using:
          where + orderBy + limit
        -->
        <BookList
          :refresh-key="refreshKey"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  onMounted,
  ref
} from 'vue'

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc
} from 'firebase/firestore'

import db from '../firebase/init'

import BookList from '../components/BookList.vue'

interface Book {
  id: string
  isbn: number
  name: string
}

// Form fields
const isbn = ref<number | null>(null)
const name = ref('')

// Firestore books
const books = ref<Book[]>([])

// Current book being edited
const editingId = ref<string | null>(null)

// Messages
const successMessage = ref('')
const errorMessage = ref('')

// Used to refresh BookList query
const refreshKey = ref(0)

/*
  Load all books from Firestore
*/
const loadBooks = async () => {
  try {
    const querySnapshot = await getDocs(
      collection(db, 'books')
    )

    books.value = querySnapshot.docs.map(
      (document) => {
        const data = document.data()

        return {
          id: document.id,
          isbn: data.isbn,
          name: data.name
        }
      }
    )
  } catch (error) {
    console.error(
      'Error loading books:',
      error
    )

    errorMessage.value =
      'Failed to load books.'
  }
}

/*
  Add or Update Book
*/
const saveBook = async () => {
  successMessage.value = ''
  errorMessage.value = ''

  if (
    isbn.value === null ||
    name.value.trim() === ''
  ) {
    errorMessage.value =
      'Please enter ISBN and book name.'

    return
  }

  try {
    /*
      UPDATE
    */
    if (editingId.value) {
      const bookRef = doc(
        db,
        'books',
        editingId.value
      )

      await updateDoc(
        bookRef,
        {
          isbn: Number(isbn.value),
          name: name.value.trim()
        }
      )

      successMessage.value =
        'Book updated successfully!'

      editingId.value = null
    } else {
      /*
        CREATE
      */
      await addDoc(
        collection(db, 'books'),
        {
          isbn: Number(isbn.value),
          name: name.value.trim()
        }
      )

      successMessage.value =
        'Book added successfully!'
    }

    // Clear form
    isbn.value = null
    name.value = ''

    // Refresh full book list
    await loadBooks()

    // Refresh where/orderBy/limit query
    refreshKey.value++
  } catch (error) {
    console.error(
      'Error saving book:',
      error
    )

    errorMessage.value =
      'Failed to save book.'
  }
}

/*
  Select a book for editing
*/
const editBook = (
  book: Book
) => {
  editingId.value = book.id

  isbn.value = book.isbn
  name.value = book.name

  successMessage.value = ''
  errorMessage.value = ''

  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

/*
  Cancel Edit
*/
const cancelEdit = () => {
  editingId.value = null

  isbn.value = null
  name.value = ''

  successMessage.value = ''
  errorMessage.value = ''
}

/*
  Delete Book
*/
const removeBook = async (
  id: string
) => {
  try {
    await deleteDoc(
      doc(
        db,
        'books',
        id
      )
    )

    successMessage.value =
      'Book deleted successfully!'

    errorMessage.value = ''

    // If deleted book was being edited
    if (editingId.value === id) {
      cancelEdit()
    }

    // Refresh full list
    await loadBooks()

    // Refresh where/orderBy/limit query
    refreshKey.value++
  } catch (error) {
    console.error(
      'Error deleting book:',
      error
    )

    errorMessage.value =
      'Failed to delete book.'
  }
}

/*
  Load books when page opens
*/
onMounted(() => {
  loadBooks()
})
</script>

<style scoped>
h1,
h2 {
  font-weight: 600;
}

table {
  vertical-align: middle;
}

.btn {
  min-width: 80px;
}
</style>