const express = require('express');
const router = express.Router();
const { protect } = require('../lib/auth');
const prisma = require('../lib/prisma');

// @desc    Get all status effects for a user
// @route   GET /api/status-effects
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const statusEffects = await prisma.statusEffect.findMany({
            where: { userId: req.user.id, isActive: true },
        });
        res.json(statusEffects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Apply a status effect
// @route   POST /api/status-effects/apply
// @access  Private
router.post('/apply', protect, async (req, res) => {
    const { name, description, cause, duration, penalty, expiresAt } = req.body;
    try {
        const statusEffect = await prisma.statusEffect.create({
            data: {
                name,
                description,
                cause,
                duration,
                penalty,
                expiresAt,
                userId: req.user.id,
            },
        });
        res.status(201).json(statusEffect);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
