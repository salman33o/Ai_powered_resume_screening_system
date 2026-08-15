import React, { useState } from 'react';
import { 
  JobRequirement, 
  StructuredResume, 
  DirectMessage, 
  UserRole,
  AuthUser 
} from '../../types';
import { 
  MessageSquare, 
  Send, 
  X, 
  Building2, 
  Sparkles, 
  CheckCircle2, 
  Briefcase, 
  User, 
  Paperclip,
  Clock
} from 'lucide-react';

interface DirectMessagingModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetJob: JobRequirement;
  resume?: StructuredResume;
  currentUser: AuthUser | null;
  currentRole: UserRole;
  recipientName?: string;
  recipientId?: string;
  onSendMessage: (message: Omit<DirectMessage, 'id' | 'timestamp' | 'isRead'>) => void;
}

export const DirectMessagingModal: React.FC<DirectMessagingModalProps> = ({
  isOpen,
  onClose,
  targetJob,
  resume,
  currentUser,
  currentRole,
  recipientName,
  recipientId,
  onSendMessage
}) => {
  const [messageText, setMessageText] = useState('');
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen) return null;

  const effectiveRecipientName = recipientName || (currentRole === 'candidate' ? `${targetJob.company} Hiring Team` : 'Applicant');
  const effectiveRecipientId = recipientId || (currentRole === 'candidate' ? `recruiter-${targetJob.company.toLowerCase().replace(/\s+/g, '-')}` : 'candidate-usr');

  const quickTemplates = currentRole === 'candidate' ? [
    `Hi ${targetJob.company} team, I saw your opening for ${targetJob.title} and would love to connect regarding how my background aligns with this role.`,
    `Hello, I'm interested in the ${targetJob.title} position. Could you share more details about the interview process and target timeline?`,
    `Hi! I have 4+ years of relevant experience in ${targetJob.requiredSkills.slice(0, 3).join(', ')} and have applied. Excited to discuss next steps!`
  ] : [
    `Hi, we reviewed your resume for ${targetJob.title} and are very impressed with your profile! Are you available for a 20-min intro chat this week?`,
    `Hello! Thank you for applying for ${targetJob.title} at ${targetJob.company}. We'd love to learn more about your recent projects.`,
    `Hi, can you confirm your current work authorization and expected start date for the ${targetJob.title} role?`
  ];

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageText.trim()) return;

    onSendMessage({
      threadId: `thread-${targetJob.id}-${currentRole === 'candidate' ? currentUser?.id || 'cand-1' : effectiveRecipientId}`,
      senderId: currentUser?.id || (currentRole === 'candidate' ? 'cand-1' : 'rec-1'),
      senderName: currentUser?.name || (currentRole === 'candidate' ? resume?.fullName || 'Candidate' : 'Senior Hiring Manager'),
      senderRole: currentRole,
      recipientId: effectiveRecipientId,
      recipientName: effectiveRecipientName,
      recipientRole: currentRole === 'candidate' ? 'recruiter' : 'candidate',
      jobId: targetJob.id,
      jobTitle: targetJob.title,
      companyName: targetJob.company,
      content: messageText.trim(),
      candidateAtsScore: resume ? 88 : undefined,
      tags: ['Job Inquiry', targetJob.title]
    });

    setSentSuccess(true);
    setTimeout(() => {
      setMessageText('');
      setSentSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-indigo-950/70 via-slate-900 to-purple-950/60 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="text-sm font-bold text-white">
                  Direct Message {currentRole === 'candidate' ? 'to Company' : 'to Candidate'}
                </h3>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  Instant Channel
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {currentRole === 'candidate' ? `Inquiry regarding ${targetJob.title} at ${targetJob.company}` : `Communicating with ${effectiveRecipientName} for ${targetJob.title}`}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSend} className="p-5 space-y-4">
          
          {/* Job Target Badge */}
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2.5">
              <Building2 className="w-4 h-4 text-indigo-400" />
              <div>
                <p className="font-bold text-white">{targetJob.title}</p>
                <p className="text-[11px] text-slate-400">{targetJob.company} • {targetJob.location}</p>
              </div>
            </div>
            <span className="text-[10px] font-mono px-2 py-1 rounded-lg bg-slate-900 text-slate-300 border border-slate-800">
              {targetJob.salaryRange || 'Competitive'}
            </span>
          </div>

          {/* Quick AI Starter Templates */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold text-slate-400 flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-indigo-400" />
              <span>Quick Starter Templates</span>
            </label>
            <div className="space-y-1 max-h-28 overflow-y-auto custom-scrollbar">
              {quickTemplates.map((t, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setMessageText(t)}
                  className="w-full text-left p-2 rounded-xl bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800/80 text-[11px] text-slate-300 hover:text-white transition-all cursor-pointer truncate"
                >
                  "{t}"
                </button>
              ))}
            </div>
          </div>

          {/* Message Area */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Your Message</label>
            <textarea
              rows={4}
              required
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder={currentRole === 'candidate' ? "Introduce yourself, highlight key strengths, or ask about role requirements..." : "Write a direct update or interview invitation to the candidate..."}
              className="w-full bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Success Indicator */}
          {sentSuccess && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center space-x-2 text-xs text-emerald-300 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Message dispatched directly to {effectiveRecipientName}!</span>
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
            <span className="text-[10px] text-slate-500 flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>Direct 2-way communication channel</span>
            </span>

            <div className="flex space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!messageText.trim() || sentSuccess}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-600/30 flex items-center space-x-1.5 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Direct</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
