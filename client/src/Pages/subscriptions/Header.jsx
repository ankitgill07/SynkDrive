import { Cloud } from 'lucide-react'

export default function Header() {
  return (
    <header className="sticky top-0 z-10 border-b bg-white border-black/10">
      <div className="flex items-center justify-between px-6 py-3">
        
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#155dfc] rounded-full flex items-center justify-center flex-shrink-0">
            <Cloud className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-black" style={{ fontFamily: 'var(--font-plus-jakarta, sans-serif)' }}>
            SynkDrive
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#155dfc] to-[#0d3fc4] flex-shrink-0" />
          <span className="text-sm font-medium text-black" style={{ fontFamily: 'var(--font-inter, sans-serif)' }}>
            User Profile
          </span>
        </div>
      </div>
    </header>
  )
}
