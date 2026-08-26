// @ts-nocheck
'use client';

import React from 'react';
import Link from 'next/link';
import { 
  ShieldAlert, ShieldCheck, Lock, AlertTriangle, UserX, Mail, 
  ExternalLink, CheckCircle2, PhoneCall, Flag, Eye, FileText
} from 'lucide-react';
import PublicHeader from '@/components/PublicHeader';
import PublicFooter from '@/components/PublicFooter';

export default function ChildSafetyStandardsPage() {
  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col selection:bg-[#5a32fa] selection:text-white font-sans">
      <PublicHeader />

      {/* Hero Header */}
      <section className="relative pt-32 pb-16 md:pt-40 md:pb-20 overflow-hidden border-b border-white/5 bg-gradient-to-b from-[#140b1e] via-[#07090e] to-[#07090e]">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-rose-500/20 to-[#5a32fa]/15 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 text-xs font-semibold text-rose-300 mb-6 backdrop-blur-md">
            <ShieldAlert size={14} className="text-rose-400" />
            <span>Google Play CSAE / CSAM Policy Compliance</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
            Child Safety & CSAE Prevention Standards
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed mb-6">
            Women&apos;s IP World Alliance (WIPA) maintains an unconditional <strong>Zero-Tolerance Policy</strong> against Child Sexual Abuse and Exploitation (CSAE) and Child Sexual Abuse Material (CSAM) across all mobile and web services.
          </p>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 font-medium pt-3 border-t border-white/10">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <strong>Status:</strong> Active & Enforced
            </span>
            <span className="text-white/20">•</span>
            <span><strong>App Package:</strong> org.wipa.app</span>
            <span className="text-white/20">•</span>
            <span><strong>Application:</strong> WIPA Connect</span>
            <span className="text-white/20">•</span>
            <span><strong>Last Reviewed:</strong> August 26, 2026</span>
          </div>
        </div>
      </section>

      {/* Main Content Article */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12 lg:py-16 flex-1 w-full space-y-10 text-slate-300 text-sm leading-relaxed">

        {/* 1. Zero-Tolerance Statement */}
        <section className="p-6 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-3">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <AlertTriangle size={18} className="text-rose-400" />
            1. Zero-Tolerance Policy Against CSAE and CSAM
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            WIPA strictly prohibits the creation, possession, transmission, sharing, promotion, or facilitation of Child Sexual Abuse Material (CSAM) or any behavior that constitutes Child Sexual Abuse and Exploitation (CSAE), grooming, sexual solicitation of minors, or trafficking. Any attempt to upload, transmit, or link to such material will result in immediate and permanent account termination, IP ban, and mandatory reporting to law enforcement authorities.
          </p>
        </section>

        {/* 2. Platform Nature & Age Restrictions */}
        <section className="space-y-3 pt-4">
          <h2 className="text-xl font-bold text-white">
            2. Platform Purpose & Age Restrictions
          </h2>
          <p>
            WIPA Connect (<code>org.wipa.app</code>) is an enterprise professional networking platform dedicated exclusively to licensed attorneys, patent specialists, trademark counsel, and adult university law students. 
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-xs text-slate-400 pl-1">
            <li>Users must be at least 18 years of age (or the legal age of majority in their jurisdiction) to create an account.</li>
            <li>We do not knowingly market to, register, or maintain accounts for minors.</li>
          </ul>
        </section>

        {/* 3. Proactive Moderation & Technical Safeguards */}
        <section className="space-y-4 pt-4 border-t border-white/5">
          <h2 className="text-xl font-bold text-white">
            3. Content Moderation & Proactive Safeguards
          </h2>
          <p>
            To keep our community safe, WIPA employs multi-tiered technical safeguards and human moderation:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
              <strong className="text-white flex items-center gap-1.5">
                <CheckCircle2 size={14} className="text-emerald-400" /> Automated Filtering
              </strong>
              <p className="text-slate-400">
                Automated keyword filters and media scanners monitor incoming post attachments and direct messages for harmful content patterns.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
              <strong className="text-white flex items-center gap-1.5">
                <Eye size={14} className="text-purple-400" /> Human Review Queue
              </strong>
              <p className="text-slate-400">
                A dedicated 24/7 security moderation team reviews flagged discussions, images, and user reports in real-time.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
              <strong className="text-white flex items-center gap-1.5">
                <UserX size={14} className="text-rose-400" /> Instant Account Freezing
              </strong>
              <p className="text-slate-400">
                Any account flagged for child exploitation is instantly suspended with all active sessions, database records, and authentication tokens revoked.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
              <strong className="text-white flex items-center gap-1.5">
                <Lock size={14} className="text-blue-400" /> Evidence Preservation
              </strong>
              <p className="text-slate-400">
                Cryptographic audit logs and device metadata are preserved in secure isolation exclusively for lawful disclosure to criminal justice agencies.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Reporting to Law Enforcement & NCMEC / IWF */}
        <section className="space-y-4 pt-4 border-t border-white/5">
          <h2 className="text-xl font-bold text-white">
            4. Mandatory Law Enforcement & NCMEC / IWF Reporting
          </h2>
          <p>
            In accordance with international child protection statutes, the US Federal Protect Act (18 U.S.C. § 2258A), and UK/EU Online Safety Directives:
          </p>
          <ul className="list-disc list-inside space-y-2 text-xs text-slate-300 pl-1">
            <li>WIPA promptly files comprehensive cybertipline reports with the <strong>National Center for Missing & Exploited Children (NCMEC)</strong> and the <strong>Internet Watch Foundation (IWF)</strong> upon detecting apparent child sexual abuse material or exploitation.</li>
            <li>We fully cooperate with local, national, and international law enforcement agencies (including Europol, Interpol, FBI, and the UK National Crime Agency) by providing logs, timestamps, IP addresses, and account details in response to lawful process.</li>
          </ul>
        </section>

        {/* 5. In-App User Reporting Mechanism */}
        <section className="space-y-4 pt-4 border-t border-white/5">
          <h2 className="text-xl font-bold text-white">
            5. In-App User Reporting Mechanism
          </h2>
          <p>
            Every user has direct access to built-in reporting tools across all community areas:
          </p>
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2 text-xs">
            <p className="text-slate-200">
              <strong>How to report harmful content inside the app:</strong>
            </p>
            <ol className="list-decimal list-inside space-y-1 text-slate-400">
              <li>Tap the <strong>More Options (&bull;&bull;&bull;)</strong> menu on any post, comment, message, or member profile.</li>
              <li>Select <strong>&ldquo;Report Content&rdquo;</strong> &rarr; Choose <strong>&ldquo;Child Safety & Exploitation Concern&rdquo;</strong>.</li>
              <li>Our trust & safety team is immediately notified, and the reported content is hidden from view pending urgent review.</li>
            </ol>
          </div>
        </section>

        {/* 6. Contact & Emergency Safety Channel */}
        <section className="space-y-4 pt-4 border-t border-white/5">
          <h2 className="text-xl font-bold text-white">
            6. Dedicated Safety Contact Channel
          </h2>
          <p>
            To report suspected CSAE, child safety concerns, or to contact our Trust & Safety Officer directly:
          </p>

          <div className="p-6 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 text-xs">
            <div className="font-bold text-white text-base">WIPA Trust & Safety Response Team</div>
            <div className="space-y-1.5 text-slate-300">
              <p><strong>Direct Safety Email:</strong> <a href="mailto:safety@womensipalliance.com" className="text-purple-400 font-semibold underline">safety@womensipalliance.com</a></p>
              <p><strong>Alternative Emergency Email:</strong> <a href="mailto:connect@northonsprmarketing.com?subject=URGENT%20Child%20Safety%20Report" className="text-purple-400 font-semibold underline">connect@northonsprmarketing.com</a></p>
              <p><strong>Response Time:</strong> Immediate / Under 4 Hours for Child Safety Reports</p>
              <p><strong>UK Office Phone:</strong> +44 (0)203-813-0457</p>
              <p><strong>Official Web Portal:</strong> <a href="https://platform.womensipalliance.com" target="_blank" rel="noopener noreferrer" className="text-purple-400 underline">https://platform.womensipalliance.com</a></p>
            </div>
          </div>
        </section>

      </main>

      <PublicFooter />
    </div>
  );
}
