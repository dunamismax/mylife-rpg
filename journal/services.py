from datetime import date, timedelta

from django.db import transaction
from django.utils import timezone

from .models import Habit, HabitLog, Progress, Quest


def get_progress() -> Progress:
    progress, _ = Progress.objects.get_or_create(pk=1)
    return progress


def _award_xp(amount: int) -> None:
    if amount <= 0:
        return

    with transaction.atomic():
        progress, _ = Progress.objects.select_for_update().get_or_create(pk=1)
        progress.total_xp += amount
        progress.level = max(1, (progress.total_xp // 100) + 1)
        progress.save(update_fields=["total_xp", "level", "updated_at"])


def complete_quest(quest: Quest, *, completed_at=None) -> bool:
    timestamp = completed_at or timezone.now()

    with transaction.atomic():
        locked = Quest.objects.select_for_update().get(pk=quest.pk)
        if locked.completed_at is not None:
            return False

        locked.completed_at = timestamp
        locked.save(update_fields=["completed_at", "updated_at"])

    _award_xp(quest.xp_reward)
    return True


def log_habit_completion(habit: Habit, *, on_date: date | None = None) -> bool:
    logged_on = on_date or timezone.localdate()

    with transaction.atomic():
        locked = Habit.objects.select_for_update().get(pk=habit.pk)
        log, created = HabitLog.objects.get_or_create(
            habit=locked,
            logged_on=logged_on,
            defaults={"xp_awarded": locked.xp_reward},
        )
        if not created:
            return False

        yesterday = logged_on - timedelta(days=1)
        if locked.last_completed_on == yesterday:
            locked.streak += 1
        else:
            locked.streak = 1

        locked.last_completed_on = logged_on
        locked.save(update_fields=["streak", "last_completed_on", "updated_at"])

    _award_xp(log.xp_awarded)
    return True
