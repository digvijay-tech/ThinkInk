/************** SKILL RELATED DETAILS **************/
export const skills = ["Professional Writing", "Critical Thinking & Behavioral Writing", "Creative & Persuasive Writing", "Academic & Technical Writing"];

export const taskMap = new Map<string, string[]>();

taskMap.set("Professional Writing", [
  "Short Memo",
  "Performance Review Feedback",
  "Meeting Summary",
  "Project Proposal",
  "Resignation Letter",
  "Cover Letter",
  "Customer Support Response",
  "Apology Letter",
  "Company Announcement",
  "Fundraising Request",
]);

taskMap.set("Critical Thinking & Behavioral Writing", [
  "Ethical Dilemma Response",
  "Crisis Management Statement",
  "Negotiation Email",
  "Diversity & Inclusion Statement",
  "Conflict Resolution Response",
  "Decision Justification",
  "Team Motivation Message",
  "Public Apology Statement",
]);

taskMap.set("Creative & Persuasive Writing", ["Product Review", "Persuasive Argumen", "Storytelling Exercise", "Speech Drafting"]);

taskMap.set("Academic & Technical Writing", ["Technical Documentation", "Case Study Report", "Lesson Plan", "Policy Drafting"]);
