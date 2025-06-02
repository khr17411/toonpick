require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const Webtoon = require('./models/webtoon');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ DB 연결됨')).catch(err => console.error(err));

const rawData = fs.readFileSync('craw_all.json');
const webtoons = JSON.parse(rawData);

webtoons.forEach(item => {
  if (typeof item.genres === 'string') {
    item.genres = item.genres.split(',').map(s => s.trim());
  }
});

async function insertWebtoons() {
  try {
    await Webtoon.deleteMany({});
    await Webtoon.insertMany(webtoons);
    console.log(`✅ 웹툰 ${webtoons.length}개 저장 완료`);
    mongoose.disconnect();
  } catch (err) {
    console.error('❌ 저장 실패:', err);
  }
}

insertWebtoons();
