import React from 'react';

export type LogoVariant = 
  | 'default'
  | 'monochrome-white'
  | 'monochrome-black'
  | 'titanium'
  | 'liquid-glass'
  | 'squircle';

interface InternEdgeIconProps {
  size?: number | string;
  variant?: LogoVariant;
  className?: string;
}

/**
 * InternEdge Iconic Geometric Symbol (I E Monogram)
 * Recreated with exact mathematical precision matching the billion-dollar brand direction.
 */
export const InternEdgeIcon: React.FC<InternEdgeIconProps> = ({
  size = 32,
  variant = 'default',
  className = '',
}) => {
  const numericSize = typeof size === 'number' ? size : parseInt(size, 10) || 32;

  // Pure SVG paths for the precision geometric IE mark
  const renderPaths = (fillColor: string = '#FFFFFF') => (
    <g className="transition-transform duration-300 group-hover:scale-[1.02]">
      {/* Left Pillar 'I' */}
      <path d="M 14 14 H 30 V 86 H 14 Z" fill={fillColor} />
      
      {/* Top Arm of 'E' with parallel 45° chamfer cut */}
      <path d="M 43 14 H 86 L 70 30 H 43 Z" fill={fillColor} />
      
      {/* Middle Arm of 'E' */}
      <path d="M 43 42 H 68 V 58 H 43 Z" fill={fillColor} />
      
      {/* Bottom Arm of 'E' with parallel 45° chamfer cut */}
      <path d="M 43 70 H 86 L 70 86 H 43 Z" fill={fillColor} />
    </g>
  );

  if (variant === 'monochrome-black') {
    return (
      <div 
        className={`relative inline-flex items-center justify-center bg-white rounded-[22%] border border-black/10 shadow-lg ${className}`}
        style={{ width: numericSize, height: numericSize, padding: numericSize * 0.18 }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {renderPaths('#0A0A0A')}
        </svg>
      </div>
    );
  }

  if (variant === 'titanium') {
    return (
      <div 
        className={`relative inline-flex items-center justify-center rounded-[22%] bg-gradient-to-b from-[#3a3b3e] via-[#222326] to-[#111214] border border-white/20 shadow-2xl overflow-hidden group ${className}`}
        style={{ width: numericSize, height: numericSize, padding: numericSize * 0.18 }}
      >
        {/* Subtle Brushed Metallic Sheen */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-60 pointer-events-none" />
        <svg viewBox="0 0 100 100" className="w-full h-full relative z-10 filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
          {renderPaths('#FFFFFF')}
        </svg>
      </div>
    );
  }

  if (variant === 'liquid-glass') {
    return (
      <div 
        className={`relative inline-flex items-center justify-center rounded-[22%] bg-white/10 backdrop-blur-2xl border border-white/25 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_8px_24px_rgba(0,0,0,0.6)] overflow-hidden group ${className}`}
        style={{ width: numericSize, height: numericSize, padding: numericSize * 0.18 }}
      >
        {/* Liquid Glass Highlight */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-transparent opacity-80 pointer-events-none" />
        <svg viewBox="0 0 100 100" className="w-full h-full relative z-10 filter drop-shadow-[0_2px_8px_rgba(255,255,255,0.3)]">
          {renderPaths('#FFFFFF')}
        </svg>
      </div>
    );
  }

  if (variant === 'squircle') {
    return (
      <div 
        className={`relative inline-flex items-center justify-center rounded-[22%] bg-white/10 border border-white/20 shadow-lg ${className}`}
        style={{ width: numericSize, height: numericSize, padding: numericSize * 0.18 }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {renderPaths('#FFFFFF')}
        </svg>
      </div>
    );
  }

  // Bare / Monochrome White SVG
  return (
    <svg 
      viewBox="0 0 100 100" 
      width={numericSize} 
      height={numericSize} 
      className={`inline-block ${className}`}
    >
      {renderPaths(variant === 'monochrome-white' ? '#FFFFFF' : '#FFFFFF')}
    </svg>
  );
};

interface InternEdgeWordmarkProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | number;
  textColor?: string;
  className?: string;
  showTagline?: boolean;
}

/**
 * InternEdge Wordmark with wide optical tracking and geometric typography
 */
export const InternEdgeWordmark: React.FC<InternEdgeWordmarkProps> = ({
  textColor = 'text-white',
  className = '',
  showTagline = false,
}) => {
  return (
    <div className={`flex flex-col items-start ${className}`}>
      <span className={`font-semibold tracking-[0.35em] ${textColor} uppercase select-none font-sans text-xs md:text-sm`}>
        INTERNEDGE
      </span>
      {showTagline && (
        <span className="text-[9px] font-mono tracking-[0.25em] text-zinc-400 uppercase pt-1 select-none">
          DISCOVER • PREPARE • CONNECT • SUCCEED
        </span>
      )}
    </div>
  );
};

interface InternEdgeLogoProps {
  iconSize?: number;
  variant?: LogoVariant;
  showWordmark?: boolean;
  showTagline?: boolean;
  className?: string;
}

/**
 * Primary Combined InternEdge Brand Logo
 */
export const InternEdgeLogo: React.FC<InternEdgeLogoProps> = ({
  iconSize = 32,
  variant = 'liquid-glass',
  showWordmark = true,
  showTagline = false,
  className = '',
}) => {
  return (
    <div className={`inline-flex items-center gap-3.5 ${className}`}>
      <InternEdgeIcon size={iconSize} variant={variant} />
      {showWordmark && (
        <InternEdgeWordmark showTagline={showTagline} />
      )}
    </div>
  );
};
