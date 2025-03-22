const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    id: String,
    title: String,
    description: String,
    company: String,
    location: String,
    salary_from: Number,
    salary_to: Number,
    employment_type: String,
    application_deadline: String,
    qualifications: Array,
    contact: String,
    job_category: String,
    is_remote_work: Boolean,
    number_of_opening: Number,
    created_at: String,
    updated_at: String
});

module.exports = mongoose.model('Job', jobSchema);
