const MIN_NOTE_LEN = 3;

export function validateTradeNotes(notes: {
  noteContext?: string;
  noteMistake?: string;
  noteNextAction?: string;
}): string | null {
  const fields = [
    { key: "Context", value: notes.noteContext?.trim() ?? "" },
    { key: "Mistake", value: notes.noteMistake?.trim() ?? "" },
    { key: "Next action", value: notes.noteNextAction?.trim() ?? "" },
  ];

  for (const field of fields) {
    if (field.value.length < MIN_NOTE_LEN) {
      return `${field.key} note must be at least ${MIN_NOTE_LEN} characters.`;
    }
  }
  return null;
}
