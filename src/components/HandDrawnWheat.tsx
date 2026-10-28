import React from 'react';

export interface HandDrawnWheatProps {
  /**
   * Mode:
   * - 'image': Uses the user's authentic hand-drawn watercolor illustration file (/assets/aistudio/image_13eec36b.png)
   *            with mix-blend-multiply for pristine transparency on light/cream backgrounds.
   * - 'svg': Vector recreation with organic watercolor fills and ink line art, works on light surfaces.
   * - 'footer-gold': Specialized gold and warm cream vector line art for dark backgrounds like the barn-green footer.
   */
  variant?: 'image' | 'svg' | 'footer-gold';
  /** Flip horizontally for visual variety (alternating sides) */
  flip?: boolean;
  /** Gentle rotation in degrees */
  rotate?: number;
  /** Sway animation speed: 'normal' (7s), 'slow' (10s), 'reverse' (8.5s), or 'none' */
  sway?: 'normal' | 'slow' | 'reverse' | 'none';
  /** Visual opacity between 0 and 1 (default 0.75 for subtle watermark feel) */
  opacity?: number;
  /** Custom wrapper classes for positioning (e.g. absolute, top, right, etc.) */
  className?: string;
  /** Optional width/height override style or sizing */
  heightClass?: string;
}

export const HandDrawnWheat: React.FC<HandDrawnWheatProps> = ({
  variant = 'image',
  flip = false,
  rotate = 0,
  sway = 'normal',
  opacity = 0.75,
  className = '',
  heightClass = 'h-56 sm:h-72 lg:h-84',
}) => {
  const swayClass =
    sway === 'slow'
      ? 'animate-wheat-breeze-slow'
      : sway === 'reverse'
      ? 'animate-wheat-breeze-rev'
      : sway === 'normal'
      ? 'animate-wheat-breeze'
      : '';

  const transformStyle: React.CSSProperties = {
    transform: `rotate(${rotate}deg)${flip ? ' scaleX(-1)' : ''}`,
    opacity,
  };

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none select-none z-0 ${className}`}
      style={{ willChange: 'transform' }}
    >
      <div className={`${swayClass} transition-transform duration-700 ease-out`} style={transformStyle}>
        {variant === 'image' ? (
          /* Authentic Hand-Drawn Wheat Artwork uploaded by user */
          <img
            src="/assets/aistudio/image_13eec36b.png"
            alt=""
            className={`${heightClass} w-auto max-w-none object-contain mix-blend-multiply filter contrast-105`}
            loading="lazy"
            decoding="async"
          />
        ) : variant === 'footer-gold' ? (
          /* Hand-drawn wheat vector tuned specifically for dark forest-green backgrounds */
          <svg
            viewBox="0 0 200 360"
            className={`${heightClass} w-auto`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Soft luminous golden watercolor washes */}
            <g opacity="0.85">
              <path
                d="M32 124 C 55 138, 72 195, 84 278"
                stroke="#EDA838"
                strokeWidth="7"
                strokeLinecap="round"
                opacity="0.75"
              />
              <path
                d="M52 148 C 68 175, 78 220, 88 285"
                stroke="#F5B84B"
                strokeWidth="5"
                strokeLinecap="round"
                opacity="0.65"
              />
              {/* Central ear grain kernel watercolor fills */}
              <ellipse cx="98" cy="235" rx="9" ry="15" transform="rotate(-15 98 235)" fill="#F0AD3E" opacity="0.8" />
              <ellipse cx="112" cy="216" rx="9" ry="16" transform="rotate(25 112 216)" fill="#E59324" opacity="0.85" />
              <ellipse cx="108" cy="190" rx="9" ry="16" transform="rotate(-20 108 190)" fill="#F0AD3E" opacity="0.8" />
              <ellipse cx="124" cy="172" rx="9" ry="15" transform="rotate(30 124 172)" fill="#EDA838" opacity="0.85" />
              <ellipse cx="120" cy="148" rx="8" ry="15" transform="rotate(-18 120 148)" fill="#E59324" opacity="0.8" />
              <ellipse cx="135" cy="132" rx="8" ry="14" transform="rotate(32 135 132)" fill="#F5B84B" opacity="0.85" />
              <ellipse cx="132" cy="112" rx="7" ry="13" transform="rotate(-15 132 112)" fill="#EDA838" opacity="0.8" />
              <ellipse cx="146" cy="98" rx="6" ry="12" transform="rotate(35 146 98)" fill="#F5B84B" opacity="0.8" />
              <path
                d="M102 245 C 120 230, 150 200, 172 185"
                stroke="#EDA838"
                strokeWidth="6"
                strokeLinecap="round"
                opacity="0.7"
              />
            </g>

            {/* Delicate hand-drawn botanical ink lines (golden-sand for dark background) */}
            <g stroke="#E9DFC9" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.85">
              {/* Left flowing leaf blade */}
              <path d="M86 318 C 80 260, 60 170, 24 122 C 38 132, 68 185, 82 278" />
              {/* Stems gathering at base */}
              <path d="M86 318 C 88 335, 93 342, 98 340 C 103 338, 100 310, 98 275 C 96 230, 102 180, 114 135" />
              {/* Right arched leaf blade */}
              <path d="M96 270 C 114 235, 145 195, 184 170" />
              {/* Hand-drawn ear kernel outlines with organic loops */}
              <path d="M92 245 C 88 230, 94 218, 102 225 C 108 232, 104 246, 96 252 Z" />
              <path d="M100 230 C 106 215, 120 215, 122 224 C 124 234, 112 240, 104 234" />
              <path d="M104 205 C 100 188, 110 178, 118 185 C 122 192, 118 206, 110 210" />
              <path d="M116 186 C 122 170, 134 172, 136 182 C 137 190, 128 196, 120 190" />
              <path d="M118 162 C 114 148, 124 138, 130 144 C 136 150, 132 164, 124 166" />
              <path d="M128 144 C 134 130, 146 132, 148 140 C 148 148, 138 154, 132 148" />
              <path d="M130 125 C 126 112, 134 104, 142 110 C 146 116, 142 126, 135 128" />
              <path d="M140 108 C 145 96, 154 98, 156 106 C 156 114, 148 118, 142 112" />
              {/* Beards / awns extending from grain ear */}
              <path d="M144 100 L 158 84" />
              <path d="M136 115 L 148 102" />
            </g>
          </svg>
        ) : (
          /* SVG vector version with dark ink contours for light surfaces */
          <svg
            viewBox="0 0 200 360"
            className={`${heightClass} w-auto`}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Soft warm golden-orange watercolor brush strokes */}
            <g opacity="0.9">
              <path
                d="M32 124 C 55 138, 72 195, 84 278"
                stroke="#EDA838"
                strokeWidth="7"
                strokeLinecap="round"
                opacity="0.8"
              />
              <path
                d="M52 148 C 68 175, 78 220, 88 285"
                stroke="#F5B84B"
                strokeWidth="5"
                strokeLinecap="round"
                opacity="0.7"
              />
              <ellipse cx="98" cy="235" rx="9" ry="15" transform="rotate(-15 98 235)" fill="#F0AD3E" opacity="0.85" />
              <ellipse cx="112" cy="216" rx="9" ry="16" transform="rotate(25 112 216)" fill="#E59324" opacity="0.9" />
              <ellipse cx="108" cy="190" rx="9" ry="16" transform="rotate(-20 108 190)" fill="#F0AD3E" opacity="0.85" />
              <ellipse cx="124" cy="172" rx="9" ry="15" transform="rotate(30 124 172)" fill="#EDA838" opacity="0.9" />
              <ellipse cx="120" cy="148" rx="8" ry="15" transform="rotate(-18 120 148)" fill="#E59324" opacity="0.85" />
              <ellipse cx="135" cy="132" rx="8" ry="14" transform="rotate(32 135 132)" fill="#F5B84B" opacity="0.9" />
              <ellipse cx="132" cy="112" rx="7" ry="13" transform="rotate(-15 132 112)" fill="#EDA838" opacity="0.85" />
              <ellipse cx="146" cy="98" rx="6" ry="12" transform="rotate(35 146 98)" fill="#F5B84B" opacity="0.85" />
              <path
                d="M102 245 C 120 230, 150 200, 172 185"
                stroke="#EDA838"
                strokeWidth="6"
                strokeLinecap="round"
                opacity="0.75"
              />
            </g>

            {/* Hand-drawn organic black ink lines */}
            <g stroke="#1F211D" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M86 318 C 80 260, 60 170, 24 122 C 38 132, 68 185, 82 278" />
              <path d="M86 318 C 88 335, 93 342, 98 340 C 103 338, 100 310, 98 275 C 96 230, 102 180, 114 135" />
              <path d="M96 270 C 114 235, 145 195, 184 170" />
              <path d="M92 245 C 88 230, 94 218, 102 225 C 108 232, 104 246, 96 252 Z" />
              <path d="M100 230 C 106 215, 120 215, 122 224 C 124 234, 112 240, 104 234" />
              <path d="M104 205 C 100 188, 110 178, 118 185 C 122 192, 118 206, 110 210" />
              <path d="M116 186 C 122 170, 134 172, 136 182 C 137 190, 128 196, 120 190" />
              <path d="M118 162 C 114 148, 124 138, 130 144 C 136 150, 132 164, 124 166" />
              <path d="M128 144 C 134 130, 146 132, 148 140 C 148 148, 138 154, 132 148" />
              <path d="M130 125 C 126 112, 134 104, 142 110 C 146 116, 142 126, 135 128" />
              <path d="M140 108 C 145 96, 154 98, 156 106 C 156 114, 148 118, 142 112" />
              <path d="M144 100 L 158 84" />
              <path d="M136 115 L 148 102" />
            </g>
          </svg>
        )}
      </div>
    </div>
  );
};
