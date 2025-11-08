import React, { useState } from 'react';
import type { Folder, Note } from '../types';
import { SearchIcon, FolderIcon, PlusIcon } from './icons';
import NoteList from './NoteList';

interface SidebarProps {
  folders: Folder[];
  notes: Note[];
  activeNoteId: string | null;
  onSelectNote: (noteId: string) => void;
  onAddNote: (folderId: string) => void;
  onCreateFolder: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ folders, notes, activeNoteId, onSelectNote, onAddNote, onCreateFolder }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <aside className="w-full md:w-80 bg-gray-50 dark:bg-gray-950 border-r border-gray-200 dark:border-gray-800 flex flex-col h-full">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm focus:ring-amber-500 focus:border-amber-500 dark:focus:ring-emerald-500 dark:focus:border-emerald-500"
          />
        </div>
      </div>
      <div className="flex-grow overflow-y-auto">
        {folders.length > 0 ? (
          folders.map(folder => (
            <div key={folder.id} className="p-2">
              <div className="flex justify-between items-center px-2 py-1">
                <div className="flex items-center space-x-2">
                  <FolderIcon className="h-5 w-5 text-gray-500" />
                  <span className="font-semibold text-sm text-gray-700 dark:text-gray-300">{folder.name}</span>
                </div>
                <button 
                  onClick={() => onAddNote(folder.id)}
                  className="p-1 rounded text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-600 dark:hover:text-gray-200"
                  title={`New note in ${folder.name}`}
                >
                  <PlusIcon className="h-4 w-4" />
                </button>
              </div>
              <NoteList
                notes={filteredNotes.filter(note => note.folderId === folder.id)}
                activeNoteId={activeNoteId}
                onSelectNote={onSelectNote}
              />
            </div>
          ))
        ) : (
          <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>No folders yet. Create one to get started!</p>
          </div>
        )}
      </div>
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={onCreateFolder}
          className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm font-semibold rounded-lg text-gray-600 dark:text-gray-300 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
          <span>New Folder</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;