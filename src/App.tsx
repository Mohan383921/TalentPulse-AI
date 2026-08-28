import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LoginView } from './components/LoginView';
import { DashboardView } from './components/DashboardView';
import { KanbanPipelineView } from './components/KanbanPipelineView';
import { JobsMatchingView } from './components/JobsMatchingView';
import { ResumeIngestionView } from './components/ResumeIngestionView';
import { AiAssistantView } from './components/AiAssistantView';
import { ExtractedResumeMatrixView } from './components/ExtractedResumeMatrixView';
import { AnalyticsView } from './components/AnalyticsView';
import { CandidateModal } from './components/CandidateModal';
import { QREntryModal } from './components/QREntryModal';
import { NotificationCenterModal } from './components/NotificationCenterModal';

import { Job, Candidate, AnalyticsData, UserProfile, NotificationItem } from './types';
import { getSupabaseClient } from './lib/supabase';

export default function App() {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('talentpulse_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [jobs, setJobs] = useState<Job[]>(() => {
    try {
      const saved = localStorage.getItem('talentpulse_jobs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [candidates, setCandidates] = useState<Candidate[]>(() => {
    try {
      const saved = localStorage.getItem('talentpulse_candidates');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);

  useEffect(() => {
    if (jobs && jobs.length > 0) {
      localStorage.setItem('talentpulse_jobs', JSON.stringify(jobs));
    }
  }, [jobs]);

  useEffect(() => {
    if (candidates && candidates.length > 0) {
      localStorage.setItem('talentpulse_candidates', JSON.stringify(candidates));
    }
  }, [candidates]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isQROpen, setIsQROpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Enterprise AI Pipeline Active',
      message: 'System ready for candidate resume ingestion and Supabase database sync.',
      timestamp: 'Just now',
      read: false,
      category: 'System'
    },
    {
      id: 'notif-2',
      title: 'Supabase Database Integration',
      message: 'Candidate database table connected and ready for live resume uploads.',
      timestamp: '5 mins ago',
      read: false,
      category: 'Database'
    }
  ]);

  // Check Supabase session on mount & subscribe to auth state
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    async function initAuth() {
      const client = getSupabaseClient();
      if (client) {
        try {
          const { data: { session }, error } = await client.auth.getSession();
          if (error) {
            console.warn("Supabase session check notice:", error.message);
          }
          if (session?.user) {
            const u: UserProfile = {
              name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Enterprise User',
              email: session.user.email || '',
              avatarUrl: session.user.user_metadata?.avatar_url,
            };
            setUser(u);
            localStorage.setItem('talentpulse_user', JSON.stringify(u));
          }
        } catch (e) {
          console.error("Supabase session check error:", e);
        }

        const { data: authListener } = client.auth.onAuthStateChange((event, session) => {
          if (session?.user) {
            const u: UserProfile = {
              name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Enterprise User',
              email: session.user.email || '',
              avatarUrl: session.user.user_metadata?.avatar_url,
            };
            setUser(u);
            localStorage.setItem('talentpulse_user', JSON.stringify(u));
          } else if (event === 'SIGNED_OUT' || !session) {
            setUser(null);
            localStorage.removeItem('talentpulse_user');
          }
        });

        unsubscribe = () => authListener?.subscription?.unsubscribe();
      }
      setLoading(false);
    }

    initAuth();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const handleLogin = (loggedInUser: UserProfile) => {
    setUser(loggedInUser);
    localStorage.setItem('talentpulse_user', JSON.stringify(loggedInUser));
  };

  const handleLogout = async () => {
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.auth.signOut();
      } catch (e) {
        console.error("Supabase signout error:", e);
      }
    }
    setUser(null);
    localStorage.removeItem('talentpulse_user');
  };


  // Fetch initial data from Express backend API / Supabase
  useEffect(() => {
    async function fetchData() {
      try {
        const [jobsRes, candidatesRes, analyticsRes] = await Promise.all([
          fetch('/api/jobs').then(r => r.json()).catch(() => []),
          fetch('/api/candidates').then(r => r.json()).catch(() => []),
          fetch('/api/analytics').then(r => r.json()).catch(() => null)
        ]);

        if (Array.isArray(jobsRes)) setJobs(jobsRes);
        if (Array.isArray(candidatesRes)) setCandidates(candidatesRes);
        if (analyticsRes) setAnalytics(analyticsRes);
      } catch (err) {
        console.error("Failed to fetch initial data:", err);
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [user]);

  const handleAddJob = (jobData: Partial<Job>) => {
    fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jobData)
    })
      .then(res => res.json())
      .then(newJob => {
        setJobs(prev => [newJob, ...prev]);
      })
      .catch(err => console.error("Error creating job:", err));
  };

  const handleDeleteJob = (jobId: string) => {
    fetch(`/api/jobs/${jobId}`, {
      method: 'DELETE',
    })
      .then(res => res.json())
      .then(() => {
        setJobs(prev => prev.filter(j => j.id !== jobId));
      })
      .catch(err => console.error("Error deleting job:", err));
  };

  const handleCandidateAdded = (newCandidate: Candidate) => {
    setCandidates(prev => [newCandidate, ...prev]);
    // Update job applicant count
    setJobs(prev => prev.map(j => j.id === newCandidate.appliedJobId ? { ...j, applicantsCount: (j.applicantsCount || 0) + 1 } : j));
  };

  const handleUpdateStatus = (candidateId: string, newStatus: string) => {
    setCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, status: newStatus } : c));
    if (selectedCandidate && selectedCandidate.id === candidateId) {
      setSelectedCandidate(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  if (!user) {
    return <LoginView onLogin={handleLogin} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shadow-lg shadow-cyan-500/20 animate-bounce mb-4">
          <span className="font-bold text-xl text-cyan-400">TP</span>
        </div>
        <p className="text-sm font-semibold tracking-wide text-slate-300">Loading TalentPulse AI Recruitment Platform...</p>
      </div>
    );
  }

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-slate-300 font-sans flex flex-col selection:bg-cyan-500 selection:text-black">
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        user={user} 
        onLogout={handleLogout} 
        onOpenQR={() => setIsQROpen(true)}
        unreadNotificationsCount={unreadCount}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <DashboardView 
            candidates={candidates} 
            jobs={jobs} 
            analytics={analytics} 
            setActiveTab={setActiveTab}
            onSelectCandidate={setSelectedCandidate}
            onOpenQR={() => setIsQROpen(true)}
          />
        )}

        {activeTab === 'pipeline' && (
          <KanbanPipelineView 
            candidates={candidates}
            jobs={jobs}
            onUpdateStatus={handleUpdateStatus}
            onSelectCandidate={setSelectedCandidate}
          />
        )}

        {activeTab === 'jobs' && (
          <JobsMatchingView 
            jobs={jobs} 
            candidates={candidates} 
            onSelectCandidate={setSelectedCandidate}
            onAddJob={handleAddJob}
            onDeleteJob={handleDeleteJob}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'ingestion' && (
          <ResumeIngestionView 
            jobs={jobs} 
            onCandidateAdded={handleCandidateAdded}
            setActiveTab={setActiveTab}
            onOpenQR={() => setIsQROpen(true)}
          />
        )}

        {activeTab === 'assistant' && (
          <AiAssistantView candidates={candidates} />
        )}

        {activeTab === 'extracted_matrix' && (
          <ExtractedResumeMatrixView 
            candidates={candidates}
            onUpdateCandidate={(updated) => {
              setCandidates(prev => prev.map(c => c.id === updated.id ? updated : c));
            }}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView analytics={analytics} />
        )}
      </main>

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <CandidateModal 
          candidate={selectedCandidate} 
          onClose={() => setSelectedCandidate(null)}
          onGenerateQuestions={() => {
            setSelectedCandidate(null);
            setActiveTab('assistant');
          }}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

      {/* QR Code Candidate Registration Modal */}
      <QREntryModal 
        isOpen={isQROpen}
        onClose={() => setIsQROpen(false)}
        onRegisterSuccess={(newCand) => {
          handleCandidateAdded(newCand);
        }}
        jobs={jobs}
      />

      {/* Notification Center Modal */}
      <NotificationCenterModal 
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAsRead={(id) => setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))}
        onMarkAllAsRead={() => setNotifications(prev => prev.map(n => ({ ...n, read: true })))}
        onClearAll={() => setNotifications([])}
      />

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-500 py-6 text-center text-xs mt-12">
        <p>© 2026 TalentPulse AI • Enterprise Recruitment Workflow & Automation Platform</p>
      </footer>
    </div>
  );
}
