export async function recordScenarioAttempt(input: {
  scenarioId: string;
  correct: number;
  total: number;
  percent: number;
}): Promise<void> {
  try {
    await fetch("/api/scenario-attempts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(input),
    });
  } catch {
    // ignore
  }
}
