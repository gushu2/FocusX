import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { Note, Folder, User } from '../types';
import NavSidebar from './NavSidebar';
import Sidebar from './Sidebar';
import Editor from './Editor';
import SettingsModal from './SettingsModal';

// Mock Data: Added a default folder and a welcome note for a better initial experience.
const FOLDERS: Folder[] = [
  { id: 'folder-1', name: 'My First Folder' },
];

const NOTES: Note[] = [
  {
    id: 'note-1',
    title: 'Welcome to FocusX!',
    content: '<h1>Begin Your Journey</h1><p>This is your first note. Start organizing your thoughts, drafting your ideas, and finding your focus. You can edit or delete this note anytime.</p><ul><li>Create new notes using the plus icon in a folder.</li><li>Organize notes into different folders.</li><li>Use the toolbar above to format your text.</li></ul>',
    folderId: 'folder-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

interface DashboardPageProps {
  theme: string;
  toggleTheme: () => void;
  user: User;
  onUpdateUser: (updatedDetails: Partial<User>) => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({ theme, toggleTheme, user, onUpdateUser }) => {
  const [folders, setFolders] = useState<Folder[]>(FOLDERS);
  const [notes, setNotes] = useState<Note[]>(NOTES);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    // Select the first note by default if one isn't already selected.
    if (notes.length > 0 && !activeNoteId) {
      setActiveNoteId(notes[0].id);
    }
  }, [notes, activeNoteId]);

  const handleSelectNote = useCallback((noteId: string) => {
    setActiveNoteId(noteId);
  }, []);

  const handleAddNote = useCallback((folderId: string) => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: 'Untitled Note',
      content: '',
      folderId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes(prev => [newNote, ...prev]);
    setActiveNoteId(newNote.id);
  }, []);
  
  const handleUpdateNote = useCallback((updatedNote: Note) => {
    setNotes(notes => notes.map(n => n.id === updatedNote.id ? { ...updatedNote, updatedAt: new Date().toISOString() } : n));
  }, []);
  
  const handleDeleteNote = useCallback((noteId: string) => {
    setNotes(notes => {
      const remainingNotes = notes.filter(n => n.id !== noteId);
      if (activeNoteId === noteId) {
        setActiveNoteId(remainingNotes.length > 0 ? remainingNotes[0].id : null);
      }
      return remainingNotes;
    });
  }, [activeNoteId]);
  
  const handleCreateFolder = useCallback(() => {
    const newFolderName = `New Folder ${folders.length + 1}`;
    const newFolder: Folder = {
      id: `folder-${Date.now()}`,
      name: newFolderName,
    };
    setFolders(prevFolders => {
      return [...prevFolders, newFolder];
    });
  }, [folders.length]);
  
  const handleOpenSettings = useCallback(() => {
    setIsSettingsOpen(true);
  }, []);

  const handleCloseSettings = useCallback(() => {
    setIsSettingsOpen(false);
  }, []);

  const activeNote = useMemo(() => notes.find(note => note.id === activeNoteId) || null, [notes, activeNoteId]);

  return (
    <div className="flex h-full w-full bg-white dark:bg-gray-900">
      <NavSidebar
        theme={theme}
        toggleTheme={toggleTheme}
        user={user}
        onOpenSettings={handleOpenSettings}
        onFocusSearch={() => { /* Focus search in sidebar */ }}
      />
      <Sidebar
        folders={folders}
        notes={notes}
        activeNoteId={activeNoteId}
        onSelectNote={handleSelectNote}
        onAddNote={handleAddNote}
        onCreateFolder={handleCreateFolder}
      />
      <main className="flex-1 flex flex-col h-full">
        {activeNote ? (
          <Editor 
            key={activeNote.id} 
            note={activeNote} 
            onUpdateNote={handleUpdateNote} 
            onDeleteNote={handleDeleteNote}
          />
        ) : (
          <div className="flex-1 flex items-center justify-center text-center text-gray-500 dark:text-gray-400 p-8">
            <div>
              <h2 className="text-2xl font-semibold mb-2">No note selected</h2>
              <p>Select a note from the sidebar to start editing, or create a new folder and note to begin.</p>
            </div>
          </div>
        )}
      </main>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={handleCloseSettings}
        user={user}
        onUpdateUser={onUpdateUser}
        theme={theme}
        toggleTheme={toggleTheme}
      />
    </div>
  );
};

export default DashboardPage;