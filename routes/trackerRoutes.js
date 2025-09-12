const express = require('express');
const { createEntry, getEntries, updateEntry, deleteEntry, sendReportByEmail } = require('../app/controllers/trackerController');
const router = express.Router();

router.post('/addgoal', createEntry);   // add goal/mood/journal
router.get('/get-tracker', getEntries);     // fetch (all or filter by ?type=goal/mood/journal)
router.put('/tracker/:id', updateEntry); // update
router.delete('/tracker/:id', deleteEntry); // delete
router.post('/send-report', sendReportByEmail); 

module.exports = router;
