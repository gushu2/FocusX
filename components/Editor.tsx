import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Note } from '../types';
import { generateTextWithGemini, AIOperation } from '../services/geminiService';
import {
  BoldIcon, ItalicIcon, ListIcon, HeadingIcon, SparklesIcon,
  ShareIcon, LockIcon, DownloadIcon, NoteIcon
} from './icons';

interface EditorProps {
  note: Note | null;
  onContentChange: (noteId: string, newContent: string) => void;
  onTitleChange: (noteId: string, newTitle: string) => void;
  onAddNote: () => void;
}

const EditorToolbarButton: React.FC<{ onClick?: () => void; children: React.ReactNode, title: string, isActive?: boolean }> = ({ onClick, children, title, isActive }) => (
    <button
        onClick={onClick}
        title={title}
        className={`p-2 rounded-md transition-colors ${
            isActive
                ? 'bg-emerald-100 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-200'
                : 'text-slate-500 dark:text-slate-400 hover:bg-amber-200 dark:hover:bg-slate-700'
        }`}
    >
        {children}
    </button>
);

const Editor: React.FC<EditorProps> = ({ note, onContentChange, onTitleChange, onAddNote }) => {
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (note && editorRef.current) {
        if (editorRef.current.innerHTML !== note.content) {
            editorRef.current.innerHTML = note.content;
        }
    }
  }, [note]);

  const handleInput = useCallback(() => {
    if (note && editorRef.current) {
        onContentChange(note.id, editorRef.current.innerHTML);
    }
  }, [note, onContentChange]);

  const formatDoc = (cmd: string, value?: string) => {
    document.execCommand(cmd, false, value);
    editorRef.current?.focus();
    handleInput();
  };

  const handleAiAction = async (operation: AIOperation) => {
    if (!note || !editorRef.current) return;
    
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();
    const textToProcess = selectedText || editorRef.current.innerText;

    if (!textToProcess) {
      setAiError("Please select text or write something to use AI features.");
      setTimeout(() => setAiError(null), 3000);
      return;
    }

    setIsAiLoading(true);
    setAiError(null);
    try {
      const result = await generateTextWithGemini(operation, textToProcess);
      if (selectedText && selection) {
          const range = selection.getRangeAt(0);
          range.deleteContents();
          range.insertNode(document.createTextNode(result));
      } else {
          editorRef.current.innerHTML = `<p>${result.replace(/\n/g, '</p><p>')}</p>`;
      }
      handleInput();
// fix: Wrapped the catch block content in curly braces to fix syntax error.
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "An unknown AI error occurred.";
      setAiError(errorMessage);
    } finally {
      setIsAiLoading(false);
    }
  };

  if (!note) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500 dark:text-slate-400 bg-amber-100/60 dark:bg-slate-900 p-8">
        <NoteIcon className="h-20 w-20 text-slate-300 dark:text-slate-600 mb-4" />
        <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200">No Note Selected</h2>
        <p className="mt-2 max-w-sm">Choose a note from the list to start editing, or create a new one.</p>
        <button
          onClick={onAddNote}
          className="mt-6 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 rounded-lg shadow-sm hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 transition-colors"
        >
          Create a New Note
        </button>
      </div>
    );
  }

  return (
    <main className="flex-1 flex flex-col h-full overflow-hidden bg-amber-50 dark:bg-slate-900/70">
        <div className="flex items-center justify-between py-2 px-4 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
            <div className="flex items-center space-x-1">
                <EditorToolbarButton title="Bold" onClick={() => formatDoc('bold')}><BoldIcon className="h-5 w-5" /></EditorToolbarButton>
                <EditorToolbarButton title="Italic" onClick={() => formatDoc('italic')}><ItalicIcon className="h-5 w-5" /></EditorToolbarButton>
                <EditorToolbarButton title="Unordered List" onClick={() => formatDoc('insertUnorderedList')}><ListIcon className="h-5 w-5" /></EditorToolbarButton>
                <EditorToolbarButton title="Heading 2" onClick={() => formatDoc('formatBlock', 'h2')}><HeadingIcon className="h-5 w-5" /></EditorToolbarButton>
            </div>
            <div className="flex items-center space-x-1">
                <div className="relative group">
                    <EditorToolbarButton title="AI Tools"><SparklesIcon className="h-5 w-5 text-emerald-500 dark:text-emerald-400" /></EditorToolbarButton>
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 p-1">
                        <button onClick={() => handleAiAction('summarize')} className="block w-full text-left px-3 py-1.5 text-sm rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">Summarize</button>
                        <button onClick={() => handleAiAction('rewrite')} className="block w-full text-left px-3 py-1.5 text-sm rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">Rewrite</button>
                        <button onClick={() => handleAiAction('fix-grammar')} className="block w-full text-left px-3 py-1.5 text-sm rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">Fix Grammar</button>
                    </div>
                </div>
                <div className="h-6 border-l border-slate-200 dark:border-slate-700 mx-2"></div>
                <EditorToolbarButton title="Share Note (coming soon)" onClick={() => alert('Share functionality coming soon!')}><ShareIcon className="h-5 w-5" /></EditorToolbarButton>
                <EditorToolbarButton title="Password Protect (premium)" onClick={() => alert('Password protection is a premium feature.')}><LockIcon className="h-5 w-5" /></EditorToolbarButton>
                <EditorToolbarButton title="Export (premium)" onClick={() => alert('Exporting is a premium feature.')}><DownloadIcon className="h-5 w-5" /></EditorToolbarButton>
            </div>
        </div>
        
        {isAiLoading && <div className="p-2 text-sm text-center bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 transition-opacity">AI is thinking...</div>}
        {aiError && <div className="p-2 text-sm text-center bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200 transition-opacity">{aiError}</div>}
        
        <div className="flex-grow overflow-y-auto" key={note.id}>
            <div className="max-w-3xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
                <input 
                    type="text"
                    value={note.title}
                    onChange={(e) => onTitleChange(note.id, e.target.value)}
                    placeholder="Note Title"
                    className="w-full text-3xl sm:text-4xl font-extrabold bg-transparent outline-none mb-8 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 tracking-tight"
                />
                <div
                    ref={editorRef}
                    contentEditable
                    onInput={handleInput}
                    className="prose prose-lg dark:prose-invert max-w-none focus:outline-none"
                    dangerouslySetInnerHTML={{ __html: note.content }}
                >
                </div>
            </div>
        </div>
    </main>
  );
};

export default Editor;