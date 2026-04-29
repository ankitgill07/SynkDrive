import { useState } from 'react';
import { Check, AlertCircle, Zap, Lock, Shield, ArrowRight } from 'lucide-react';

export default function CheckoutPage() {
  const [state, setState] = useState('idle');
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgradeClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      const success = Math.random() > 0.2;
      if (success) {
        setState('success');
        setIsLoading(false);
        setTimeout(() => {
          window.location.href = '/';
        }, 2000);
      } else {
        setState('cancelled');
        setIsLoading(false);
      }
    }, 1500);
  };

  const handleRetry = () => {
    setState('idle');
  };

  const plan = {
    name: 'Professional',
    price: '₹999',
    billingPeriod: 'month',
    description: 'For growing teams building at scale',
    features: [
      { text: 'Unlimited projects', icon: true },
      { text: 'Advanced analytics & insights', icon: true },
      { text: 'Priority 24/7 support', icon: true },
      { text: 'Custom integrations', icon: true },
      { text: 'Team collaboration tools', icon: true },
      { text: 'Advanced security features', icon: true },
    ],
    benefits: [
      { stat: '10x', label: 'Faster deployment' },
      { stat: '99.9%', label: 'Uptime guarantee' },
      { stat: '∞', label: 'Scalability' },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex flex-col overflow-hidden relative">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-slate-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative border-b border-slate-700/50 py-6 px-4 sm:px-6 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <a href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back
          </a>
          <h1 className="text-4xl font-bold text-white mb-2">Upgrade to {plan.name}</h1>
          <p className="text-slate-400 text-lg">
            {plan.description}
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 relative">
        <div className="w-full max-w-2xl">
          {/* Idle State */}
          {state === 'idle' && (
            <div className="animate-in fade-in duration-500">
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {plan.benefits.map((benefit, idx) => (
                  <div key={idx} className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6 text-center hover:border-blue-500/50 transition-colors">
                    <div className="text-3xl font-bold text-blue-400 mb-2">{benefit.stat}</div>
                    <div className="text-sm text-slate-400">{benefit.label}</div>
                  </div>
                ))}
              </div>

              {/* Main Card */}
              <div className="bg-gradient-to-br from-slate-800/60 to-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden hover:border-slate-600/50 transition-all duration-300 shadow-2xl">
                {/* Gradient accent top */}
                <div className="h-1 bg-gradient-to-r from-blue-500 via-blue-400 to-transparent"></div>

                {/* Content */}
                <div className="p-8 sm:p-12">
                  {/* Plan Header */}
                  <div className="mb-10">
                    <h2 className="text-5xl font-bold text-white mb-4">
                      {plan.name}
                    </h2>
                    <div className="flex items-baseline gap-3 mb-4">
                      <span className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-300">
                        {plan.price}
                      </span>
                      <span className="text-slate-400 text-xl">
                        /{plan.billingPeriod}
                      </span>
                    </div>
                    <p className="text-slate-400 text-sm">
                      Billed monthly. Cancel anytime.
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-slate-700 via-slate-600 to-transparent mb-10"></div>

                  {/* Features Grid */}
                  <div className="mb-10">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-6">
                      Everything Included
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-blue-400" />
                          </div>
                          <span className="text-slate-300 font-medium">{feature.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent mb-8"></div>

                  {/* Primary CTA */}
                  <button
                    onClick={handleUpgradeClick}
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 mb-6 shadow-lg hover:shadow-blue-500/25"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing Payment...
                      </>
                    ) : (
                      <>
                        <Zap className="w-5 h-5" />
                        Upgrade Now
                      </>
                    )}
                  </button>

                  {/* Security Info */}
                  <div className="flex items-center justify-center gap-3 text-slate-400 text-sm">
                    <Shield className="w-4 h-4" />
                    <span>Secure payment by Razorpay</span>
                    <Lock className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="mt-8 grid grid-cols-2 gap-4 text-center">
                <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4">
                  <p className="text-slate-300 text-sm font-medium">✓ 256-bit Encryption</p>
                </div>
                <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4">
                  <p className="text-slate-300 text-sm font-medium">✓ 50K+ Happy Users</p>
                </div>
              </div>
            </div>
          )}

          {/* Cancelled State */}
          {state === 'cancelled' && (
            <div className="animate-in fade-in duration-500">
              <div className="bg-gradient-to-br from-slate-800/60 to-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 sm:p-12 text-center">
                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center">
                    <AlertCircle className="w-10 h-10 text-red-400" />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-white mb-4">
                  Payment Cancelled
                </h3>
                <p className="text-slate-400 mb-8">
                  No charges were made to your account. Please try again or contact support.
                </p>
                <button
                  onClick={handleRetry}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 mb-3"
                >
                  Try Again
                </button>
                <a
                  href="/"
                  className="block w-full border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 bg-slate-800/30 hover:bg-slate-700/30"
                >
                  Return Home
                </a>
              </div>
            </div>
          )}

          {/* Success State */}
          {state === 'success' && (
            <div className="animate-in fade-in duration-500">
              <div className="bg-gradient-to-br from-slate-800/60 to-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 sm:p-12 text-center">
                <div className="flex justify-center mb-8">
                  <div className="relative w-24 h-24">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-pulse opacity-30"></div>
                    <div className="relative w-full h-full bg-green-500/20 rounded-full flex items-center justify-center">
                      <Check className="w-12 h-12 text-green-400" />
                    </div>
                  </div>
                </div>
                <h3 className="text-4xl font-bold text-white mb-4">
                  Welcome!
                </h3>
                <p className="text-slate-300 mb-2 text-lg">
                  Your upgrade is complete. You now have access to all {plan.name} features.
                </p>
                <p className="text-slate-500 text-sm mb-8">
                  Redirecting to dashboard in a moment...
                </p>
                <div className="w-full bg-slate-700/50 rounded-full h-1 overflow-hidden">
                  <div className="bg-gradient-to-r from-green-400 to-emerald-400 h-full w-full animate-pulse"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative border-t border-slate-700/50 py-6 px-4 sm:px-6 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto text-center text-sm text-slate-400">
          <p>
            Questions?{' '}
            <a href="#" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
              Contact support
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
