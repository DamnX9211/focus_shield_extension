# Focus Shield 🛡️

Focus Shield is a lightweight Chrome / Brave extension that helps you stay focused by blocking distracting websites during a timed focus session.

It allows you to:
- Create your own block list
- Start a focus session for a custom duration
- Automatically unblock sites when time ends
- See how many times you tried to access blocked sites
- Stay focused with a custom block page instead of Chrome’s error screen

Everything runs locally in the browser. No tracking. No servers.

---

## ✨ Features

- ⏱️ Custom focus timer (minutes-based)
- 🚫 Block user-defined websites
- 🔁 Auto-disable when time ends
- 📊 Attempt counter (tracks retry behavior)
- 🧠 Persistent state (survives popup close & browser restart)
- 🎯 Custom block page with countdown
- 🌐 Works on Chrome and Brave

---

## 🎥 Demo

> Watch the demo video below to see Focus Shield in action.

https://github.com/user-attachments/assets/02a86210-768c-49e1-bdd5-ee099bbad8d6
---

## 🧩 How It Works (High Level)

- **Popup UI**: User input, countdown display
- **Background service worker**: Manages rules, timer, and lifecycle
- **Chrome rule engine**: Enforces blocking at the network layer
- **chrome.storage**: Single source of truth
- **chrome.alarms**: Reliable timer that survives restarts

---

## 🔐 Privacy

- No analytics
- No external requests
- No data leaves your browser

---

## 🚀 Installation (Local)

1. Clone this repository
2. Open `chrome://extensions`
3. Enable **Developer Mode**
4. Click **Load unpacked**
5. Select the project folder

---

## 📌 Tech Stack

- Manifest V3
- JavaScript
- Chrome Extensions API
- declarativeNetRequest
- chrome.alarms
- chrome.storage

---

## 📄 License

MIT
