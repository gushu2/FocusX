import React, { useState, useEffect, useRef } from 'react';
import type { Note } from '../types';
import { generateTextWithGemini, AIOperation } from '../services/geminiService';
import { AiIcon, TrashIcon, SparklesIcon, CheckIcon, Heading1Icon, Heading2Icon, ListIcon } from './icons';

interface EditorProps {
  note: Note;
  onUpdateNote: (note: Note) => void;
  onDeleteNote: (noteId: string) => void;
}

const ToolbarButton: React.FC<{ onClick: () => void; children: React.ReactNode; title: string; }> = ({ onClick, children, title }) => (
  <button
    onClick={onClick}
    title={title}
    className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
  >
    {children}
  </button>
);

const EditorToolbar: React.FC<{ onFormat: (command: string, value?: string) => void }> = ({ onFormat }) => (
  <div className="flex-shrink-0 px-4 py-2 border-b border-gray-200 dark:border-gray-800 flex items-center space-x-2">
    <ToolbarButton title="Heading 1" onClick={() => onFormat('formatBlock', '<h1>')}>
        <Heading1Icon className="h-5 w-5" />
    </ToolbarButton>
    <ToolbarButton title="Heading 2" onClick={() => onFormat('formatBlock', '<h2>')}>
        <Heading2Icon className="h-5 w-5" />
    </ToolbarButton>
    <ToolbarButton title="Bulleted List" onClick={() => onFormat('insertUnorderedList')}>
        <ListIcon className="h-5 w-5" />
    </ToolbarButton>
  </div>
);


const Editor: React.FC<EditorProps> = ({ note, onUpdateNote, onDeleteNote }) => {
  const [title, setTitle] = useState(note.title);
  const [content, setContent] = useState(note.content);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [isAiMenuOpen, setIsAiMenuOpen] = useState(false);
  const [showSaveConfirmation, setShowSaveConfirmation] = useState(false);
  const saveTimeoutRef = useRef<number | null>(null);
  const aiMenuRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Debounced save
    const handler = setTimeout(() => {
      // Check if editor content is different from note prop content
      if (note.title !== title || note.content !== content) {
        onUpdateNote({ ...note, title, content });

        setShowSaveConfirmation(true);
        if (saveTimeoutRef.current) {
          clearTimeout(saveTimeoutRef.current);
        }
        saveTimeoutRef.current = window.setTimeout(() => {
          setShowSaveConfirmation(false);
        }, 2000);
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [title, content, note, onUpdateNote]);

  // Cleanup confirmation timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, []);
  
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
      const result = await generateTextWithGemini(operation, editorRef.current?.innerText || content);
      setContent(result);
    } catch (error: any) {
      setAiError(error.message || 'An unknown error occurred.');
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleFormat = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if(editorRef.current) {
        setContent(editorRef.current.innerHTML);
    }
  };

  // Check if editor content is effectively empty to show placeholder
  const isEditorEmpty = !content.replace(/<[^>]*>/g, '').trim();

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
        <div className="flex items-center space-x-4">
          <div className={`transition-opacity duration-300 ${showSaveConfirmation ? 'opacity-100' : 'opacity-0'}`}>
              <div className="flex items-center space-x-1 text-sm text-gray-400 dark:text-gray-500">
                  <CheckIcon className="h-4 w-4" />
                  <span>Saved</span>
              </div>
          </div>
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
        </div>
      </header>
      <EditorToolbar onFormat={handleFormat} />
      {/* fix: Fix placeholder attribute on contentEditable div by conditionally rendering a placeholder element. */}
      <div className="flex-grow p-6 overflow-y-auto relative">
        {isEditorEmpty && (
          <div className="absolute top-6 left-6 text-lg text-gray-500 dark:text-gray-400 pointer-events-none">
            Start writing...
          </div>
        )}
        <div
          ref={editorRef}
          contentEditable
          onInput={(e) => setContent(e.currentTarget.innerHTML)}
          dangerouslySetInnerHTML={{ __html: content }}
          className="w-full h-full editor-content text-lg text-gray-800 dark:text-gray-300 leading-relaxed focus:outline-none"
        />
        {isAiLoading && <div className="flex items-center text-sm text-gray-500 mt-2"><SparklesIcon className="h-4 w-4 mr-2 animate-pulse" />Thinking...</div>}
        {aiError && <div className="text-sm text-red-500 mt-2">{aiError}</div>}
      </div>
    </div>
  );
};

export default Editor;
