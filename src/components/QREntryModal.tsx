import React, { useState } from 'react';
import { 
  X, 
  QrCode, 
  Smartphone, 
  Send, 
  CheckCircle2, 
  Sparkles, 
  Copy, 
  Check, 
  User, 
  Mail, 
  Phone, 
  Briefcase, 
  Building2, 
  GraduationCap, 
  DollarSign,
  FileCode2,
  RefreshCw
} from 'lucide-react';
import { Candidate, Job } from '../types';

interface QREntryModalProps {
  jobs: Job[];
  onClose: () => void;
  isOpen?: boolean;
  onRegisterSuccess?: (candidate: Candidate) => void;
  onCandidateAdded?: (candidate: Candidate) => void;
}

export function QREntryModal({ 
  jobs, 
  onClose, 
  isOpen = true, 
  onRegisterSuccess, 
  onCandidateAdded 
}: QREntryModalProps) {
  if (isOpen === false) return null;
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'qr' | 'simulate'>('qr');
  const [selectedJobId, setSelectedJobId] = useState<string>(jobs[0]?.id || '');
  
  // Mobile registration form fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'ECE DS 2A',
    role: jobs[0]?.title || 'Python Developer',
    education: 'BTech, MTech',
    experienceYears: '3',
    skills: 'Python, Machine Learning, React, Node.js, SQL',
    expectedSalary: '50000',
    resumeText: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successResult, setSuccessResult] = useState<Candidate | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const registrationUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/?register=qr`
    : 'https://talentpulse.app/qr-register';

  const handleCopyLink = () => {
    navigator.clipboard.writeText(registrationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegisterCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      setErrorMessage('Please fill in candidate Name and Email.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/candidates/qr-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          jobId: selectedJobId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to register candidate via QR portal');
      }

      const newCandidate: Candidate = await response.json();
      setSuccessResult(newCandidate);
      if (onCandidateAdded) onCandidateAdded(newCandidate);
      if (onRegisterSuccess) onRegisterSuccess(newCandidate);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error submitting registration form');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-scaleUp">
        {/* Modal Header */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">QR Code Mobile Candidate Registration</h2>
              <p className="text-xs text-slate-400">Instant mobile registration portal with real-time sync</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 space-x-4">
          <button
            onClick={() => setActiveTab('qr')}
            className={`pb-3 text-xs font-bold border-b-2 transition-all flex items-center space-x-2 ${
              activeTab === 'qr'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <QrCode className="w-4 h-4" />
            <span>QR Code Gateway & Sharing</span>
          </button>
          <button
            onClick={() => setActiveTab('simulate')}
            className={`pb-3 text-xs font-bold border-b-2 transition-all flex items-center space-x-2 ${
              activeTab === 'simulate'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Mobile Form Simulator</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {activeTab === 'qr' && (
            <div className="space-y-6 text-center">
              <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 flex flex-col items-center justify-center">
                {/* Visual QR Code Display */}
                <div className="bg-white p-4 rounded-xl shadow-md border border-slate-200 mb-4 relative group">
                  <svg className="w-48 h-48" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Background */}
                    <rect width="100" height="100" fill="white" />
                    
                    {/* Top Left Corner */}
                    <rect x="10" y="10" width="25" height="25" rx="3" fill="#0F172A" />
                    <rect x="14" y="14" width="17" height="17" rx="2" fill="white" />
                    <rect x="18" y="18" width="9" height="9" fill="#4F46E5" />

                    {/* Top Right Corner */}
                    <rect x="65" y="10" width="25" height="25" rx="3" fill="#0F172A" />
                    <rect x="69" y="14" width="17" height="17" rx="2" fill="white" />
                    <rect x="73" y="18" width="9" height="9" fill="#4F46E5" />

                    {/* Bottom Left Corner */}
                    <rect x="10" y="65" width="25" height="25" rx="3" fill="#0F172A" />
                    <rect x="14" y="69" width="17" height="17" rx="2" fill="white" />
                    <rect x="18" y="73" width="9" height="9" fill="#4F46E5" />

                    {/* Random Matrix Pattern simulation */}
                    <rect x="42" y="10" width="6" height="6" fill="#0F172A" />
                    <rect x="52" y="10" width="6" height="6" fill="#0F172A" />
                    <rect x="42" y="20" width="6" height="6" fill="#4F46E5" />
                    <rect x="52" y="24" width="6" height="6" fill="#0F172A" />
                    <rect x="10" y="42" width="6" height="6" fill="#0F172A" />
                    <rect x="20" y="42" width="6" height="6" fill="#4F46E5" />
                    <rect x="30" y="42" width="6" height="16" fill="#0F172A" />
                    <rect x="42" y="42" width="16" height="16" fill="#0F172A" />
                    <rect x="65" y="42" width="8" height="8" fill="#4F46E5" />
                    <rect x="78" y="42" width="12" height="6" fill="#0F172A" />
                    <rect x="42" y="65" width="8" height="12" fill="#0F172A" />
                    <rect x="55" y="65" width="12" height="6" fill="#4F46E5" />
                    <rect x="72" y="65" width="18" height="18" fill="#0F172A" />
                    <rect x="55" y="78" width="10" height="12" fill="#0F172A" />
                    
                    {/* Center TalentPulse Logo overlay */}
                    <rect x="40" y="40" width="20" height="20" rx="4" fill="#0F172A" />
                    <circle cx="50" cy="50" r="5" fill="#06B6D4" />
                  </svg>
                  <div className="mt-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    Scan to Open Mobile Gateway
                  </div>
                </div>

                <p className="text-xs text-slate-600 max-w-md leading-relaxed">
                  Recruiters can display this QR code at job fairs, campus recruitment drives, or candidate kiosks. Candidates scan with their phone camera to submit details directly into TalentPulse.
                </p>

                {/* Registration Link Input */}
                <div className="w-full max-w-md mt-4 flex items-center space-x-2 bg-white p-1.5 rounded-xl border border-slate-200">
                  <input
                    type="text"
                    readOnly
                    value={registrationUrl}
                    className="flex-1 text-xs font-mono px-3 py-1.5 text-slate-700 bg-transparent focus:outline-none truncate"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="inline-flex items-center space-x-1.5 bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-2 flex justify-center">
                <button
                  onClick={() => setActiveTab('simulate')}
                  className="inline-flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-xl text-xs font-semibold shadow-md transition-all"
                >
                  <Smartphone className="w-4 h-4 text-cyan-400" />
                  <span>Test Mobile Registration Simulator</span>
                </button>
              </div>
            </div>
          )}

          {activeTab === 'simulate' && (
            <div>
              {successResult ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-emerald-900">Registration Successful!</h3>
                    <p className="text-xs text-emerald-700 mt-1">
                      Candidate <strong className="font-bold">{successResult.name}</strong> has been registered via QR entry system.
                    </p>
                  </div>

                  {/* AI Scores Summary Badge */}
                  <div className="bg-white p-4 rounded-xl border border-emerald-200 grid grid-cols-3 gap-3 text-center">
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-slate-400">Resume Score</span>
                      <span className="text-lg font-extrabold text-indigo-600">{successResult.resumeScore || 75}%</span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-slate-400">ML Score</span>
                      <span className="text-lg font-extrabold text-violet-600">{successResult.mlScore || 72}%</span>
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-slate-400">Final Score</span>
                      <span className="text-lg font-extrabold text-emerald-600">{successResult.finalScore || 74}%</span>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-center space-x-3">
                    <button
                      onClick={() => {
                        setSuccessResult(null);
                        setFormData({
                          name: '',
                          email: '',
                          phone: '',
                          department: 'ECE DS 2A',
                          role: jobs[0]?.title || 'Python Developer',
                          education: 'BTech, MTech',
                          experienceYears: '3',
                          skills: 'Python, Machine Learning, React',
                          expectedSalary: '50000',
                          resumeText: ''
                        });
                      }}
                      className="inline-flex items-center space-x-1.5 px-4 py-2 bg-white border border-emerald-300 text-emerald-800 text-xs font-semibold rounded-xl hover:bg-emerald-100 transition-colors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Register Another</span>
                    </button>
                    <button
                      onClick={onClose}
                      className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl transition-colors shadow-md"
                    >
                      View on Dashboard
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleRegisterCandidate} className="space-y-4">
                  {errorMessage && (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs">
                      {errorMessage}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Full Name *</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          required
                          placeholder="e.g. JOHN DOE"
                          value={formData.name}
                          onChange={e => setFormData({ ...formData, name: e.target.value })}
                          className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Email Address *</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="email"
                          required
                          placeholder="e.g. ahamed@example.com"
                          value={formData.email}
                          onChange={e => setFormData({ ...formData, email: e.target.value })}
                          className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Phone Number</label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          placeholder="e.g. +91 98765 43210"
                          value={formData.phone}
                          onChange={e => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Department</label>
                      <div className="relative">
                        <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <select
                          value={formData.department}
                          onChange={e => setFormData({ ...formData, department: e.target.value })}
                          className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                          <option value="ECE DS 2A">ECE DS 2A</option>
                          <option value="CSE 2A">CSE 2A</option>
                          <option value="BIO TECH">BIO TECH</option>
                          <option value="MECHANICAL">MECHANICAL</option>
                          <option value="CIVIL">CIVIL</option>
                          <option value="HR">HR</option>
                          <option value="General">General</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Target Role</label>
                      <div className="relative">
                        <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          placeholder="e.g. Python Developer"
                          value={formData.role}
                          onChange={e => setFormData({ ...formData, role: e.target.value })}
                          className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Education</label>
                      <div className="relative">
                        <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          placeholder="e.g. BTech, MTech"
                          value={formData.education}
                          onChange={e => setFormData({ ...formData, education: e.target.value })}
                          className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Experience (Years)</label>
                      <input
                        type="number"
                        min="0"
                        max="40"
                        value={formData.experienceYears}
                        onChange={e => setFormData({ ...formData, experienceYears: e.target.value })}
                        className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Expected Salary (₹ or $)</label>
                      <div className="relative">
                        <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          placeholder="e.g. 50000"
                          value={formData.expectedSalary}
                          onChange={e => setFormData({ ...formData, expectedSalary: e.target.value })}
                          className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Key Skills (Comma Separated)</label>
                    <input
                      type="text"
                      placeholder="e.g. PYTHON, DJANGO, REACT, SQL"
                      value={formData.skills}
                      onChange={e => setFormData({ ...formData, skills: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">Resume / Career Summary Text</label>
                    <textarea
                      rows={3}
                      placeholder="Paste brief career summary or details..."
                      value={formData.resumeText}
                      onChange={e => setFormData({ ...formData, resumeText: e.target.value })}
                      className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    />
                  </div>

                  <div className="pt-3 flex justify-end space-x-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setActiveTab('qr')}
                      className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-200 transition-colors"
                    >
                      Back to QR
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-300 text-white px-5 py-2 text-xs font-semibold rounded-xl shadow-md transition-all"
                    >
                      {isSubmitting ? (
                        <span>Submitting Candidate...</span>
                      ) : (
                        <>
                          <Send className="w-3.5 h-3.5" />
                          <span>Submit Registration</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
