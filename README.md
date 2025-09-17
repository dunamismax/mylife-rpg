# MyLife RPG

MyLife RPG is a gamified habit tracker that helps you build good habits, break bad ones, and achieve your goals. Level up your life, one quest at a time.

This project is a vanilla web application built with Node.js, Express, and a plain HTML/CSS/JavaScript frontend. It uses a MySQL database with Prisma as the ORM.

## Technology Stack

-   **Backend:** Node.js, Express
-   **Database:** MySQL, Prisma
-   **Authentication:** JSON Web Tokens (JWT)
-   **Frontend:** HTML, CSS, JavaScript (vanilla)

## Getting Started

### Prerequisites

-   Node.js
-   MySQL

### Installation

1.  Clone the repository:
    ```sh
    git clone https://github.com/your-username/mylife-rpg.git
    cd mylife-rpg
    ```

2.  Install the dependencies:
    ```sh
    npm install
    ```

3.  Set up the environment variables. Create a `.env` file in the root of the project and add the following variables:
    ```
    DATABASE_URL="mysql://user:password@host:port/database"
    JWT_SECRET="your_jwt_secret"
    ```
    Replace the values with your MySQL connection string and a secret for signing JWTs.

4.  Apply the database schema:
    ```sh
    npx prisma db push
    ```

5.  Start the server:
    ```sh
    npm start
    ```

The application will be available at `http://localhost:3000`.