# Huddle-app

## Introduction

Huddle-app is a collaborative platform designed to connect users in real-time through chat rooms and discussion spaces. The application leverages modern web technologies to provide a seamless user experience for group communication. Its intuitive interface and robust backend make it suitable for both casual and professional use, enabling individuals and teams to stay connected and collaborate efficiently.

## Features

- Real-time group chat rooms with instant messaging
- User authentication and secure session management
- Create, join, and leave rooms effortlessly
- Easy-to-use interface for managing room membership
- Responsive design for mobile and desktop devices
- User presence indicators and live participant lists
- Modular codebase for easy feature extension
- Scalable backend using Node.js and modern frameworks

## Installation

To set up the Huddle-app locally, follow these steps:

1. **Clone the Repository**
   ```bash
   git clone https://github.com/HarshNawle/Huddle-app.git
   cd Huddle-app
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   - Create a `.env` file in the root directory.
   - Add the required environment variables (see Configuration section below).

4. **Run the Application**
   ```bash
   npm start
   ```
   The app will be available at `http://localhost:3000` by default.

## Configuration

Huddle-app requires certain environment variables for proper operation. Create a `.env` file in the root directory with the following keys:

- `PORT`: The port number on which the server will run (default: 3000).
- `MONGO_URI`: MongoDB connection string for user and room data persistence.
- `SESSION_SECRET`: A secure, random string used for session management.
- `JWT_SECRET`: Secret key for signing JSON Web Tokens (if applicable).

Example `.env` file:
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/huddle
SESSION_SECRET=your_session_secret
JWT_SECRET=your_jwt_secret
```

You may also configure additional options depending on your deployment needs, such as CORS settings or third-party authentication providers.

## License

This project is licensed under the MIT License. You are free to use, modify, and distribute this software as needed. See the `LICENSE` file for more information.