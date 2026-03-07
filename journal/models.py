from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class Progress(models.Model):
    total_xp = models.PositiveIntegerField(default=0)
    level = models.PositiveIntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "progress"
        verbose_name_plural = "progress"

    def __str__(self) -> str:
        return f"Level {self.level} ({self.total_xp} XP)"


class Quest(models.Model):
    class Cadence(models.TextChoices):
        DAILY = "daily", "Daily"
        WEEKLY = "weekly", "Weekly"
        ONE_OFF = "one_off", "One-off"

    class Difficulty(models.TextChoices):
        EASY = "easy", "Easy"
        MEDIUM = "medium", "Medium"
        HARD = "hard", "Hard"

    title = models.CharField(max_length=255)
    notes = models.TextField(blank=True)
    cadence = models.CharField(max_length=16, choices=Cadence.choices, default=Cadence.DAILY)
    difficulty = models.CharField(max_length=16, choices=Difficulty.choices, default=Difficulty.MEDIUM)
    xp_reward = models.PositiveIntegerField(default=25)
    due_date = models.DateField(blank=True, null=True)
    completed_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["completed_at", "due_date", "-created_at"]

    def __str__(self) -> str:
        return self.title

    @property
    def is_complete(self) -> bool:
        return self.completed_at is not None


class Habit(models.Model):
    class Kind(models.TextChoices):
        BUILD = "build", "Build"
        AVOID = "avoid", "Avoid"

    title = models.CharField(max_length=255)
    notes = models.TextField(blank=True)
    kind = models.CharField(max_length=16, choices=Kind.choices, default=Kind.BUILD)
    xp_reward = models.PositiveIntegerField(default=10)
    streak = models.PositiveIntegerField(default=0)
    last_completed_on = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["title"]

    def __str__(self) -> str:
        return self.title


class HabitLog(models.Model):
    habit = models.ForeignKey(Habit, on_delete=models.CASCADE, related_name="logs")
    logged_on = models.DateField()
    xp_awarded = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-logged_on", "-created_at"]
        constraints = [
            models.UniqueConstraint(fields=["habit", "logged_on"], name="unique_habit_log_per_day")
        ]

    def __str__(self) -> str:
        return f"{self.habit.title} on {self.logged_on}"


class DailyCheckIn(models.Model):
    check_in_date = models.DateField(unique=True)
    daily_intention = models.CharField(max_length=255)
    if_then_plan = models.CharField(max_length=255, blank=True)
    craving_intensity = models.PositiveSmallIntegerField(
        blank=True,
        null=True,
        validators=[MinValueValidator(0), MaxValueValidator(10)],
    )
    trigger_notes = models.TextField(blank=True)
    reflection = models.TextField(blank=True)
    slip_happened = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-check_in_date"]

    def __str__(self) -> str:
        return f"Check-in for {self.check_in_date}"
