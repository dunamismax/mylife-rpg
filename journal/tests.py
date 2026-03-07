from datetime import date
from unittest import mock

from django.test import TestCase
from django.urls import reverse
from django.utils import timezone

from .models import DailyCheckIn, Habit, HabitLog, Quest
from .services import complete_quest, get_progress, log_habit_completion


class ProgressFlowTests(TestCase):
    def test_dashboard_renders(self):
        response = self.client.get(reverse("journal:dashboard"))

        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "QuestLog")
        self.assertContains(response, "Create quest")

    def test_completing_a_quest_awards_xp_once(self):
        quest = Quest.objects.create(title="Morning walk", xp_reward=25)

        first = complete_quest(quest, completed_at=timezone.now())
        second = complete_quest(quest, completed_at=timezone.now())

        progress = get_progress()
        quest.refresh_from_db()

        self.assertTrue(first)
        self.assertFalse(second)
        self.assertIsNotNone(quest.completed_at)
        self.assertEqual(progress.total_xp, 25)
        self.assertEqual(progress.level, 1)

    def test_logging_a_habit_once_per_day_preserves_history_and_streak(self):
        habit = Habit.objects.create(title="No late-night sugar", kind=Habit.Kind.AVOID, xp_reward=10)
        first_day = date(2026, 3, 6)
        second_day = date(2026, 3, 7)

        first = log_habit_completion(habit, on_date=first_day)
        duplicate = log_habit_completion(habit, on_date=first_day)
        second = log_habit_completion(habit, on_date=second_day)

        habit.refresh_from_db()
        progress = get_progress()

        self.assertTrue(first)
        self.assertFalse(duplicate)
        self.assertTrue(second)
        self.assertEqual(habit.streak, 2)
        self.assertEqual(progress.total_xp, 20)
        self.assertEqual(HabitLog.objects.count(), 2)

    def test_daily_check_in_updates_existing_row_for_today(self):
        today = date(2026, 3, 7)
        url = reverse("journal:save_check_in")

        payload = {
            "daily_intention": "Protect the evening.",
            "if_then_plan": "If cravings hit, go for a short walk.",
            "craving_intensity": 4,
            "trigger_notes": "Stress after work.",
            "reflection": "Stayed steady.",
            "slip_happened": "",
        }

        updated_payload = {
            **payload,
            "reflection": "Updated reflection.",
            "slip_happened": "on",
        }

        with mock.patch("journal.views.timezone.localdate", return_value=today):
            first = self.client.post(url, payload)
            second = self.client.post(url, updated_payload)

        self.assertEqual(first.status_code, 302)
        self.assertEqual(second.status_code, 302)
        self.assertEqual(DailyCheckIn.objects.count(), 1)

        check_in = DailyCheckIn.objects.get()
        self.assertEqual(check_in.check_in_date, today)
        self.assertEqual(check_in.reflection, "Updated reflection.")
        self.assertTrue(check_in.slip_happened)
