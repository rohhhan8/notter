import type { NoteMode } from "@notter/types";
import { GENERAL_MODE_CONTRACT } from "./general";
import { SCHOOL_MODE_CONTRACT } from "./school";
import { LECTURE_MODE_CONTRACT } from "./lecture";
import { UNIVERSITY_MODE_CONTRACT } from "./university";
import { RESEARCH_MODE_CONTRACT } from "./research";
import { TECHNICAL_MODE_CONTRACT } from "./technical";
import { MEETING_MODE_CONTRACT } from "./meeting";
import { IDEA_MODE_CONTRACT } from "./idea";

export const MODE_CONTRACTS: Record<NoteMode, string> = {
  general: GENERAL_MODE_CONTRACT,
  school: SCHOOL_MODE_CONTRACT,
  lecture: LECTURE_MODE_CONTRACT,
  university: UNIVERSITY_MODE_CONTRACT,
  research: RESEARCH_MODE_CONTRACT,
  technical: TECHNICAL_MODE_CONTRACT,
  meeting: MEETING_MODE_CONTRACT,
  idea: IDEA_MODE_CONTRACT,
};

export function getModeContract(mode: NoteMode): string {
  return MODE_CONTRACTS[mode] ?? GENERAL_MODE_CONTRACT;
}
