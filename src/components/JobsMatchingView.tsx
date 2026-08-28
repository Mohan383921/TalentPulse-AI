import React, { useState } from 'react';
import { 
  Briefcase, 
  Plus, 
  Search, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  MapPin, 
  DollarSign, 
  Users,
  FileText,
  X,
  UserCheck,
  Trash2
} from 'lucide-react';
import { Job, Candidate } from '../types';

interface JobsMatchingViewProps {
  jobs: Job[];
  candidates: Candidate[];
  onSelectCandidate: (candidate: Candidate) => void;
  onAddJob: (jobData: Partial<Job>) => void;
  onDeleteJob: (jobId: string) => void;
  setActiveTab: (tab: string) => void;
}

export function JobsMatchingView({ 
  jobs, 
  candidates, 
  onSelectCandidate, 
  onAddJob,
  onDeleteJob,
  setActiveTab 
}: JobsMatchingViewProps) {
  const [selectedJobId, setSelectedJobId] = useState<string>(jobs[0]?.id || '');
  const [showNewJobModal, setShowNewJobModal] = useState(false);
  const [jobToDelete, setJobToDelete] = useState<Job | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // New Job Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDept, setNewDept] = useState('Engineering');
  const [newLoc, setNewLoc] = useState('Remote');
  const [newSalary, setNewSalary] = useState('$140k - $180k');
  const [newDesc, setNewDesc] = useState('');
  const [newReqs, setNewReqs] = useState('');

  const currentJob = jobs.find(j => j.id === selectedJobId) || jobs[0];
  const filteredCandidates = candidates.filter(c => {
    const matchesJob = selectedJobId ? c.appliedJobId === selectedJobId : true;
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.skills.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesJob && matchesSearch;
  });

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddJob({
      title: newTitle,
      department: newDept,
      location: newLoc,
      salary: newSalary,
      description: newDesc,
      requirements: newReqs.split('\n').filter(r => r.trim().length > 0)
    });

    setNewTitle('');
    setNewDesc('');
    setNewReqs('');
    setShowNewJobModal(false);
  };

  const handleConfirmDeleteJob = () => {
    if (!jobToDelete) return;
    const deletedId = jobToDelete.id;
    onDeleteJob(deletedId);

    if (selectedJobId === deletedId) {
      const remaining = jobs.filter(j => j.id !== deletedId);
      setSelectedJobId(remaining[0]?.id || '');
    }
    setJobToDelete(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Job Postings & Candidate Matching</h1>
          <p className="text-xs text-slate-500">AI-powered qualification analysis, ranking, and explainable match scoring</p>
        </div>
        <button
          onClick={() => setShowNewJobModal(true)}
          className="inline-flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Job</span>
        </button>
      </div>

      {/* Job selector tabs */}
      <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-none">
        {jobs.length === 0 ? (
          <p className="text-xs text-slate-400 py-2">No jobs posted yet. Click "+ Post New Job" to create one.</p>
        ) : (
          jobs.map((job) => (
            <div
              key={job.id}
              className={`flex items-center space-x-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                selectedJobId === job.id
                  ? "bg-indigo-900 text-white border-indigo-900 shadow-md shadow-indigo-900/20"
                  : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
              }`}
            >
              <button
                onClick={() => setSelectedJobId(job.id)}
                className="flex items-center space-x-2 text-left"
              >
                <Briefcase className="w-3.5 h-3.5 shrink-0" />
                <span>{job.title}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                  selectedJobId === job.id ? "bg-indigo-800 text-indigo-100" : "bg-slate-100 text-slate-600"
                }`}>
                  {job.applicantsCount}
                </span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setJobToDelete(job);
                }}
                className={`p-1 rounded-md transition-colors ${
                  selectedJobId === job.id
                    ? "text-indigo-200 hover:bg-rose-600 hover:text-white"
                    : "text-slate-400 hover:bg-rose-100 hover:text-rose-600"
                }`}
                title={`Delete job: ${job.title}`}
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Current Job Details Card */}
      {currentJob && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center space-x-3 mb-1">
                <h2 className="text-lg font-bold text-slate-900">{currentJob.title}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {currentJob.status}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" /> {currentJob.location}</span>
                <span className="flex items-center"><DollarSign className="w-3.5 h-3.5 mr-1 text-slate-400" /> {currentJob.salary}</span>
                <span className="flex items-center"><Users className="w-3.5 h-3.5 mr-1 text-slate-400" /> {currentJob.department}</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setActiveTab('ingestion')}
                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
              >
                Upload Resumes for Job
              </button>
              <button
                type="button"
                onClick={() => setJobToDelete(currentJob)}
                className="inline-flex items-center space-x-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold px-3.5 py-2 rounded-xl transition-all group"
                title="Delete Job Post"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-600 group-hover:scale-110 transition-transform" />
                <span>Delete Job</span>
              </button>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Job Description</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{currentJob.description}</p>
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Key Requirements</h3>
              <ul className="space-y-1.5 text-xs text-slate-600">
                {currentJob.requirements.map((req, i) => (
                  <li key={i} className="flex items-start">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mr-1.5 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Candidate Ranking Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Ranked Candidate Pipeline</h3>
            <p className="text-xs text-slate-500">Showing matches for {currentJob ? currentJob.title : 'All Jobs'}</p>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search candidate or skill..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filteredCandidates.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs">
              No candidates found matching this filter. Upload resumes to populate ranking.
            </div>
          ) : (
            filteredCandidates.map((cand) => (
              <div
                key={cand.id}
                onClick={() => onSelectCandidate(cand)}
                className="p-5 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-sm shrink-0">
                      {cand.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="flex items-center space-x-3">
                        <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                          {cand.name}
                        </h4>
                        <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                          {cand.experienceYears} Years Exp
                        </span>
                        <span className="text-[10px] font-medium text-slate-400">
                          Applied {cand.appliedDate}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{cand.email} • {cand.phone}</p>
                      
                      <div className="flex flex-wrap gap-1 mt-2.5">
                        {cand.skills.map((skill, i) => (
                          <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md font-medium">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Match Score & Badges */}
                  <div className="flex items-center space-x-6 justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                    <div className="text-left md:text-right">
                      <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <Sparkles className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                        {cand.matchScore}% Match
                      </div>
                      <div className="flex items-center space-x-3 mt-1.5 text-[10px] text-slate-500">
                        <span>Skills: {cand.matchBreakdown.skillsMatch}%</span>
                        <span>Exp: {cand.matchBreakdown.experienceMatch}%</span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>

                {/* AI Justification Excerpt */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-start space-x-2 text-xs text-slate-600 bg-slate-50/70 p-3 rounded-lg">
                  <Sparkles className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
                  <p className="line-clamp-2"><strong className="text-slate-800">AI Screening Verdict:</strong> {cand.justification}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* New Job Modal */}
      {showNewJobModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-scaleUp">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-lg font-bold text-slate-900">Post New Enterprise Job</h3>
              <button 
                onClick={() => setShowNewJobModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateJob} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Job Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Senior Backend Engineer"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    value={newLoc}
                    onChange={(e) => setNewLoc(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Salary Range</label>
                <input
                  type="text"
                  value={newSalary}
                  onChange={(e) => setNewSalary(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Job Description</label>
                <textarea
                  rows={3}
                  placeholder="Role overview and responsibilities..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Key Requirements (one per line)</label>
                <textarea
                  rows={3}
                  placeholder="5+ years experience&#10;React & TypeScript expertise"
                  value={newReqs}
                  onChange={(e) => setNewReqs(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowNewJobModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all"
                >
                  Create Job Posting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Job Confirmation Modal */}
      {jobToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-scaleUp">
            <div className="flex items-center space-x-3 text-rose-600 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5 text-rose-600" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Delete Job Posting</h3>
                <p className="text-xs text-slate-500">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-6">
              Are you sure you want to delete the job posting <strong className="text-slate-900">"{jobToDelete.title}"</strong> ({jobToDelete.department})?
            </p>

            <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setJobToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteJob}
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-600/30 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirm Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
