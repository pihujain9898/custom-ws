# WebSocket Backend Setup Guide

This guide walks you through setting up a native WebSocket server in Node.js with:

- Environment-based configuration and validation (Joi)
- Logging (Winston)
- Heartbeat to detect dead clients
- Graceful shutdown and unhandled error handling

## 📁 Project Structure

```
ws-server/
├── config/
│   ├── config.js
│   └── logger.js
├── utils/
│   └── errorHandler.js
├── .env
├── .gitignore
├── package.json
└── server.js
```

---

### 1. Initialize Project & Install Dependencies

- Create project folder
```git clone https://github.com/pihujain9898/custom-ws```
 
- **Dependencies**:
    - `ws`: Native WebSocket server
    - `dotenv`: Load `.env` variables
    - `joi`: Schema validation for env vars
    - `winston`: Logging framework

- Install dependencies
```npm i```

### 2. Files used:

#### i. Create `.env` File.  
In the project root, add a file named `.env` or you can rename `.env.example`:

#### ii. Configuration Loader: `config/config.js`

#### iii. Logger Setup: `config/logger.js`

#### iv. Unhandled Error Handler: `utils/errorHandler.js`

#### 7. WebSocket Server (entery point): `index.js`

### 3. Run the Server

You now have a production-ready WebSocket backend with:

- **Devlopment** ```npm run dev```
- **Production** ```npm run start```
