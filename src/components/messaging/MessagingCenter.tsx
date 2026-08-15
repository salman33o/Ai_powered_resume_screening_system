import React, { useState } from 'react';
import { 
  DirectMessage, 
  UserRole, 
  AuthUser, 
  JobRequirement,
  StructuredResume
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
  Filter,
  ArrowRight,
  ShieldCheck,
  Star
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

  // Group messages into threads
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

  // Default select first thread
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
    'Thank you for the update! I am available any weekday morning for an interview.',
    'I have attached my latest portfolio and certifications for your review.',
    'Could you clarify if this position offers remote or hybrid flexibility?'
  ] : [
    'Thanks for reaching out! We would like to schedule a 30-min technical screen.',
    'Could you please share your GitHub / portfolio link and notice period?',
    'Our hiring team has reviewed your application and will follow up shortly.'
  ];

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Direct Inquiries & Hiring Channels</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
              {threads.length} Active Conversations
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            {currentRole === 'candidate' ? 'Direct Candidate-to-Company Messages' : 'Candidate Communications & Inquiries Hub'}
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Real-time, 2-way verified messaging between applicants and hiring companies for posted roles.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Encrypted Direct ATS Channel</span>
          </div>
        </div>
      </div>

      {/* Main Inbox Container */}
      <div className="bg-slate-900/90 rounded-3xl border border-slate-800 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px] shadow-2xl">
        
        {/* Left Thread List (4 cols) */}
        <div className="lg:col-span-4 border-r border-slate-800 flex flex-col bg-slate-950/50">
          
          {/* Search bar */}
          <div className="p-3.5 border-b border-slate-800">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search messages, roles, companies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-900 rounded-xl border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Thread list items */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-900 custom-scrollbar">
            {filteredThreads.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-xs space-y-2">
                <MessageSquare className="w-8 h-8 mx-auto text-slate-600" />
                <p>No active message threads yet.</p>
                <p className="text-[10px]">When candidate or recruiter sends a message on a job posting, it will appear here.</p>
              </div>
            ) : (
              filteredThreads.map((t) => {
                const isSelected = activeThread?.threadId === t.threadId;
                return (
                  <div
                    key={t.threadId}
                    onClick={() => setSelectedThreadId(t.threadId)}
                    className={`p-4 transition-all cursor-pointer ${
                      isSelected 
                        ? 'bg-indigo-950/30 border-l-4 border-indigo-500' 
                        : 'hover:bg-slate-900/80 border-l-4 border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400 font-bold text-xs">
                          {t.otherPartyName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-xs text-white truncate max-w-[140px]">{t.otherPartyName}</p>
                          <p className="text-[10px] text-slate-400 truncate max-w-[140px]">{t.companyName}</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-500">
                        {new Date(t.lastMessage.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-900 text-indigo-300 border border-slate-800 truncate max-w-[160px]">
                        {t.jobTitle}
                      </span>
                      {t.unreadCount > 0 && (
                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                      )}
                    </div>

                    <p className="text-xs text-slate-300 mt-2 line-clamp-1">
                      {t.lastMessage.content}
                    </p>
                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* Right Chat Conversation (8 cols) */}
        <div className="lg:col-span-8 flex flex-col justify-between bg-slate-900/40">
          
          {activeThread ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-slate-800 bg-slate-950/40 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 p-0.5">
                    <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center text-white font-bold text-xs">
                      {activeThread.otherPartyName.slice(0, 2).toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-bold text-white text-sm">{activeThread.otherPartyName}</h3>
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {activeThread.otherPartyRole}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      Re: <span className="text-indigo-300 font-semibold">{activeThread.jobTitle}</span> • {activeThread.companyName}
                    </p>
                  </div>
                </div>

                {onSelectJobForContext && (
                  <button
                    onClick={() => {
                      const matchedJob = jobs.find(j => j.id === activeThread.jobId);
                      if (matchedJob) onSelectJobForContext(matchedJob);
                    }}
                    className="hidden sm:flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 transition-colors cursor-pointer"
                  >
                    <span>View Role Req</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Chat Messages Stream */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4 max-h-[380px] custom-scrollbar">
                {activeThread.messages.map((m) => {
                  const isMe = m.senderId === (currentUser?.id || (currentRole === 'candidate' ? 'cand-1' : 'rec-1'));
                  return (
                    <div 
                      key={m.id} 
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center space-x-1.5 mb-1 text-[10px] text-slate-400">
                        <span className="font-bold text-slate-300">{isMe ? 'You' : m.senderName}</span>
                        <span>•</span>
                        <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      
                      <div className={`p-3.5 rounded-2xl max-w-lg text-xs leading-relaxed shadow-md ${
                        isMe 
                          ? 'bg-indigo-600 text-white rounded-br-none' 
                          : 'bg-slate-950 border border-slate-800 text-slate-100 rounded-bl-none'
                      }`}>
                        {m.content}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick AI Suggestions */}
              <div className="px-5 py-2 border-t border-slate-800/80 bg-slate-950/60 flex items-center space-x-2 overflow-x-auto">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="text-[10px] font-bold text-slate-400 shrink-0">Quick Responses:</span>
                {quickReplies.map((r, rIdx) => (
                  <button
                    key={rIdx}
                    onClick={() => setReplyText(r)}
                    className="text-[10px] whitespace-nowrap px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  >
                    {r.length > 40 ? r.slice(0, 40) + '...' : r}
                  </button>
                ))}
              </div>

              {/* Chat Input Footer */}
              <form onSubmit={handleSendReply} className="p-4 bg-slate-950 border-t border-slate-800 flex items-center space-x-3">
                <input
                  type="text"
                  required
                  placeholder={`Write your direct message to ${activeThread.otherPartyName}...`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="flex-1 bg-slate-900 px-4 py-2.5 rounded-2xl border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold rounded-2xl text-xs transition-all shadow-lg shadow-indigo-600/25 flex items-center space-x-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Reply</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-500 text-xs space-y-3">
              <MessageSquare className="w-12 h-12 text-slate-700" />
              <h4 className="text-white font-bold text-sm">Select a Conversation</h4>
              <p className="max-w-sm">
                Choose an active candidate or company message thread on the left to review communication history and respond.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
