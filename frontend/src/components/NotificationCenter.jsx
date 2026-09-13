import React, { useState } from 'react';
import { Bell, CheckCheck, Sparkles, MessageSquare, Video, ShieldAlert, Briefcase } from 'lucide-react';

export default function NotificationCenter({ notifications, markAsRead, unreadCount, onSelectMatch }) {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState('ALL');

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'SWIPE_MATCH':
        return <Sparkles className="h-4 w-4 text-emerald-400" />;
      case 'NEW_STARTUP':
        return <MessageSquare className="h-4 w-4 text-cyan-400" />;
      case 'MEETING':
        return <Video className="h-4 w-4 text-rose-400" />;
      case 'JOB_APPLICATION':
        return <Briefcase className="h-4 w-4 text-purple-400" />;
      default:
        return <ShieldAlert className="h-4 w-4 text-amber-400" />;
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'UNREAD') return !n.isRead;
    return true;
  });

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-xl border border-white/10 bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white transition-all"
        title="In-App Notifications"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white shadow-lg shadow-emerald-500/50 animate-bounce">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown Panel */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl border border-white/10 bg-slate-900/95 backdrop-blur-2xl shadow-2xl z-50 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 bg-slate-800/40">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-emerald-400" />
                <h3 className="font-semibold text-sm text-white">Notifications</h3>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30">
                  {unreadCount} new
                </span>
              </div>
              <button
                onClick={() => markAsRead(null)}
                className="flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-emerald-400 transition-colors"
              >
                <CheckCheck className="h-3.5 w-3.5" />
                Mark all read
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex border-b border-white/10 px-3 bg-slate-950/40 text-xs">
              <button
                onClick={() => setFilter('ALL')}
                className={`px-3 py-2 font-medium transition-colors ${filter === 'ALL' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-slate-400 hover:text-slate-200'}`}
              >
                All ({notifications.length})
              </button>
              <button
                onClick={() => setFilter('UNREAD')}
                className={`px-3 py-2 font-medium transition-colors ${filter === 'UNREAD' ? 'text-emerald-400 border-b-2 border-emerald-400' : 'text-slate-400 hover:text-slate-200'}`}
              >
                Unread ({unreadCount})
              </button>
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto divide-y divide-white/5">
              {filteredNotifications.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  No notifications to show.
                </div>
              ) : (
                filteredNotifications.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => {
                      markAsRead(n.id);
                      if (n.category === 'SWIPE_MATCH' || n.category === 'MEETING') {
                        onSelectMatch();
                        setIsOpen(false);
                      }
                    }}
                    className={`flex items-start gap-3 p-3.5 transition-all cursor-pointer hover:bg-white/5 ${
                      !n.isRead ? 'bg-emerald-500/5' : ''
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-slate-800/80 border border-white/5 mt-0.5">
                      {getCategoryIcon(n.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs font-semibold text-slate-100 truncate">{n.title}</p>
                        <span className="text-[10px] text-slate-500">{n.time}</span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">{n.message}</p>
                    </div>
                    {!n.isRead && (
                      <span className="h-2 w-2 rounded-full bg-emerald-400 mt-2 shrink-0"></span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
