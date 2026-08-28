import React, { useState } from 'react';
import { 
  FileUp, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  FileText, 
  Briefcase,
  UserCheck,
  QrCode
} from 'lucide-react';
import { Job, Candidate } from '../types';

interface ResumeIngestionViewProps {
  jobs: Job[];
  onCandidateAdded: (newCandidate: Candidate) => void;
  setActiveTab: (tab: string) => void;
  onOpenQR?: () => void;
}

export function ResumeIngestionView({ 
  jobs, 
  onCandidateAdded, 
  setActiveTab,
  onOpenQR
}: ResumeIngestionViewProps) {
  const [selectedJobId, setSelectedJobId] = useState<string>(jobs[0]?.id || '');
  const [resumeText, setResumeText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sample templates for quick testing
  const sampleResumes = [
    {
      name: "David Sterling (Senior Cloud Engineer)",
      text: `David Sterling
david.sterling@example.com | +1 (555) 456-7890 | Seattle, WA

EXPERIENCE:
Senior Cloud DevOps Engineer - CloudScale Inc. (2021 - Present)
- Architected enterprise Kubernetes clusters on AWS and Google Cloud supporting 50M+ requests daily.
- Implemented automated CI/CD pipelines with GitHub Actions, Terraform, and Docker.
- Spearheaded migration to containerized microservices with zero downtime.

SOFTWARE ENGINEER - TechSolutions (2018 - 2021)
- Developed REST APIs and microservices using Node.js, Python, and PostgreSQL.
- Implemented monitoring with Prometheus and Grafana.

SKILLS:
AWS, Kubernetes, Docker, Terraform, Python, Node.js, PostgreSQL, CI/CD, Linux`
    },
    {
      name: "Aisha Patel (AI & ML Engineer)",
      text: `Aisha Patel
aisha.patel@example.com | +1 (555) 789-0123 | Boston, MA

EXPERIENCE:
Lead AI Engineer - NeuralTech AI (2022 - Present)
- Designed and deployed enterprise RAG pipelines using LangChain, ChromaDB, and OpenAI/Gemini APIs.
- Fine-tuned open-source LLMs (Llama 3, Mistral) for domain-specific document search and summarization.
- Optimized vector embedding indexing pipelines for sub-50ms retrieval latency.

MACHINE LEARNING RESEARCHER - DataCore Labs (2019 - 2022)
- Built NLP models for text extraction and named entity recognition using PyTorch and Hugging Face.

SKILLS:
Python, PyTorch, LangChain, ChromaDB, OpenAI, Google GenAI, Vector Databases, Docker, FastAPI`
    }
  ];

  const handleParseResume = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim()) {
      setErrorMessage("Please enter or paste resume text.");
      return;
    }

    setIsParsing(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/resumes/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, jobId: selectedJobId })
      });

      if (!response.ok) {
        throw new Error('Failed to parse resume via server API');
      }

      const newCandidate: Candidate = await response.json();
      onCandidateAdded(newCandidate);
      setSuccessMessage(`Successfully parsed resume for ${newCandidate.name}! Match Score: ${newCandidate.matchScore}%`);
      setResumeText('');
    } catch (err: any) {
      setErrorMessage(err.message || 'Error parsing resume');
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600">
            <FileUp className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Scalable Resume Ingestion & AI Parsing</h1>
            <p className="text-xs text-slate-500">Upload PDF/DOCX or paste resume text for instant AI metadata extraction and embedding indexing</p>
          </div>
        </div>
        {onOpenQR && (
          <button
            onClick={onOpenQR}
            className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md transition-all shrink-0"
          >
            <QrCode className="w-4 h-4 text-amber-300" />
            <span>Mobile QR Self-Register</span>
          </button>
        )}
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-semibold">{successMessage}</span>
          </div>
          <button
            onClick={() => setActiveTab('jobs')}
            className="underline font-bold text-emerald-900 hover:text-emerald-700 ml-4"
          >
            View in Pipeline →
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Ingestion Form */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 space-y-6">
        <form onSubmit={handleParseResume} className="space-y-6">
          {/* Target Job Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Select Target Job Opening
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {jobs.map((job) => (
                <button
                  type="button"
                  key={job.id}
                  onClick={() => setSelectedJobId(job.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    selectedJobId === job.id
                      ? "bg-indigo-50 border-indigo-500 text-indigo-900 shadow-sm"
                      : "bg-slate-50/50 border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <div className="text-xs font-bold truncate">{job.title}</div>
                  <div className="text-[10px] text-slate-500 mt-1">{job.department}</div>
                </button>
              ))}
            </div>
          </div>

          {/* File Upload from Device */}
          <div className="bg-indigo-50/50 border-2 border-dashed border-indigo-200 rounded-2xl p-6 text-center">
            <input
              type="file"
              id="resume-file-input"
              accept=".pdf,.docx,.txt"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setErrorMessage(null);
                
                if (file.name.endsWith('.pdf') || file.name.endsWith('.docx')) {
                  // Read as base64 and send to server parser
                  const reader = new FileReader();
                  reader.onload = async () => {
                    const base64 = (reader.result as string)?.split(',')[1];
                    try {
                      setIsParsing(true);
                      const res = await fetch('/api/resumes/upload-file', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ fileBase64: base64, fileName: file.name, jobId: selectedJobId })
                      });
                      if (!res.ok) throw new Error('Failed to parse uploaded document file');
                      const newCandidate: Candidate = await res.json();
                      onCandidateAdded(newCandidate);
                      setSuccessMessage(`Successfully uploaded and parsed ${file.name} for ${newCandidate.name}! Match: ${newCandidate.matchScore}%`);
                    } catch (err: any) {
                      setErrorMessage(err.message || 'Error processing document file');
                    } finally {
                      setIsParsing(false);
                    }
                  };
                  reader.readAsDataURL(file);
                } else {
                  // Text file
                  const reader = new FileReader();
                  reader.onload = () => {
                    setResumeText(reader.result as string || '');
                  };
                  reader.readAsText(file);
                }
              }}
            />
            <label
              htmlFor="resume-file-input"
              className="cursor-pointer inline-flex flex-col items-center justify-center space-y-2"
            >
              <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shadow-sm">
                <FileUp className="w-6 h-6" />
              </div>
              <div className="text-xs font-semibold text-slate-800">
                Click to upload PDF, DOCX, or TXT from your file manager
              </div>
              <div className="text-[11px] text-slate-500">
                Drag and drop or browse files (Max 25MB)
              </div>
            </label>
          </div>

          {/* Sample Templates Quick-Load */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Or Load Sample Candidate Resume
            </label>
            <div className="flex flex-wrap gap-2">
              {sampleResumes.map((sample, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => setResumeText(sample.text)}
                  className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-medium transition-colors"
                >
                  Load: {sample.name}
                </button>
              ))}
            </div>
          </div>

          {/* Resume Text Input / Paste Box */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Resume Content / Extracted Text
              </label>
              <span className="text-[10px] text-slate-400">Supports PDF/DOCX raw text or copy-paste</span>
            </div>
            <textarea
              rows={10}
              required
              placeholder="Paste candidate resume content here (Name, contact info, professional experience, education, skills)..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              className="w-full p-4 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
            />
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="flex items-center space-x-2 text-xs text-slate-500">
              <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
              <span>Gemini 2.5 Flash will parse and index embeddings in ChromaDB</span>
            </div>
            <button
              type="submit"
              disabled={isParsing}
              className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-300 text-white px-6 py-3 rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition-all"
            >
              {isParsing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Parsing & Indexing...</span>
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4" />
                  <span>Parse & Rank Resume</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
