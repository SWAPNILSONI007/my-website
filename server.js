require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
app.use(express.json({ limit: '15mb' }));

// MongoDB connect (non-fatal — server works without DB using in-memory fallback)
if(process.env.MONGODB_URI){
  mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 3000 })
    .then(()=>console.log('✅ MongoDB Connected!'))
    .catch(err=>console.log('⚠️ MongoDB unavailable, using in-memory mode:', err.message));
}
// Prevent unhandled promise rejections from crashing the server
process.on('unhandledRejection', (err) => console.log('⚠️ Unhandled rejection:', err.message));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/chatbot', require('./routes/chatbot'));
app.use('/api/payment', require('./routes/payment'));
app.use('/api/custom-design', require('./routes/custom-design'));

// HTML Pages
app.get('/', (req,res) => res.sendFile(path.join(__dirname,'public','index.html')));
app.get('/shop', (req,res) => res.sendFile(path.join(__dirname,'public','shop.html')));
app.get('/flash-sale', (req,res) => res.sendFile(path.join(__dirname,'public','flash-sale.html')));
app.get('/about', (req,res) => res.sendFile(path.join(__dirname,'public','about.html')));
app.get('/contact', (req,res) => res.sendFile(path.join(__dirname,'public','contact.html')));
app.get('/product', (req,res) => res.sendFile(path.join(__dirname,'public','product.html')));
app.get('/track', (req,res) => res.sendFile(path.join(__dirname,'public','track.html')));
app.get('/admin', (req,res) => res.sendFile(path.join(__dirname,'public','admin','login.html')));
app.get('/admin/dashboard', (req,res) => res.sendFile(path.join(__dirname,'public','admin','dashboard.html')));
app.get('/custom-design', (req,res) => res.sendFile(path.join(__dirname,'public','custom-design.html')));
app.get('/shipping-policy', (req,res) => res.sendFile(path.join(__dirname,'public','shipping-policy.html')));
app.get('/return-policy', (req,res) => res.sendFile(path.join(__dirname,'public','return-policy.html')));
app.get('/privacy-policy', (req,res) => res.sendFile(path.join(__dirname,'public','privacy-policy.html')));
app.get('/terms', (req,res) => res.sendFile(path.join(__dirname,'public','terms.html')));
app.get('/size-guide', (req,res) => res.sendFile(path.join(__dirname,'public','size-guide.html')));
app.get('/care-instructions', (req,res) => res.sendFile(path.join(__dirname,'public','care-instructions.html')));
app.get('/authenticity', (req,res) => res.sendFile(path.join(__dirname,'public','authenticity.html')));
app.get('/fraud-protection', (req,res) => res.sendFile(path.join(__dirname,'public','fraud-protection.html')));

// Static files
app.use(express.static(path.join(__dirname,'public')));

// Vercel ke liye — app.listen nahi, module.exports!
if(process.env.NODE_ENV !== 'production'){
  app.listen(process.env.PORT||3000, ()=>console.log('🌐 Local server running'));
}

module.exports = app;