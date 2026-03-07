from django.urls import path

from . import views

app_name = "journal"

urlpatterns = [
    path("", views.dashboard, name="dashboard"),
    path("quests/create/", views.create_quest, name="create_quest"),
    path("quests/<int:quest_id>/complete/", views.complete_quest_view, name="complete_quest"),
    path("habits/create/", views.create_habit, name="create_habit"),
    path("habits/<int:habit_id>/log/", views.log_habit_view, name="log_habit"),
    path("check-in/save/", views.save_check_in, name="save_check_in"),
]
