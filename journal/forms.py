from django import forms

from .models import DailyCheckIn, Habit, Quest


class DateInput(forms.DateInput):
    input_type = "date"


class QuestForm(forms.ModelForm):
    class Meta:
        model = Quest
        fields = ["title", "notes", "difficulty", "due_date", "xp_reward"]
        widgets = {
            "notes": forms.Textarea(attrs={"rows": 3}),
            "due_date": DateInput(),
        }


class HabitForm(forms.ModelForm):
    class Meta:
        model = Habit
        fields = ["title", "notes", "kind", "xp_reward"]
        widgets = {
            "notes": forms.Textarea(attrs={"rows": 3}),
        }


class DailyCheckInForm(forms.ModelForm):
    class Meta:
        model = DailyCheckIn
        fields = [
            "daily_intention",
            "if_then_plan",
            "craving_intensity",
            "trigger_notes",
            "reflection",
            "slip_happened",
        ]
        widgets = {
            "trigger_notes": forms.Textarea(attrs={"rows": 3}),
            "reflection": forms.Textarea(attrs={"rows": 3}),
        }
