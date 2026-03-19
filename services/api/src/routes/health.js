const express = require('express');
const { getWelcomeMessage } = require('@fyle-ops/common');

const router = express.Router();

router.get('/', (req, res) => 
{
    res.json(getWelcomeMessage());
});

module.exports = router;
