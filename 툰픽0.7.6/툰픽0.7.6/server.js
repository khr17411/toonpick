//server.js
require('dotenv').config();            
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

const webtoonRouter = require('./api/webtoon');
const recommendRouter = require('./api/recommend');  
const genreClickRouter = require('./api/genre_click');
app.use(cors());                       
app.use(express.json());              

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('✅ MongoDB 연결 성공');
}).catch(err => {
  console.error('❌ MongoDB 연결 실패:', err);
});

app.use('/api/comment', require('./api/comment'));
app.use('/api/preference', require('./api/preference'));
app.use('/api/webtoon', webtoonRouter);
app.use('/api/recommend', recommendRouter); 
app.use('/api/genre_click', genreClickRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 서버 실행 중: http://localhost:${PORT}`);
});
