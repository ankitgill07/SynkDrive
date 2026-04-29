import { useState, useEffect } from 'react'
import { X, CreditCard } from 'lucide-react'



export default function SubscriptionModal({
  isOpen,
  onClose,
  planType
}) {
  const [timeLeft, setTimeLeft] = useState(3)
  const [showRedirecting, setShowRedirecting] = useState(false)

  useEffect(() => {
    if (!isOpen) {
      setTimeLeft(3)
      setShowRedirecting(false)
      return
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setShowRedirecting(true)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
  
      <div
        className="bg-[#faf9f7] rounded-2xl border border-black/10 p-6 max-w-md w-full shadow-lg animate-in fade-in zoom-in duration-300"
      >
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-black/60 hover:text-black transition-colors"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Content */}
        <div className="flex flex-col items-center text-center pt-4">
          {/* Payment Indicator */}
          <CreditCard className="w-12 h-12 text-[#155dfc] mb-6 animate-pulse" />

          {/* Heading */}
          <h2
            className="text-2xl font-bold text-black mb-2"
            style={{ fontFamily: 'var(--font-plus-jakarta, sans-serif)' }}
          >
            {showRedirecting ? 'Redirecting...' : 'Redirecting to Payment'}
          </h2>

          {/* Subtext */}
          <p
            className="text-black/60 text-sm mb-6"
            style={{ fontFamily: 'var(--font-inter, sans-serif)' }}
          >
            {showRedirecting ? '' : 'You will be redirected securely in'}
          </p>

          {!showRedirecting && (
            <div
              className="text-4xl font-bold text-[#155dfc] mb-6"
              style={{ fontFamily: 'var(--font-plus-jakarta, sans-serif)' }}
            >
              {timeLeft}
            </div>
          )}

          {/* Note */}
          <p
            className="text-sm text-black/50 mb-6"
            style={{ fontFamily: 'var(--font-inter, sans-serif)' }}
          >
            Please do not close this window.
          </p>

          {/* Proceed Now Button */}
          <button
            onClick={onClose}
            className="w-full bg-[#155dfc] text-white py-2.5 rounded-xl font-semibold hover:bg-[#0d3fc4] transition-colors"
            style={{ fontFamily: 'var(--font-inter, sans-serif)' }}
          >
            Proceed Now
          </button>
        </div>
      </div>
    </div>
  )
}
