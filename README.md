# 🏋️‍♀️ FitNova

**FitNova** is a cross-platform fitness tracking mobile app built with **React Native (Expo)**. It helps users plan and track daily workouts across three categories — **Gym, Cardio, and Fitness** — calculate their **BMI**, monitor weekly progress with an analytics report, and manage their profile, all backed by **Firebase Authentication** and **Realtime Database**.

<p align="center">
  <img src="https://img.shields.io/badge/React%20Native-0.83-61DAFB?logo=react&logoColor=white" alt="React Native" />
  <img src="https://img.shields.io/badge/Expo-SDK%2055-000020?logo=expo&logoColor=white" alt="Expo" />
  <img src="https://img.shields.io/badge/Firebase-Realtime%20DB-FFCA28?logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/Platform-Android%20%7C%20iOS%20%7C%20Web-lightgrey" alt="Platform" />
  <img src="https://img.shields.io/badge/License-MIT-green" alt="License" />
</p>

---

## 📖 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Firebase Setup](#-firebase-setup)
- [Environment Variables](#-environment-variables)
- [Running the App](#-running-the-app)
- [Screens Overview](#-screens-overview)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 🧭 About the Project

FitNova is designed to make personal fitness planning simple and structured. On signup, users get access to a dashboard where they can log their weight and height to instantly get a **BMI score and health status**. From there, they can pick a workout category (Gym, Cardio, or Fitness), follow a day-wise routine complete with exercises, precautions, and diet tips, and track their weekly performance through a dedicated analytics screen — with the option to export/share a report as a PDF.

This project was built as a learning/portfolio app to practice React Native navigation patterns (stack, tabs, and drawer), Firebase integration, theming (dark/light mode), and clean component architecture.

---

## ✨ Features

- 🔐 **Authentication** — Email/password sign up & login powered by Firebase Auth
- 📊 **BMI Calculator** — Auto-calculates BMI and health status (Underweight / Normal / Overweight) from weight & height
- 🏋️ **Workout Categories** — Structured Gym, Cardio, and Fitness routines with a day-wise plan (Monday–Sunday)
- 📅 **Daily Workout Tracking** — Focus area, duration, exercises, precautions, and diet tips for every day
- 📈 **Weekly Report / Analytics** — Visual summary of progress synced from Firebase Realtime Database
- 🖨️ **PDF Export & Sharing** — Generate and share workout/weekly reports using `expo-print` and `expo-sharing`
- 🌗 **Dark / Light Theme** — Fully themeable UI with a custom theme context
- 🧑‍💻 **Editable Profile (Drawer Menu)** — Update username, email, phone, weight, and height on the fly
- 📱 **Cross-Platform** — Runs on Android, iOS, and Web from a single Expo codebase
- 🔔 **Toast / Flash Messages** — Friendly in-app notifications via `react-native-flash-message`

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Framework | [React Native](https://reactnative.dev/) 0.83 + [Expo](https://expo.dev/) SDK 55 |
| Navigation | React Navigation (Stack, Bottom Tabs, Drawer) |
| Backend / Auth / DB | [Firebase](https://firebase.google.com/) (Authentication + Realtime Database) |
| State Management | React Context API (`UserContext`, `ThemeContext`) |
| Storage | AsyncStorage |
| Animations | React Native Reanimated |
| PDF/Sharing | expo-print, expo-sharing |
| Language | JavaScript (ES6+), TypeScript config included |

---

## 📂 Project Structure

```
FitNova/
├── App.js                      # App entry point
├── app.json                    # Expo app configuration
├── assets/                     # Images, icons, workout day photos
├── android/                    # Native Android project
├── scripts/
│   └── reset-project.js
└── src/
    ├── components/              # Reusable UI components
    ├── constants/
    │   └── theme.js              # Dark/Light theme color tokens
    ├── context/
    │   ├── UserContext.js        # Firebase auth + user state
    │   └── ThemeContext.js       # Theme toggling logic
    ├── data/
    │   └── workoutData.js        # Gym / Cardio / Fitness routines
    ├── hooks/                    # Custom hooks
    ├── navigation/
    │   └── AppNavigator.js       # Stack + Tab + Drawer navigation
    ├── screens/
    │   ├── Auth/                 # Login & Signup screens
    │   ├── Dashboard/            # Home dashboard (BMI calculator)
    │   ├── Report/                # Weekly analytics report
    │   └── Workout/               # Category selection + daily tracking
    ├── styles/
    │   └── globalStyles.js
    └── global.css
```

---

## ✅ Prerequisites

Make sure you have the following installed before you start:

- [Node.js](https://nodejs.org/) (LTS version, v18+ recommended)
- npm (comes with Node.js) or yarn
- [Expo CLI](https://docs.expo.dev/get-started/installation/) (installed automatically via `npx`)
- [Expo Go](https://expo.dev/go) app on your phone (for quick testing) **or** Android Studio / Xcode for emulator/simulator
- A free [Firebase](https://firebase.google.com/) account/project

---

## ⚙️ Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/<your-username>/FitNova.git
   cd FitNova
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables** — see the [Firebase Setup](#-firebase-setup) section below.

4. **Start the development server**

   ```bash
   npx expo start
   ```

---

## 🔥 Firebase Setup

FitNova uses **Firebase Authentication** and **Realtime Database**. To run this project with your own backend:

1. Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2. Enable **Authentication → Sign-in method → Email/Password**.
3. Enable **Realtime Database** (start in test mode for development, then secure it with proper rules before going to production).
4. In **Project Settings → General**, register a Web App and copy your Firebase config keys.
5. Add these keys to your project as environment variables (see next section) instead of hardcoding them in `UserContext.js`.

> ⚠️ **Security Note:** This project currently has Firebase config values written directly inside `src/context/UserContext.js`. Before pushing to a **public** GitHub repository, move these into environment variables (below) and rotate/regenerate your Firebase API keys from the console, since old keys committed in git history can still be found even after removal.

---

## 🔑 Environment Variables

Create a `.env` file in the project root (this file is already ignored by `.gitignore`... make sure to add `.env` there too):

```env
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id
FIREBASE_MEASUREMENT_ID=your_measurement_id
```

Then update `src/context/UserContext.js` to read from `process.env` (using [`expo-constants`](https://docs.expo.dev/guides/environment-variables/) or `react-native-dotenv`) instead of hardcoded values.

---

## ▶️ Running the App

After `npx expo start`, the Expo Dev Tools will open in your terminal/browser with a QR code. From there you can run:

```bash
# Run on Android emulator/device
npm run android

# Run on iOS simulator (macOS only)
npm run ios

# Run in the browser
npm run web
```

Or scan the QR code with the **Expo Go** app on your phone for the fastest way to preview.

---

## 📱 Screens Overview

| Screen | Description |
|---|---|
| **Login / Signup** | Firebase email-password authentication |
| **Dashboard** | Enter weight & height → get instant BMI score + health status |
| **Workout Category** | Choose between Gym, Cardio, and Fitness plans |
| **Daily Tracking (Gym / Cardio / Fitness)** | Day-wise focus area, exercises, precautions, and diet tips |
| **Weekly Report** | Analytics of logged progress, exportable/shareable as PDF |
| **Drawer / Profile** | Edit profile info and toggle dark/light theme |

---

## 🗺️ Roadmap

- [ ] Push notifications for workout reminders
- [ ] Custom/editable workout plans
- [ ] Progress charts (graphs) on the Weekly Report screen
- [ ] Social/community sharing of achievements
- [ ] Offline-first support with local caching

Feel free to open an issue if you'd like to suggest a feature.

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 📬 Contact

**Ayesha Muzammil**

- Email: [@ayeshamuzammil09@gmail.com](https://github.com/ayeshamuzammil2)

---

<p align="center">Made with ❤️ using React Native & Expo</p>
