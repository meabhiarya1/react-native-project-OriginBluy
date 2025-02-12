# Media Capture and Storage Mobile Application

## Overview

This project is a media capture and storage mobile application developed using React Native with Expo. It includes backend functionality for user authentication, media upload, listing, and deletion using Node.js, Express.js, and MongoDB. The frontend allows users to capture media, view and manage their media files, and interact with the backend for various operations.

## Project Structure

### Frontend

- **React Native with Expo:** The frontend application is built using React Native with Expo.
- **Media Capture:** Users can capture images and videos, preview them, and upload them to Backend file system.
- **Gallery Management:** Users can view, manage, and delete their uploaded media files.

### Backend

- **Express.js:** The backend is built using Node.js and Express.js.
- **MongoDB Atlas:** Stores user data and handles authentication.
- **Multer:** Handles file uploads.
- **JWT (JSON Web Token):** Used for user authentication and authorization.

## Backend API Endpoints

### Authentication

#### Register

- **URL:** `/register`
- **Method:** `POST`
- **Body Parameters:**
  - `username`: String, required
  - `email`: String, required
  - `password`: String, required
- **Response:**
  - `token`: JWT token
  - `user`: User object with `id`, `username`, and `email`

#### Login

- **URL:** `/login`
- **Method:** `POST`
- **Body Parameters:**
  - `emailOrUsername`: String, required
  - `password`: String, required
- **Response:**
  - `token`: JWT token
  - `user`: User object with `id`, `username`, and `email`

#### Request OTP

- **URL:** `/auth/forgot-password`
- **Method:** `POST`
- **Body Parameters:**
  - `email `: String, required
- **Response:**
  - `token`: JWT token
  - `user`: "OTP Sent", "Check your email for the OTP."

#### Verify OTP

- **URL:** `/auth/verify-otp`
- **Method:** `POST`
- **Body Parameters:**
  - `email `: String, required
  - `otp`: String, required
- **Response:**
  -  `message: "OTP verified", resetToken`

#### Reset Password 

- **URL:** `/auth/verify-otp`
- **Method:** `POST`
- **Body Parameters:**
  - `email `: String, required
  - `newPassword`: String, required
  - `resetToken`: String, required
- **Response:**
  -  `message: "Password reset successful" `


### Media Management

#### Upload Media

- **URL:** `/media/upload`
- **Method:** `POST`
- **Headers:**
  - `Authorization`: Bearer token (JWT)
- **Body:**
  - `media`: File (image or video)
- **Response:**
  - `url`: Public URL of the uploaded media file

#### List Media

- **URL:** `/media/:userId`
- **Method:** `GET`
- **Headers:**
  - `Authorization`: Bearer token (JWT)
- **Response:**
  - `urls`: Array of public URLs for the user's media files

#### Delete Media

- **URL:** `/delete`
- **Method:** `DELETE`
- **Headers:**
  - `Authorization`: Bearer token (JWT)
- **Body:**
  - `uris`: Array of media file URLs to delete
- **Response:**
  - `message`: Success message or error details

## Setup and Installation

### Prerequisites

- **Node.js**: v22.11.0
- **MongoDB Atlas**: Access to a MongoDB Atlas cluster
- **Expo CLI**: For running the React Native app
- **Create .env file in backend and stored the credentials **:
  MONGODB_URI=
  JWT_SECRET=
  EMAIL_USER=
  EMAIL_PASS=

### Frontend Setup

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/MithunKumar09/React-Native-Expo-Media Capture and Storage Mobile Application.git
   cd React-Native-Expo-Media Capture and Storage Mobile Application

   - **Create .env file in backend and stored the credentials **:
         BACKEND_API=

   ```
