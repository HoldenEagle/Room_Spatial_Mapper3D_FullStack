# Room_Spatial_Mapper3D_FullStack
To go along with the Point Cloud visualizer in my previous repository, I built a full stack application using React , Node.Js and MySQL. This application leverages the power of API requests to to handle user authentication and point cloud file management.

Key Features:
-Users can sign up and log in while their information is stored in a mySQL database. Password are are securely hashed using bcrypt before being stored in the database.
-Users can upload point cloud files in various formats and stored efficiently
-Users can retrieve the files from the database that they previously uploaded, allowing them to continue to work on it

API integration:
API endpoints are handled for data management and file operations. These API's also facilitate the file uploads directly through the server, and manages 
requests from the React frontend to the Node.js backend.

UI features:

A clean, responsive UI built with React that guides users through the process of signing up, logging in, and managing their point cloud files.
The application then dynamically switches through different pages based on user interactions.

Technology Stack
Frontend: React, Axios, CSS
Backend: Node.js, Express.js, multer, bcrypt
Database: MySQL
Middleware: body-parser, cors

To clone the Repository
git clone https://github.com/your-username/point-cloud-viewer.git
cd point-cloud-viewer

Dependecies to Install:
-npm
-Node

To run the Application:
1.Start Server
cd server
node server.js

2.Start React Application
cd testreact
npm start

Future Advancements: looking to connect this with the point cloud viewer and to upgrade the graphics and user interface with the visual


