require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

// Allow CORS from common dev origins or from ALLOWED_ORIGINS env (comma-separated).
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:3000', 'http://127.0.0.1:3000'];

// In development, it's often convenient to accept requests from any origin.
const corsOptions = process.env.NODE_ENV === 'production'
  ? { origin: allowedOrigins }
  : { origin: true };

app.use(cors(corsOptions));
app.use(express.json());

// Simple request logger to help debugging network calls from the frontend
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.originalUrl);
  next();
});

// Health
app.get('/health', (req, res) => {
  res.json({ ok: true });
});

// Seed endpoint: create a test user (email, password in body)
// WARNING: Use only in development. This endpoint will create a user if it doesn't exist.
app.post('/seed', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'email and password required' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.json({ message: 'user already exists', user: { id: existing.id, email: existing.email } });
    }
    // Store plaintext password for local testing (NOT for production)
    const user = await prisma.user.create({ data: { email, password, name } });
    return res.json({ message: 'user created', user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'internal error' });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'email and password required' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: 'invalid credentials' });

  // Plaintext comparison for development/testing only
  if (user.password !== password) return res.status(401).json({ message: 'invalid credentials' });

    // Successful login. In a real app you'd create a session or JWT. Here we return user info.
    return res.json({ id: user.id, email: user.email, name: user.name });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'internal error' });
  }
});

// List users (no passwordHash)
app.get('/users', async (req, res) => {
  try {
    const users = await prisma.user.findMany({ select: { id: true, email: true, name: true, createdAt: true } });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'internal error' });
  }
});

// Products CRUD
app.get('/api/products', async (req, res) => {
  try {
    const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'internal error' });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const { name, description, price, quantity } = req.body;
    if (!name) return res.status(400).json({ message: 'name is required' });
    const prod = await prisma.product.create({ data: { name, description, price: Number(price) || 0, quantity: Number(quantity) || 0 } });
    res.status(201).json(prod);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'internal error' });
  }
});

app.put('/api/products/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, description, price, quantity } = req.body;
    const prod = await prisma.product.update({ where: { id }, data: { name, description, price: price !== undefined ? Number(price) : undefined, quantity: quantity !== undefined ? Number(quantity) : undefined } });
    res.json(prod);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'internal error' });
  }
});

app.delete('/api/products/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    await prisma.product.delete({ where: { id } });
    res.json({ message: 'deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'internal error' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit();
});
