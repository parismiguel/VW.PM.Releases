# Uprise Release Tracker
A web app to manage release planning and documentation.

## Setup
1. **Backend**:
   - `cd server`
   - `npm install`
   - Create `.env` with `BASIC_AUTH_USER` and `BASIC_AUTH_PASS`
   - `npm run dev`
2. **Frontend**:
   - `cd client`
   - `npm install`
   - `npm start`

> Username: admin
> Password: password

## Features
- Create, edit, and view releases
- Generate Word documents from release data

## Considerations
Both server and client require Node v16.202 and npm v8.19.4 If you work with a different version, please install the Node Version Manager tool here: https://github.com/nvm-sh/nvm and switch to the version required:

```bash
nvm use node 16
```