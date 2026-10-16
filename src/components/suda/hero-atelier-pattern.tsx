export function HeroAtelierPattern() {
  return (
    <div className="atelier-hero-pattern" aria-hidden="true">
      <svg viewBox="0 0 900 900" preserveAspectRatio="xMidYMid slice" role="presentation">
        <defs>
          <linearGradient id="heroThreadGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E8D7E1" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#A195A2" stopOpacity="0.68" />
          </linearGradient>
        </defs>

        {/* drafting guide lines */}
        <g className="hero-pattern-guides">
          <path d="M34 18V860" />
          <path d="M34 120H330" />
          <path d="M34 330H312" />
          <path d="M34 515H248" />
          <path d="M34 736H410" />
          <path d="M175 0V860" />
          <path d="M350 255V760" />
          <path d="M0 72C98 102 210 80 310 28" />
          <path d="M0 632C144 618 274 676 404 792" />
          <path d="M396 0C322 70 292 146 304 224" />
          <path d="M120 436C176 382 250 366 318 398" />
        </g>

        {/* dress pattern / drafting silhouette */}
        <g className="hero-pattern-outline">
          <path d="M88 120c44-16 83-16 118 0 38 17 78 31 118 42-14 72-52 133-116 184l28 267-138-16 20-214c-45 42-84 92-116 149" />
          <path d="M200 116c8 56 34 102 76 140" />
          <path d="M260 222c-47 31-90 72-128 124" />
          <path d="M156 408c26 31 49 65 68 102" />
          <path d="M152 526c-29 37-48 81-58 132" />
        </g>

        {/* embroidery hoop */}
        <g className="hero-pattern-hoop" transform="translate(176 262)">
          <circle cx="0" cy="0" r="96" />
          <circle cx="0" cy="0" r="87" />
          <rect x="-16" y="-110" width="32" height="18" rx="5" />
          <rect x="-11" y="-126" width="22" height="18" rx="5" />
        </g>

        {/* needle */}
        <g className="hero-pattern-needle" transform="translate(548 180) rotate(32)">
          <path d="M0 0L166 0" />
          <ellipse cx="13" cy="0" rx="10" ry="4.8" />
        </g>

        {/* floating crosses and circles */}
        <g className="hero-pattern-marks">
          <path d="M392 114v34M375 131h34" />
          <path d="M610 258v34M593 275h34" />
          <path d="M336 540v34M319 557h34" />
          <path d="M378 758v34M361 775h34" />
          <path d="M138 790v34M121 807h34" />
          <circle cx="566" cy="182" r="30" />
          <circle cx="420" cy="486" r="34" />
          <circle cx="598" cy="724" r="40" />
        </g>

        {/* flowing thread */}
        <g className="hero-pattern-thread">
          <path d="M563 186c-53 42-84 93-92 152-8 57 15 98 66 124 43 22 74 54 94 96 24 52 22 108-6 168-28 61-79 103-154 125" />
          <path d="M472 851c-66-10-117-45-153-104" />
        </g>

        {/* stitch trajectory */}
        <g className="hero-pattern-stitches">
          <path d="M279 5c95 49 183 121 243 212" />
          <path d="M415 338c52 16 95 47 128 94" />
          <path d="M196 590c78 15 146 47 201 103" />
          <path d="M454 741c66-6 128 10 186 48" />
        </g>

        {/* french curve / ruler */}
        <g className="hero-pattern-ruler" transform="translate(0 0)">
          <path d="M0 890c44-89 96-132 155-131 52 1 92 22 122 64 20 28 47 47 80 56 39 11 70 8 94-8 15-10 29-29 40-57l28 14c-15 39-37 67-66 84-37 22-81 25-133 10-45-13-82-37-111-74-24-31-53-46-87-47-44-1-86 33-124 101z" />
          <path d="M42 860l26-13M56 836l26-13M70 812l26-13M84 788l26-13M98 764l26-13M112 740l26-13M126 716l26-13M140 692l26-13M154 668l26-13M168 644l26-13M182 620l26-13" />
        </g>
      </svg>
    </div>
  );
}
