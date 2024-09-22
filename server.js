const bodyParser = require('body-parser');
const mysql = require('mysql');
const express = require('express')
const app = express();

// Middleware to parse JSON request bodies
app.use(bodyParser.json());
// Create a connection to the database
const connection = mysql.createConnection({
  host: 'localhost', // Database host
  user: 'root',      // Your MySQL username
  password: 'W7301@jqir#',  // Your MySQL password
  database: 'nodejs' // Database name
});


// Connect to MySQL
connection.connect((err) => {
  if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
  }
  console.log('Connected to MySQL database!');
});


// Create a table if it doesn't exist
 /* const createTableQuery = `
CREATE TABLE IF NOT EXISTS person (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  city_name VARCHAR(100)
)
`;

connection.query(createTableQuery, (err, result) => {
if (err) {
  console.error('Error creating table:', err);
  return;
}
console.log('Table "person" created or already exists.');
}); */


app.post('/add-person', (req, res) => {
  const { id, name, city_name } = req.body;//it contains the   person data

  if (!id || !name || !city_name) {
    return res.status(400).send('ID, name, and city_name are required.');
  }

  const insertQuery = 'INSERT INTO person (id, name, city_name) VALUES (?, ?, ?)';
  connection.query(insertQuery, [id, name, city_name], (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      return res.status(500).send('Error inserting data.');
    }
    res.send('Data inserted successfully!');
  });
});


// Route to get data from the "person" table by id
app.get('/get-person/:id', (req, res) => {
  const { id } = req.params;

  const selectQuery = 'SELECT * FROM person WHERE id = ?';
  connection.query(selectQuery, [id], (err, result) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).send('Error fetching data.');
    }

    if (result.length === 0) {
      return res.status(404).send('Person not found.');
    }

    res.json(result[0]);  // Return the first (and only) result as JSON
  });
});


// Route to delete a person from the "person" table by id
app.delete('/delete-person/:id', (req, res) => {
  const { id } = req.params;

  const deleteQuery = 'DELETE FROM person WHERE id = ?';
  connection.query(deleteQuery, [id], (err, result) => {
    if (err) {
      console.error('Error deleting data:', err);
      return res.status(500).send('Error deleting data.');
    }

    if (result.affectedRows === 0) {
      return res.status(404).send('Person not found.');
    }

    res.send('Person deleted successfully!');
  });
});


// Route to update a person by id
app.put('/update-person/:id', (req, res) => {
  const { id } = req.params;
  const { name, city_name } = req.body;

  if (!name && !city_name) {
    return res.status(400).send('Name or city_name must be provided to update.');
  }

  const updateQuery = 'UPDATE person SET name = ?, city_name = ? WHERE id = ?';
  connection.query(updateQuery, [name, city_name, id], (err, result) => {
    if (err) {
      console.error('Error updating data:', err);
      return res.status(500).send('Error updating data.');
    }

    if (result.affectedRows === 0) {
      return res.status(404).send('Person not found.');
    }

    res.send('Person updated successfully!');
  });
});

// Sample route
app.get('/', (req, res) => {
  res.send('Hello, MySQL is connected!');
});
// Route 1: Database connection message
app.get('/db-status', (req, res) => {
  res.send('Hello, MySQL is connected!');
});



app.listen(9000,()=>{
  console.log("Server is started at 9000")
})