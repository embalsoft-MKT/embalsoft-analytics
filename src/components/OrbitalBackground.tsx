import { useState } from "react";

interface Planet {
  id: string;
  label: string;
  orbitRadius: number;
  size: number;
  duration: number;
  startAngle: number;
  color: string;
  glowColor: string;
}

const planets: Planet[] = [
  {
    id: "erp",
    label: "ERP",
    orbitRadius: 140,
    size: 38,
    duration: 30,
    startAngle: 0,
    color: "#f48121",
    glowColor: "#f48121",
  },
  {
    id: "crm",
    label: "CRM",
    orbitRadius: 220,
    size: 32,
    duration: 45,
    startAngle: 120,
    color: "#a7c64f",
    glowColor: "#a7c64f",
  },
  {
    id: "wms",
    label: "WMS",
    orbitRadius: 300,
    size: 28,
    duration: 60,
    startAngle: 240,
    color: "#b955a0",
    glowColor: "#b955a0",
  },
];

const stars = Array.from({ length: 80 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 0.5,
  opacity: Math.random() * 0.5 + 0.1,
  duration: Math.random() * 4 + 2,
}));

const OrbitalBackground = () => {
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);

  const cx = 50;
  const cy = 50;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Deep space background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, hsl(222, 47%, 12%) 0%, hsl(222, 47%, 6%) 50%, hsl(222, 47%, 3%) 100%)",
        }}
      />

      {/* Stars */}
      <svg className="absolute inset-0 w-full h-full">
        {stars.map((star) => (
          <circle
            key={star.id}
            cx={`${star.x}%`}
            cy={`${star.y}%`}
            r={star.size}
            fill="white"
            opacity={star.opacity}
          >
            <animate
              attributeName="opacity"
              values={`${star.opacity};${star.opacity * 0.3};${star.opacity}`}
              dur={`${star.duration}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </svg>

      {/* Orbital system */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        style={{ minHeight: "100vh" }}
      >
        <defs>
          {/* Core glow */}
          <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(197, 78%, 52%)" stopOpacity="0.4" />
            <stop offset="50%" stopColor="hsl(197, 78%, 52%)" stopOpacity="0.1" />
            <stop offset="100%" stopColor="hsl(197, 78%, 52%)" stopOpacity="0" />
          </radialGradient>

          {planets.map((p) => (
            <radialGradient key={`grad-${p.id}`} id={`planetGrad-${p.id}`} cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor={p.color} stopOpacity="1" />
              <stop offset="100%" stopColor={p.color} stopOpacity="0.6" />
            </radialGradient>
          ))}

          {planets.map((p) => (
            <filter key={`filter-${p.id}`} id={`glow-${p.id}`} x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="0.4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          ))}

          <filter id="coreFilter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="0.3" />
          </filter>
        </defs>

        {/* Core glow ambient */}
        <circle cx={cx} cy={cy} r="8" fill="url(#coreGlow)" />

        {/* Orbit rings */}
        {planets.map((p) => {
          const r = (p.orbitRadius / 800) * 100;
          return (
            <circle
              key={`orbit-${p.id}`}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke="hsl(197, 78%, 52%)"
              strokeOpacity="0.08"
              strokeWidth="0.15"
              strokeDasharray="0.8 0.6"
            />
          );
        })}

        {/* Core circle glow base */}
        <circle cx={cx} cy={cy} r="3" fill="hsl(197, 78%, 52%)" fillOpacity="0.2" filter="url(#coreFilter)" />
        <circle cx={cx} cy={cy} r="2" fill="hsl(197, 78%, 52%)" fillOpacity="0.4" filter="url(#coreFilter)" />
        
        {/* The Icon Image */}
        <image
          x={cx - 2.2}
          y={cy - 2.2}
          width="4.4"
          height="4.4"
          href="/icon-e.png"
          preserveAspectRatio="xMidYMid meet"
          style={{ opacity: 0.95 }}
        />

        {/* Planets */}
        {planets.map((p) => {
          const r = (p.orbitRadius / 800) * 100;
          const planetR = (p.size / 800) * 100;
          const isHovered = hoveredPlanet === p.id;

          return (
            <g key={p.id}>
              <animateTransform
                attributeName="transform"
                type="rotate"
                from={`${p.startAngle} ${cx} ${cy}`}
                to={`${p.startAngle + 360} ${cx} ${cy}`}
                dur={`${p.duration}s`}
                repeatCount="indefinite"
              />

              {/* Planet glow */}
              <circle
                cx={cx + r}
                cy={cy}
                r={planetR * (isHovered ? 2.5 : 1.8)}
                fill={p.glowColor}
                fillOpacity={isHovered ? 0.2 : 0.08}
                style={{ transition: "all 0.3s ease" }}
              />

              {/* Planet body */}
              <circle
                cx={cx + r}
                cy={cy}
                r={planetR}
                fill={`url(#planetGrad-${p.id})`}
                filter={`url(#glow-${p.id})`}
                stroke={p.color}
                strokeWidth="0.08"
                strokeOpacity="0.5"
                style={{
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  transform: isHovered ? `scale(1.3)` : "scale(1)",
                  transformOrigin: `${cx + r}% ${cy}%`,
                }}
                onMouseEnter={() => setHoveredPlanet(p.id)}
                onMouseLeave={() => setHoveredPlanet(null)}
              />

              {/* Label */}
              <text
                x={cx + r}
                y={cy - planetR - 1}
                textAnchor="middle"
                fill="white"
                fontSize="1.1"
                fontFamily="Inter, sans-serif"
                fontWeight="600"
                opacity={isHovered ? 0.95 : 0}
                style={{ transition: "opacity 0.3s ease", pointerEvents: "none" }}
              >
                {p.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Overlay for login readability */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 50%, transparent 0%, hsl(222, 47%, 4% / 0.4) 60%, hsl(222, 47%, 4% / 0.7) 100%)",
        }}
      />
    </div>
  );
};

export default OrbitalBackground;
