require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const noteSchema = new mongoose.Schema({ text: String });
const Note = mongoose.model('Note', noteSchema);

app.use(express.json());
app.use(express.static('public'));

// Get all notes
app.get('/api/notes', async (req, res) => {
  const notes = await Note.find();
  res.json(notes);
});

// Add new note
app.post('/api/notes', async (req, res) => {
  const note = new Note({ text: req.body.text });
  await note.save();
  res.json({ message: 'Note added!' });
});

// Delete a note
app.delete('/api/notes/:id', async (req, res) => {
  await Note.findByIdAndDelete(req.params.id);
  res.json({ message: 'Note deleted!' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});