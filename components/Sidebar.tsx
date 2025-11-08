
import React, { useState } from 'react';
import type { Folder, Note } from '../types';
import { SearchIcon, FolderIcon, FileIcon, PlusIcon } from './icons';

interface SidebarProps {
  folders: Folder[];
  notes: Note[];
  activeNoteId: string | null;
  onSelectNote: (noteId: string) => void;
  onAddNote: (folderId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ folders, notes, activeNoteId, onSelectNote, onAddNote }) => {
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
        {folders.map(folder => (
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
            <ul className="mt-1 space-y-1">
              {filteredNotes
                .filter(note => note.folderId === folder.id)
                .map(note => (
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
          </div>
        ))}
      </div>
    </aside>
  );
};

export default Sidebar;