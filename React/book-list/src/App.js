import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [books, setBooks] = useState([]);
  const [filterOptions, setFilterOptions] = useState({
    country: "",
    language: "",
    pages: "",
    year: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [pageSize, setPageSize] = useState(20);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchButtonPressed, setSearchButtonPressed] = useState(false);

  const fetchBooks = async () => {
    try {
      const response = await fetch("/books.json");
      const data = await response.json();
      setBooks(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilterOptions((prevOptions) => ({ ...prevOptions, [name]: value }));
    setCurrentPage(1);
  };

  const handleSearchButton = () => {
    setSearchButtonPressed(true);
    setCurrentPage(1);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setSearchButtonPressed(false);
  };

  const filteredBooks = books.filter((book) => {
    const { country, language, pages, year } = filterOptions;
    const isValidCountry =
      !country || book.country.toLowerCase().includes(country.toLowerCase());
    const isValidLanguage =
      !language || book.language.toLowerCase().includes(language.toLowerCase());
    const isValidPages =
      !pages ||
      (pages === "1-100" && book.pages <= 100) ||
      (pages === "101-200" && book.pages <= 200) ||
      (pages === "201-300" && book.pages <= 300);
    const isValidYear =
      !year ||
      (year === "16th century" && book.year >= 1501 && book.year <= 1600) ||
      (year === "17th century" && book.year >= 1601 && book.year <= 1700) ||
      (year === "18th century" && book.year >= 1701 && book.year <= 1800);

    const searchMatchesTitle =
      searchTerm !== "" &&
      book.title.toLowerCase().includes(searchTerm.toLowerCase());

    return (
      isValidCountry &&
      isValidLanguage &&
      isValidPages &&
      isValidYear &&
      (!searchButtonPressed || searchMatchesTitle)
    );
  });

  const handlePageSizeChange = (event) => {
    setPageSize(Number(event.target.value));
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredBooks.length / pageSize);
  const paginatedBooks = filteredBooks.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="App">
      <header className="App-header">
        <h1>List of Books</h1>
        <div className="filters">
          <div className="filter">
            <label>Country:</label>
            <input
              type="text"
              name="country"
              value={filterOptions.country}
              onChange={handleFilterChange}
            />
          </div>
          <div className="filter">
            <label>Language:</label>
            <input
              type="text"
              name="language"
              value={filterOptions.language}
              onChange={handleFilterChange}
            />
          </div>
          <div className="filter">
            <label>No. of Pages:</label>
            <select
              name="pages"
              value={filterOptions.pages}
              onChange={handleFilterChange}
            >
              <option value="">All</option>
              <option value="1-100">1-100</option>
              <option value="101-200">101-200</option>
              <option value="201-300">201-300</option>
            </select>
          </div>
          <div className="filter">
            <label>Year Published:</label>
            <select
              name="year"
              value={filterOptions.year}
              onChange={handleFilterChange}
            >
              <option value="">All</option>
              <option value="16th century">16th century</option>
              <option value="17th century">17th century</option>
              <option value="18th century">18th century</option>
            </select>
          </div>
          <div className="filter">
            <label>Search:</label>
            <input type="text" value={searchTerm} onChange={handleSearch} />
            <button onClick={handleSearchButton}>Search</button>
          </div>
          <div className="filter">
            <label>Items per Page:</label>
            <select
              name="pageSize"
              value={pageSize}
              onChange={handlePageSizeChange}
            >
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>
        <div className="book-list">
          {filteredBooks.length === 0 ? (
            <p>No books match the current filters.</p>
          ) : (
            paginatedBooks.map((book) => (
              <div key={book.title} className="book-card">
                <h3>{book.title}</h3>
                <p>Author: {book.author}</p>
                <p>Country: {book.country}</p>
                <p>Language: {book.language}</p>
                <p>Year Published: {book.year}</p>
                <p>Pages: {book.pages}</p>
              </div>
            ))
          )}
        </div>
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (pageNumber) => (
              <button
                key={pageNumber}
                className={currentPage === pageNumber ? "active" : ""}
                onClick={() => setCurrentPage(pageNumber)}
              >
                {pageNumber}
              </button>
            )
          )}
        </div>
      </header>
    </div>
  );
};

export default App;
