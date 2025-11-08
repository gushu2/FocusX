import React, { useState, useEffect, useRef } from 'react';
import type { Note } from '../types';
import { generateTextWithGemini, AIOperation } from '../services/geminiService';
import { AiIcon, TrashIcon, SparklesIcon } from './icons';

interface EditorProps {
  note: Note;
  onUpdateNote: (note: Note) => void;
  onDeleteNote: (noteId: string) => void;
}

const Editor: React.FC<EditorProps> = ({ note, onUpdateNote, onDeleteNote }) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [isAiMenuOpen, setIsAiMenuOpen] = useState(false);
  const aiMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Debounced save
    const handler = setTimeout(() => {
      if (note.title !== title || note.content !== content) {
        onUpdateNote({ ...note, title, content });
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [title, content, note, onUpdateNote]);
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (aiMenuRef.current && !aiMenuRef.current.contains(event.target as Node)) {
        setIsAiMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAiAction = async (operation: AIOperation) => {
    if (!content.trim() || isAiLoading) return;
    setIsAiMenuOpen(false);
    setIsAiLoading(true);
    setAiError(null);
    try {
      const result = await generateTextWithGemini(operation, content);
      setContent(result);
    } catch (error: any) {
      setAiError(error.message || 'An unknown error occurred.');
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-2xl font-bold bg-transparent focus:outline-none w-full text-gray-900 dark:text-white"
          placeholder="Note Title"
        />
        <div className="flex items-center space-x-2">
           <div className="relative" ref={aiMenuRef}>
            <button 
              onClick={() => setIsAiMenuOpen(prev => !prev)}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
            >
              <AiIcon className="h-5 w-5" />
            </button>
            {isAiMenuOpen && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-10 p-2">
                <button onClick={() => handleAiAction('summarize')} className="w-full text-left px-3 py-1.5 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700">Summarize</button>
                <button onClick={() => handleAiAction('rewrite')} className="w-full text-left px-3 py-1.5 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700">Rewrite</button>
                <button onClick={() => handleAiAction('fix-grammar')} className="w-full text-left px-3 py-1.5 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700">Fix Grammar</button>
              </div>
            )}
           </div>
          <button 
            onClick={() => onDeleteNote(note.id)}
            className="p-2 rounded-md hover:bg-red-100 dark:hover:bg-red-900/50 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-500"
            title="Delete note"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </header>
      <div className="flex-grow p-6 overflow-y-auto">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-full bg-transparent text-lg text-gray-800 dark:text-gray-300 leading-relaxed focus:outline-none resize-none"
          placeholder="Start writing..."
        />
        {isAiLoading && <div className="flex items-center text-sm text-gray-500 mt-2"><SparklesIcon className="h-4 w-4 mr-2 animate-pulse" />Thinking...</div>}
        {aiError && <div className="text-sm text-red-500 mt-2">{aiError}</div>}
      </div>
    </div>
  );
};

export default Editor;