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
  CheckCircle2, 
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
    `Hi! I have relevant experience in ${targetJob.requiredSkills.slice(0, 3).join(', ')} and have applied. Excited to discuss next steps!`
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
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="bg-[#131F30] border border-[#223348] rounded-lg max-w-lg w-full shadow-lg overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-4 bg-[#0E1A29] border-b border-[#223348] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded bg-[#131F30] border border-[#223348] flex items-center justify-center text-teal-400">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xs font-bold text-[#E6EAF0] font-display">
                  Direct Channel {currentRole === 'candidate' ? 'to Company' : 'to Candidate'}
                </h3>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#131F30] text-teal-300 border border-teal-500/30">
                  Live
                </span>
              </div>
              <p className="text-[11px] text-[#8A97A8] font-mono">
                {currentRole === 'candidate' ? `${targetJob.title} — ${targetJob.company}` : `${effectiveRecipientName} — ${targetJob.title}`}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded text-[#8A97A8] hover:text-[#E6EAF0] hover:bg-[#131F30] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSend} className="p-4 space-y-3 font-mono text-xs">
          
          {/* Job Target Badge */}
          <div className="p-2.5 rounded bg-[#0E1A29] border border-[#223348] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Building2 className="w-3.5 h-3.5 text-teal-400" />
              <div>
                <p className="font-bold text-[#E6EAF0] font-sans">{targetJob.title}</p>
                <p className="text-[10px] text-[#8A97A8]">{targetJob.company} • {targetJob.location}</p>
              </div>
            </div>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#131F30] text-[#8A97A8] border border-[#223348]">
              {targetJob.salaryRange || 'Competitive'}
            </span>
          </div>

          {/* Quick Starter Templates */}
          <div className="space-y-1">
            <label className="text-[10px] text-[#8A97A8] block">
              Quick Templates
            </label>
            <div className="space-y-1 max-h-24 overflow-y-auto font-sans">
              {quickTemplates.map((t, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setMessageText(t)}
                  className="w-full text-left p-1.5 rounded bg-[#0E1A29] hover:bg-[#17263B] border border-[#223348] text-[11px] text-[#8A97A8] hover:text-[#E6EAF0] transition-colors cursor-pointer truncate"
                >
                  &quot;{t}&quot;
                </button>
              ))}
            </div>
          </div>

          {/* Message Area */}
          <div className="space-y-1">
            <label className="text-[10px] text-[#8A97A8] block">Message Content</label>
            <textarea
              rows={4}
              required
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder={currentRole === 'candidate' ? "Introduce yourself, highlight key strengths, or ask about role requirements..." : "Write a direct update or interview invitation to the candidate..."}
              className="w-full bg-[#0E1A29] p-2.5 rounded border border-[#223348] text-xs text-[#E6EAF0] placeholder-[#5B6B80] focus:outline-none focus:border-teal-500 resize-none font-sans"
            />
          </div>

          {/* Success Indicator */}
          {sentSuccess && (
            <div className="p-2 rounded bg-[#0E1A29] border border-teal-500/30 flex items-center space-x-1.5 text-xs text-teal-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
              <span>Message dispatched directly to {effectiveRecipientName}!</span>
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-[#223348]">
            <span className="text-[10px] text-[#5B6B80] flex items-center space-x-1">
              <Clock className="w-3 h-3" />
              <span>Direct 2-way ledger channel</span>
            </span>

            <div className="flex space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded text-xs font-semibold text-[#8A97A8] hover:text-[#E6EAF0] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!messageText.trim() || sentSuccess}
                className="px-3.5 py-1.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 text-slate-950 font-bold rounded text-xs transition-colors flex items-center space-x-1 cursor-pointer"
              >
                <Send className="w-3 h-3" />
                <span>Send</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
