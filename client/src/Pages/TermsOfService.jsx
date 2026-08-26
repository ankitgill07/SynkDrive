import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Mail } from "lucide-react";
import secondlogo from "../assets/images/secondlogo.png";

export default function TermsOfService() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-inter">
      {/* Top Navigation / Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/drive/home" className="flex items-center gap-2">
              <img
                className="object-cover w-8 h-8 rounded-md"
                src={secondlogo}
                alt="SynkDrive Logo"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
              <span className="text-xl font-bold font-plusjakartaSans text-slate-900">
                SynkDrive
              </span>
            </Link>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors py-2 px-4 rounded-lg hover:bg-slate-100/80"
          >
            <ArrowLeft size={16} />
            Back
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 sm:p-10 md:p-12">
          {/* Header Section */}
          <div className="border-b border-slate-100 pb-8 mb-8 text-center sm:text-left">
            <div className="inline-flex p-3 rounded-xl bg-blue-50 text-[#155DFC] mb-4">
              <FileText size={28} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-plusjakartaSans tracking-tight">
              Terms of Service
            </h1>
            <p className="text-slate-500 mt-2 text-sm">
              Last updated: August 26, 2026
            </p>
          </div>

          {/* Intro Text */}
          <p className="text-base text-slate-600 leading-relaxed mb-6">
            Welcome to SynkDrive! Please read these Terms of Service ("Terms") carefully before using the SynkDrive cloud storage platform, synchronization services, and related applications (collectively, the "Service"). The Service is operated by SynkDrive.
          </p>
          <p className="text-base text-slate-600 leading-relaxed mb-8">
            By accessing or using our Service, you agree to be bound by these Terms and our Privacy Policy. If you do not agree to any part of these Terms, you do not have permission to access the Service.
          </p>

          {/* Terms Content Sections */}
          <div className="space-y-8">
            {/* Section 1 */}
            <section>
              <h2 className="text-xl font-bold text-slate-950 font-plusjakartaSans mb-3 flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">1</span>
                Account Registration & Security
              </h2>
              <div className="text-slate-600 leading-relaxed space-y-3 pl-0 sm:pl-7">
                <p>
                  To use certain features of the Service, you must register for an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
                </p>
                <p>
                  You are responsible for safeguarding your password and account credentials. You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
                </p>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-xl font-bold text-slate-950 font-plusjakartaSans mb-3 flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">2</span>
                Storage & Usage Limits
              </h2>
              <div className="text-slate-600 leading-relaxed space-y-3 pl-0 sm:pl-7">
                <p>
                  SynkDrive provides storage space for your files, folders, photos, and other data ("User Content"). The storage capacity available to you depends on your subscription tier (Free, Premium, etc.).
                </p>
                <p>
                  You agree not to exceed the storage limits associated with your account. If you exceed your limit, we reserve the right to suspend upload functionality, restrict access to your files, or require you to upgrade to an appropriate paid tier.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-xl font-bold text-slate-950 font-plusjakartaSans mb-3 flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">3</span>
                Acceptable Use & User Content
              </h2>
              <div className="text-slate-600 leading-relaxed space-y-3 pl-0 sm:pl-7">
                <p>
                  You retain full ownership of all data, files, and content that you upload, store, or share through SynkDrive. We do not claim any ownership rights over your User Content.
                </p>
                <p>
                  However, you are solely responsible for your content and your conduct. You agree not to upload, store, share, or transmit any content that:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 mt-2">
                  <li>Is illegal, harmful, threatening, abusive, harassing, defamatory, or invasive of another's privacy.</li>
                  <li>Infringes any patent, trademark, trade secret, copyright, or other proprietary rights of any party.</li>
                  <li>Contains viruses, malware, trojan horses, worms, or any other computer code designed to interrupt or damage the Service.</li>
                  <li>Impersonates any person or entity or misrepresents your affiliation with any person or entity.</li>
                </ul>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-xl font-bold text-slate-950 font-plusjakartaSans mb-3 flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">4</span>
                Paid Subscriptions, Billing & Refunds
              </h2>
              <div className="text-slate-600 leading-relaxed space-y-3 pl-0 sm:pl-7">
                <p>
                  Some aspects of the Service are billed on a subscription basis. You will be billed in advance on a recurring and periodic basis (monthly or annually) depending on the plan you select.
                </p>
                <p>
                  Subscriptions automatically renew under the same conditions unless you cancel your subscription or we cancel it. You may cancel your subscription at any time through your subscription management page. All fees paid are non-refundable except when required by law.
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-xl font-bold text-slate-950 font-plusjakartaSans mb-3 flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">5</span>
                Termination & Account Deletion
              </h2>
              <div className="text-slate-600 leading-relaxed space-y-3 pl-0 sm:pl-7">
                <p>
                  We may terminate or suspend your account and bar access to the Service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever, including without limitation if you breach the Terms.
                </p>
                <p>
                  Upon termination, your right to use the Service will immediately cease. You may also delete your account at any time. Upon account deletion, your stored files and data will be permanently deleted and cannot be recovered.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-xl font-bold text-slate-950 font-plusjakartaSans mb-3 flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">6</span>
                Disclaimers & Limitation of Liability
              </h2>
              <div className="text-slate-600 leading-relaxed space-y-3 pl-0 sm:pl-7">
                <p>
                  THE SERVICE IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS. SYNKDRIVE MAKES NO WARRANTIES, EXPRESSED OR IMPLIED, AND HEREBY DISCLAIMS AND NEGATES ALL OTHER WARRANTIES, INCLUDING WITHOUT LIMITATION, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT OF INTELLECTUAL PROPERTY.
                </p>
                <p>
                  IN NO EVENT SHALL SYNKDRIVE OR ITS SUPPLIERS BE LIABLE FOR ANY DAMAGES (INCLUDING, WITHOUT LIMITATION, DAMAGES FOR LOSS OF DATA OR PROFIT, OR DUE TO BUSINESS INTERRUPTION) ARISING OUT OF THE USE OR INABILITY TO USE THE SERVICE.
                </p>
              </div>
            </section>
          </div>

          {/* Help Box/Contact info */}
          <div className="mt-12 p-6 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="p-3 bg-white text-[#155DFC] rounded-lg shadow-sm border border-slate-200/50 shrink-0">
              <Mail size={24} />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 font-plusjakartaSans text-base">
                Have questions or need assistance?
              </h3>
              <p className="text-slate-500 text-sm mt-0.5">
                If you have any issues, feedback, or questions regarding these Terms, please contact our support team.
              </p>
              <div className="mt-2">
                <a
                  href="mailto:ankit930k@gmail.com"
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-[#155DFC] hover:underline"
                >
                  ankit930k@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
