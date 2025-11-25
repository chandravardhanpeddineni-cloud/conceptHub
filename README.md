# ConceptHub - Concept sharing platform Backend

A robust Node.js and Express backend for the ConceptHub platform.

## How to Run

### Step 1: Clone the Repository
```bash
git clone https://github.com/Jaswant10041/backend-blog.git

```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Create .env File
Create a `.env` file in the root directory:
```
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/dbname?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_here
PORT=3000
NODE_ENV=development
```

### Step 4: Whitelist Your IP on MongoDB Atlas
1. Go to MongoDB Atlas → Network Access
2. Click **+ ADD IP ADDRESS**
3. Click **ALLOW ACCESS FROM ANYWHERE** (for development)
4. Click **Confirm**
5. Wait 1-2 minutes for changes to apply

### Step 5: Start the Development Server
```bash
npm run dev
```

You should see:
```
Connected to database
Server running on port 3000
```

Done! Your backend is now running on `http://localhost:3000`

## Available Commands

```bash
npm run dev          # Start development server
npm start            # Start production server
```

Done!
