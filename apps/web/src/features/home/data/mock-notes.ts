export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export const mockNotes: Note[] = [
  {
    id: "1",
    title: "Weekly team sync notes",
    content:
      "Discussed Q3 roadmap priorities. Design system rollout is on track for next sprint. Need to follow up with backend team on the notes API timeline.",
    createdAt: "2026-09-22T09:30:00.000Z",
  },
  {
    id: "2",
    title: "Product launch checklist",
    content:
      "1. Finalize pricing page copy\n2. QA the onboarding flow on mobile\n3. Confirm analytics events are firing\n4. Schedule the announcement email",
    createdAt: "2026-09-20T14:05:00.000Z",
  },
  {
    id: "3",
    title: "Ideas for onboarding flow",
    content:
      "What if we let users skip profile setup and come back to it later? Could reduce drop-off. Worth testing against the current required-step version.",
    createdAt: "2026-09-18T11:15:00.000Z",
  },
];
