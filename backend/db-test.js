const axios = require('axios');




axios.get('http://localhost:8000/api/user_data')
  .then(response => console.log("Got database"))
  .catch(error => console.error('Error:', error));


// Define the user data
const userData = {
  username: 'Paolo',
  email: 'P@gmail.com',
  password: 'Paolo123',
  company: 'Magic'
};

axios.post('http://localhost:8000/api/user_data', userData, {
  headers: {
    'Content-Type': 'application/json'  // Set the Content-Type to application/json
  }
})
  .then(response => console.log('User added successfully:', response.data))
  .catch(error => {
    if (error.response) {
      console.error('Error response:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
  });



const userData = {
  username: 'testuser',
  email: 'testuser@example.com',
  password: 'password123',
  company: 'Test Company'
};
const jsonData = JSON.stringify(userData);
const parsedData = JSON.parse(jsonData);

// Extract individual components
const username = parsedData.username;
const email = parsedData.email;
const password = parsedData.password;
const company = parsedData.company;

// Log the components
console.log('Username:', username);
console.log('Email:', email);
console.log('Password:', password);
console.log('Company:', company);


axios.post('http://localhost:8000/api/login' , userData , {
  headers: {
    'Content-Type': 'application/json'  // Set the Content-Type to application/json
  }

})
  .then(response => console.log('login successful'))
  .catch(error => {
    if (error.response) {
      console.error('Error response:', error.response.data);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error setting up request:', error.message);
    }
  });
