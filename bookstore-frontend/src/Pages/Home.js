import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import Axios from 'axios';
import SideNavBar from './../Components/SideNavBar';
import '../res/css/Home.css';

function Home() {
  const [cart, setCart] = useState([]);
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAuthor, setSelectedAuthor] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedPublishDate, setSelectedPublishDate] = useState('');
  
  const Access_token = sessionStorage.getItem('token');

  const config = {
    headers: {
      Authorization: `Bearer ${Access_token}`,
    }
  };
 // console.log('Access_token:', Access_token);


  useEffect(() => {
    // Fetch books initially
    Axios.get('https://api.patelauto.co/getBooks', {
      headers: {
        authorization: `Bearer ${Access_token}`,
      }
    })
      .then((response) => {
        setBooks(response.data);
        setFilteredBooks(response.data);
      })
      .catch((error) => {
        console.error('Error fetching books:', error);
      });
  }, []);

  const toggleSortOrder = () => {
    setSortOrder((prevOrder) => (prevOrder === 'asc' ? 'desc' : 'asc'));
  };
  const addToCart = (book) => {
    // Implement the logic to add the book to the cart
    Axios.post('https://api.patelauto.co/addBookCart', {
      user_id: sessionStorage.getItem('user-id'),
      book_id: book.BookID,
    }, {
      headers: {
        authorization: `Bearer ${Access_token}`,
      }
    })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error adding books:', error);
      });

    if (!cart.find((cartBook) => cartBook.BookID === book.BookID)) {
      // Add the book to the cart
      setCart((prevCart) => [...prevCart, book]);
      console.log(`Book ${book.Title} added to cart`);
    }
  };

  const handleSearch = () => {
    // Filter books based on the search term
    const filtered = books.filter((book) =>
      book.Title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredBooks(filtered);
  };

  const handleFilter = () => {
    // Filter books based on selected filters (author, genre, publish date)
    let filtered = books;

    if (selectedAuthor) {
      filtered = filtered.filter((book) => book.AuthorName === selectedAuthor);
    }

    if (selectedGenre) {
      filtered = filtered.filter((book) => book.GenreName === selectedGenre);
    }

    if (selectedPublishDate) {
      filtered = filtered.filter(
        (book) => book.PublishDate.split('T')[0] === selectedPublishDate
      );
    }

    setFilteredBooks(filtered);
  };

  return (
    <div>
      <SideNavBar />
      <main className="dashboard">
        <div className="filters">
          <input
            type="text"
            placeholder="Search by title"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={selectedAuthor}
            onChange={(e) => setSelectedAuthor(e.target.value)}
          >
            <option value="">Filter by Author</option>
            {/* Add options for authors */}
          </select>
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            <option value="">Filter by Genre</option>
            {/* Add options for genres */}
          </select>
          <input
            type="date"
            value={selectedPublishDate}
            onChange={(e) => setSelectedPublishDate(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
          <button onClick={handleFilter}>Filter</button>
        </div>
        <section className="books-container">
          {filteredBooks.map((book) => (
            <div key={book.BookID} className="book-box">
              <img src={book.tumbnail_url} alt={book.Title} />
              <div className="book-details">
                <h3>{book.Title}</h3>
                <p>{book.AuthorName}</p>
                <p>{book.GenreName}</p>
                <p>{book.Price}</p>
                <button onClick={() => addToCart(book)}>Add to Cart</button>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}

export default Home;
