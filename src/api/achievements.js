const express = require('express');
const router = express.Router();
const { protect } = require('../lib/auth');
const prisma = require('../lib/prisma');

// @desc    Get all achievements for a user
// @route   GET /api/achievements
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const achievements = await prisma.achievement.findMany({
            where: { userId: req.user.id },
        });
        res.json(achievements);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Check for new achievements
// @route   POST /api/achievements/check
// @access  Private
router.post('/check', protect, async (req, res) => {
    // TODO: Implement achievement checking logic
    res.status(200).json({ message: 'Checked for achievements' });
});


module.exports = router;
