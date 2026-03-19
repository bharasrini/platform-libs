const express = require('express');

const router = express.Router();

router.post('/backup', async (req, res) => 
{
    res.json({
      ok: true,
      message: 'Freshsuccess backup route is working'
    });
});

module.exports = router;