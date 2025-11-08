import React, { useState, useCallback, useMemo, useRef } from 'react';
import NavSidebar from './NavSidebar';
import NoteList from './NoteList';
import Editor from './Editor';
import type { Note, Folder, User } from '../types';
import ThemeToggle from './ThemeToggle';
import { XIcon } from './icons';

const initialFolders: Folder[] = [
    { id: 'f1', name: 'My First Folder' },
];

const initialNotes: Note[] = [];

const mockUser: User = {
    id: 'u1',
    name: 'Alex',
    email: 'alex@example.com',
    plan: 'Creator',
};

const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
};

interface DashboardPageProps {
  theme: string;
  toggleTheme: () => void;
}

const SettingsModal: React.FC<{ isOpen: boolean; onClose: () => void; theme: string; toggleTheme: () => void; }> = ({ isOpen, onClose, theme, toggleTheme }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md m-4" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Settings</h3>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"><XIcon className="h-5 w-5"/></button>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span className="text-slate-700 dark:text-slate-300">Theme</span>
                        <div className="flex items-center space-x-2">
                           <span className="text-sm text-slate-500">{theme === 'light' ? 'Light' : 'Dark'}</span>
                           <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                        </div>
                    </div>
                     <div className="flex items-center justify-between opacity-50">
                        <span className="text-slate-700 dark:text-slate-300">Editor Font Size</span>
                        <span className="text-sm text-slate-500">Coming soon</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

const DashboardPage: React.FC<DashboardPageProps> = ({ theme, toggleTheme }) => {
    const [folders, setFolders] = useState<Folder[]>(initialFolders);
    const [notes, setNotes] = useState<Note[]>(initialNotes);
    const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const handleSelectNote = (noteId: string) => {
        setActiveNoteId(noteId);
    };

    const handleFocusSearch = () => {
        searchInputRef.current?.focus();
    };

    const handleAddNote = () => {
        const folderId = folders[0]?.id || 'f1';
        if (folders.length === 0) {
            setFolders([{ id: 'f1', name: 'My First Folder' }]);
        }
        const newNote: Note = {
            id: `n${Date.now()}`,
            folderId,
            title: 'Untitled Note',
            content: '<p>Start your masterpiece...</p>',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        setNotes(prev => [newNote, ...prev]);
        setActiveNoteId(newNote.id);
    };
    
    const handleContentChange = useCallback((noteId: string, newContent: string) => {
        setNotes(prevNotes => 
            prevNotes.map(note =>
                note.id === noteId ? { ...note, content: newContent, updatedAt: new Date().toISOString() } : note
            )
        );
    }, []);
    
    const handleTitleChange = useCallback((noteId: string, newTitle: string) => {
        setNotes(prevNotes =>
            prevNotes.map(note =>
                note.id === noteId ? { ...note, title: newTitle || 'Untitled Note', updatedAt: new Date().toISOString() } : note
            )
        );
    }, []);

    const activeNote = useMemo(() => notes.find(note => note.id === activeNoteId) || null, [notes, activeNoteId]);
    
    const notesWithSnippets = useMemo(() => {
        return notes.map(note => ({
            ...note,
            snippet: stripHtml(note.content).substring(0, 100)
        })).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
    }, [notes]);

    return (
        <div className="h-screen w-screen flex bg-amber-50 dark:bg-slate-900">
            <NavSidebar
                theme={theme}
                toggleTheme={toggleTheme}
                user={mockUser}
                onOpenSettings={() => setIsSettingsOpen(true)}
                onFocusSearch={handleFocusSearch}
            />
            <div className="flex-grow flex overflow-hidden">
                <NoteList
                    notes={notesWithSnippets}
                    activeNoteId={activeNoteId}
                    onSelectNote={handleSelectNote}
                    onAddNote={handleAddNote}
                    searchInputRef={searchInputRef}
                />
                <Editor 
                    note={activeNote}
                    onContentChange={handleContentChange}
                    onTitleChange={handleTitleChange}
                    onAddNote={handleAddNote}
                />
            </div>
            <SettingsModal 
                isOpen={isSettingsOpen} 
                onClose={() => setIsSettingsOpen(false)} 
                theme={theme}
                toggleTheme={toggleTheme}
            />
        </div>
    );
};

export default DashboardPage;