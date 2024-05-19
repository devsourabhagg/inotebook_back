const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Notes');
const {validationResult, body } = require('express-validator');

router.get('/fetchallnotes', fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.send(notes);
  }
  catch (e) {
    console.log(`Error in fetchall notes Api : ${e.message}`);
  }

})


router.post('/note', fetchuser, [
  body('title', 'Enter a valid title').isLength({ min: 3 }),
  body('description', 'Description must be at least 5 characters').isLength({ min: 5 }),
], async (req, res) => {
  try {

    const { title, description, tag } = req.body;
    // if there are errors then return the bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // One way of saving the data
    /*const note = await Note.create({
      title: title,
      description:description,
      tag: tag,
      user : req.user.id
    })
    // res.send(note);
    res.json({ note });
    */
    //Another way of saving the data

    const note = new Note({
      title,description,tag,user: req.user.id,
    })
    const savedNote = await note.save();
    res.json(savedNote);
    // res.json({savedNote}); -> this will first have the savedNote object then inside that object notes value will be there.

  }
  catch (e) {
    console.log(`Error in add notes Api : ${e.message}`);
  }

})


module.exports = router