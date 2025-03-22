const express = require('express');
const { fetchAndStoreJobs } = require('../services/jobService');
const router = express.Router();

// Route to fetch and store jobs
router.get('/fetch-jobs', async (req, res) => {
    await fetchAndStoreJobs();
    res.send('Jobs fetched and stored successfully!');
});

module.exports = router;
