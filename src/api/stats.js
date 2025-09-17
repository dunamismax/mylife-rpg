const express = require('express');
const router = express.Router();
const { protect } = require('../lib/auth');
const prisma = require('../lib/prisma');

// @desc    Get user stats
// @route   GET /api/stats
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const stats = await prisma.stats.findUnique({
            where: { userId: req.user.id },
        });
        res.json(stats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
