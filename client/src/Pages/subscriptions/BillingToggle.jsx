
export default function BillingToggle({ isYearly, setIsYearly }) {
  return (
    <div className="flex flex-col items-center gap-4">
      {/* Toggle Switch */}
      <div className="flex items-center gap-3 bg-white border border-black/10 rounded-full p-1">
        <button
          onClick={() => setIsYearly(false)}
          className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
            !isYearly
              ? 'bg-[#155dfc] text-white'
              : 'bg-transparent text-black hover:text-[#155dfc]'
          }`}
          style={{ fontFamily: 'var(--font-inter, sans-serif)' }}
        >
          Monthly
        </button>
        <button
          onClick={() => setIsYearly(true)}
          className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
            isYearly
              ? 'bg-[#155dfc] text-white'
              : 'bg-transparent text-black hover:text-[#155dfc]'
          }`}
          style={{ fontFamily: 'var(--font-inter, sans-serif)' }}
        >
          Yearly
        </button>
      </div>

      {/* Save Text */}
      <p className="text-sm text-black/60" style={{ fontFamily: 'var(--font-inter, sans-serif)' }}>
        Save 20% yearly
      </p>
    </div>
  )
}
