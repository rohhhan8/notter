export const OUTPUT_SCHEMA_INSTRUCTIONS = `OUTPUT SCHEMA CONTRACT:
You must output a single JSON object with two top-level keys:
- "title": A short string (3-8 words) identifying the note.
- "document": A Tiptap-compatible JSON document object:
  {
    "type": "doc",
    "content": [ ...nodes... ]
  }

ALLOWED NODE TYPES & SPECIFICATIONS:
1. "heading":
   - attrs: { "level": 1 | 2 | 3 }
   - content: text nodes
2. "paragraph":
   - content: text nodes or marks
3. "bulletList":
   - content: array of "listItem" nodes
4. "orderedList":
   - attrs: { "start": 1 }
   - content: array of "listItem" nodes
5. "listItem":
   - content: array of "paragraph" nodes
6. "taskList":
   - content: array of "taskItem" nodes
7. "taskItem":
   - attrs: { "checked": false | true }
   - content: array of "paragraph" nodes
8. "blockquote":
   - content: array of "paragraph" nodes
9. "codeBlock":
   - attrs: { "language": "typescript" | "javascript" | "python" | "bash" | "json" | "sql" | "text" }
   - content: [ { "type": "text", "text": "code here" } ]
10. "callout":
    - attrs: { "type": "takeaway" | "info" | "important" | "warning" }
    - content: array of "paragraph" nodes
11. "horizontalRule":
    - leaf node (no content)
12. "table":
    - content: array of "tableRow" nodes
13. "tableRow":
    - content: array of "tableHeader" or "tableCell" nodes
14. "tableHeader" / "tableCell":
    - content: array of "paragraph" nodes

ALLOWED MARKS (on text nodes):
- "bold": { "type": "bold" }
- "italic": { "type": "italic" }
- "code": { "type": "code" }
- "strike": { "type": "strike" }
- "highlight": { "type": "highlight", "attrs": { "color": "#fef08a" | "#bbf7d0" | "#fed7aa" | "#bfdbfe" } }

Text node structure:
{
  "type": "text",
  "text": "Your text here",
  "marks": [ { "type": "bold" } ] // optional
}

CRITICAL RULES:
- Never return raw HTML tags like <b>, <i>, <p>, or <div className="...">.
- Use "callout" with type "takeaway" for key summary takeaways or conclusions.
- Use "taskList" with "taskItem" for actionable follow-ups, to-dos, or next steps.
- Every "listItem" and "taskItem" MUST wrap its text in a "paragraph" node.`;
