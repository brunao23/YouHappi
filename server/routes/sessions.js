const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const heygenService = require('../services/heygenService');

// @route   POST api/sessions
// @desc    Create a new session
// @access  Private
router.post(
  '/',
  [auth, [check('message', 'Message is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { message, emotion } = req.body;

      // Here you would typically save the session to your database
      // For this example, we'll just use the HeyGen service

      const response = await heygenService.generateResponse(message);
      const insights = await heygenService.generateInsights(message, emotion);

      res.json({ response, insights });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;