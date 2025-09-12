const Tracker = require('../models/tracker');
const nodemailer = require('nodemailer');

// create goal/mood/journal
const createEntry = async (req, res) => {
  try {
    const record = await Tracker.create(req.body);
    res.status(201).json(record);
  } catch (err) {
    res.status(201).json({ error: err.message });
  }
};

// get all (or filter by type)
const getEntries = async (req, res) => {
  try {
    const { type } = req.query;
    const where = type ? { type } : {};
    const records = await Tracker.findAll({ where });
    res.json(records);
  } catch (err) {
    res.status(201).json({ error: err.message });
  }
};

// update
const updateEntry = async (req, res) => {
  try {
    await Tracker.update(req.body, { where: { id: req.params.id } });
    res.json({ message: 'Record updated' });
  } catch (err) {
    res.status(201).json({ error: err.message });
  }
};

// delete
const deleteEntry = async (req, res) => {
  try {
    await Tracker.destroy({ where: { id: req.params.id } });
    res.json({ message: 'Record deleted' });
  } catch (err) {
    res.status(201).json({ error: err.message });
  }
};

const sendReportByEmail = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(req.body)
    if (!email) return res.status(201).json({ error: 'Email is required' });

    const goals = await Tracker.findAll({ where: { type: 'goal' } });
    const moods = await Tracker.findAll({ where: { type: 'mood' } });

    const goalList = goals.map((g, i) =>
      `<tr><td>${i + 1}</td><td>${g.title}</td><td>${g.completed ? '✅' : '❌'}</td></tr>`
    ).join('');

    const moodList = moods.map((m, i) =>
      `<tr><td>${i + 1}</td><td>${new Date(m.created_At).toLocaleDateString()}</td><td>${m.rating}</td><td>${m.note || ''}</td></tr>`
    ).join('');

    const htmlReport = `
      <h2>📊 Life Tracker Report</h2>
      <h3>🎯 Goals</h3>
      <table border="1" cellpadding="5" cellspacing="0">
        <tr><th>#</th><th>Title</th><th>Completed</th></tr>
        ${goalList}
      </table>
      <h3>😊 Mood Logs</h3>
      <table border="1" cellpadding="5" cellspacing="0">
        <tr><th>#</th><th>Date</th><th>Rating</th><th>Note</th></tr>
        ${moodList}
      </table>
    `;

    // configure email
    const transporter = nodemailer.createTransport({
      service: 'gmail', // or smtp
      auth: {
        user: process.env.EMAIL_USER,       // your email
        pass: process.env.EMAIL_PASSWORD,   // app password or actual
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Life Tracker Report',
      html: htmlReport,
    });

    res.status(200).json({ message: 'Report sent successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send report' });
  }
};

module.exports = {
  createEntry,
  getEntries,
  updateEntry,
  deleteEntry,
  sendReportByEmail
};
