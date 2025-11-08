import React, { useState, useCallback, useMemo } from 'react';
import NavSidebar from './NavSidebar';
import NoteList from './NoteList';
import Editor from './Editor';
import type { Note, Folder, User } from '../types';

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

const DashboardPage: React.FC<DashboardPageProps> = ({ theme, toggleTheme }) => {
    const [folders, setFolders] = useState<Folder[]>(initialFolders);
    const [notes, setNotes] = useState<Note[]>(initialNotes);
    const [activeNoteId, setActiveNoteId] = useState<string | null>(null);

    const handleSelectNote = (noteId: string) => {
        setActiveNoteId(noteId);
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
                userName={mockUser.name}
            />
            <div className="flex-grow flex overflow-hidden">
                <NoteList
                    notes={notesWithSnippets}
                    activeNoteId={activeNoteId}
                    onSelectNote={handleSelectNote}
                    onAddNote={handleAddNote}
                />
                <Editor 
                    note={activeNote}
                    onContentChange={handleContentChange}
                    onTitleChange={handleTitleChange}
                    onAddNote={handleAddNote}
                />
            </div>
        </div>
    );
};

export default DashboardPage;