

# Empower Her

**Empower Her** is a women’s safety and empowerment web app with SOS alerts, emergency contact notifications, map-based resource discovery, and safety guidance.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Development](#development)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Features

- **SOS Alert System:** Send an SOS alert with location to trusted contacts.
- **Emergency Contact Management:** Save and manage emergency contact details.
- **Map Resources:** Find nearby medical shops and restrooms.
- **Location Sharing:** Share your current location during emergencies.
- **Safety Resources:** Access educational content for empowerment and legal awareness.

## Technology Stack

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **Database:** MongoDB
- **Services:** Twilio SMS, Google Maps
- **Styling:** Tailwind CSS

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/empower-her.git
   cd empower-her
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env
   ```

4. **Edit `.env` with your values:**
   - `MONGO_URI`
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_PHONE_NUMBER`
   - `CLIENT_ORIGIN`
   - `PORT`
   - `VITE_CLERK_PUBLISHABLE_KEY`

## Environment Variables

Copy `.env.example` to `.env` and fill in your own values.

Example `.env` values:

```env
CLIENT_ORIGIN=http://localhost:8080
PORT=3000
MONGO_URI=mongodb://localhost:27017/empowerher
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
```

> Keep `.env` private and do not commit it to Git.

## Development

### Start frontend only

```bash
npm run dev
```

### Start backend only

```bash
npm run server
```

### Start both frontend and backend together

```bash
npm run dev:full
```

### Build production frontend

```bash
npm run build
```

## Usage

1. Open the app in your browser at `http://localhost:8080`.
2. Add emergency contacts.
3. Use the SOS button to send an alert to your contacts.
4. Confirm the backend is running on `http://localhost:3000`.

## Contributing

We welcome contributions!

1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add some feature"
   ```
4. Push your branch:
   ```bash
   git push origin feature/your-feature
   ```
5. Open a pull request.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## Contact

- **Team Captain:** Srisha N – srishaurala22@gmail.com
- **Team Members:**
  - Tarun N – tarun132004@gmail.com
  - Varsha M N – varshamanjunath2533@gmail.com


