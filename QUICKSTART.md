# Quick Start Guide - TradeWatcher

Get the TradeWatcher platform running in 5 minutes.

---

## Prerequisites

- **Node.js** 18+ (`node --version`)
- **Python** 3.11+ (`python --version`)
- **Yarn** (`yarn --version`)
- **MongoDB** instance (local or Atlas)

---

## 1. Clone & Setup

```bash
# Clone repository
git clone <repository-url>
cd tradewatcher
```

---

## 2. Backend Setup

```bash
cd backend

# Create virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or: venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env with your MongoDB credentials:
# MONGO_URL=mongodb://localhost:27017
# DB_NAME=tradewatcher
```

---

## 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
yarn install

# Configure environment
cp .env.example .env
# Edit .env:
# REACT_APP_BACKEND_URL=http://localhost:8001
```

---

## 4. Start Services

### Option A: Development Mode

**Terminal 1 - Backend:**
```bash
cd backend
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

**Terminal 2 - Frontend:**
```bash
cd frontend
yarn start
```

### Option B: Using Supervisor (Production-like)

```bash
# Start both services
sudo supervisorctl start backend frontend

# Check status
sudo supervisorctl status

# View logs
tail -f /var/log/supervisor/backend.*.log
tail -f /var/log/supervisor/frontend.*.log
```

---

## 5. Access Application

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8001/api
- **API Docs:** http://localhost:8001/docs

---

## Quick Test

```bash
# Test backend health
curl http://localhost:8001/api/

# Expected response:
# {"message":"Flow Intel Analytics API","version":"2.0.0","status":"healthy"}
```

---

## Key Routes

| URL | Description |
|-----|-------------|
| `/` | Dashboard |
| `/actors` | Actors catalog |
| `/actors/vitalik` | Actor profile example |
| `/tokens` | Token overview |
| `/signals` | Smart signals |
| `/watchlist` | Tracked items |
| `/alerts` | Notifications |

---

## Project Structure

```
/app/
├── backend/
│   ├── server.py          # API server
│   ├── requirements.txt   # Python deps
│   └── .env              # Config
│
├── frontend/
│   ├── src/
│   │   ├── App.js        # Router
│   │   ├── pages/        # Page components
│   │   └── components/   # Shared components
│   ├── package.json      # JS deps
│   └── .env             # Config
│
├── README.md             # Full documentation
├── NEXT-TASKS.md         # Development roadmap
├── PAGES.md             # Page documentation
└── memory/PRD.md        # Product requirements
```

---

## Common Issues

### Port already in use
```bash
# Find process on port
lsof -i :8001  # or :3000

# Kill process
kill -9 <PID>
```

### MongoDB connection failed
- Check MongoDB is running
- Verify MONGO_URL in `.env`
- Test connection: `mongo mongodb://localhost:27017`

### Frontend build errors
```bash
cd frontend
rm -rf node_modules yarn.lock
yarn install
```

### Backend import errors
```bash
cd backend
pip install -r requirements.txt --upgrade
```

---

## Environment Variables

### Backend (`/backend/.env`)
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=tradewatcher
CORS_ORIGINS=*
```

### Frontend (`/frontend/.env`)
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

---

## Development Tips

1. **Hot Reload** - Both frontend and backend auto-reload on file changes

2. **API Testing** - Use the Swagger docs at `/docs`

3. **Browser DevTools** - React DevTools extension recommended

4. **VS Code Extensions:**
   - ESLint
   - Tailwind CSS IntelliSense
   - Python
   - Prettier

---

## Need Help?

- Check [README.md](README.md) for full documentation
- See [NEXT-TASKS.md](NEXT-TASKS.md) for development priorities
- Review [PAGES.md](PAGES.md) for page-specific details
