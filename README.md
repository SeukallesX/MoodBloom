
<div align="center">

# 🌸 MoodBloom

### ✨ Every Feeling Deserves Space to Bloom ✨

**A little space for every emotion. A beautiful way to reflect, track, and grow.**

An interactive 3D mood tracker and personal journaling experience, designed with soft pastels, holographic visuals, and gentle animations.

<br/>

![Version](https://img.shields.io/badge/Version-1.0.0-E8A5C8?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-B8A7E8?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-C6A9F0?style=for-the-badge&logo=vite&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-3D-9ED9CC?style=for-the-badge&logo=threedotjs&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-F5B9A8?style=for-the-badge)

<br/>

[Explore Features](#-features) ·
[Get Started](#-getting-started) ·
[Project Structure](#-project-structure) ·
[Roadmap](#-roadmap)

</div>

---

## 🌷 Welcome to MoodBloom

> **"Every feeling is a part of your story. Let it bloom."**

MoodBloom is a personal mood-tracking and journaling web application that transforms emotional reflection into a calming, interactive experience.

At the heart of MoodBloom is a **3D holographic flower** that changes with your emotions, creating a visual representation of how you feel.

With a personal journal, mood calendar, weekly insights, and customizable settings, MoodBloom offers a gentle way to understand your emotional journey.

### 💗 Why MoodBloom?

- 🌸 **Express** how you feel through an interactive flower.
- 📖 **Reflect** on your thoughts in a personal journal.
- 📅 **Remember** your emotional journey through a calendar.
- 📊 **Discover** patterns in your weekly mood insights.
- ✨ **Personalize** your experience with themes and animations.

---

## ✨ Features

<table>
<tr>
<td width="50%" valign="top">

### 🌸 Holographic Mood Flower

An interactive 3D flower that responds to your emotions.

- Mood-reactive colors
- Smooth rotation
- Breathing animations
- Interactive pulse effects
- Floating particles
- Holographic orbital rings

</td>
<td width="50%" valign="top">

### 📖 Personal Mood Journal

A peaceful space to write and reflect.

- Create journal entries
- Edit and delete reflections
- Search previous entries
- Filter journal history
- Automatic local persistence

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 📅 Mood Calendar

Look back on your emotional journey.

- Browse entries by date
- Review recorded moods
- Explore daily reflections
- Notice emotional patterns

</td>
<td width="50%" valign="top">

### 📊 Weekly Mood Insights

Understand how your emotions change over time.

- Weekly mood summaries
- Mood distributions
- Visual trends
- Personal reflection insights

</td>
</tr>
<tr>
<td width="50%" valign="top">

### 🎨 Personalization

Make MoodBloom feel like your own space.

- Appearance preferences
- Theme customization
- Animation controls
- Saved settings

</td>
<td width="50%" valign="top">

### 🔐 Local-First Privacy

Your reflections stay in your browser.

- No account required
- Browser localStorage
- JSON and CSV export
- Data import
- No cloud synchronization

</td>
</tr>
</table>

---

## 🎨 The MoodBloom Palette

<div align="center">

**Five moods. Five colors. Every feeling matters.**

| Emotion | Color | Meaning |
|:---:|:---:|---|
| 💗 **Amazing** | `#F4A7C5` Pink | Feeling joyful and energized |
| 🌿 **Good** | `#A8E6CF` Mint | Feeling positive and balanced |
| 💜 **Okay** | `#CDB4F6` Lavender | Feeling neutral or steady |
| 💙 **Low** | `#A9C7F5` Blue | Feeling down or tired |
| 🧡 **Stressed** | `#F5B39C` Coral | Feeling overwhelmed or tense |

*Colors shown are illustrative of the MoodBloom palette.*

</div>

---

## 🪄 Design Philosophy

MoodBloom combines **soft, welcoming design** with interactive technology.

| Design Element | Experience |
|---|---|
| 🌸 Pastel colors | A gentle, calming visual atmosphere |
| 🫧 Glassmorphism | Soft translucent interface panels |
| 🪐 Holographic 3D | An expressive, interactive flower |
| ✨ Micro-animations | Subtle movement and feedback |
| 📱 Responsive layout | A comfortable experience across screen sizes |
| 💗 Emotional reflection | A nonjudgmental space for every mood |

---

## 🛠️ Built With

<div align="center">

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-3D-222222?style=flat-square&logo=threedotjs&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-Modern-1572B6?style=flat-square&logo=css&logoColor=white)

</div>

| Technology | Role |
|---|---|
| **React 19** | Component-based user interface |
| **Vite 8** | Development server and build tooling |
| **Three.js** | Interactive 3D graphics |
| **React Three Fiber** | Three.js integration with React |
| **Drei** | Helpers for 3D rendering |
| **CSS** | Responsive styling and animations |
| **localStorage** | Browser-based data persistence |

---

## 🚀 Getting Started

### 📋 Prerequisites

Make sure you have installed:

- Node.js
- npm
- Git

### 01 · Clone the repository

```bash
git clone https://github.com/SeukallesX/MoodBloom.git
```

### 02 · Open the project

```bash
cd MoodBloom
```

### 03 · Install dependencies

```bash
npm install
```

### 04 · Start the development server

```bash
npm run dev
```

Open the local URL shown in your terminal.

### 05 · Build for production

```bash
npm run build
```

### 06 · Preview the production build

```bash
npm run preview
```

### 07 · Check code quality

```bash
npm run lint
```

---

## 📂 Project Structure

```text
MoodBloom/
│
├── public/
│   ├── favicon.svg
│   └── icons.svg
│
├── src/
│   ├── App.jsx              # Main application
│   ├── App.css              # Application styling
│   ├── Hologram.jsx         # Interactive 3D flower
│   ├── MoodCalendar.jsx     # Mood calendar
│   ├── MoodInsights.jsx     # Weekly insights
│   ├── MoodSettings.jsx     # User preferences
│   ├── moodExport.js        # Import/export utilities
│   ├── moodUtils.js         # Shared mood utilities
│   ├── index.css            # Global styling
│   └── main.jsx             # React entry point
│
├── index.html
├── package.json
├── vite.config.js
├── README.md
└── LICENSE
```

---

## 🗺️ Roadmap

### 🌸 Version 1.0.0 — Initial Public Release

- [x] Interactive 3D holographic flower
- [x] Five mood selections
- [x] Mood-reactive flower colors
- [x] Personal journaling
- [x] Journal search and filtering
- [x] Mood calendar
- [x] Weekly insights
- [x] Theme and animation preferences
- [x] Browser-based data persistence
- [x] JSON and CSV export
- [x] Data import
- [x] Responsive design

### 🌱 Future Possibilities

- [ ] Expanded mood analytics
- [ ] Additional flower designs
- [ ] More customization options
- [ ] Accessibility enhancements
- [ ] Additional journaling tools
- [ ] Optional cross-device synchronization

> Future improvements are exploratory and do not have confirmed release dates.

---

## 🔒 Privacy & Data

MoodBloom uses a **local-first approach**.

Your journal entries, mood history, and preferences are saved using your browser's `localStorage`.

**Important:**

- MoodBloom does not require an account.
- Entries are not automatically synchronized across devices.
- Clearing browser data may delete your saved entries.
- Export your data regularly to keep a personal backup.
- Avoid using shared devices for sensitive reflections.

---

## 💗 A Note About Mental Wellness

MoodBloom is designed to encourage personal reflection and emotional awareness.

It is **not** a medical application and does not provide diagnosis, treatment, or professional mental health care.

Every emotion deserves acknowledgment, whether your day feels bright, difficult, or somewhere in between.

---

## 📄 License

Distributed under the **MIT License**.

See [LICENSE](LICENSE) for more information.

---

<div align="center">

### 🌸 Grow at Your Own Pace

*Some days you bloom. Some days you rest. Both are part of growing.*

<br/>

**MoodBloom · Version 1.0.0**

Made with 💗 and a little bit of magic.

[⬆ Back to Top](#-moodbloom)

</div>
