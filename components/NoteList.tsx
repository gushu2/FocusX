import React, { useState } from 'react';
import type { Note } from '../types';
import { SearchIcon, PlusIcon } from './icons';

interface NoteWithSnippet extends Note {
  snippet: string;
}

interface NoteListProps {
  notes: NoteWithSnippet[];
  activeNoteId: string | null;
  onSelectNote: (noteId: string) => void;
  onAddNote: () => void;
  searchInputRef: React.RefObject<HTMLInputElement>;
}

const NoteList: React.FC<NoteListProps> = ({ notes, activeNoteId, onSelectNote, onAddNote, searchInputRef }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.snippet.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  return (
    <aside className="w-full md:w-96 bg-amber-100/60 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">All Notes</h2>
            <button
                onClick={onAddNote}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-semibold text-amber-950 bg-amber-400 rounded-lg shadow-sm hover:bg-amber-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 dark:text-white dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:focus-visible:ring-emerald-500 dark:focus-visible:ring-offset-slate-900 transition-colors"
                title="Create a New Note"
            >
                <PlusIcon className="h-5 w-5" />
                <span>New Note</span>
            </button>
        </div>
        <div className="relative">
          <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:ring-amber-500 focus:border-amber-500 dark:focus:ring-emerald-500 dark:focus:border-emerald-500 transition"
          />
        </div>
      </div>
      <div className="flex-grow overflow-y-auto p-2">
        {filteredNotes.length > 0 ? (
            <ul className="space-y-1">
            {filteredNotes.map(note => (
                <li key={note.id}>
                <button
                    onClick={() => onSelectNote(note.id)}
                    className={`w-full text-left p-3 rounded-lg transition-colors duration-150 ${
                    activeNoteId === note.id
                        ? 'bg-amber-200 dark:bg-emerald-900/60'
                        : 'hover:bg-amber-200/50 dark:hover:bg-slate-800/50'
                    }`}
                >
                    <h3 className={`font-semibold truncate ${activeNoteId === note.id ? 'text-amber-800 dark:text-emerald-200' : 'text-slate-800 dark:text-slate-200'}`}>{note.title}</h3>
                    <div className="flex justify-between items-center text-sm text-slate-500 dark:text-slate-400 mt-1.5">
                        <span>{formatDate(note.updatedAt)}</span>
                        <p className="truncate ml-2">{note.snippet || 'No content'}</p>
                    </div>
                </button>
                </li>
            ))}
            </ul>
        ) : (
            <div className="text-center py-10 px-4">
                <p className="text-slate-500">
                    {searchTerm ? `No notes found for "${searchTerm}"` : "No notes yet. Create one!"}
                </p>
            </div>
        )}
      </div>
    </aside>
  );
};

export default NoteList;