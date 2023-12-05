const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const config = require('./config.json')
const cors = require('cors')
const multer = require('multer');
const aws = require('aws-sdk');
const { BlobServiceClient, StorageSharedKeyCredential } = require('@azure/storage-blob');
const multerS3 = require('multer-s3');

const app = express();
const port = 3008;

// MySQL database connection setup
const db = mysql.createConnection({
  host: 'localhost',
  user: config.mysql_username,
  password: config.mysql_password,
  database: 'OnlineBookstore',
});

aws.config.update({
  accessKeyId: 'your-access-key-id',
  secretAccessKey: 'your-secret-access-key',
  region: 'your-aws-region',
});

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ["GET", "POST", "PUT"],
};

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

app.use(bodyParser.json());

app.use(
  session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true,
  })
);

app.use(cors(corsOptions));
//app.use(express.urlencoded({ extended: true }));

// Middleware for JWT token validation
const checkToken = (req, res, next) => {
  const token = req.headers['x-access-token'] || req.session.token;

  if (!token) {
    return res.status(403).json({ error: 'Token is required' });
  }

  jwt.verify(token, 'your_jwt_secret', (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' });
    }
    req.decoded = decoded;
    next();
  });
};

// Login API
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const query = 'SELECT * FROM Users WHERE Username = ? AND Password = ?';
  db.query(query, [username, password], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      if (results.length > 0) {
        const user = results[0];
        const token = jwt.sign({ userID: user.UserID, username: user.Username }, 'your_jwt_secret', {
          expiresIn: '1h', // Token expires in 1 hour
        });

        // Save the token in the session
        req.session.token = token;

        res.json({ message: 'Login successful', token, user });
      } else {
        res.status(401).json({ error: 'Invalid credentials' });
      }
    }
  });
});

// Logout API
app.post('/logout', (req, res) => {
  // Destroy the session
  req.session.destroy((err) => {
    if (err) {
      res.status(500).json({ error: 'Internal Server Error' });
    } else {
      res.json({ message: 'Logout successful' });
    }
  });
});

// Protected route with JWT token validation middleware
app.get('/protected', checkToken, (req, res) => {
  res.json({ message: 'Protected route', user: req.decoded });
});

// Register API
app.post('/register', (req, res) => {
    const { username, password, email, address } = req.body;
    const query = 'INSERT INTO Users (Username, Password, Email, Address) VALUES (?, ?, ?, ?)';
    db.query(query, [username, password, email, address], (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json({ message: 'Registration successful', userID: results.insertId });
      }
    });
  });
  
  // Add Book API
  app.post('/addBook', (req, res) => {
    const { title, authorID, genreID, publishDate, price, stockQuantity } = req.body;
    const query =
      'INSERT INTO Books (Title, AuthorID, GenreID, PublishDate, Price, StockQuantity) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(
      query,
      [title, authorID, genreID, publishDate, price, stockQuantity],
      (err, results) => {
        if (err) {
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          res.json({ message: 'Book added successfully', bookID: results.insertId });
        }
      }
    );
  });

  //Add Book in cart
  app.post('/addBookCart', (req, res) => {
    const { user_id, book_id, date } = req.body;
    const query =
      `INSERT INTO cart (user_id, book_id, date) VALUES(?, ?, ?)`;
    db.query(
      query,
      [user_id, book_id, date],
      (err, results) => {
        if (err) {
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          res.json(results[0]);
        }
      }
    );
  });

  //Get books
  app.get('/getBooks', (req, res) => {
    const query =
      `SELECT a.BookID, a.Title, a.PublishDate, a.Price, a.tumbnail_url, b.AuthorName, g.GenreName 
      FROM Books as a join Authors b join Genres g on a.AuthorID = b.AuthorID and a.GenreID = g.GenreID`;
    db.query(
      query,
      (err, results) => {
        if (err) {
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          res.json(results);
        }
      }
    );
  });
  
  //getCart
  app.get('/cart', (req, res) => {
    userID = req.query.user_id
    const query =
      `select c.id, b.BookID, b.Title, b.Price, g.GenreName, a.AuthorName, b.tumbnail_url from cart c 
      join Books b 
      join Genres g 
      join Authors a  
      on c.book_id = b.BookID 
      and b.GenreID = g.GenreID 
      and b.AuthorID = A.AuthorID 
      where c.user_id = ? and c.is_Active = 1 and c.is_Deleted = 0;`;
    db.query(
      query, [userID], 
      (err, results) => {
        if (err) {
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          res.json(results);
        }
      }
    );
  });


  //delete book from cart
  app.post('/deleteBookCart', (req, res) => {
    const { cart_id } = req.body;
    const query =
      `UPDATE cart SET is_Active = 0, is_Deleted = 1 WHERE id = ?;`;
    db.query(
      query,
      [cart_id],
      (err, results) => {
        if (err) {
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          res.json(results[0]);
        }
      }
    );
  });

  //upload image to aws and book to database
  const upload = multer({
    // storage: multerS3({
    //   s3: s3,
    //   bucket: 'your-s3-bucket-name',
    //   acl: 'public-read', // Set ACL permissions for the uploaded file
    //   metadata: function (req, file, cb) {
    //     cb(null, { fieldName: file.fieldname });
    //   },
    //   key: function (req, file, cb) {
    //     cb(null, Date.now().toString() + '-' + file.originalname);
    //   },
    // }),
  });
  
  // Endpoint to handle book upload
  app.post('/uploadNewBook', upload.single('image'), async (req, res) => {
    try {
      // Save book details and imageUrl to MySQL
      const { title, author } = req.body;
      const imageUrl = req.file.location;
  
      const query = 'INSERT INTO books (title, author, imageUrl) VALUES (?, ?, ?)';
      db.query(query, [title, author, imageUrl], (err, result) => {
        if (err) {
          console.error('Error inserting data into MySQL:', err);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          res.json({ message: 'Book uploaded successfully' });
        }
      });
    } catch (error) {
      console.error('Error uploading book:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  // addpurchase history
  app.post('/createPurchasehistory', (req, res) => {
    const { user_id, book_id } = req.body;
    const query =
      `INSERT INTO purchaseHistory
      (userId, BookId)
      VALUES(?, ?);`;
    db.query(
      query,
      [user_id, book_id],
      (err, results) => {
        if (err) {
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          res.json({ message: 'Purchase Completed'});
        }
      }
    );
  });

  //getPurchae history 
  app.get('/purchaseHistory', (req, res) => {
    userID = req.query.user_id
    const query =
      `select ph.isPaid, b.BookID, b.Title, b.Price, g.GenreName, a.AuthorName, b.tumbnail_url from purchaseHistory ph join Books b 
      join Genres g 
      join Authors a  
      on ph.bookid = b.BookID 
      and b.GenreID = g.GenreID 
      and b.AuthorID = A.AuthorID 
      where ph.userid = 72;`;
    db.query(
      query, [userID], 
      (err, results) => {
        if (err) {
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          res.json(results);
        }
      }
    );
  });

  // Delete Book API
  // app.delete('/deleteBook/:bookID', (req, res) => {
  //   const bookID = req.params.bookID;
  //   const query = 'DELETE FROM Books WHERE BookID = ?';
  //   db.query(query, [bookID], (err, results) => {
  //     if (err) {
  //       res.status(500).json({ error: 'Internal Server Error' });
  //     } else {
  //       if (results.affectedRows > 0) {
  //         res.json({ message: 'Book deleted successfully' });
  //       } else {
  //         res.status(404).json({ error: 'Book not found' });
  //       }
  //     }
  //   });
  // });  




//Azure Storage

// Azure Blob Storage configuration (replace placeholder values)
const account = 'rbedagkabucket';
const accountKey = 'DywWILbrT8BYe2M6yD0DYvAP1P4WUi1Gp2BXbtMy1AVEbsrOKdodz1zQb30Rv8l8sm+j7oTRm0LQ+AStEpn1pA==';
const containerName = 'bookstore';
const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
const blobServiceClient = new BlobServiceClient(`https://${account}.blob.core.windows.net`, sharedKeyCredential);

const containerClient = blobServiceClient.getContainerClient(containerName);

// Configure Multer to use Azure Blob Storage
const uploadAzure = multer({
  storage: multer.memoryStorage(),
});

// Endpoint to handle book upload
app.post('/uploadAzure', uploadAzure.single('image'), async (req, res) => {
  try {
   
    const { title, authorID, genreID, publishDate, price, stockQuantity } = req.body;

    const blobName = `${title}-${authorID}-${req.file.originalname}`;
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);
    const uploadURL = await blockBlobClient.upload(req.file.buffer, req.file.size);

    if(uploadURL.etag) {
      const url = `https://rbedagkabucket.blob.core.windows.net/bookstore/${blobName}`;
    const query = `INSERT INTO Books
    (Title, AuthorID, GenreID, PublishDate, Price, StockQuantity, tumbnail_url)
    VALUES(?, ?, ?, ?, ?, ?, ?);`;
    db.query(query, [title, authorID, genreID, publishDate, price, stockQuantity, url], async (err, result) => {
      if (err) {
        console.error('Error inserting data into MySQL:', err);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }
      // Upload image to Azure Blob Storage
      // const blobName = `$abc-${req.file.originalname}`;
      res.json({ success: 'Book uploaded successfully' });
    });
    }
    
  
  } catch (error) {
    console.error('Error uploading book:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

//////////////////

//getauthor 
app.get('/authors', (req, res) => {
  const query =
    `SELECT * from Authors`;
  db.query(
    query, 
    (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(results);
      }
    }
  );
});

 /******************** */
 
 //get genre
 app.get('/genres', (req, res) => {
  const query =
    `SELECT * from Genres`;
  db.query(
    query, 
    (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json(results);
      }
    }
  );
});



/*************** */
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


app.get('/test', (req, res) => {
    res.send("working")
})