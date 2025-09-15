# Consistency Tracker: The Puzzle-Reveal App 🧩

**Turn Your Daily Habits and Goals into a Beautifully Unveiling Puzzle.**

-----

## 🌟 About the App

Consistency Tracker is a simple and elegant web application designed to help you stay motivated on your long-term goals. Instead of just checking off boxes, the app transforms your daily progress into a visual reward. As you complete each day, you reveal a new piece of a secret puzzle image, turning your journey into a satisfying and beautiful masterpiece.

The app is built as a single-page application (SPA), with all your data securely saved locally in your browser for complete privacy.

-----

## ✨ Features

  * **Customizable Challenges:** Create new challenges with a name and duration of your choice (e.g., a 75-Day Challenge or a 365-Day Journey).
  * **Interactive Puzzle Grid:** Your challenge is represented as a grid. Each day you complete reveals a new piece of your puzzle.
  * **Personalized Memories:** Click on any completed day to add a personal note, a photo, a link to a resource, or a mood emoji to capture your progress.
  * **Streak Tracking:** The app automatically calculates and displays your current and longest streaks to keep you motivated.
  * **Journey Review:** A beautiful timeline view to look back on all your progress and memories in one place.
  * **Dark Mode:** Switch to a comfortable dark theme with the click of a button.

-----

## 🖼️ Screenshots

<p align="center">
  <img src="https://github.com/user-attachments/assets/eed6df9e-52c6-43f8-b182-c7065605499f" alt="Main Dashboard with Puzzle Grid" width="800"/>
</p>

<p align="center">
  <img src="https://github.com/user-attachments/assets/6b21e40d-cae9-48cc-9fa9-2892a3ffc33d" alt="Day Note Modal" width="350" style="display: inline-block; margin: 0 10px;"/>
  <img src="https://github.com/user-attachments/assets/7e3289b2-85a4-414f-ae5d-d643f4a4936b" alt="Journey Review Timeline" width="550" style="display: inline-block; margin: 0 10px;"/>
</p>


-----

## 🚀 How to Use

1.  **Create a New Challenge:** Click the **"New Challenge"** button to name your goal and set a duration.
2.  **Upload Your Puzzle:** Open the **"Settings"** menu (the gear icon) to upload a custom image. This image will be the puzzle you reveal.
3.  **Track Your Progress:** Simply click on a day's square in the grid to mark it as complete. The Day Note Modal will pop up, allowing you to add your reflections.
4.  **Review Your Journey:** Click **"Journey Review"** in the header to see a chronological timeline of all the memories you've captured.

-----

## ⚙️ For Developers

To run this project locally, you need to have **Node.js** installed on your machine.

**Prerequisites:**

  * Node.js (v18 or higher)
  * A package manager like npm or yarn

**Getting Started:**

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Nitishwn/Stride.git
    cd Stride
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    ```

3.  **Run the app in development mode:**

    ```bash
    npm run dev
    ```

    The app will open in your browser at `http://localhost:5173`. Any changes you make to the code will be automatically reloaded.

4.  **Build for production:**

    ```bash
    npm run build
    ```

    This command generates the static, production-ready files in the `dist` directory.

-----

## 🛠️ Technology Stack

  * **React:** A JavaScript library for building user interfaces.
  * **TypeScript:** A strongly typed programming language that builds on JavaScript.
  * **Vite:** A fast build tool that serves as a modern alternative to Webpack.
  * **Tailwind CSS:** A utility-first CSS framework for rapid styling.
  * **html-to-image:** A library for client-side image generation (future feature).

-----

## 📜 License

This project is licensed under the MIT License. See the `LICENSE` file for details.
