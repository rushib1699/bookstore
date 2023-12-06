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
const fs = require('fs');
const bcrypt = require("bcrypt");
const crypto = require('crypto');

const jwtToken = require('./jwt');



const app = express();
const port = 3008;


var private_key = null;
const privateKeyPath = '/home/ubuntu/bookstore/keys/private_key.pem';
// fs.readFile('/home/ubuntu/bookstore/keys/private-key.pem', 'utf8', (err, data_private) => {
//     if (err) {
//         console.log(err)
//     } else {
//         private_key = data_private
//     }
// })
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
  origin: "https://app.patelauto.co",
  credentials: true,
  methods: ["GET", "POST", "PUT", "OPTIONS"],
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
// app.post('/login', (req, res) => {
//   const { username, password } = req.body;
//   const query = 'SELECT * FROM Users WHERE Username = ? AND Password = ?';
//   db.query(query, [username, password], (err, results) => {
//     if (err) {
//       res.status(500).json({ error: 'Internal Server Error' });
//     } else {
//       if (results.length > 0) {
//         const user = results[0];
//         const token = jwt.sign({ userID: user.UserID, username: user.Username }, 'your_jwt_secret', {
//           expiresIn: '1h', // Token expires in 1 hour
//         });

//         // Save the token in the session
//         req.session.token = token;

//         res.json({ message: 'Login successful', token, user });
//       } else {
//         res.status(401).json({ error: 'Invalid credentials' });
//       }
//     }
//   });
// });

// // Logout API
// app.post('/logout', (req, res) => {
//   // Destroy the session
//   req.session.destroy((err) => {
//     if (err) {
//       res.status(500).json({ error: 'Internal Server Error' });
//     } else {
//       res.json({ message: 'Logout successful' });
//     }
//   });
// });

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
app.get('/getBooks', jwtToken.ensure, (req, res) => {
  const query =
    `SELECT a.BookID, a.Title, a.PublishDate, a.Price, a.tumbnail_url, b.AuthorName, g.GenreName 
      FROM Books as a join Authors b join Genres g on a.AuthorID = b.AuthorID and a.GenreID = g.GenreID`;
  db.query(
    query,
    (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        const verify = jwtToken.verify(req.token);
        if (verify) {
          res.json(results);
        } else {
          res.sendStatus(403);
        }

      }
    }
  );
});

//getCart
app.get('/cart', (req, res) => {
  userID = req.query.user_id
  //console.log(req)
  const query =
    `select c.id, b.BookID, b.Title, b.Price, g.GenreName, a.AuthorName, b.tumbnail_url from cart c 
      join Books b 
      join Genres g 
      join Authors a  
      on c.book_id = b.BookID 
      and b.GenreID = g.GenreID 
      and b.AuthorID = a.AuthorID 
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
        res.json({ message: 'Purchase Completed' });
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
      and b.AuthorID = a.AuthorID 
      where ph.userid = ?`;
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

    if (uploadURL.etag) {
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

/*********************************************/

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



/*********************************************/


/****************Login */

app.post('/login', (req, res) => {
  const username = req.body.username;
  const pass = req.body.pass;
  //console.log(username)
  let query =
    `SELECT * FROM Users u WHERE Email = ? and isActive = 1 and isDeleted = 0`;
  try {
    db.query(query, username, (error, result) => {
      if (error) {
        res.send(error);
      }
      if (result.length > 0) {
        bcrypt.compare(pass, result[0].Password, (e, r) => {
          if (r) {
            // req.session.user = result;
            // var signOptions = {
            //     expiresIn: "12h",
            //     algorithm: "RS256"
            // }
            // const token = jwt.sign({ result }, private_key, signOptions);
            //console.log(token)
            var token = ''
            console.log(privateKeyPath);
            // res.send({ isLoggedIn: true, result, token });
            fs.readFile(privateKeyPath, 'utf8', async (err, private_key) => {
              if (err) {
                console.log(err);
              } else {
                // Assuming that `result` is an object containing user information
                //console.log(private_key)
                req.session.user = result;

                // Configure JWT signing options
                const signOptions = {
                  expiresIn: '12h',
                  algorithm: 'HS256'
                };

                token = await jwt.sign({ user: result }, private_key, signOptions);
                //console.log(token);
                res.send({ isLoggedIn: true, result, token });


              }
            });

          } else {
            res.send({ message: "Wrong username and/or Password" });
          }
        });
      }
    });
  } catch (error) {
    console.log(error);
    res.send({ message: "Something Went Wrong, Please Try Again " });
  }
});


// app.post('/login', (req, res) => {
//   const username = req.body.username;
//   const pass = req.body.pass;
//   console.log(username);

//   let query = `SELECT * FROM Users u WHERE Email = ? and isActive = 1 and isDeleted = 0`;

//   try {
//     db.query(query, username, (error, result) => {
//       if (error) {
//         res.send(error);
//       }

//       if (result.length > 0) {
//         bcrypt.compare(pass, result[0].Password, async (e, r) => {
//           if (r) {
//             var token = '';

//             fs.readFile(privateKeyPath, 'utf8', async (err, privateKey) => {
//               if (err) {
//                 console.log('Error reading private key:', err);
//                 res.status(500).json({ error: 'Internal Server Error' });
//                 return;
//               }

//               try {
//                 // Continue with the rest of your code
//                 req.session.user = result;

//                 // Configure JWT signing options
//                 const signOptions = {
//                   expiresIn: '12h',
//                   algorithm: 'RS256',
//                 };

//                 // Sign the JWT using RS256 and the private key
//                 token = await jwt.sign({ user: result }, privateKey, signOptions);
//                 console.log('JWT Token:', token);

//                 res.send({ isLoggedIn: true, result, token });
//               } catch (signError) {
//                 console.error('Error signing token:', signError);
//                 res.status(500).json({ error: 'Internal Server Error' });
//               }
//             });
//           } else {
//             res.send({ message: 'Wrong username and/or Password' });
//           }
//         });
//       }
//     });
//   } catch (error) {
//     console.log(error);
//     res.send({ message: 'Something Went Wrong, Please Try Again ' });
//   }
// });
/****************** */


/***************logout */

app.post("/logout", (req, res) => {
  // const userid = req.body.userId;
  // const username = req.body.username;
  // const time = req.body.loggedDuration;
  // const loginTimeStamp = req.body.logInTime;
  // const logOutTimeStamp = req.body.logOutTime;

  // console.log(`User, ${username}: ${userid} was logged in for ${time} min`);

  let query =
    `INSERT INTO session_details (login_timestamp, logout_timestamp, duration, users_id) VALUES (?, ?, ?, ?)`;
  try {
    // db.query(query, [loginTimeStamp, logOutTimeStamp, time, userid]);

    req.session.destroy();
    res.send({ isLoggedIn: false });
  }
  catch (error) {
    console.log(error);
    res.send({ message: "Something Went Wrong, Please Try Again " });
  }
});

/****************** */




/****************   Rent Histoy */

// addpurchase history
app.post('/createRentHistory', (req, res) => {
  const { user_id, book_id } = req.body;
  const query =
    `INSERT INTO rentHistory
      (userId, BookId)
      VALUES(?, ?);`;
  db.query(
    query,
    [user_id, book_id],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Internal Server Error' });
      } else {
        res.json({ message: 'Purchase Completed' });
      }
    }
  );
});

//get Rent history 
app.get('/rentHistory', (req, res) => {
  userID = req.query.user_id
  const query =
    `select rh.isPaid, b.BookID, b.Title, b.Price, g.GenreName, a.AuthorName, b.tumbnail_url from rentHistory rh join Books b 
      join Genres g 
      join Authors a  
      on rh.bookid = b.BookID 
      and b.GenreID = g.GenreID 
      and b.AuthorID = a.AuthorID 
      where rh.userid = ?`;
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

/******************************* */



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


app.get('/test', (req, res) => {
  res.send("working")
})