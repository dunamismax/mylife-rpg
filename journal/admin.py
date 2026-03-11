from django.contrib import admin

from .models import DailyCheckIn, Habit, HabitLog, Progress, Quest


@admin.register(Progress)
class ProgressAdmin(admin.ModelAdmin):
    list_display = ("level", "total_xp", "updated_at")

    def has_add_permission(self, request):
        return super().has_add_permission(request) and not Progress.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(Quest)
class QuestAdmin(admin.ModelAdmin):
    list_display = ("title", "difficulty", "xp_reward", "completed_at")
    list_filter = ("difficulty",)
    search_fields = ("title", "notes")


@admin.register(Habit)
class HabitAdmin(admin.ModelAdmin):
    list_display = ("title", "kind", "current_streak_display", "last_completed_on", "xp_reward")
    list_filter = ("kind",)
    search_fields = ("title", "notes")

    @admin.display(description="current streak")
    def current_streak_display(self, obj):
        return obj.current_streak


@admin.register(HabitLog)
class HabitLogAdmin(admin.ModelAdmin):
    list_display = ("habit", "logged_on", "xp_awarded", "created_at")
    list_filter = ("logged_on",)


@admin.register(DailyCheckIn)
class DailyCheckInAdmin(admin.ModelAdmin):
    list_display = ("check_in_date", "daily_intention", "slip_happened", "updated_at")
    list_filter = ("slip_happened", "check_in_date")
