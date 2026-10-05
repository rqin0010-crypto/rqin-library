const {onRequest} = require("firebase-functions/v2/https");
const {
  onDocumentCreated,
} = require("firebase-functions/v2/firestore");

const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");

const cors = require("cors")({
  origin: true,
});

initializeApp();


// -----------------------------------
// Function 1: Count books
// -----------------------------------
exports.countBooks = onRequest((request, response) => {
  cors(request, response, async () => {
    try {
      const db = getFirestore();

      const snapshot = await db
          .collection("books")
          .get();

      response.status(200).json({
        count: snapshot.size,
      });
    } catch (error) {
      console.error(
          "Error counting books:",
          error,
      );

      response.status(500).json({
        error: "Failed to count books",
      });
    }
  });
});


// -----------------------------------
// Function 2: Capitalise new book data
// -----------------------------------
exports.capitalizeBook = onDocumentCreated(
    "books/{bookId}",
    async (event) => {
      try {
        const snapshot = event.data;

        if (!snapshot) {
          return;
        }

        const bookData = snapshot.data();

        const updatedData = {};

        Object.entries(bookData).forEach(
            ([key, value]) => {
              if (typeof value === "string") {
                updatedData[key] =
                  value.toUpperCase();
              }
            },
        );

        if (
          Object.keys(updatedData).length > 0
        ) {
          await snapshot.ref.update(
              updatedData,
          );
        }

        console.log(
            "Book data capitalised:",
            updatedData,
        );
      } catch (error) {
        console.error(
            "Error capitalising book:",
            error,
        );
      }
    },
);


// -----------------------------------
// Function 3: Get all books
// -----------------------------------
exports.getAllBooks = onRequest(
    (request, response) => {
      cors(request, response, async () => {
        try {
          const db = getFirestore();

          const snapshot = await db
              .collection("books")
              .get();

          const books = snapshot.docs.map(
              (document) => ({
                id: document.id,
                ...document.data(),
              }),
          );

          response.status(200).json(
              books,
          );
        } catch (error) {
          console.error(
              "Error getting all books:",
              error,
          );

          response.status(500).json({
            error: "Failed to get all books",
          });
        }
      });
    },
);
