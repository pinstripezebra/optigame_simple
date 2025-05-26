# OptiGame

OptiGame is a full-stack web application for discovering, reviewing, and managing board games. It features a React + TypeScript frontend, a FastAPI backend, JWT-based authentication, and a PostgreSQL database.

---

## Features

- **User Authentication:** Secure signup, login, and logout with JWT tokens.
- **Game Discovery:** Browse and search for board games.
- **User Profile:** View and manage your personal game shelf and reviews.
- **Game Reviews:** Add ratings and reviews for games.
- **Similar Games:** Get recommendations for similar games.
- **Protected Routes:** Only authenticated users can access certain pages.
- **Responsive UI:** Built with Chakra UI for a modern look.

---

## Tech Stack

- **Frontend:** React, TypeScript, Chakra UI, React Router
- **Backend:** FastAPI, SQLAlchemy, PostgreSQL
- **Authentication:** JWT (JSON Web Tokens), passlib (bcrypt)
- **State Management:** React Context API

---

## Getting Started

### Prerequisites

- Node.js & npm
- Python 3.8+
- PostgreSQL

### Backend Setup

1. **Install dependencies:**
    ```bash
    pip install fastapi uvicorn sqlalchemy psycopg2-binary python-dotenv passlib[bcrypt] python-jose
    ```

2. **Configure environment variables:**
    - Copy `.env2.example` to `.env2` and fill in your database and JWT settings.

3. **Run the backend:**
    ```bash
    uvicorn main:app --reload
    ```

### Frontend Setup

1. **Install dependencies:**
    ```bash
    npm install
    ```

2. **Run the frontend:**
    ```bash
    npm run dev
    ```

3. **Open your browser:**  
   Visit [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal).

---

## Project Structure

```
optigame_simple/
├── FastApi/                # FastAPI backend
│   ├── main.py
│   ├── models.py
│   └── ...
├── optigame_simple/
│   └── optigame/
│       ├── src/
│       │   ├── context/
│       │   │   └── UserContext.tsx
│       │   ├── hooks/
│       │   ├── pages/
│       │   ├── main.tsx
│       │   └── ...
│       └── ...
└── ...
```

---

## Key Files

- **Backend**
  - `main.py` – FastAPI app, endpoints, JWT logic
  - `models.py` – SQLAlchemy models

- **Frontend**
  - `src/main.tsx` – React entry point
  - `src/context/UserContext.tsx` – User authentication context
  - `src/pages/LoginSignup/Login.tsx` – Login page
  - `src/pages/LoginSignup/Protected.tsx` – Route protection

---

## Authentication Flow

- On login, the backend returns a JWT token.
- The frontend stores the token and username in `localStorage`.
- Protected routes check for a valid token and redirect to login if invalid or expired.
- On logout, the token and username are removed from `localStorage`.

---

## Customization

- **Add new games:** Extend the backend models and endpoints.
- **Change database:** Update the `DATABASE_URL` in `.env2`.
- **Styling:** Modify Chakra UI components in the frontend.

---

## License

MIT

---

## Acknowledgements

- [FastAPI](https://fastapi.tiangolo.com/)
- [React](https://react.dev/)
- [Chakra UI](https://chakra-ui.com/)
- [PostgreSQL](https://www.postgresql.org/)