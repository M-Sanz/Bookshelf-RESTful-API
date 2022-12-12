const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const newBook = {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    insertedAt,
    updatedAt,
    id,
    finished: readPage === pageCount,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBooks = (req, h) => {
  const displayedBooks = [];

  const { reading, finished, name: queryName } = req.query;

  if (reading === '0') {
    const unreading = books.filter((book) => book.reading === false);
    unreading.forEach((book) => {
      const newBook = (({ id, name, publisher }) => ({ id, name, publisher }))(book);
      displayedBooks.push(newBook);
    });
    return h.response({
      status: 'success',
      data: {
        books: displayedBooks,
      },
    }).code(200);
  }

  if (reading === '1') {
    const sedangDibaca = books.filter((book) => book.reading === true);
    sedangDibaca.forEach((book) => {
      const newBook = (({ id, name, publisher }) => ({ id, name, publisher }))(book);
      displayedBooks.push(newBook);
    });
    return h.response({
      status: 'success',
      data: {
        books: displayedBooks,
      },
    }).code(200);
  }
  if (finished === '0') {
    const unreading = books.filter((book) => book.finished === false);
    unreading.forEach((book) => {
      const newBook = (({ id, name, publisher }) => ({ id, name, publisher }))(book);
      displayedBooks.push(newBook);
    });
    return h.response({
      status: 'success',
      data: {
        books: displayedBooks,
      },
    }).code(200);
  }

  if (finished === '1') {
    const sedangDibaca = books.filter((book) => book.finished === true);
    sedangDibaca.forEach((book) => {
      const newBook = (({ id, name, publisher }) => ({ id, name, publisher }))(book);
      displayedBooks.push(newBook);
    });
    return h.response({
      status: 'success',
      data: {
        books: displayedBooks,
      },
    }).code(200);
  }

  if (queryName !== undefined) {
    books.forEach((book) => {
      if (book.name.toLowerCase().includes(queryName.toLowerCase())) {
        const newBook = (({ id, name, publisher }) => ({ id, name, publisher }))(book);
        displayedBooks.push(newBook);
      }
    });
    if (displayedBooks.length > 0) {
      return h.response({
        status: 'success',
        data: {
          books: displayedBooks,
        },
      }).code(200);
    }
    return h.response({
      status: 'fail',
      message: 'name tidak ditemukan',
    }).code(404);
  }

  books.forEach((book) => {
    const newBook = (({ id, name, publisher }) => ({ id, name, publisher }))(book);
    displayedBooks.push(newBook);
  });
  return h.response({
    status: 'success',
    data: {
      books: displayedBooks,
    },
  }).code(200);
};

const getBookDetail = (req, h) => {
  const { id } = req.params;
  const book = books.filter((n) => n.id === id)[0];

  if (book !== undefined) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHandler = (req, h) => {
  const { id } = req.params;

  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = req.payload;

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  const index = books.findIndex((book) => book.id === id);

  const update = new Date().toISOString();
  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt: update,
    };

    return h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    }).code(200);
  }

  return h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  }).code(404);
};

const deleteBookByIdHandler = (req, h) => {
  const { id } = req.params;

  const index = books.findIndex((book) => book.id === id);
  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    }).code(200);
    return response;
  }

  return h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  }).code(404);
};

module.exports = {
  addBookHandler, getAllBooks, getBookDetail, editBookByIdHandler, deleteBookByIdHandler,
};
