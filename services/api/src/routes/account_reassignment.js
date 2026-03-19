const express = require('express');

const router = express.Router();

router.post('/preview', (req, res) => {
  res.json({
    ok: true,
    message: 'Account reassignment preview route is working'
  });
});

module.exports = router;