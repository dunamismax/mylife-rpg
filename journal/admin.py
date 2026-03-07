from django.contrib import admin

from .models import DailyCheckIn, Habit, HabitLog, Progress, Quest


@admin.register(Progress)
class ProgressAdmin(admin.ModelAdmin):
    list_display = ("level", "total_xp", "updated_at")


@admin.register(Quest)
class QuestAdmin(admin.ModelAdmin):
    list_display = ("title", "cadence", "difficulty", "xp_reward", "completed_at")
    list_filter = ("cadence", "difficulty")
    search_fields = ("title", "notes")


@admin.register(Habit)
class HabitAdmin(admin.ModelAdmin):
    list_display = ("title", "kind", "streak", "last_completed_on", "xp_reward")
    list_filter = ("kind",)
    search_fields = ("title", "notes")


@admin.register(HabitLog)
class HabitLogAdmin(admin.ModelAdmin):
    list_display = ("habit", "logged_on", "xp_awarded", "created_at")
    list_filter = ("logged_on",)


@admin.register(DailyCheckIn)
class DailyCheckInAdmin(admin.ModelAdmin):
    list_display = ("check_in_date", "daily_intention", "slip_happened", "updated_at")
    list_filter = ("slip_happened", "check_in_date")
