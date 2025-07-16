# Virtual Pet Frontend

User interface for the Virtual Pet API, allowing users to interact visually and enjoyably with their virtual pets.

---

## Features

- User registration and login with JWT authentication.
- Responsive dashboard showing user's pets.
- Actions: feed, play, delete pets.
- Create new pets with form validation.
- Protected routes and clear error handling.
- Modern, animated, responsive design.

## Technologies

- React.js + Vite
- React Router DOM, Context API
- Axios, Formik, Yup
- jwt-decode
- CSS Modules and global CSS

## Setup

- Node.js 18+
- npm or Yarn
- Backend API running (default http://localhost:8080)

## Install dependencies:

`npm install`

## Running the App

`npm run dev`

Open 
[http://localhost:5173](http://localhost:5173) in your browser.

## Project Structure

- `src/api/`: backend API calls  
- `src/components/`: reusable UI components  
- `src/contexts/`: global state contexts  
- `src/hooks/`: custom hooks  
- `src/pages/`: main views  
- `src/utils/`: helper functions  
- `App.jsx`: main app routes and contexts  


## Key Features

- Login and registration pages  
- Dashboard with pets and interactive actions  
- Pet creation form  
- Delete confirmation  


## Styles

- CSS Modules for scoped styling  
- CSS variables for flexible design  
- Animations and comic-style font  
- Responsive layout  


## Backend Communication

- Requests include stored JWT  
- User-visible error handling  
- Optimistic UI updates  




