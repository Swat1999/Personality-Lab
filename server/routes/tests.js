const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const db = require('../config/db');
const { analyzePersonality } = require('../utils/personalityAnalyze');

// Save test result
router.post('/save', auth, async (req, res) => {
  const { personalInfo, answers, personality } = req.body;
  const userId = req.user.id;
  try {
    const userId = req.user.id;
    const { personalInfo, answers } = req.body;

    const improvementSuggestions = {
      "Balanced & Reliable": [
        "Take leadership in small group projects.",
        "Read about time management strategies.",
        "Try public speaking practice once a week."
      ],
      "Creative & Spontaneous": [
        "Set daily structure to balance creativity.",
        "Explore collaboration tools like Trello.",
        "Read 'Atomic Habits' to improve consistency."
      ]
    };
    const improvements = improvementSuggestions[personality] || [
      "Keep journalizing your progress.",
      "Seek feedback from trusted peers."
    ];

    await db.query(
      `INSERT INTO personnels (userId, personalInfo, answers, personality, improvements) 
      VALUES (?, ?, ?, ?, ?)`,
    [
      userId,
      JSON.stringify(personalInfo),
      JSON.stringify(answers),
      personality,
      JSON.stringify(improvements)
    ]
  );

    res.json({
      message: 'Test saved',
      improvements,
    });
  } catch (err) {
    console.error('Save test error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Fetch user tests
router.get('/my-tests', auth, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM personnels WHERE userId = ? ORDER BY createdAt DESC',
      [req.user.id]
    );
    const tests = rows.map(r => ({
      ...r,
      personalInfo: typeof r.personalInfo === "string" ? JSON.parse(r.personalInfo) : r.personalInfo,
      answers: typeof r.answers === "string" ? JSON.parse(r.answers) : r.answers,
      improvements: typeof r.improvements === "string" ? JSON.parse(r.improvements) : (r.improvements || []),
      }));
    res.json({ tests });
  } catch (err) {
    console.error('Fetch tests error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.put('/update/:id', auth, async (req, res) => {
  const { improvements } = req.body;
  try {
    await db.query(
      `UPDATE personnels SET improvements = ? WHERE id = ? AND userId = ?`,
      [JSON.stringify(improvements), req.params.id, req.user.id]
      );
      res.json({ message: 'Improvements updated' });
      } catch (err) {
        console.error('Update test error:', err);
        res.status(500).json({ error: 'Server error' });
      }
    });

function generateImprovements(answers) {
  const list = [];
  if (!answers) return ['No answers provided'];
  if (answers.openToCriticism === 'No')
    list.push('Practice receiving constructive feedback: ask for 1 thing to improve after a task.');
  if (answers.teamPlayer === 'individual')
    list.push('Try collaborating on a small project to improve team skills.');
  if (answers.prefersAlone === 'Alone')
    list.push('Balance alone time with small social interactions to build support network.');
  if (answers.likesGoingOut === 'Staying in')
    list.push('Schedule one outing per week to diversify experiences.');
  if (answers.getsTriggered === 'Yes')
    list.push('Learn small calming techniques (breathing, journalizing) to manage triggers.');
  if (answers.keepUpTrends === 'No')
    list.push('Follow 1 newsletter or account in your interest area to stay updated.');
  if (list.length === 0)
    list.push('You seem balanced — continue what you are doing and reflect weekly.');
  return list;
}

module.exports = router;