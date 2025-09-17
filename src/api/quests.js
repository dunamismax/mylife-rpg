const express = require('express');
const router = express.Router();
const { protect } = require('../lib/auth');
const prisma = require('../lib/prisma');

// @desc    Get all quests for a user
// @route   GET /api/quests
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const quests = await prisma.quest.findMany({
            where: { userId: req.user.id },
        });
        res.json(quests);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Create a new quest
// @route   POST /api/quests
// @access  Private
router.post('/', protect, async (req, res) => {
    const { title, type, xpReward } = req.body;
    try {
        const quest = await prisma.quest.create({
            data: {
                title,
                type,
                xpReward,
                userId: req.user.id,
            },
        });
        res.status(201).json(quest);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Update a quest
// @route   PUT /api/quests/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
    const { completed } = req.body;
    try {
        const quest = await prisma.quest.update({
            where: { id: req.params.id },
            data: { completed },
        });
        res.json(quest);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
