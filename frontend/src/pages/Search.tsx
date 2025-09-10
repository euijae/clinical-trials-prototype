import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SearchBar } from '../components';
import {
  addMessage,
  appendMessageContent,
  selectMessages,
} from '../store/chatSlice';

export default function Search() {
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [draftAnswer, setDraftAnswer] = useState<string>('');
  
  const dispatch = useDispatch();
  const messages = useSelector(selectMessages);
  const streamTimer = useRef<number | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = (smooth = true) => {
    const node = endRef.current;
    if (node) node.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto' });
  };

  async function submit() {
    if (!query.trim()) return;
    setLoading(true);
    setDraftAnswer('');

    // stop any existing client-side stream
    if (streamTimer.current !== null) {
      clearInterval(streamTimer.current);
      streamTimer.current = null;
    }

    // store user's question immediately
    dispatch(addMessage({ role: 'user', content: query }));

    try {
      const res = await fetch('http://localhost:3001/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: query }),
      });

      const data = await res.json();
      const text: string = data.answer ?? data.response ?? data.error ?? 'No answer';
      
      // Start an assistant message placeholder to stream into
      const action = dispatch(addMessage({ role: 'assistant', content: '' }));
      const assistantId: string = action.payload.id;

      // Stream line-by-line (client-side) if text contains newlines
      const lines = String(text).split(/\r?\n/);
      let i = 0;
      streamTimer.current = window.setInterval(() => {
        setLoading(false);
        const chunk = (i > 0 ? '\n' : '') + lines[i++];
        dispatch(appendMessageContent({ id: assistantId, chunk }));
        
        // Keep viewport following the stream
        scrollToBottom();
        
        if (i >= lines.length && streamTimer.current !== null) {
          clearInterval(streamTimer.current);
          streamTimer.current = null;
        }
      }, 200);
      setDraftAnswer('');
      setQuery('');
    } catch (e: any) {
      const errMsg = e?.message ?? 'Request failed';
      setDraftAnswer(errMsg);
      setLoading(false);
    } finally {
      // loading is turned off when streaming completes or on error
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamTimer.current !== null) {
        clearInterval(streamTimer.current);
        streamTimer.current = null;
      }
    };
  }, []);

  // Auto-scroll on message updates
  useEffect(() => {
    scrollToBottom(false);
  }, [messages, draftAnswer, loading]);

  return (
    <section className="min-h-[calc(100vh-56px)]">
      <div className="mx-auto max-w-4xl px-4">
        {messages.length === 0 && (
            <header className="py-8">
                <p className="text-sm text-black/60">Type a query and press Enter. Our AI assistant will answer based on the preloaded dataset.</p>
            </header>  
        )}

        {/* chat column */}
        <div className="pb-28">
          <div className="mx-auto max-w-4xl space-y-3">
            {' '}
            {/* was max-w-3xl */}
            {messages.map((m, i) =>
              m.role === 'user' ? (
                <div key={m.id ?? i} className="flex justify-end">
                  <div className="max-w-[80%] rounded-2xl bg-blue-900 text-white px-4 py-2 whitespace-pre-wrap">
                    {m.content}
                  </div>
                </div>
              ) : (
                <div key={m.id ?? i} className="flex justify-start">
                  <div className="max-w-[100%] rounded-2xl bg-white px-4 py-3 whitespace-pre-wrap">
                    {m.content}
                  </div>
                </div>
              )
            )}
            {loading && (
              <div className="text-sm text-black/60">Searching ...</div>
            )}
            {draftAnswer && (
              <div className="flex justify-start">
                <div className="max-w-[100%] rounded-2xl border bg-white px-4 py-3 shadow-sm whitespace-pre-wrap">
                  {draftAnswer}
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
        </div>

        {/* fixed search bar uses SAME width */}
        <div className="fixed bottom-5 left-0 right-0 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
          <div className="mx-auto max-w-4xl px-4 py-3">
            <SearchBar value={query} onChange={setQuery} onSubmit={submit} />
          </div>
        </div>
      </div>
    </section>
  );
}
