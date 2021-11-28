## FD Challenge
A real-time cryptocurrency exchange rates demo with client and server. Server-Sent Events (SSE) is used for pushing latest exchange rates to client.

### Prerequisites
- Node.js v14.x LTS
- Docker

### Get started
- Client

Prepare `.env` with below variables

```
VITE_BACKEND_BASE_URL=
```

Execute below commands to start with Docker

```
cd client
docker build . -t fd-client
docker run -p 3000:3000 fd-client
```

Due to some bugs from external library, it is not able to build, used development mode instead

- Server

Prepare `.env` with below variables

```
NODE_ENV=production
JWT_SECRET=
PORT=

EXCHANGE_RATE_API=https://api.cryptonator.com/api/ticker
```

Execute below commands to start with Docker

```
cd server
docker build . -t fd-server
docker run -p {port in env}:{port in env} fd-server
```