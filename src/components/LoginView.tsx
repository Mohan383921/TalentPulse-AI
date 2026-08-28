import React, { useState, useEffect } from 'react';
import { 
  Brain, 
  ShieldCheck, 
  ArrowRight, 
  Lock, 
  Mail, 
  AlertCircle, 
  CheckCircle, 
  User, 
  Eye, 
  EyeOff, 
  KeyRound, 
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { UserProfile } from '../types';
import { getSupabaseClient } from '../lib/supabase';

interface LoginViewProps {
  onLogin: (user: UserProfile) => void;
}

type AuthMode = 'signin' | 'signup' | 'forgot_password' | 'reset_password';

export function LoginView({ onLogin }: LoginViewProps) {
  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Check URL hash for password recovery link
  useEffect(() => {
    if (window.location.hash.includes('type=recovery')) {
      setAuthMode('reset_password');
    }
  }, []);

  const mapSupabaseError = (error: any): string => {
    const message = error?.message || '';
    if (message.includes('Invalid login credentials')) {
      return 'Invalid email or password. Please verify your credentials and try again.';
    }
    if (message.includes('User already registered') || message.includes('email_exists')) {
      return 'An account with this email address already exists. Please sign in instead.';
    }
    if (message.includes('Password should be at least')) {
      return 'Password must be at least 6 characters long.';
    }
    if (message.includes('Email not confirmed')) {
      return 'Your email address has not been verified yet. Please check your inbox for the confirmation link.';
    }
    if (message.includes('provider is not enabled') || message.includes('Unsupported provider')) {
      return 'Google OAuth is not enabled in your Supabase Console (Authentication > Providers > Google).';
    }
    return message || 'An unexpected authentication error occurred. Please try again.';
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const client = getSupabaseClient();
    if (!client) {
      setErrorMsg('Supabase authentication client is not initialized. Please ensure VITE_SUPABASE_ANON_KEY is provided.');
      return;
    }

    setLoading(true);

    try {
      // MODE 1: FORGOT PASSWORD
      if (authMode === 'forgot_password') {
        if (!email.trim()) {
          throw new Error('Please enter your email address.');
        }
        const { error } = await client.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: window.location.origin,
        });
        if (error) throw error;
        setSuccessMsg('A password reset link has been sent to your email address.');
        return;
      }

      // MODE 2: RESET PASSWORD (From email recovery link)
      if (authMode === 'reset_password') {
        if (!password) {
          throw new Error('Please enter a new password.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters long.');
        }
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match.');
        }
        const { error } = await client.auth.updateUser({ password });
        if (error) throw error;
        setSuccessMsg('Your password has been updated successfully! You can now sign in.');
        setTimeout(() => {
          setAuthMode('signin');
          setPassword('');
          setConfirmPassword('');
        }, 1500);
        return;
      }

      // MODE 3: SIGN UP
      if (authMode === 'signup') {
        if (!email.trim() || !password) {
          throw new Error('Please fill in all required fields.');
        }
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters long.');
        }
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match.');
        }

        const nameValue = fullName.trim() || email.split('@')[0];
        const { data, error } = await client.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: nameValue,
              avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(nameValue)}`,
            },
            emailRedirectTo: window.location.origin,
          },
        });

        if (error) throw error;

        if (data.user && !data.session) {
          setSuccessMsg('Account created successfully in Supabase! If email confirmation is enabled, please verify your email inbox before signing in.');
          setAuthMode('signin');
        } else if (data.session && data.user) {
          const profile: UserProfile = {
            name: data.user.user_metadata?.full_name || nameValue,
            email: data.user.email || email,
            avatarUrl: data.user.user_metadata?.avatar_url,
          };
          if (rememberMe) {
            localStorage.setItem('talentpulse_user', JSON.stringify(profile));
          }
          setSuccessMsg('Account created! Logging you in...');
          setTimeout(() => onLogin(profile), 600);
        }
        return;
      }

      // MODE 4: SIGN IN
      if (authMode === 'signin') {
        if (!email.trim() || !password) {
          throw new Error('Please enter both email address and password.');
        }

        const { data, error } = await client.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) throw error;

        if (data.user) {
          const profile: UserProfile = {
            name: data.user.user_metadata?.full_name || email.split('@')[0],
            email: data.user.email || email,
            avatarUrl: data.user.user_metadata?.avatar_url,
          };
          if (rememberMe) {
            localStorage.setItem('talentpulse_user', JSON.stringify(profile));
          }
          onLogin(profile);
        }
      }
    } catch (err: any) {
      setErrorMsg(mapSupabaseError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);

    const client = getSupabaseClient();
    if (!client) {
      setErrorMsg('Supabase client is not initialized. Please ensure VITE_SUPABASE_ANON_KEY is set.');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await client.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      setErrorMsg(mapSupabaseError(err));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-200 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background radial glowing ambient spotlights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full space-y-6 bg-slate-900/90 backdrop-blur-2xl border border-slate-800/80 p-8 sm:p-10 rounded-3xl shadow-2xl relative z-10">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 border border-cyan-500/30 items-center justify-center shadow-lg shadow-cyan-500/10 mb-1">
            <Brain className="w-8 h-8 text-cyan-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            TalentPulse AI
          </h2>
          <p className="text-xs text-slate-400 font-mono uppercase tracking-wider flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 inline" />
            <span>Enterprise Auth Suite</span>
          </p>
        </div>

        {/* Tab Selector for Sign In vs Register */}
        {(authMode === 'signin' || authMode === 'signup') && (
          <div className="flex bg-slate-950/80 p-1 rounded-2xl border border-slate-800/80 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setAuthMode('signin');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-2.5 rounded-xl transition-all ${
                authMode === 'signin'
                  ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('signup');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`flex-1 py-2.5 rounded-xl transition-all ${
                authMode === 'signup'
                  ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Status Alerts */}
        {errorMsg && (
          <div className="bg-rose-950/60 border border-rose-800/80 text-rose-300 p-3.5 rounded-xl text-xs flex items-start space-x-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 p-3.5 rounded-xl text-xs flex items-start space-x-2.5 animate-fadeIn">
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
            <span className="leading-relaxed">{successMsg}</span>
          </div>
        )}

        {/* Google OAuth Button */}
        {(authMode === 'signin' || authMode === 'signup') && (
          <>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-3 bg-slate-950 hover:bg-slate-800/80 text-white font-medium text-xs py-3 px-4 rounded-xl border border-slate-700/80 transition-all hover:border-slate-600 shadow-sm disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#EA4335"
                  d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.1 9 5 12 5z"
                />
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15s.7 5.3 1.9 7.7l3.7-2.9c-.3-.8-.5-1.7-.5-2.6z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.1-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-800 w-full" />
              <span className="bg-slate-900 px-3 text-[11px] font-mono uppercase text-slate-500 shrink-0">
                Or with password
              </span>
            </div>
          </>
        )}

        {/* Form Container */}
        <form onSubmit={handleAuthSubmit} className="space-y-4">
          
          {/* Full Name field (Sign Up only) */}
          {authMode === 'signup' && (
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
              </div>
            </div>
          )}

          {/* Email field */}
          {(authMode === 'signin' || authMode === 'signup' || authMode === 'forgot_password') && (
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all"
                />
              </div>
            </div>
          )}

          {/* Password field */}
          {(authMode === 'signin' || authMode === 'signup' || authMode === 'reset_password') && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-slate-300">
                  {authMode === 'reset_password' ? 'New Password' : 'Password'}
                </label>
                {authMode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('forgot_password');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Confirm Password field (Sign Up & Reset Password) */}
          {(authMode === 'signup' || authMode === 'reset_password') && (
            <div className="space-y-1.5">
              <label className="block text-xs font-medium text-slate-300">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* Remember Me Checkbox */}
          {authMode === 'signin' && (
            <div className="flex items-center space-x-2 pt-1">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-800 bg-slate-950 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-900"
              />
              <label htmlFor="rememberMe" className="text-xs text-slate-400 select-none">
                Remember session on this device
              </label>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-600 via-cyan-500 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-semibold text-xs py-3 px-4 rounded-xl shadow-lg shadow-cyan-600/20 transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <span>
                  {authMode === 'signin' && 'Sign In to Workspace'}
                  {authMode === 'signup' && 'Create Enterprise Account'}
                  {authMode === 'forgot_password' && 'Send Password Reset Email'}
                  {authMode === 'reset_password' && 'Update Password'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Back to Sign In Link for Forgot/Reset Password */}
        {(authMode === 'forgot_password' || authMode === 'reset_password') && (
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => {
                setAuthMode('signin');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              ← Back to Sign In
            </button>
          </div>
        )}

        {/* Footer Security Badge */}
        <div className="pt-4 border-t border-slate-800/80 text-center">
          <p className="text-[11px] text-slate-500 flex items-center justify-center space-x-1.5 font-mono">
            <KeyRound className="w-3.5 h-3.5 text-slate-400" />
            <span>Protected by Supabase JWT & Row Level Security</span>
          </p>
        </div>

      </div>
    </div>
  );
}
