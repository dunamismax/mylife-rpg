from datetime import timedelta

from django.contrib import messages
from django.shortcuts import get_object_or_404, redirect, render
from django.utils import timezone
from django.views.decorators.http import require_GET, require_POST

from .forms import DailyCheckInForm, HabitForm, QuestForm
from .models import DailyCheckIn, Habit, HabitLog, Quest
from .services import complete_quest, get_progress, log_habit_completion


def _dashboard_context(*, quest_form=None, habit_form=None, check_in_form=None):
    today = timezone.localdate()
    today_check_in = DailyCheckIn.objects.filter(check_in_date=today).first()
    week_start = today - timedelta(days=today.weekday())

    return {
        "progress": get_progress(),
        "open_quests": Quest.objects.filter(completed_at__isnull=True).order_by("due_date", "-created_at"),
        "recently_completed_quests": Quest.objects.filter(completed_at__isnull=False).order_by(
            "-completed_at"
        )[:8],
        "habits": Habit.objects.all(),
        "recent_habit_logs": HabitLog.objects.select_related("habit")[:8],
        "today": today,
        "summary": {
            "open_quests": Quest.objects.filter(completed_at__isnull=True).count(),
            "quests_completed_this_week": Quest.objects.filter(
                completed_at__date__gte=week_start,
                completed_at__date__lte=today,
            ).count(),
            "habit_logs_this_week": HabitLog.objects.filter(
                logged_on__gte=week_start,
                logged_on__lte=today,
            ).count(),
            "check_in_done": today_check_in is not None,
        },
        "quest_form": quest_form or QuestForm(),
        "habit_form": habit_form or HabitForm(),
        "check_in_form": check_in_form or DailyCheckInForm(instance=today_check_in),
    }


@require_GET
def dashboard(request):
    return render(request, "journal/dashboard.html", _dashboard_context())


@require_POST
def create_quest(request):
    form = QuestForm(request.POST)
    if form.is_valid():
        form.save()
        messages.success(request, "Quest created.")
        return redirect("journal:dashboard")

    return render(request, "journal/dashboard.html", _dashboard_context(quest_form=form), status=400)


@require_POST
def complete_quest_view(request, quest_id):
    quest = get_object_or_404(Quest, pk=quest_id)
    if complete_quest(quest):
        messages.success(request, f"Completed quest: {quest.title}")
    else:
        messages.info(request, "That quest was already completed.")
    return redirect("journal:dashboard")


@require_POST
def create_habit(request):
    form = HabitForm(request.POST)
    if form.is_valid():
        form.save()
        messages.success(request, "Habit created.")
        return redirect("journal:dashboard")

    return render(request, "journal/dashboard.html", _dashboard_context(habit_form=form), status=400)


@require_POST
def log_habit_view(request, habit_id):
    habit = get_object_or_404(Habit, pk=habit_id)
    if log_habit_completion(habit):
        messages.success(request, f"Logged habit: {habit.title}")
    else:
        messages.info(request, "That habit is already logged for today.")
    return redirect("journal:dashboard")


@require_POST
def save_check_in(request):
    today = timezone.localdate()
    existing = DailyCheckIn.objects.filter(check_in_date=today).first()
    form = DailyCheckInForm(request.POST, instance=existing)

    if form.is_valid():
        check_in = form.save(commit=False)
        check_in.check_in_date = today
        check_in.save()
        messages.success(request, "Today's check-in was saved.")
        return redirect("journal:dashboard")

    return render(request, "journal/dashboard.html", _dashboard_context(check_in_form=form), status=400)
