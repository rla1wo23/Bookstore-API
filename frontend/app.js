// static/app.js
const API_URL = "http://localhost:5000";

function loadBooks() {
  fetch(`${API_URL}/books`)
    .then((response) => response.json())
    .then((data) => {
      const bookList = document.getElementById("book-list");
      bookList.innerHTML = "";
      data.forEach((book) => {
        const li = document.createElement("li");
        li.textContent = `${book.title} - ${book.author} - $${parseFloat(
          book.price,
        ).toFixed(2)}`;

        // 삭제 버튼
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "삭제";
        deleteButton.onclick = () => deleteBook(book.id);
        li.appendChild(deleteButton);

        // 수정 버튼
        const editButton = document.createElement("button");
        editButton.textContent = "수정";
        editButton.onclick = () => showEditForm(book);
        li.appendChild(editButton);

        bookList.appendChild(li);
      });
    });
}

function addBook(event) {
  event.preventDefault();
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const price = document.getElementById("price").value;

  fetch(`${API_URL}/books`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, author, price }),
  })
    .then((response) => response.json())
    .then((data) => {
      loadBooks();
      document.getElementById("add-book-form").reset();
    });
}

function deleteBook(id) {
  fetch(`${API_URL}/books/${id}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      loadBooks();
    });
}

function showEditForm(book) {
  document.getElementById("edit-form-container").style.display = "block";
  document.getElementById("edit-id").value = book.id;
  document.getElementById("edit-title").value = book.title;
  document.getElementById("edit-author").value = book.author;
  document.getElementById("edit-price").value = book.price;
}

function cancelEdit() {
  document.getElementById("edit-form-container").style.display = "none";
  document.getElementById("edit-book-form").reset();
}

function editBook(event) {
  event.preventDefault();
  const id = document.getElementById("edit-id").value;
  const title = document.getElementById("edit-title").value;
  const author = document.getElementById("edit-author").value;
  const price = document.getElementById("edit-price").value;

  fetch(`${API_URL}/books/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, author, price }),
  })
    .then((response) => response.json())
    .then((data) => {
      loadBooks();
      cancelEdit();
    });
}

document.getElementById("add-book-form").addEventListener("submit", addBook);
document.getElementById("edit-book-form").addEventListener("submit", editBook);

window.onload = loadBooks;
