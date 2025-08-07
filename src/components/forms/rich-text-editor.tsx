'use client';

import * as React from 'react';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Link,
  Quote,
  Type,
  Eye,
  Edit,
  Maximize2,
  Minimize2,
  Undo2,
  Redo2
  // AlignLeft,
  // AlignCenter,
  // AlignRight - kept for future alignment features
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Textarea } from './form-field';

// Simple markdown-like text processor
const processText = (text: string): string => {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // **bold**
    .replace(/\*(.*?)\*/g, '<em>$1</em>') // *italic*
    .replace(/^- (.*)$/gm, '<li>$1</li>') // - bullet points
    .replace(/^(\d+\.) (.*)$/gm, '<li>$1</li>') // 1. numbered lists
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>') // [text](url)
    .replace(/^> (.*)$/gm, '<blockquote>$1</blockquote>') // > quotes
    .replace(/\n/g, '<br>'); // line breaks
};

// Kept for future bidirectional conversion features
// const unprocessText = (html: string): string => {
//   return html
//     .replace(/<strong>(.*?)<\/strong>/g, '**$1**')
//     .replace(/<em>(.*?)<\/em>/g, '*$1*')
//     .replace(/<li>(.*?)<\/li>/g, '- $1')
//     .replace(/<a href="([^"]+)"[^>]*>(.*?)<\/a>/g, '[$2]($1)')
//     .replace(/<blockquote>(.*?)<\/blockquote>/g, '> $1')
//     .replace(/<br\s*\/?>/g, '\n');
// };

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  error?: boolean;
  warning?: boolean;
  success?: boolean;
  className?: string;
  minHeight?: number;
  maxHeight?: number;
  showPreview?: boolean;
  allowFullscreen?: boolean;
  suggestions?: string[];
}

export function RichTextEditor({
  value = '',
  onChange,
  placeholder = "Enter description...",
  error,
  warning,
  success,
  className,
  minHeight = 120,
  maxHeight = 300,
  showPreview = true,
  allowFullscreen = true,
  suggestions = []
}: RichTextEditorProps) {
  const [isPreview, setIsPreview] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [history, setHistory] = React.useState<string[]>([value]);
  const [historyIndex, setHistoryIndex] = React.useState(0);
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  
  // Update history on value change
  const updateHistory = React.useCallback((newValue: string) => {
    if (newValue !== history[historyIndex]) {
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newValue);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    }
  }, [history, historyIndex]);

  const handleChange = (newValue: string) => {
    onChange?.(newValue);
    updateHistory(newValue);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      const historyValue = history[newIndex];
      if (historyValue) {
        onChange?.(historyValue);
      }
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      const historyValue = history[newIndex];
      if (historyValue) {
        onChange?.(historyValue);
      }
    }
  };

  // Text formatting functions
  const insertAtCursor = (before: string, after = '', placeholder = 'text') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const textToInsert = selectedText || placeholder;
    
    const newValue = 
      value.substring(0, start) + 
      before + textToInsert + after + 
      value.substring(end);
    
    handleChange(newValue);
    
    // Reset cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + textToInsert.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const formatBold = () => insertAtCursor('**', '**', 'bold text');
  const formatItalic = () => insertAtCursor('*', '*', 'italic text');
  const insertBulletList = () => insertAtCursor('\n- ', '', 'list item');
  const insertNumberedList = () => insertAtCursor('\n1. ', '', 'list item');
  const insertLink = () => insertAtCursor('[', '](url)', 'link text');
  const insertQuote = () => insertAtCursor('\n> ', '', 'quote');

  // Suggestion handling
  const insertSuggestion = (suggestion: string) => {
    const newValue = value + (value.endsWith('\n') ? '' : '\n') + '- ' + suggestion;
    handleChange(newValue);
    setShowSuggestions(false);
    textareaRef.current?.focus();
  };

  const editorStyles = cn(
    "border rounded-lg bg-white",
    error && "border-red-300",
    warning && "border-amber-300",
    success && "border-green-300",
    !error && !warning && !success && "border-gray-300",
    isFullscreen && "fixed inset-4 z-50 shadow-2xl",
    className
  );

  return (
    <>
      {/* Fullscreen overlay */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black/50 z-40" />
      )}
      
      <div className={editorStyles}>
        {/* Toolbar */}
        <div className="flex items-center justify-between p-2 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-1">
            {/* Undo/Redo */}
            <button
              type="button"
              onClick={handleUndo}
              disabled={historyIndex === 0}
              className="p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded disabled:opacity-50"
              title="Undo"
            >
              <Undo2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleRedo}
              disabled={historyIndex === history.length - 1}
              className="p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded disabled:opacity-50"
              title="Redo"
            >
              <Redo2 className="w-4 h-4" />
            </button>
            
            <div className="w-px h-6 bg-gray-300 mx-1" />
            
            {/* Formatting */}
            <button
              type="button"
              onClick={formatBold}
              className="p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded"
              title="Bold (**text**)"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={formatItalic}
              className="p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded"
              title="Italic (*text*)"
            >
              <Italic className="w-4 h-4" />
            </button>
            
            <div className="w-px h-6 bg-gray-300 mx-1" />
            
            {/* Lists */}
            <button
              type="button"
              onClick={insertBulletList}
              className="p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded"
              title="Bullet list (- item)"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={insertNumberedList}
              className="p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded"
              title="Numbered list (1. item)"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
            
            <div className="w-px h-6 bg-gray-300 mx-1" />
            
            {/* Link & Quote */}
            <button
              type="button"
              onClick={insertLink}
              className="p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded"
              title="Link ([text](url))"
            >
              <Link className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={insertQuote}
              className="p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded"
              title="Quote (> text)"
            >
              <Quote className="w-4 h-4" />
            </button>

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <>
                <div className="w-px h-6 bg-gray-300 mx-1" />
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowSuggestions(!showSuggestions)}
                    className="p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded"
                    title="Suggestions"
                  >
                    <Type className="w-4 h-4" />
                  </button>
                  
                  {showSuggestions && (
                    <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                      <div className="p-2 text-xs text-gray-500 border-b">
                        Suggested achievements:
                      </div>
                      {suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => insertSuggestion(suggestion)}
                          className="w-full p-2 text-left text-sm hover:bg-gray-50 border-b border-gray-100 last:border-0"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Preview toggle */}
            {showPreview && (
              <button
                type="button"
                onClick={() => setIsPreview(!isPreview)}
                className={cn(
                  "p-1.5 rounded",
                  isPreview 
                    ? "text-launch-blue bg-launch-blue/10" 
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-200"
                )}
                title={isPreview ? "Edit mode" : "Preview mode"}
              >
                {isPreview ? <Edit className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            )}

            {/* Fullscreen toggle */}
            {allowFullscreen && (
              <button
                type="button"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-1.5 text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded"
                title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            )}
          </div>
        </div>

        {/* Content area */}
        <div 
          className="relative"
          style={{ 
            minHeight: isFullscreen ? 400 : minHeight,
            maxHeight: isFullscreen ? 'calc(100vh - 200px)' : maxHeight
          }}
        >
          {isPreview ? (
            // Preview mode
            <div 
              className="p-4 prose prose-sm max-w-none overflow-y-auto h-full"
              dangerouslySetInnerHTML={{ __html: processText(value) }}
            />
          ) : (
            // Edit mode
            <Textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => handleChange(e.target.value)}
              placeholder={placeholder}
              className="border-0 resize-none rounded-none focus:ring-0 h-full"
              style={{ 
                minHeight: isFullscreen ? 400 : minHeight,
                maxHeight: isFullscreen ? 'calc(100vh - 200px)' : maxHeight
              }}
            />
          )}
        </div>

        {/* Footer with tips */}
        <div className="p-2 border-t border-gray-200 bg-gray-50 text-xs text-gray-500">
          <div className="flex items-center justify-between">
            <div>
              Supports: **bold**, *italic*, - bullets, 1. numbers, [links](url), &gt; quotes
            </div>
            <div>
              {value.length} characters
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Simpler text editor without rich features
interface SimpleTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  error?: boolean;
  warning?: boolean;
  success?: boolean;
  className?: string;
  rows?: number;
  showCharCount?: boolean;
  maxLength?: number;
  suggestions?: string[];
}

export function SimpleTextEditor({
  value = '',
  onChange,
  placeholder = "Enter text...",
  error,
  warning,
  success,
  className,
  rows = 4,
  showCharCount = false,
  maxLength,
  suggestions = []
}: SimpleTextEditorProps) {
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const insertSuggestion = (suggestion: string) => {
    const newValue = value + (value ? '\n' : '') + suggestion;
    onChange?.(newValue);
    setShowSuggestions(false);
    textareaRef.current?.focus();
  };

  return (
    <div className={cn("relative", className)}>
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        {...(error && { error })}
        {...(warning && { warning })}
        {...(success && { success })}
        rows={rows}
        maxLength={maxLength}
        className="pr-20"
      />

      {/* Suggestions button */}
      {suggestions.length > 0 && (
        <div className="absolute top-2 right-2">
          <button
            type="button"
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
            title="Show suggestions"
          >
            <Type className="w-4 h-4" />
          </button>
          
          {showSuggestions && (
            <div className="absolute top-full right-0 mt-1 w-64 bg-white border border-gray-200 rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
              <div className="p-2 text-xs text-gray-500 border-b">
                Suggestions:
              </div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => insertSuggestion(suggestion)}
                  className="w-full p-2 text-left text-sm hover:bg-gray-50 border-b border-gray-100 last:border-0"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Character count */}
      {showCharCount && (
        <div className="absolute bottom-2 right-2 text-xs text-gray-500">
          {value.length}{maxLength && `/${maxLength}`}
        </div>
      )}
    </div>
  );
}