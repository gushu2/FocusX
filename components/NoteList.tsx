import React from 'react';
import type { Note } from '../types';
import { FileIcon } from './icons';

interface NoteListProps {
  notes: Note[];
  activeNoteId: string | null;
  onSelectNote: (noteId: string) => void;
}

const NoteList: React.FC<NoteListProps> = ({ notes, activeNoteId, onSelectNote }) => {
  if (notes.length === 0) {
    return (
      <div className="px-2 pt-1 text-xs text-gray-500 dark:text-gray-400">
        No notes in this folder.
      </div>
    );
  }

  return (
    <ul className="mt-1 space-y-1">
      {notes.map(note => (
        <li key={note.id}>
          <button
            onClick={() => onSelectNote(note.id)}
            className={`w-full text-left flex items-center space-x-2 px-2 py-1.5 text-sm rounded-md transition-colors ${
              activeNoteId === note.id
                ? 'bg-amber-200 text-amber-800 dark:bg-emerald-900/50 dark:text-emerald-300'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
            }`}
          >
            <FileIcon className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">{note.title}</span>
          </button>
        </li>
      ))}
    </ul>
  );
};

export default NoteList;
