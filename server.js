require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
app.use(express.json());

// MongoDB connect
if(process.env.MONGODB_URI){
  mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 3000 })
    .then(()=>console.log('✅ MongoDB Connected!'))
    .catch(err=>console.log('❌ Error:',err));
}

// API Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/chatbot', require('./routes/chatbot'));

// HTML Pages
app.get('/', (req,res) => res.sendFile(path.join(__dirname,'public','index.html')));
app.get('/shop', (req,res) => res.sendFile(path.join(__dirname,'public','shop.html')));
app.get('/flash-sale', (req,res) => res.sendFile(path.join(__dirname,'public','flash-sale.html')));
app.get('/about', (req,res) => res.sendFile(path.join(__dirname,'public','about.html')));
app.get('/contact', (req,res) => res.sendFile(path.join(__dirname,'public','contact.html')));
app.get('/product', (req,res) => res.sendFile(path.join(__dirname,'public','product.html')));
app.get('/admin', (req,res) => res.sendFile(path.join(__dirname,'public','admin','login.html')));
app.get('/admin/dashboard', (req,res) => res.sendFile(path.join(__dirname,'public','admin','dashboard.html')));

// Static files
app.use(express.static(path.join(__dirname,'public')));

// Vercel ke liye — app.listen nahi, module.exports!
if(process.env.NODE_ENV !== 'production'){
  app.listen(process.env.PORT||3000, ()=>console.log('🌐 Local server running'));
}

module.exports = app;