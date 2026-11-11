import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md',
  showSubtitle = true 
}) => {
  const iconSizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-base',
    lg: 'w-12 h-12 text-xl'
  };

  const textSizes = {
    sm: 'text-base',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Premium Monogram Icon with Metallic Shield & Diamond V */}
      <div className={`relative ${iconSizes[size]} rounded-xl flex items-center justify-center font-black font-mono shadow-xl shrink-0 group`}>
        {/* Glow backdrop */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-200 opacity-90 blur-[2px] group-hover:blur-[4px] transition-all" />
        
        {/* Main Badge body */}
        <div className="relative w-full h-full rounded-xl bg-gradient-to-b from-zinc-950 via-zinc-900 to-black border border-amber-400/60 flex items-center justify-center overflow-hidden">
          {/* Subtle reflection shimmer */}
          <div className="absolute -top-6 -left-6 w-12 h-12 bg-white/20 rotate-45 pointer-events-none" />

          {/* Golden Geometric V */}
          <svg 
            viewBox="0 0 24 24" 
            fill="none" 
            className="w-5 h-5 drop-shadow-[0_2px_4px_rgba(245,158,11,0.6)]"
          >
            <path 
              d="M3 4L12 21L21 4H16.5L12 14.5L7.5 4H3Z" 
              fill="url(#vellora-gold-grad)" 
            />
            <path 
              d="M12 2L13.5 5.5L17 7L13.5 8.5L12 12L10.5 8.5L7 7L10.5 5.5L12 2Z" 
              fill="#FFFBEB" 
              opacity="0.85" 
            />
            <defs>
              <linearGradient id="vellora-gold-grad" x1="3" y1="4" x2="21" y2="21" gradientUnits="userSpaceOnUse">
                <stop stopColor="#FDE68A" />
                <stop offset="0.45" stopColor="#F59E0B" />
                <stop offset="0.85" stopColor="#D97706" />
                <stop offset="1" stopColor="#92400E" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Brand Name & Typography */}
      <div className="leading-tight">
        <div className="flex items-center gap-1.5">
          <span className={`font-black tracking-wider text-white font-mono ${textSizes[size]}`}>
            VELLORA
          </span>
          <span className="text-[9px] font-black uppercase tracking-wider bg-gradient-to-r from-amber-400 to-amber-600 text-zinc-950 px-1.5 py-0.5 rounded shadow-sm">
            PRO
          </span>
        </div>
        {showSubtitle && (
          <p className="text-[9px] font-bold tracking-widest text-zinc-400 uppercase font-mono">
            Barbershop OS
          </p>
        )}
      </div>
    </div>
  );
};
