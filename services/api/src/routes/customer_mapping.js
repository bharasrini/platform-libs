const express = require('express');

const router = express.Router();

router.get('/validate', (req, res) => {
  res.json({
    ok: true,
    message: 'Customer mapping route is working'
  });
});

module.exports = router;