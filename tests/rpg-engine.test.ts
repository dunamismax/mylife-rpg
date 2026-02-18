import { describe, expect, test } from "bun:test";

import { demoState } from "../app/data/demo-state";
import { logHabitSlip, toggleHabit, toggleQuest } from "../app/lib/rpg-engine";

describe("rpg engine", () => {
  test("awards XP only once for quest completion", () => {
    const quest = demoState.quests.find((item) => !item.completed);
    if (!quest) {
      throw new Error("Expected a quest in demo state");
    }

    const first = toggleQuest(demoState, quest.id, new Date("2026-02-18T12:00:00.000Z"));
    const second = toggleQuest(first, quest.id, new Date("2026-02-18T12:05:00.000Z"));
    const third = toggleQuest(second, quest.id, new Date("2026-02-18T12:10:00.000Z"));

    expect(first.stats.xp).toBeGreaterThan(demoState.stats.xp);
    expect(third.stats.xp).toBe(first.stats.xp);
  });

  test("increments habit streak when completed on consecutive days", () => {
    const habit = demoState.habits.find((item) => item.type === "good");
    if (!habit) {
      throw new Error("Expected a good habit in demo state");
    }

    const nextDay = toggleHabit(demoState, habit.id, new Date("2026-02-19T08:00:00.000Z"));
    const updated = nextDay.habits.find((item) => item.id === habit.id);

    expect(updated?.streak).toBe(habit.streak + 1);
  });

  test("applies slip penalty once per day", () => {
    const habit = demoState.habits.find((item) => item.type === "bad");
    if (!habit) {
      throw new Error("Expected a bad habit in demo state");
    }

    const first = logHabitSlip(demoState, habit.id, new Date("2026-02-18T12:00:00.000Z"));
    const second = logHabitSlip(first, habit.id, new Date("2026-02-18T18:00:00.000Z"));

    expect(first.stats.hp).toBe(demoState.stats.hp - 2);
    expect(second.stats.hp).toBe(first.stats.hp);
    expect(second.statusEffects.length).toBe(first.statusEffects.length);
  });
});
