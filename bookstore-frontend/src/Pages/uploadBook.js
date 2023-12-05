import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../res/css/uploadBook.css';
import SideNavBar from '../Components/SideNavBar';


function BookUpload() {
  const [title, setTitle] = useState('');
  const [authorID, setAuthorID] = useState('');
  const [authors, setAuthors] = useState([]);
  const [genreID, setGenreID] = useState('');
  const [genres, setGenres] = useState([]);
  const [publishDate, setPublishDate] = useState(new Date());
  const [price, setPrice] = useState('');
  
  const [stockQuantity, setStockQuantity] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchAuthorsAndGenres();
  }, []);

  const fetchAuthorsAndGenres = async () => {
    try {
      const authorsResponse = await axios.get('http://localhost:3008/authors');
      setAuthors(authorsResponse.data);

      const genresResponse = await axios.get('http://localhost:3008/genres');
      setGenres(genresResponse.data);
    } catch (error) {
      console.error('Error fetching authors and genres:', error);
    }
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(selectedImage);
  };

  const handleUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('authorID', authorID);
      formData.append('genreID', genreID);
      formData.append('publishDate', formatDateForMySQL(publishDate));
      formData.append('price', price);
      formData.append('stockQuantity', stockQuantity);
      formData.append('image', image);

      const response = await axios.post('http://localhost:3008/uploadAzure', formData);

      if (response.data.success) {
        // Show success notification
        toast.success('Book uploaded successfully', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });

        // Reset form fields after successful upload
        setTitle('');
        setAuthorID('');
        setGenreID('');
        setPublishDate(new Date());
        setPrice('');
        setStockQuantity('');
        setImage(null);
        setImagePreview(null);
      } else {
        // Show error notification
        toast.error('Failed to upload book. Please try again.', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    } catch (error) {
      console.error('Error uploading book:', error);
    }
  };

  const formatDateForMySQL = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div>
      <SideNavBar />
      <div className="div-container">
        <h2>Upload New Book</h2>
        <label>
          Title:
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <br />
        <label>
          Author:
          <select value={authorID} onChange={(e) => setAuthorID(e.target.value)}>
            <option value="">Select Author</option>
            {authors.map((author) => (
              <option key={author.AuthorID} value={author.AuthorID}>
                {author.AuthorName}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Genre:
          <select value={genreID} onChange={(e) => setGenreID(e.target.value)}>
            <option value="">Select Genre</option>
            {genres.map((genre) => (
              <option key={genre.GenreID} value={genre.GenreID}>
                {genre.GenreName}
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Publish Date:
          <DatePicker selected={publishDate} onChange={(date) => setPublishDate(date)} />
        </label>
        <br />
        <label>
          Price:
          <input type="text" value={price} onChange={(e) => setPrice(e.target.value)} />
        </label>
        <br />
        <label>
          Stock Quantity:
          <input type="text" value={stockQuantity} onChange={(e) => setStockQuantity(e.target.value)} />
        </label>
        <br />
        <label>
          Image:
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>
        <br />
        {imagePreview && <img src={imagePreview} alt="Preview" style={{ maxWidth: '200px' }} />}
        <br />
        <button onClick={handleUpload}>Upload</button>
      </div>
      {/* Notification Container */}
      <ToastContainer />
    </div>
  );
}

export default BookUpload;
