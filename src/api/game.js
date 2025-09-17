const express = require('express');
const router = express.Router();
const { protect } = require('../lib/auth');
const prisma = require('../lib/prisma');

// @desc    Update user progress (XP, stats, etc.)
// @route   POST /api/game/progress
// @access  Private
router.post('/progress', protect, async (req, res) => {
    const { xpGained, statsAffected, hpAffected } = req.body;

    try {
        const userStats = await prisma.stats.findUnique({
            where: { userId: req.user.id },
        });

        if (!userStats) {
            return res.status(404).json({ message: 'User stats not found' });
        }

        const updatedStats = await prisma.stats.update({
            where: { userId: req.user.id },
            data: {
                xp: userStats.xp + (xpGained || 0),
                // TODO: Implement logic for statsAffected and hpAffected
            },
        });

        res.json(updatedStats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
