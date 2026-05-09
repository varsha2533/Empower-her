# Empower Her

**Empower Her** is a women's safety and empowerment web application designed to provide immediate emergency support through an intelligent SOS alert system, emergency contact management, resource discovery, and safety guidance.

## 📋 Table of Contents

- [Features](#features)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [System Architecture Flow](#system-architecture-flow)
- [Installation & Setup](#installation--setup)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Development](#development)
- [Screenshots](#screenshots)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## ✨ Features

### Core Features
- **🚨 SOS Alert System:** Send an instant SOS alert with location to trusted emergency contacts
- **📱 Emergency Contact Management:** Save, edit, and manage emergency contacts
- **🗺️ Map-based Resource Discovery:** Find nearby medical shops, hospitals, and restrooms
- **📍 Location Sharing:** Automatic location capture and sharing during emergencies
- **🔐 User Authentication:** Secure login via Clerk
- **⚠️ Risk Assessment:** Intelligent risk scoring and recommendations from FastAPI backend
- **📊 SOS History:** Track and review all previous SOS alerts with details

### Safety Features
- **Network Status Awareness:** Detects internet connectivity and disables SOS when offline
- **Phone Number Validation:** Validates emergency contact phone numbers before sending
- **Multiple Contact Support:** Send alerts to multiple emergency contacts simultaneously
- **Development Mode:** Safe testing without sending real SMS in development
- **Error Handling:** Comprehensive error messages and fallback mechanisms

## 🏗️ Architecture & Tech Stack

### Frontend
- **Framework:** React 18 with TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **State Management:** React Hooks
- **UI Components:** Custom component library with Shadcn UI
- **Authentication:** Clerk
- **Icons:** Lucide React
- **Animation:** Framer Motion

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB
- **SMS Service:** Twilio
- **Risk Analysis:** FastAPI (Python)
- **Environment:** .env configuration

### External Services
- **Twilio:** SMS delivery for emergency alerts
- **Google Maps:** Location and resource display
- **Clerk:** User authentication and management
- **MongoDB Atlas:** Cloud database hosting
- **FastAPI:** Risk scoring and assessment engine

## 🔄 System Architecture Flow

```
┌─────────────────────┐
│   React Frontend    │
│  (Vite + TypeScript)│
└──────────┬──────────┘
           │ HTTP Request
           ▼
┌─────────────────────┐
│  Express Backend    │
│  (Node.js)          │
│  Port: 3000         │
└──────┬───────┬──────┘
       │       │
       │       ├──────────────────┐
       │       │                  │
       ▼       ▼                  ▼
    MongoDB  Twilio          FastAPI
    (SOS    (SMS)          (Risk Score)
    Alerts) Send           Analysis
       │       │                  │
       └───┬───┴──────────────────┘
           │
           ▼
    Emergency Contacts
    (Phone Notifications)
```

### API Flow for SOS Alert

1. **Frontend (React):**
   - User presses SOS button
   - App requests location from browser
   - Collects emergency contacts

2. **POST /api/sos:**
   - Frontend sends: `{contacts, location, message}`
   - Backend validates data
   - Saves alert to MongoDB
   - Sends SMS via Twilio to each contact
   - Calls FastAPI for risk scoring

3. **Risk Assessment:**
   - FastAPI analyzes the message and location
   - Returns: `{riskScore, riskLevel, recommendation}`
   - Backend saves risk data to MongoDB

4. **Response:**
   - Frontend receives risk data
   - Displays Risk Assessment Card
   - Shows alert status to user

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Python (v3.8 or higher) - for FastAPI
- Twilio Account
- Clerk Account
- Git

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/empower-her.git
cd empower-her
```

### Step 2: Install Frontend Dependencies

```bash
npm install
```

### Step 3: Install Backend Dependencies

```bash
cd server
npm install
cd ..
```

### Step 4: Install Python Risk Engine (FastAPI)

```bash
cd backend-python
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

### Step 5: Create Environment Files

**Frontend (.env in root):**
```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key_here
```

**Backend (server/.env):**
```env
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/empowerher
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890
CLIENT_ORIGIN=http://localhost:8080
PORT=3000
```

**Python Risk Engine (backend-python/.env):**
```env
FASTAPI_HOST=localhost
FASTAPI_PORT=8000
```

## 🔑 Environment Variables

### Frontend Environment Variables (`VITE_*`)
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk authentication public key | `pk_test_xxxxx` |

### Backend Environment Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:password@cluster.mongodb.net/empowerher` |
| `TWILIO_ACCOUNT_SID` | Twilio Account SID | `AC1234567890abcdef` |
| `TWILIO_AUTH_TOKEN` | Twilio Authentication Token | `your_auth_token_here` |
| `TWILIO_PHONE_NUMBER` | Twilio phone number for SMS | `+1234567890` |
| `CLIENT_ORIGIN` | Frontend URL for CORS | `http://localhost:8080` |
| `PORT` | Backend server port | `3000` |

### Python Risk Engine Environment Variables
| Variable | Description | Example |
|----------|-------------|---------|
| `FASTAPI_HOST` | FastAPI host address | `localhost` |
| `FASTAPI_PORT` | FastAPI server port | `8000` |

> ⚠️ **Important:** Never commit `.env` files. Add them to `.gitignore`.

## 🏃 Running the Application

### Development Mode (All Services)

**Terminal 1 - Frontend:**
```bash
npm run dev
# Runs on http://localhost:8080
```

**Terminal 2 - Backend:**
```bash
cd server
npm run dev
# Runs on http://localhost:3000
```

**Terminal 3 - Python Risk Engine:**
```bash
cd backend-python
source venv/bin/activate  # On Windows: venv\Scripts\activate
python main.py
# Runs on http://localhost:8000
```

### Production Build

```bash
# Build frontend
npm run build

# Start backend
cd server
npm run start

# Start Python engine
cd backend-python
python main.py
```

## 📡 API Documentation

### Health Check
```
GET /api/health-check

Response:
{
  "success": true,
  "message": "Server is healthy"
}
```

### Send SOS Alert
```
POST /api/sos

Request:
{
  "contacts": [
    {"name": "Mom", "phone": "+1234567890"},
    {"name": "Dad", "phone": "+0987654321"}
  ],
  "location": {
    "lat": 37.7749,
    "lng": -122.4194
  },
  "message": "I'm in danger"
}

Response (Success):
{
  "success": true,
  "message": "SOS alert sent successfully",
  "alert": {
    "_id": "63f7a1b2c3d4e5f6g7h8i9j0",
    "contacts": [...],
    "location": {...},
    "smsStatus": "sent",
    "riskScore": 8.5,
    "riskLevel": "HIGH",
    "recommendation": "Contact local authorities immediately",
    "createdAt": "2024-01-15T10:30:00Z"
  },
  "riskData": {
    "riskScore": 8.5,
    "riskLevel": "HIGH",
    "recommendation": "Contact local authorities immediately"
  }
}

Response (Error):
{
  "success": false,
  "message": "Failed to send SOS alert",
  "error": "No emergency contacts configured"
}
```

### Fetch SOS History
```
GET /api/sos/history?limit=50&skip=0

Response:
{
  "success": true,
  "alerts": [
    {
      "_id": "63f7a1b2c3d4e5f6g7h8i9j0",
      "contacts": [...],
      "location": {...},
      "message": "Emergency alert",
      "smsStatus": "sent",
      "riskScore": 7.2,
      "riskLevel": "HIGH",
      "recommendation": "...",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:31:00Z"
    }
  ],
  "pagination": {
    "total": 5,
    "limit": 50,
    "skip": 0,
    "hasMore": false
  }
}
```

## 📁 Project Structure

```
empower-her/
├── src/                          # React frontend
│   ├── components/
│   │   ├── SOSAlert.tsx         # Main SOS button component
│   │   ├── EmergencyContacts.tsx # Contact management
│   │   ├── Navbar.tsx            # Navigation bar
│   │   ├── Layout.tsx            # Layout wrapper
│   │   └── ui/                   # UI component library
│   ├── pages/
│   │   ├── Index.tsx             # Home page
│   │   ├── SOS.tsx               # SOS page
│   │   ├── SOSHistory.tsx        # SOS history page (NEW)
│   │   ├── Medical.tsx           # Medical resources page
│   │   ├── Resources.tsx         # General resources
│   │   ├── Restrooms.tsx         # Restroom finder
│   │   └── Profile.tsx           # User profile
│   ├── hooks/                    # Custom React hooks
│   ├── lib/                      # Utilities and helpers
│   ├── App.tsx                   # Root component
│   ├── AppRoutes.tsx             # Route definitions
│   └── main.tsx                  # Entry point
├── server/                       # Express backend
│   ├── src/
│   │   ├── routes/
│   │   │   ├── sos.js           # SOS endpoints (POST /sos, GET /sos/history)
│   │   │   ├── health.routes.js # Health check endpoint
│   │   │   └── sms.routes.js    # SMS routes
│   │   ├── models/
│   │   │   └── SOSAlert.js      # MongoDB SOS Alert schema
│   │   └── config/
│   │       └── database.js      # MongoDB connection
│   └── index.js                 # Server entry point
├── backend-python/              # FastAPI risk engine
│   ├── main.py                  # FastAPI app
│   └── requirements.txt         # Python dependencies
├── public/                       # Static assets
├── package.json                 # Frontend dependencies
├── vite.config.ts               # Vite configuration
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.ts           # Tailwind CSS config
└── README.md                    # This file
```

## 🛠️ Development

### Code Style
- **Frontend:** TypeScript with React best practices
- **Backend:** ES6+ with Express patterns
- **Python:** PEP 8 style guide

### Adding New Features

1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature
   ```

2. Make your changes and test thoroughly

3. Commit with clear messages:
   ```bash
   git commit -m "feat: add new feature description"
   ```

4. Push and create a pull request

### Common Development Commands

```bash
# Install dependencies
npm install

# Start frontend dev server
npm run dev

# Build frontend
npm run build

# Start backend dev server
cd server && npm run dev

# Run tests (if available)
npm test
```

## 📸 Screenshots

*Screenshots placeholders for demo:*

- 🏠 **Home Page:** Welcome screen with navigation
- 🆘 **SOS Page:** Large SOS button with emergency contacts
- 📊 **Risk Assessment:** Display after SOS with score and recommendation
- 📜 **SOS History:** View of all previous alerts
- 👥 **Emergency Contacts:** Contact management interface
- 🗺️ **Medical Resources:** Map-based resource finder

## 🔧 Troubleshooting

### Issue: "Network connection unavailable"
- **Cause:** Backend server not running or unreachable
- **Solution:** 
  ```bash
  cd server && npm run dev
  ```

### Issue: "No emergency contacts configured"
- **Cause:** User hasn't added contacts yet
- **Solution:** Add emergency contacts before pressing SOS

### Issue: SMS not being sent
- **Cause:** Twilio credentials not set or invalid phone numbers
- **Solution:**
  - Verify `.env` variables
  - Ensure phone numbers have country code (e.g., +1)
  - Check Twilio account has credits

### Issue: MongoDB connection failed
- **Cause:** Invalid connection string or network issue
- **Solution:**
  - Verify `MONGO_URI` in `.env`
  - Check MongoDB is running (if local)
  - Whitelist your IP on MongoDB Atlas

### Issue: Frontend shows loading spinner indefinitely
- **Cause:** FastAPI risk engine not running or backend error
- **Solution:**
  ```bash
  # Start FastAPI
  cd backend-python && python main.py
  
  # Check backend logs for errors
  cd server && npm run dev
  ```

## 🤝 Contributing

We welcome contributions! Here's how:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m "feat: add amazing feature"`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Submit** a Pull Request

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## 📧 Contact

### Team
- **Team Captain:** Srisha N – srishaurala22@gmail.com
- **Developer:** Tarun N – tarun132004@gmail.com
- **Developer:** Varsha M N – varshamanjunath2533@gmail.com

### Support
For questions, issues, or feedback, please open an issue on GitHub or contact the team directly.

---

**Made with ❤️ for women's safety and empowerment**
