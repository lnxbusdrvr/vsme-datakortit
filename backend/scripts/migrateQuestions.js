// scripts/migrateQuestions.js
require('dotenv').config({ path: '../.env' });
const mongoose = require('mongoose');
const Question = require('../models/question');

const mongoUrl = process.env.MONGODB_URI;

mongoose.connect(mongoUrl)
  .then(async () => {
    console.log('Connected to MongoDB');

    const db = mongoose.connection.db;
    const perusmoduuliCollection = db.collection('perusmoduuli');

    const rawDoc = await perusmoduuliCollection.findOne();
    const profileItems = rawDoc.profile;

    let section = '';
    const docs = [];

    profileItems.forEach((item) => {
      if (item.title) {
        section = item.title;
      } else if (item.question) {
        docs.push({
          module: 'Perusmoduuli',
          section,
          question: item.question,
          metadata: {}
        });
      }
    });

    await Question.insertMany(docs);
    console.log('✅ Questions migrated!');
    mongoose.disconnect();
  })
  .catch(err => {
    console.error('Migration failed:', err);
    mongoose.disconnect();
  });

