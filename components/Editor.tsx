import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Note } from '../types';
import { generateTextWithGemini, AIOperation } from '../services/geminiService';
import {
  BoldIcon, ItalicIcon, ListIcon, HeadingIcon, SparklesIcon,
  ShareIcon, LockIcon, DownloadIcon, NoteIcon, XIcon, CheckIcon
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
                ? 'bg-amber-200 dark:bg-emerald-800 text-amber-800 dark:text-emerald-200'
                : 'text-slate-500 dark:text-slate-400 hover:bg-amber-200 dark:hover:bg-slate-700'
        }`}
    >
        {children}
    </button>
);

const Editor: React.FC<EditorProps> = ({ note, onContentChange, onTitleChange, onAddNote }) => {
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  
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
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "An unknown AI error occurred.";
      setAiError(errorMessage);
    } finally {
      setIsAiLoading(false);
    }
  };

  const downloadFile = (filename: string, content: string, mimeType: string) => {
    const element = document.createElement('a');
    const file = new Blob([content], { type: mimeType });
    element.href = URL.createObjectURL(file);
    element.download = filename;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
    document.body.removeChild(element);
  };

  const convertHtmlToMarkdown = (html: string) => {
    return html
      .replace(/<h2>(.*?)<\/h2>/g, '## $1\n\n')
      .replace(/<h3>(.*?)<\/h3>/g, '### $1\n\n')
      .replace(/<p>(.*?)<\/p>/g, '$1\n\n')
      .replace(/<b>(.*?)<\/b>/g, '**$1**')
      .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
      .replace(/<i>(.*?)<\/i>/g, '*$1*')
      .replace(/<em>(.*?)<\/em>/g, '*$1*')
      .replace(/<ul>(.*?)<\/ul>/gs, (match, p1) => p1.replace(/<li>(.*?)<\/li>/g, '- $1\n').trim() + '\n\n')
      .replace(/<br\s*\/?>/g, '\n')
      .replace(/&nbsp;/g, ' ')
      .replace(/<[^>]+>/g, '') // Strip remaining tags
      .trim();
  };

  const handleExport = (format: 'txt' | 'md') => {
    if (!note || !editorRef.current) return;
    const title = note.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'untitled_note';
    const filename = `${title}.${format}`;

    if (format === 'txt') {
        const content = editorRef.current.innerText;
        downloadFile(filename, content, 'text/plain');
    } else if (format === 'md') {
        const content = convertHtmlToMarkdown(editorRef.current.innerHTML);
        downloadFile(filename, content, 'text/markdown');
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
          className="mt-6 px-4 py-2 text-sm font-semibold text-white bg-amber-500 rounded-lg shadow-sm hover:bg-amber-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 dark:bg-emerald-600 dark:hover:bg-emerald-700 dark:focus-visible:ring-emerald-500 dark:focus-visible:ring-offset-slate-900 transition-colors"
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
                    <EditorToolbarButton title="AI Tools"><SparklesIcon className="h-5 w-5 text-amber-500 dark:text-emerald-400" /></EditorToolbarButton>
                    <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 p-1">
                        <button onClick={() => handleAiAction('summarize')} className="block w-full text-left px-3 py-1.5 text-sm rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">Summarize</button>
                        <button onClick={() => handleAiAction('rewrite')} className="block w-full text-left px-3 py-1.5 text-sm rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">Rewrite</button>
                        <button onClick={() => handleAiAction('fix-grammar')} className="block w-full text-left px-3 py-1.5 text-sm rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">Fix Grammar</button>
                    </div>
                </div>
                <div className="h-6 border-l border-slate-200 dark:border-slate-700 mx-2"></div>
                <EditorToolbarButton title="Share Note" onClick={() => setIsShareModalOpen(true)}><ShareIcon className="h-5 w-5" /></EditorToolbarButton>
                <EditorToolbarButton title="Password Protect (premium)" onClick={() => setIsPasswordModalOpen(true)}><LockIcon className="h-5 w-5" /></EditorToolbarButton>
                <div className="relative group">
                    <EditorToolbarButton title="Export (premium)"><DownloadIcon className="h-5 w-5" /></EditorToolbarButton>
                     <div className="absolute top-full right-0 mt-2 w-48 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10 p-1">
                        <button onClick={() => handleExport('txt')} className="block w-full text-left px-3 py-1.5 text-sm rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">Export as Text (.txt)</button>
                        <button onClick={() => handleExport('md')} className="block w-full text-left px-3 py-1.5 text-sm rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700">Export as Markdown (.md)</button>
                    </div>
                </div>
            </div>
        </div>
        
        {isAiLoading && <div className="p-2 text-sm text-center bg-amber-100 text-amber-800 dark:bg-emerald-900/50 dark:text-emerald-200 transition-opacity">AI is thinking...</div>}
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
        
        {isShareModalOpen && <ShareModal noteId={note.id} onClose={() => setIsShareModalOpen(false)} />}
        {isPasswordModalOpen && <PasswordModal onClose={() => setIsPasswordModalOpen(false)} />}
    </main>
  );
};

const ShareModal: React.FC<{noteId: string; onClose: () => void}> = ({ noteId, onClose }) => {
    const shareUrl = `${window.location.origin}/share/${noteId}`;
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-md m-4" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Share Note</h3>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"><XIcon className="h-5 w-5"/></button>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Anyone with this link can view the note. (This is a demo)</p>
                <div className="flex items-center space-x-2">
                    <input type="text" readOnly value={shareUrl} className="w-full px-3 py-2 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md text-sm" />
                    <button onClick={handleCopy} className={`px-4 py-2 text-sm font-semibold text-white rounded-md shadow-sm transition-colors ${copied ? 'bg-emerald-600' : 'bg-amber-500 hover:bg-amber-600 dark:bg-emerald-600 dark:hover:bg-emerald-700'}`}>
                        {copied ? <CheckIcon className="h-5 w-5" /> : 'Copy'}
                    </button>
                </div>
            </div>
        </div>
    );
};

const PasswordModal: React.FC<{onClose: () => void}> = ({ onClose }) => {
    return (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 w-full max-w-sm m-4" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Protect Note</h3>
                    <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"><XIcon className="h-5 w-5"/></button>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Set a password to encrypt this note. This is a premium feature.</p>
                <input type="password" placeholder="Enter password..." className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-md text-sm mb-4" />
                <button onClick={onClose} className="w-full px-4 py-2 text-sm font-semibold text-white bg-amber-500 hover:bg-amber-600 dark:bg-emerald-600 dark:hover:bg-emerald-700 rounded-md shadow-sm">Set Password</button>
            </div>
        </div>
    );
}

export default Editor;