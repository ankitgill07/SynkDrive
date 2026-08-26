import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Shield, Mail } from "lucide-react";
import secondlogo from "../assets/images/secondlogo.png";

export default function PrivacyPolicy() {
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
              <Shield size={28} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-plusjakartaSans tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-slate-500 mt-2 text-sm">
              Last updated: August 26, 2026
            </p>
          </div>

          {/* Intro Text */}
          <p className="text-base text-slate-600 leading-relaxed mb-6">
            At SynkDrive, accessible from our application and website, one of our main priorities is the privacy of our visitors and users. This Privacy Policy document contains types of information that is collected and recorded by SynkDrive and how we use it.
          </p>
          <p className="text-base text-slate-600 leading-relaxed mb-8">
            If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at the details provided below.
          </p>

          {/* Privacy Content Sections */}
          <div className="space-y-8">
            {/* Section 1 */}
            <section>
              <h2 className="text-xl font-bold text-slate-950 font-plusjakartaSans mb-3 flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">1</span>
                Information We Collect
              </h2>
              <div className="text-slate-600 leading-relaxed space-y-3 pl-0 sm:pl-7">
                <p>
                  We collect information that you directly provide to us when you create an account, upload files, customize your profile, or purchase a subscription. This includes:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 mt-2">
                  <li><strong>Account Information:</strong> Your name, email address, password, profile picture, and registration timestamp.</li>
                  <li><strong>Files and Data:</strong> The files, folders, photos, images, and other metadata you upload to the Service.</li>
                  <li><strong>Billing Information:</strong> Payment details, transaction history, subscription tier, and checkout states.</li>
                  <li><strong>Communication History:</strong> Any details you share when contacting customer support or email queries.</li>
                </ul>
              </div>
            </section>

            {/* Section 2 */}
            <section>
              <h2 className="text-xl font-bold text-slate-950 font-plusjakartaSans mb-3 flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">2</span>
                How We Use Your Information
              </h2>
              <div className="text-slate-600 leading-relaxed space-y-3 pl-0 sm:pl-7">
                <p>
                  We use the information we collect in various ways, including to:
                </p>
                <ul className="list-disc pl-5 space-y-1.5 mt-2">
                  <li>Provide, operate, and maintain our cloud storage platform and synchronization service.</li>
                  <li>Improve, personalize, and expand the performance and user experience of SynkDrive.</li>
                  <li>Understand and analyze how you use our Service to build better features.</li>
                  <li>Process billing payments and manage active paid subscriptions.</li>
                  <li>Communicate with you directly, including for customer service, updates, and service announcements.</li>
                  <li>Detect, prevent, and mitigate security threats, fraud, or abuse.</li>
                </ul>
              </div>
            </section>

            {/* Section 3 */}
            <section>
              <h2 className="text-xl font-bold text-slate-950 font-plusjakartaSans mb-3 flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">3</span>
                File Storage & Security
              </h2>
              <div className="text-slate-600 leading-relaxed space-y-3 pl-0 sm:pl-7">
                <p>
                  The security of your files and personal information is our priority. SynkDrive employs robust technical and organizational security measures to protect your data from unauthorized access, loss, misuse, or alteration.
                </p>
                <p>
                  Files stored on SynkDrive are protected using secure server protocols, database validation, and modern access tokens. When you share files publicly or via email links, only users with the specific shared URL or authenticated access tokens can download them.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section>
              <h2 className="text-xl font-bold text-slate-950 font-plusjakartaSans mb-3 flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">4</span>
                Sharing and Disclosing Information
              </h2>
              <div className="text-slate-600 leading-relaxed space-y-3 pl-0 sm:pl-7">
                <p>
                  We do not sell, rent, or trade your personal information or files to third parties. We may share information with trusted third-party service providers who assist us in operating our database, managing payments, or running email servers. These providers are bound by strict confidentiality agreements.
                </p>
                <p>
                  We may also disclose information if required to do so by law or in response to valid requests by public authorities (e.g., a court or government agency).
                </p>
              </div>
            </section>

            {/* Section 5 */}
            <section>
              <h2 className="text-xl font-bold text-slate-950 font-plusjakartaSans mb-3 flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">5</span>
                Data Retention & Deletion
              </h2>
              <div className="text-slate-600 leading-relaxed space-y-3 pl-0 sm:pl-7">
                <p>
                  We will retain your personal information and uploaded files only for as long as is necessary for the purposes set out in this Privacy Policy.
                </p>
                <p>
                  If you delete a file, it is moved to the Recycle Bin where it remains until you permanently empty it. If you choose to delete your SynkDrive account, all account records, user metadata, and stored files are permanently and irreversibly deleted from our active servers.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section>
              <h2 className="text-xl font-bold text-slate-950 font-plusjakartaSans mb-3 flex items-center gap-2">
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">6</span>
                Your Rights & Choice
              </h2>
              <div className="text-slate-600 leading-relaxed space-y-3 pl-0 sm:pl-7">
                <p>
                  You have the right to access, update, correct, or delete your account information and files at any time directly through the SynkDrive interface. If you wish to make further requests regarding your personal data, please contact us.
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
                If you have any issues, feedback, or questions regarding our Privacy Policy, please contact our support team.
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
