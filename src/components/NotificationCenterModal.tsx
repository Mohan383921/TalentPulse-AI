import React, { useState } from 'react';
import { NotificationItem } from '../types';
import { 
  Bell, 
  Check, 
  CheckCheck, 
  Trash2, 
  X, 
  UserPlus, 
  FileUp, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Sparkles,
  MailCheck
} from 'lucide-react';

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
}

export function NotificationCenterModal({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onClearAll
}: NotificationCenterModalProps) {
  const [filterCategory, setFilterCategory] = useState<string>('All');

  if (!isOpen) return null;

  const filtered = filterCategory === 'All' 
    ? notifications 
    : notifications.filter(n => n.category === filterCategory);

  const unreadCount = notifications.filter(n => !n.read).length;

  const getCategoryIcon = (category: NotificationItem['category']) => {
    switch (category) {
      case 'Candidate Registered': return <UserPlus className="w-4 h-4 text-indigo-500" />;
      case 'Resume Uploaded': return <FileUp className="w-4 h-4 text-blue-500" />;
      case 'Interview Scheduled': return <Calendar className="w-4 h-4 text-purple-500" />;
      case 'Interview Completed': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'Offer Accepted': return <MailCheck className="w-4 h-4 text-emerald-500" />;
      case 'Offer Rejected': return <XCircle className="w-4 h-4 text-rose-500" />;
      case 'AI Screening Completed': return <Sparkles className="w-4 h-4 text-amber-500" />;
      default: return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Enterprise Notification Center</h2>
              <p className="text-xs text-slate-500">{unreadCount} unread notification(s)</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Category Filters */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 text-xs">
          <div className="flex items-center space-x-1">
            {['All', 'Candidate Registered', 'Resume Uploaded', 'Interview Scheduled', 'Offer Accepted'].map(cat => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition-colors whitespace-nowrap ${
                  filterCategory === cat 
                    ? 'bg-indigo-600 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Action Header */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <button 
            onClick={onMarkAllAsRead} 
            className="flex items-center space-x-1 text-indigo-600 font-bold hover:underline"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark all as read</span>
          </button>

          <button 
            onClick={onClearAll} 
            className="flex items-center space-x-1 text-rose-600 font-semibold hover:underline"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear history</span>
          </button>
        </div>

        {/* Notification List */}
        <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
          {filtered.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">No notifications in this category</div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => onMarkAsRead(item.id)}
                className={`p-3 rounded-xl border flex items-start justify-between gap-3 transition-all cursor-pointer ${
                  item.read 
                    ? 'bg-slate-50/60 border-slate-200 opacity-75' 
                    : 'bg-indigo-50/40 border-indigo-200 shadow-sm'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div className="mt-0.5">{getCategoryIcon(item.category)}</div>
                  <div className="space-y-0.5">
                    <h3 className="text-xs font-bold text-slate-900">{item.title}</h3>
                    <p className="text-[11px] text-slate-600">{item.message}</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-1">{item.timestamp}</p>
                  </div>
                </div>

                {!item.read && (
                  <span className="w-2 h-2 rounded-full bg-indigo-600 flex-shrink-0 mt-1.5" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
