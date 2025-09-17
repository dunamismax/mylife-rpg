const express = require('express');
const router = express.Router();
const { protect } = require('../lib/auth');
const prisma = require('../lib/prisma');

// @desc    Get all habits for a user
// @route   GET /api/habits
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const habits = await prisma.habit.findMany({
            where: { userId: req.user.id },
        });
        res.json(habits);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Create a new habit
// @route   POST /api/habits
// @access  Private
router.post('/', protect, async (req, res) => {
    const { title, type, xpReward } = req.body;
    try {
        const habit = await prisma.habit.create({
            data: {
                title,
                type,
                xpReward,
                userId: req.user.id,
            },
        });
        res.status(201).json(habit);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

// @desc    Update a habit
// @route   PUT /api/habits/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
    const { streak, lastCompleted } = req.body;
    try {
        const habit = await prisma.habit.update({
            where: { id: req.params.id },
            data: { streak, lastCompleted },
        });
        res.json(habit);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
});

module.exports = router;
