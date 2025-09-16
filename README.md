# MyLife-RPG

## Transform Your Life into an Epic Adventure

MyLife-RPG is a gamified habit tracker that helps you build good habits, break bad ones, and achieve your goals. Level up your life, one quest at a time.

## Tech Stack

*   **Framework:** Next.js (v14+) with TypeScript
*   **Styling:** Tailwind CSS
*   **Database:** MySQL
*   **ORM:** Prisma
*   **Authentication:** NextAuth.js
*   **Package Manager:** npm

## Features Implemented

*   **User Authentication:** Secure registration, login, and logout.
*   **Character Stats:** Track core stats (Level, XP, HP, Strength, Endurance, Intelligence, Wisdom, Charisma, Willpower).
*   **Quest Management:** Create, track, and complete daily and major quests with XP rewards.
*   **Habit Tracking:** Create, track, and complete good/bad habits with streak tracking and XP rewards/penalties.
*   **Achievement System:** Unlock achievements based on in-game actions.
*   **Status Effects:** Apply and track status effects (debuffs) based on negative habits.
*   **Gamification Logic:** Basic XP gain, level-up mechanics, and stat adjustments.

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

*   Node.js (v18+)
*   npm (v9+)
*   MySQL Server (v8+)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/MyLife-RPG.git
    cd MyLife-RPG
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up your environment variables:**
    Create a `.env` file in the root of the project and add the following:
    ```env
    DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/myliferpg"
    NEXTAUTH_SECRET="YOUR_GENERATED_SECRET_HERE"
    ```
    *   Replace `USER`, `PASSWORD`, `HOST`, `PORT` with your MySQL database credentials.
    *   Replace `YOUR_GENERATED_SECRET_HERE` with a strong, random string (you can generate one using `openssl rand -hex 32`).

4.  **Set up the database schema:**
    ```bash
    npx prisma db push --accept-data-loss
    ```
    *(Note: `--accept-data-loss` is used for initial setup and development. Be cautious in production environments.)*

### Running the Application

To start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Future Enhancements

*   More robust stat progression and level-up rewards.
*   Detailed UI for managing quests, habits, achievements, and status effects.
*   Visual progress bars for stats and XP.
*   Analytics and reporting features.
*   Skill tree implementation.
*   Customization options for quests, XP values, and achievement conditions.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.