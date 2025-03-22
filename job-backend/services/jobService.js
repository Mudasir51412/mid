const axios = require('axios');
const Job = require('../models/Job');

// Function to fetch jobs and store in DB
async function fetchAndStoreJobs() {
    try {
        const response = await axios.get('https://jsonfakery.com/jobs/infinite-scroll');
        const jobs = response.data.data;

        // Prevent duplicates by checking job ID before inserting
        for (const job of jobs) {
            await Job.updateOne({ id: job.id }, job, { upsert: true });
        }

        console.log('Jobs fetched and stored successfully!');
    } catch (error) {
        console.error('Error fetching jobs:', error);
    }
}

// Export function for use in routes or scheduled tasks
module.exports = { fetchAndStoreJobs };
