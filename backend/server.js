const express = require('express');
const mysql = require('mysql2');
const bc  = require('bcrypt');
const bodyParser = require('body-parser');
const cors = require('cors'); // Add this line , another middleware piece (cross origin resource sharing)
const multer = require('multer'); //helps with uploading file data
const saltRounds = 5;



const app = express();
const port = 8000; // You can use any port you like

const user_db = mysql.createConnection({
    host: 'localhost',    // Replace with your host
    user: 'root', // Replace with your MySQL username
    password: 'SaulGoodman1213$', // Replace with your MySQL password
    database: 'rm_vis_users' // Replace with your database name
  });

// Middleware to parse JSON bodies, parses incoming json data prior to its arrival
app.use(bodyParser.json()); //takes raw json payloads and assigns them to req.body and makes it a js object
app.use(cors()); // Add this line, without cors, you cannot accept data from different origins (ports)



user_db.connect(err => {
    if (err) {
      console.error('Error connecting to the database:', err);
      return;
    }
    console.log('Connected to the database.');
});

// Sample route to fetch data (GET REQUEST)
app.get('/api/user_data', (req, res) => {
    console.log("Someone running this")
    const sqlQuery = 'SELECT * FROM users'; // Replace with your SQL query (the command)
    //user_db.query then executes and returns results and shit etc
    user_db.query(sqlQuery, (err, results) => {
      if (err) {
        res.status(500).send('Error executing query');
        return;
      }
      res.json(results); //sent back as a json response
    });
  });


app.post('/api/user_data' , (req , res) => {
    console.log("Changing");
    const { username, email, password, company } = req.body;
    if (!username || !email || !password || !company) {
      return res.status(400).send('Missing required fields');
    }

    const sqlQuery1 = 'SELECT * FROM users WHERE username = ? AND company = ?';
    user_db.query(sqlQuery1 , [username , company] , (err , results)=>{
        if(err){
            res.status(500).send('Error executing query');
            return;
        }
        if(results.length > 0){
          return res.status(409).send('User already exists');
        }
        else{
            bc.hash(password, saltRounds, (err, hashedPassword) => {
              if (err) {
                console.error('Error hashing password:', err);
                return;
              }
              const sqlQuery = 'INSERT INTO users (username, email, password , company) VALUES (?, ?, ? , ?)';
              user_db.query(sqlQuery , [username, email, hashedPassword, company] , (err , results) =>{
              if(err){
                res.status(500).send('Error executing query');
                return;
              }
              res.status(201).json(results);
              });
            });
          }
    });    
});


app.post('/api/login' , (req, res) => {
  const { username, email, password, company } = req.body;
  if (!username || !email || !password || !company) {
    return res.status(400).send('Missing required fields');
  }
  console.log(username , email , password , company);
  //start querying the database
  const sqlQuery = 'SELECT * FROM users WHERE username = ? AND company = ?';
  user_db.query(sqlQuery , [username , company] , (err , results) => {
      if (err) {
        res.status(500).send('Error executing query');
        return;
      }
      console.log(results);
      if (results.length === 0) {
        return res.status(404).send('User not found');
      }

      const user = results[0];

      bc.compare(password, user.password, (err, isMatch) => {
        if (err) {
            console.error('Error comparing passwords:', err);
            return;
        }

        if (isMatch) {
            // Authentication successful
            res.json({ message: 'Login successful', user });
        } else {
            // Authentication failed
            res.status(401).send('Incorrect password');
        }
      });
  });
});


//set up multer to deal with file uploads
const storage = multer.memoryStorage(); //used as a buffer in ram
const upload = multer({ storage: storage }); //sets up an instance of the multer object, with the storage specified as the one above
//this next part deals with the post feature for the point cloud dataset

//upload.single is middleware that processes the single file uploaded
app.post('/api/upload_point_cloud' , upload.single('file') , (req,res) => {
    const { user, company , filename } = req.body;
    const fileData = req.file.buffer; // Access the uploaded file's data stored in memory
    if (!user || !filename || !fileData || !company) {
      return res.status(400).json({ message: 'Missing required fields' });
    }


    const sqlQuery = 'SELECT id FROM users WHERE username = ? AND company = ?';
    user_db.query(sqlQuery , [user , company] , (err , results) => {
      if(err){
          return res.status(550).json({ message: 'Error finding the user' });
      }
      if(results.length == 0){
        return res.status(404).json({ message: 'User not found' });
      }

      const userId = results[0].id;

      const sqlQuery3 = 'INSERT INTO point_cloud_files (user_id, filename, filedata) VALUES (?, ?, ?)';
      user_db.query(sqlQuery3 , [userId , filename , fileData] , (err , results) => {
          if(err){
            return res.status(500).json({ message: 'Error executing query' });
          }
          res.status(201).json({ message: 'File uploaded successfully', results });
      });


    });
});


//Get request to get existing files 
app.get('/api/check_files' , (req, res) => {
    const user = req.query.user;
    const company = req.query.company;
    if(!user || !company){
        return res.status(400).json({ message: 'Missing required fields' });
    }

    //get the user's id
    const sqlQuery = 'SELECT id FROM users WHERE username = ? AND company = ?';
    user_db.query(sqlQuery , [user , company] , (err , results) => {
      if(err){
          return res.status(550).json({ message: 'Error finding the user' });
      }
      if(results.length == 0){
        return res.status(404).json({ message: 'User not found' });
      }

      const userId = results[0].id;

      const sqlQuery2 = 'SELECT filename FROM point_cloud_files WHERE user_id = ?';
      user_db.query(sqlQuery2 , [userId] , (err , results) => {
          if(err){
            return res.status(500).json({message: 'error executing query'});
          }
          if (results.length >0){
              //found file names, results will be rows
              const pcd_names = results.map(row => row.filename); //maps an array
              return res.status(200).json({ pcd_names }); //returns the information in a JSON file
          }
          else{
            return res.status(404).json({message: 'No files were found'});
          }
      });

    });
});


//allows the server to listen for get requests
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 