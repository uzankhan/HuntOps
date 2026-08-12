# 🎯 HUNTOPS — Phone Recovery & Tracking System

> **Advanced, Cross-Platform Phone Recovery & Tracking System**  
> Track, lock, and recover lost/stolen devices using IMEI numbers.

![HuntOps Banner](https://via.placeholder.com/1200x300/1A0A0A/D4AF37?text=HUNTOPS+%7C+Phone+Recovery+System)

---

## 📖 **About HuntOps**

**HuntOps** is a cutting-edge, cross-platform phone recovery and tracking system that empowers users to track, lock, and recover lost or stolen mobile devices using **IMEI (International Mobile Equipment Identity)** numbers.

Built with modern technologies, HuntOps offers a seamless experience across **Web, Android, and iOS** platforms. Whether you're a concerned individual looking to secure your personal device or a business managing multiple company phones, HuntOps provides the tools you need to stay in control.

---

## 🚀 **Key Features**

### 🔍 **Tracking & Location**
- ✅ **IMEI-Based Tracking** — Track any phone using its unique 15-digit IMEI number
- ✅ **Real-Time GPS Location** — Live location updates every 5 seconds
- ✅ **Location History Playback** — View route history with timestamps
- ✅ **Geofencing** — Set safe zones and get alerts when a device leaves the area
- ✅ **Wi-Fi & Bluetooth Detection** — Detect nearby networks and devices

### 🔒 **Remote Control**
- ✅ **Remote Lock** — Lock device screen with custom message
- ✅ **Remote Unlock** — Unlock device remotely
- ✅ **Password Change** — Change lock screen PIN/password
- ✅ **Remote Alarm** — Trigger loud siren on the device
- ✅ **Pocket Alarm** — Alert when phone is picked up

### 📸 **Surveillance & Data**
- ✅ **Remote Camera Access** — Capture photos from front/rear camera
- ✅ **Remote Microphone Access** — Record surroundings secretly
- ✅ **Screen Recording** — Capture live screen activity
- ✅ **Read Contacts & SMS** — Access device contacts and messages
- ✅ **Data Backup** — Auto-backup before remote wipe
- ✅ **Remote Data Wipe** — Factory reset device (with confirmation)

### 🤖 **AI & Smart Features**
- ✅ **AI Threat Detection** — Detect suspicious behavior patterns
- ✅ **Predictive Location** — Predict where device might be next
- ✅ **Community Stolen Database** — Report and track stolen devices
- ✅ **Recovery Assistant** — Step-by-step recovery process
- ✅ **Police Reporting** — Generate evidence packages for authorities

---

## 🛠️ **Tech Stack**

| Component | Technology |
|-----------|------------|
| **Backend** | Node.js, Express, TypeScript, PostgreSQL, Socket.io, Firebase (FCM) |
| **Web Dashboard** | React.js, TypeScript, Leaflet (maps), Axios, React Router |
| **Mobile App** | React Native, Expo, TypeScript, React Navigation |
| **Database** | PostgreSQL (Neon.tech) |
| **Deployment** | Render.com (Backend), Vercel (Web), Expo (Mobile) |

---

## 📁 **Project Structure**
HuntOps/
├── backend/
│ ├── src/
│ │ ├── config/ # Database & environment config
│ │ ├── controllers/ # API controllers (Auth, Device, Command, Tracking)
│ │ ├── models/ # Database models (User, Device, Location, Command)
│ │ ├── routes/ # API routes
│ │ ├── services/ # External services (FCM, WebSocket, AI)
│ │ ├── middleware/ # Authentication middleware
│ │ ├── utils/ # Helpers & utilities
│ │ └── app.ts # Main application entry
│ ├── .env
│ ├── package.json
│ └── tsconfig.json
│
├── mobile-app/
│ ├── src/
│ │ ├── components/ # Reusable UI components
│ │ ├── screens/ # App screens (Login, Dashboard, Tracking)
│ │ ├── services/ # Native services (IMEI, Location, Camera, Mic)
│ │ └── app.tsx # Main app entry
│ ├── assets/ # Images & icons
│ ├── app.json # Expo configuration
│ └── package.json
│
└── web-dashboard/
├── src/
│ ├── components/ # UI components (Sidebar, MapView, CommandCenter)
│ ├── pages/ # Pages (Login, Dashboard, Community)
│ ├── styles/ # Theme & styles
│ ├── App.tsx # Main app entry
│ └── index.tsx # React entry point
├── public/
├── package.json
└── tsconfig.json


---

## 📦 **Installation & Setup**

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **PostgreSQL** database (or use Neon.tech)
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/uzankhan/HuntOps.git
cd HuntOps

2. Backend Setup
bash
cd backend
npm install
cp .env.example .env  # Update environment variables
npm run dev

Server will start at: http://localhost:5000

3. Web Dashboard Setup
bash
cd ../web-dashboard
npm install
npm start
Dashboard will start at: http://localhost:3000

4. Mobile App Setup
bash
cd ../mobile-app
npm install
npx expo start
Scan QR code with Expo Go app, or press w for web version.
