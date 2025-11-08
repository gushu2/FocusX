import React, { useState, useEffect, useCallback, useMemo } from 'react';
import type { Note, Folder, User } from '../types';
import NavSidebar from './NavSidebar';
import Sidebar from './Sidebar';
import Editor from './Editor';
import SettingsModal from './SettingsModal';

// Mock Data moved outside the component to prevent re-creation on re-renders
const FOLDERS: Folder[] = [];
const NOTES: Note[] = [];

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
    // Select the first note by default
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
    setFolders(prevFolders => {
      const newFolder: Folder = {
        id: `folder-${Date.now()}`,
        name: `New Folder ${prevFolders.length + 1}`,
      };
      return [...prevFolders, newFolder];
    });
  }, []);
  
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
          <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
            <p>Select a note to start editing or create a new one.</p>
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