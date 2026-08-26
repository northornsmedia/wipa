// @ts-nocheck
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, Lock, Smartphone, Database, Trash2, Mail, Globe, 
  CheckCircle2, FileText, ArrowRight, ExternalLink, ChevronRight,
  Eye, RefreshCw, AlertCircle, Sparkles, Building2, UserCheck
} from 'lucide-react';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState('overview');

  const scrollTo = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col selection:bg-[#5a32fa] selection:text-white font-sans">
      <PublicHeader />

      {/* Hero Banner */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden border-b border-white/5 bg-gradient-to-b from-[#0e1424] via-[#07090e] to-[#07090e]">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#5a32fa]/20 to-[#ff90e8]/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-purple-300 mb-6 backdrop-blur-md">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>Google Play & Global Data Privacy Compliance</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
            WIPA Privacy Policy
          </h1>

          <p className="text-slate-400 text-sm sm:text-base max-w-2xl leading-relaxed mb-6">
            Women&apos;s IP Alliance (&ldquo;WIPA&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;) is dedicated to safeguarding your personal information, intellectual property assets, and professional communications with bank-grade encryption and complete transparency.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-medium pt-2 border-t border-white/10">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <strong>Effective Date:</strong> January 1, 2026
            </span>
            <span className="text-white/20">•</span>
            <span><strong>Last Updated:</strong> August 26, 2026</span>
            <span className="text-white/20">•</span>
            <span><strong>App Package:</strong> org.wipa.app</span>
            <span className="text-white/20">•</span>
            <span><strong>Application:</strong> WIPA Connect</span>
          </div>
        </div>
      </section>

      {/* Quick Summary / Privacy Highlights Cards */}
      <section className="py-12 bg-[#090d16] border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-xs font-bold uppercase tracking-wider text-purple-400 mb-6">
            Privacy Highlights At A Glance
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-purple-500/30 transition-all space-y-2">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <Lock size={18} />
              </div>
              <h3 className="font-bold text-white text-sm">Zero Data Selling</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                We never sell, rent, or monetize your personal data, contact details, or IP files to advertisers.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-emerald-500/30 transition-all space-y-2">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <ShieldCheck size={18} />
              </div>
              <h3 className="font-bold text-white text-sm">Encrypted In Transit & Rest</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                All transmissions use TLS 1.3 encryption and enterprise AES-256 database storage with Row-Level Security.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-blue-500/30 transition-all space-y-2">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Smartphone size={18} />
              </div>
              <h3 className="font-bold text-white text-sm">Minimal App Permissions</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Photos, videos, and camera are accessed strictly upon direct user prompt for profile avatars and forum attachments.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-rose-500/30 transition-all space-y-2">
              <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                <Trash2 size={18} />
              </div>
              <h3 className="font-bold text-white text-sm">1-Click Account Erasure</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                You can permanently delete your account, posts, and media anytime in-app or via our verified deletion portal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout with Sticky Sidebar */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-12 lg:py-16 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Table of Contents Sticky Sidebar */}
          <aside className="lg:col-span-4">
            <div className="sticky top-28 bg-[#0d1220]/90 backdrop-blur-md rounded-2xl border border-white/10 p-5 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-2 pb-2 border-b border-white/5">
                Table of Contents
              </h3>
              <nav className="space-y-1 text-xs">
                {[
                  { id: 'overview', label: '1. Overview & Scope' },
                  { id: 'data-collection', label: '2. Information We Collect' },
                  { id: 'mobile-permissions', label: '3. Android & Mobile Permissions (Play Store)' },
                  { id: 'how-we-use', label: '4. How We Use Your Information' },
                  { id: 'subprocessors', label: '5. Third-Party Services & Subprocessors' },
                  { id: 'security', label: '6. Data Storage & Security Standards' },
                  { id: 'account-deletion', label: '7. Account Deletion & Data Retention Policy' },
                  { id: 'legal-rights', label: '8. GDPR, UK DPA & CCPA/CPRA Rights' },
                  { id: 'children', label: '9. Children’s Privacy' },
                  { id: 'contact', label: '10. Contact & Data Protection Officer' },
                ].map(item => (
                  <button
                    key={item.id}
                    onClick={() => scrollTo(item.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-center justify-between font-medium ${
                      activeSection === item.id 
                        ? 'bg-[#5a32fa] text-white font-bold shadow-sm' 
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronRight size={12} className={activeSection === item.id ? 'opacity-100' : 'opacity-40'} />
                  </button>
                ))}
              </nav>

              <div className="pt-4 border-t border-white/5 px-2">
                <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-[11px] text-purple-300 space-y-1.5">
                  <p className="font-bold flex items-center gap-1 text-white">
                    <Mail size={12} className="text-purple-400" /> Need Privacy Support?
                  </p>
                  <p className="text-slate-300">
                    Reach our Data Protection team directly at{' '}
                    <a href="mailto:connect@northonsprmarketing.com" className="text-purple-400 underline font-semibold">
                      connect@northonsprmarketing.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* Detailed Legal Sections */}
          <article className="lg:col-span-8 space-y-12 text-slate-300 text-sm leading-relaxed">

            {/* 1. Overview */}
            <section id="overview" className="space-y-4 pt-2">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider">
                <Building2 size={16} /> Section 1
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                1. Overview & Scope
              </h2>
              <p>
                This Privacy Policy applies to the <strong>WIPA Connect</strong> application (including the Android mobile application package <code>org.wipa.app</code>, the iOS application, and the web platform hosted at <code>platform.womensipalliance.com</code>), operated by the Women&apos;s IP Alliance and Northons Media (collectively, &ldquo;WIPA&rdquo;, &ldquo;we&rdquo;, &ldquo;our&rdquo;, or &ldquo;us&rdquo;).
              </p>
              <p>
                WIPA provides a premier global network for intellectual property attorneys, patent specialists, trademark counsel, academics, and students. By accessing or using our platform, you acknowledge and agree to the data collection and usage practices described in this Privacy Policy. If you do not agree with our policies, please refrain from using the application.
              </p>
            </section>

            {/* 2. Information We Collect */}
            <section id="data-collection" className="space-y-4 pt-8 border-t border-white/5">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider">
                <Database size={16} /> Section 2
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                2. Information We Collect
              </h2>
              <p>
                We only collect information necessary to provide professional networking, legal intelligence, educational webinars, and directory verification.
              </p>

              <div className="space-y-3 pt-2">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <h4 className="font-bold text-white text-sm mb-1">A. Information You Voluntarily Provide</h4>
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-400">
                    <li><strong>Account Credentials:</strong> Full name, professional email address, password hash, and company/firm affiliation.</li>
                    <li><strong>Professional Profile Details:</strong> Bio, jurisdiction, IP practice areas (patents, trademarks, copyright, litigation), university degrees, and LinkedIn URL.</li>
                    <li><strong>Profile Media:</strong> Profile avatar photographs and firm logos uploaded by you.</li>
                    <li><strong>User-Generated Content:</strong> Forum discussions, comments, group messages, webinar registrations, and event RSVPs.</li>
                    <li><strong>Direct Communications:</strong> Support inquiries, feedback forms, and mentorship applications.</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                  <h4 className="font-bold text-white text-sm mb-1">B. Automatically Collected Technical Information</h4>
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-400">
                    <li><strong>Device Telemetry:</strong> Device model, operating system version (Android / iOS), app version, and unique push notification installation tokens (FCM tokens).</li>
                    <li><strong>Usage & Interaction Data:</strong> Feature utilization, article reading timestamps, and search query parameters (processed locally for instant filtering).</li>
                    <li><strong>IP Address & Network Data:</strong> General approximate location (country/city level) for localized IP news filtering and cybersecurity fraud detection.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 3. Android & Mobile Permissions (Play Store Declaration) */}
            <section id="mobile-permissions" className="space-y-4 pt-8 border-t border-white/5">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider">
                <Smartphone size={16} /> Section 3
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                3. Android & Mobile Permissions Disclosures
              </h2>
              <p>
                In strict adherence to <strong>Google Play Developer Policies</strong> and Google&apos;s Photo & Video Permissions Policy, our application only requests hardware and storage permissions when explicitly required to execute a user-initiated action:
              </p>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border border-white/10 rounded-xl overflow-hidden">
                  <thead className="bg-white/5 text-slate-200 uppercase font-bold text-[11px]">
                    <tr>
                      <th className="p-3 border-b border-white/10">Permission Name</th>
                      <th className="p-3 border-b border-white/10">Type</th>
                      <th className="p-3 border-b border-white/10">Exact Purpose & Justification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-slate-300">
                    <tr>
                      <td className="p-3 font-mono text-purple-300">READ_MEDIA_IMAGES</td>
                      <td className="p-3 font-semibold text-emerald-400">Optional</td>
                      <td className="p-3">Used solely when you choose to upload and crop your profile avatar, attach IP diagrams in discussion posts, or submit visual publication assets.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono text-purple-300">READ_MEDIA_VIDEO</td>
                      <td className="p-3 font-semibold text-emerald-400">Optional</td>
                      <td className="p-3">Allows members to upload and share educational webinars, presentation recordings, and multimedia legal videos within community channels.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono text-purple-300">CAMERA</td>
                      <td className="p-3 font-semibold text-emerald-400">Optional</td>
                      <td className="p-3">Used strictly when you choose to take a live photo for your profile avatar or capture a badge during verified in-person WIPA summits.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono text-purple-300">RECORD_AUDIO</td>
                      <td className="p-3 font-semibold text-emerald-400">Optional</td>
                      <td className="p-3">Enables active microphone participation in Meetn virtual IP roundtables and audio podcast sessions. Audio is not recorded or stored without explicit notice.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono text-purple-300">POST_NOTIFICATIONS</td>
                      <td className="p-3 font-semibold text-emerald-400">Optional</td>
                      <td className="p-3">Delivers real-time alerts for direct messages, member replies, event calendar reminders, and breaking IP news briefings. You can disable this anytime in System Settings.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-start gap-3">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong>Photo Picker First Policy:</strong> On Android 13+ devices, WIPA utilizes the native Android System Photo Picker whenever possible, allowing you to select specific media without granting continuous filesystem access to your full media library.
                </div>
              </div>
            </section>

            {/* 4. How We Use Your Information */}
            <section id="how-we-use" className="space-y-4 pt-8 border-t border-white/5">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider">
                <Eye size={16} /> Section 4
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                4. How We Use Your Information
              </h2>
              <p>We process your personal information strictly for legitimate business and contractual purposes:</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <li className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-purple-400 shrink-0 mt-0.5" />
                  <span><strong>Account Administration:</strong> Authenticating your identity and managing membership tiers.</span>
                </li>
                <li className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-purple-400 shrink-0 mt-0.5" />
                  <span><strong>Community Networking:</strong> Displaying your verified profile to fellow IP attorneys and practitioners.</span>
                </li>
                <li className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-purple-400 shrink-0 mt-0.5" />
                  <span><strong>Educational Webinars:</strong> Providing secure entry links and calendar synchronizations for summits.</span>
                </li>
                <li className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-purple-400 shrink-0 mt-0.5" />
                  <span><strong>AI Legal Research:</strong> Powering the LexIQ assistant with anonymized prompt execution.</span>
                </li>
                <li className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-purple-400 shrink-0 mt-0.5" />
                  <span><strong>Security & Fraud Prevention:</strong> Protecting members from unauthorized logins and spam abuse.</span>
                </li>
                <li className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-2">
                  <CheckCircle2 size={14} className="text-purple-400 shrink-0 mt-0.5" />
                  <span><strong>Legal Compliance:</strong> Complying with tax obligations, accounting laws, and lawful court orders.</span>
                </li>
              </ul>
            </section>

            {/* 5. Subprocessors & Third-Party Services */}
            <section id="subprocessors" className="space-y-4 pt-8 border-t border-white/5">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider">
                <Globe size={16} /> Section 5
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                5. Third-Party Services & Subprocessors
              </h2>
              <p>
                We collaborate only with industry-leading, privacy-certified service providers under strict Data Processing Agreements (DPAs):
              </p>

              <div className="space-y-2.5 text-xs">
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white">Supabase Inc.</span>
                    <p className="text-slate-400">Database storage, encrypted authentication, and media storage (AWS Frankfurt / EU region).</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-300 font-mono">SOC2 / GDPR</span>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white">Google Firebase (FCM)</span>
                    <p className="text-slate-400">Encrypted transmission of mobile push notifications.</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-300 font-mono">ISO 27001</span>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white">Stripe Payments Europe Ltd</span>
                    <p className="text-slate-400">PCI-DSS Level 1 compliant processing of membership subscriptions. We never store credit card numbers.</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-300 font-mono">PCI-DSS L1</span>
                </div>

                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white">Meetn Video</span>
                    <p className="text-slate-400">Encrypted virtual summit streaming and interactive room audio/video.</p>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-300 font-mono">TLS / SRTP</span>
                </div>
              </div>
            </section>

            {/* 6. Security Standards */}
            <section id="security" className="space-y-4 pt-8 border-t border-white/5">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider">
                <Lock size={16} /> Section 6
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                6. Data Storage & Security Standards
              </h2>
              <p>
                We implement comprehensive organizational and technical measures to protect against unauthorized access, accidental loss, alteration, or disclosure:
              </p>
              <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-300">
                <li><strong>Encryption:</strong> Transport Layer Security (TLS 1.3) on all network traffic and AES-256 encryption for data at rest.</li>
                <li><strong>Database Isolation:</strong> Postgres Row-Level Security (RLS) guarantees that only authorized users can read or write their private records.</li>
                <li><strong>Password Protection:</strong> Passwords are cryptographically salted and hashed using Argon2/bcrypt; plaintext passwords are never stored.</li>
                <li><strong>Session Security:</strong> JWT tokens with automatic expiry and instant session revocation upon sign-out.</li>
              </ul>
            </section>

            {/* 7. Account & Data Deletion (Google Play Strictly Required) */}
            <section id="account-deletion" className="space-y-4 pt-8 border-t border-white/5">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                <Trash2 size={16} /> Section 7 (Google Play Requirement)
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                7. Account Deletion & Data Retention Policy
              </h2>
              <p>
                In compliance with Google Play&apos;s Account Deletion Policy and global privacy mandates, we provide transparent, immediate options for you to permanently delete your account and all associated personal data:
              </p>

              <div className="p-5 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-4">
                <h3 className="font-bold text-white text-base flex items-center gap-2">
                  <Trash2 size={18} className="text-rose-400" />
                  How to Request Account & Data Deletion:
                </h3>
                
                <div className="space-y-3 text-xs">
                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-300 font-bold flex items-center justify-center shrink-0">1</span>
                    <div>
                      <strong className="text-white">Option A: In-App Self-Service Deletion (Instant)</strong>
                      <p className="text-slate-400 mt-0.5">
                        Open the WIPA Mobile App or Web Platform &rarr; Navigate to <strong>Settings</strong> &rarr; Select <strong>Account & Security</strong> &rarr; Click <strong>&ldquo;Delete Account&rdquo;</strong> and confirm.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-300 font-bold flex items-center justify-center shrink-0">2</span>
                    <div>
                      <strong className="text-white">Option B: Email Deletion Request (Support Handled)</strong>
                      <p className="text-slate-400 mt-0.5">
                        Email{' '}
                        <a href="mailto:connect@northonsprmarketing.com?subject=WIPA%20Account%20Deletion%20Request" className="text-rose-400 font-semibold underline">
                          connect@northonsprmarketing.com
                        </a>{' '}
                        or{' '}
                        <a href="mailto:contact@womensipalliance.com?subject=WIPA%20Account%20Deletion%20Request" className="text-rose-400 font-semibold underline">
                          contact@womensipalliance.com
                        </a>{' '}
                        with the subject <em>&ldquo;WIPA Account Deletion Request&rdquo;</em> from your registered email address. Requests are processed within 48 hours.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-rose-500/20 text-xs text-slate-300">
                  <strong className="text-white">What Happens When Your Account Is Deleted?</strong>
                  <ul className="list-disc list-inside space-y-1 text-slate-400 mt-1.5">
                    <li>Your profile, avatar images, contact information, and biography are permanently erased from our live databases.</li>
                    <li>Your active sessions, FCM push notification tokens, and device tokens are revoked immediately.</li>
                    <li>Any Stripe recurring subscription billing is canceled immediately with no future charges.</li>
                    <li>Tax receipts and financial transaction logs are retained strictly as required by statutory law (typically 7 years for HMRC/IRS audit compliance), after which they are permanently shredded.</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 8. GDPR & Global Rights */}
            <section id="legal-rights" className="space-y-4 pt-8 border-t border-white/5">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider">
                <Globe size={16} /> Section 8
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                8. Your Global Legal Rights (GDPR, UK DPA, CCPA/CPRA)
              </h2>
              <p>Depending on your country or state of residence, you are entitled to exercise the following rights:</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <strong className="text-white block mb-1">Right to Access & Portability</strong>
                  <p className="text-slate-400">Request an electronic copy of all personal data held about you in a standard JSON or CSV format.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <strong className="text-white block mb-1">Right to Rectification</strong>
                  <p className="text-slate-400">Correct or update any inaccurate or incomplete professional profile information directly in your settings.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <strong className="text-white block mb-1">Right to Erasure (&ldquo;Be Forgotten&rdquo;)</strong>
                  <p className="text-slate-400">Request the permanent deletion of your personal data when it is no longer necessary for the original purpose.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5">
                  <strong className="text-white block mb-1">Right to Restrict or Object</strong>
                  <p className="text-slate-400">Object to the processing of your data for direct marketing or automated profiling purposes.</p>
                </div>
              </div>
            </section>

            {/* 9. Children's Privacy */}
            <section id="children" className="space-y-4 pt-8 border-t border-white/5">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider">
                <UserCheck size={16} /> Section 9
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                9. Children&apos;s Privacy Notice
              </h2>
              <p>
                WIPA Connect is designed exclusively for legal professionals, IP attorneys, corporate counsel, and adult university students. We do not knowingly collect, solicit, or maintain personal information from children under the age of 18 (or under 16 in the EEA/UK under GDPR-K). If we discover that a minor has provided us with personal data, we will take immediate steps to delete the information and terminate the account.
              </p>
            </section>

            {/* 10. Contact Information */}
            <section id="contact" className="space-y-4 pt-8 border-t border-white/5">
              <div className="flex items-center gap-2 text-purple-400 font-bold text-xs uppercase tracking-wider">
                <Mail size={16} /> Section 10
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                10. Contact Us & Data Protection Officer
              </h2>
              <p>
                If you have questions, feedback, or requests regarding this Privacy Policy or our data practices, please contact our designated Data Protection Officer:
              </p>

              <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 text-xs">
                <div className="font-bold text-white text-sm">Women&apos;s IP Alliance (WIPA) & Northons Media</div>
                <div className="space-y-1 text-slate-300">
                  <p><strong>Organization:</strong> Women&apos;s IP Alliance</p>
                  <p><strong>Primary Support & DPO Email:</strong> <a href="mailto:connect@northonsprmarketing.com" className="text-purple-400 underline">connect@northonsprmarketing.com</a></p>
                  <p><strong>General Alliance Email:</strong> <a href="mailto:contact@womensipalliance.com" className="text-purple-400 underline">contact@womensipalliance.com</a></p>
                  <p><strong>Official Web Portal:</strong> <a href="https://platform.womensipalliance.com" target="_blank" rel="noopener noreferrer" className="text-purple-400 underline">https://platform.womensipalliance.com</a></p>
                </div>
              </div>
            </section>

          </article>
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}
