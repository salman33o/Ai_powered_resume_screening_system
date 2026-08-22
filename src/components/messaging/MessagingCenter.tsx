import React, { useState } from 'react';
import { 
  DirectMessage, 
  UserRole, 
  AuthUser, 
  JobRequirement 
} from '../../types';
import { 
  MessageSquare, 
  Send, 
  Building2, 
  User, 
  Sparkles, 
  CheckCircle2, 
  Briefcase, 
  Clock, 
  Search, 
  ArrowRight, 
  ShieldCheck 
} from 'lucide-react';

interface MessagingCenterProps {
  messages: DirectMessage[];
  currentRole: UserRole;
  currentUser: AuthUser | null;
  jobs: JobRequirement[];
  activeJob: JobRequirement;
  onSendMessage: (message: Omit<DirectMessage, 'id' | 'timestamp' | 'isRead'>) => void;
  onSelectJobForContext?: (job: JobRequirement) => void;
}

export const MessagingCenter: React.FC<MessagingCenterProps> = ({
  messages,
  currentRole,
  currentUser,
  jobs,
  activeJob,
  onSendMessage,
  onSelectJobForContext
}) => {
  const [selectedThreadId, setSelectedThreadId] = useState<string>('');
  const [replyText, setReplyText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const threads = React.useMemo(() => {
    const map = new Map<string, {
      threadId: string;
      jobId: string;
      jobTitle: string;
      companyName: string;
      otherPartyName: string;
      otherPartyRole: UserRole;
      otherPartyId: string;
      lastMessage: DirectMessage;
      messages: DirectMessage[];
      unreadCount: number;
    }>();

    messages.forEach((m) => {
      const isSender = m.senderId === (currentUser?.id || (currentRole === 'candidate' ? 'cand-1' : 'rec-1'));
      const otherPartyName = isSender ? m.recipientName : m.senderName;
      const otherPartyRole = isSender ? m.recipientRole : m.senderRole;
      const otherPartyId = isSender ? m.recipientId : m.senderId;

      if (!map.has(m.threadId)) {
        map.set(m.threadId, {
          threadId: m.threadId,
          jobId: m.jobId,
          jobTitle: m.jobTitle,
          companyName: m.companyName,
          otherPartyName,
          otherPartyRole,
          otherPartyId,
          lastMessage: m,
          messages: [m],
          unreadCount: (!m.isRead && !isSender) ? 1 : 0
        });
      } else {
        const t = map.get(m.threadId)!;
        t.messages.push(m);
        if (new Date(m.timestamp) > new Date(t.lastMessage.timestamp)) {
          t.lastMessage = m;
        }
        if (!m.isRead && !isSender) {
          t.unreadCount += 1;
        }
      }
    });

    const list = Array.from(map.values());
    list.sort((a, b) => new Date(b.lastMessage.timestamp).getTime() - new Date(a.lastMessage.timestamp).getTime());
    return list;
  }, [messages, currentUser, currentRole]);

  const activeThread = threads.find(t => t.threadId === selectedThreadId) || threads[0] || null;

  const filteredThreads = threads.filter(t => 
    t.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.otherPartyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.lastMessage.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendReply = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!replyText.trim() || !activeThread) return;

    onSendMessage({
      threadId: activeThread.threadId,
      senderId: currentUser?.id || (currentRole === 'candidate' ? 'cand-1' : 'rec-1'),
      senderName: currentUser?.name || (currentRole === 'candidate' ? 'Alex Rivera' : 'Recruitment Team'),
      senderRole: currentRole,
      recipientId: activeThread.otherPartyId,
      recipientName: activeThread.otherPartyName,
      recipientRole: activeThread.otherPartyRole,
      jobId: activeThread.jobId,
      jobTitle: activeThread.jobTitle,
      companyName: activeThread.companyName,
      content: replyText.trim(),
      tags: ['Active Thread', activeThread.jobTitle]
    });

    setReplyText('');
  };

  const quickReplies = currentRole === 'candidate' ? [
    'Available for scheduled technical screen.',
    'Attached updated portfolio metrics.',
    'Clarifying remote / hybrid model terms.'
  ] : [
    'Confirming technical evaluation window.',
    'Please forward portfolio references.',
    'Application review in progress by committee.'
  ];

  return (
    <div className="space-y-4">
      
      {/* Header */}
      <div className="bg-[#131F30] rounded-lg p-4 border border-[#223348] flex flex-col md:flex-row md:items-center justify-between gap-3.5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-teal-400">Communication Terminal</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#0E1A29] text-[#8A97A8] border border-[#223348]">
              {threads.length} Active Channels
            </span>
          </div>
          <h2 className="text-lg font-bold text-[#E6EAF0] font-display mt-0.5">
            {currentRole === 'candidate' ? 'Candidate Communications Terminal' : 'Recruitment Inquiries & Communications Hub'}
          </h2>
          <p className="text-xs text-[#8A97A8] mt-0.5">
            Direct 2-way messaging ledger between applicants and hiring organizations.
          </p>
        </div>

        <div className="flex items-center space-x-2 font-mono text-xs">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-[#0E1A29] border border-[#223348] text-[#8A97A8]">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>Encrypted Ledger</span>
          </div>
        </div>
      </div>

      {/* Main Inbox Container */}
      <div className="bg-[#131F30] rounded-lg border border-[#223348] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[560px]">
        
        {/* Left Thread List (4 cols) */}
        <div className="lg:col-span-4 border-r border-[#223348] flex flex-col bg-[#0E1A29]">
          
          {/* Search bar */}
          <div className="p-2.5 border-b border-[#223348]">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#8A97A8] absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search messages, roles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-2.5 py-1.5 bg-[#131F30] rounded border border-[#223348] text-xs text-[#E6EAF0] placeholder-[#5B6B80] focus:outline-none focus:border-teal-500 font-mono"
              />
            </div>
          </div>

          {/* Thread list items */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#223348]">
            {filteredThreads.length === 0 ? (
              <div className="p-6 text-center text-[#5B6B80] text-xs font-mono space-y-1.5">
                <MessageSquare className="w-6 h-6 mx-auto text-[#5B6B80]" />
                <p>No active message threads.</p>
              </div>
            ) : (
              filteredThreads.map((t) => {
                const isSelected = activeThread?.threadId === t.threadId;
                return (
                  <div
                    key={t.threadId}
                    onClick={() => setSelectedThreadId(t.threadId)}
                    className={`p-3 transition-colors cursor-pointer ${
                      isSelected 
                        ? 'bg-[#17263B] border-l-2 border-teal-500' 
                        : 'hover:bg-[#131F30] border-l-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded bg-[#131F30] border border-[#223348] flex items-center justify-center text-teal-400 font-mono font-bold text-[10px]">
                          {t.otherPartyName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-xs text-[#E6EAF0] truncate max-w-[130px]">{t.otherPartyName}</p>
                          <p className="text-[10px] text-[#8A97A8] font-mono truncate max-w-[130px]">{t.companyName}</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono text-[#8A97A8]">
                        {new Date(t.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="mt-1.5 flex items-center justify-between font-mono">
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#0E1A29] text-teal-300 border border-[#223348] truncate max-w-[150px]">
                        {t.jobTitle}
                      </span>
                      {t.unreadCount > 0 && (
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                      )}
                    </div>

                    <p className="text-xs text-[#8A97A8] mt-1.5 line-clamp-1">
                      {t.lastMessage.content}
                    </p>
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* Right Chat Conversation (8 cols) */}
        <div className="lg:col-span-8 flex flex-col justify-between bg-[#131F30]">
          
          {activeThread ? (
            <>
              {/* Thread Header */}
              <div className="p-3 border-b border-[#223348] bg-[#0E1A29] flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded bg-[#131F30] border border-[#223348] flex items-center justify-center text-teal-400 font-mono font-bold text-xs">
                    {activeThread.otherPartyName.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-[#E6EAF0] text-xs font-display">{activeThread.otherPartyName}</h3>
                      <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.2 rounded bg-[#131F30] text-[#8A97A8] border border-[#223348]">
                        {activeThread.otherPartyRole}
                      </span>
                    </div>
                    <p className="text-[10px] font-mono text-[#8A97A8]">
                      Re: <span className="text-teal-300 font-semibold">{activeThread.jobTitle}</span> • {activeThread.companyName}
                    </p>
                  </div>
                </div>

                {onSelectJobForContext && (
                  <button
                    onClick={() => {
                      const matchedJob = jobs.find(j => j.id === activeThread.jobId);
                      if (matchedJob) onSelectJobForContext(matchedJob);
                    }}
                    className="hidden sm:flex items-center space-x-1 px-2.5 py-1 rounded bg-[#131F30] hover:bg-[#17263B] border border-[#223348] text-[11px] font-mono text-[#8A97A8] hover:text-[#E6EAF0] transition-colors cursor-pointer"
                  >
                    <span>View Role</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>

              {/* Chat Messages Stream */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 max-h-[380px]">
                {activeThread.messages.map((m) => {
                  const isMe = m.senderId === (currentUser?.id || (currentRole === 'candidate' ? 'cand-1' : 'rec-1'));
                  return (
                    <div 
                      key={m.id} 
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center space-x-1.5 mb-1 text-[10px] font-mono text-[#8A97A8]">
                        <span className="font-bold text-[#E6EAF0]">{isMe ? 'You' : m.senderName}</span>
                        <span>•</span>
                        <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      
                      <div className={`p-2.5 rounded max-w-lg text-xs leading-relaxed ${
                        isMe 
                          ? 'bg-teal-600 text-slate-950 font-medium' 
                          : 'bg-[#0E1A29] border border-[#223348] text-[#E6EAF0]'
                      }`}>
                        {m.content}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick AI Suggestions */}
              <div className="px-3.5 py-1.5 border-t border-[#223348] bg-[#0E1A29] flex items-center space-x-2 overflow-x-auto font-mono text-xs">
                <span className="text-[10px] text-[#8A97A8] shrink-0">Templates:</span>
                {quickReplies.map((r, rIdx) => (
                  <button
                    key={rIdx}
                    onClick={() => setReplyText(r)}
                    className="text-[10px] whitespace-nowrap px-2 py-0.5 rounded bg-[#131F30] hover:bg-[#17263B] border border-[#223348] text-[#8A97A8] hover:text-[#E6EAF0] transition-colors cursor-pointer"
                  >
                    {r}
                  </button>
                ))}
              </div>

              {/* Chat Input Footer */}
              <form onSubmit={handleSendReply} className="p-3 bg-[#0E1A29] border-t border-[#223348] flex items-center space-x-2 font-mono">
                <input
                  type="text"
                  required
                  placeholder={`Message ${activeThread.otherPartyName}...`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 bg-[#131F30] px-3 py-1.5 rounded border border-[#223348] text-xs text-[#E6EAF0] placeholder-[#5B6B80] focus:outline-none focus:border-teal-500 font-sans"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-slate-950 font-bold rounded text-xs transition-colors flex items-center space-x-1 cursor-pointer"
                >
                  <Send className="w-3 h-3" />
                  <span>Send</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[#5B6B80] text-xs font-mono space-y-2">
              <MessageSquare className="w-8 h-8 text-[#5B6B80]" />
              <h4 className="text-[#E6EAF0] font-bold">Select a Channel</h4>
              <p className="max-w-sm">
                Choose an active communication thread on the left to review ledger log history.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
