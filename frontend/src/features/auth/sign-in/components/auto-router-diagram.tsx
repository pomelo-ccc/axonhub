/**
 * AutoRouterDiagram
 * A lightweight, dependency-free animated SVG matching the restrained auth surface.
 */
export default function AutoRouterDiagram() {
  return (
    <div className='w-full select-none'>
      <svg viewBox='70 0 536 360' role='img' aria-labelledby='auto-router-title' className='h-auto w-full' preserveAspectRatio='xMinYMid meet'>
        <title id='auto-router-title'>Auto Router Diagram</title>

        <style>{`
          .ar-dash {
            stroke-dasharray: 6 8;
            animation: ar-dash-flow 4.5s linear infinite;
          }
          @keyframes ar-dash-flow {
            to { stroke-dashoffset: -140; }
          }
          .ar-pulse {
            transform-origin: 360px 180px;
            animation: ar-pulse 3.8s ease-in-out infinite;
          }
          @keyframes ar-pulse {
            0%, 100% { opacity: 0.65; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.03); }
          }
        `}</style>

        <g className='ar-pulse'>
          <circle cx='360' cy='180' r='78' fill='none' stroke='var(--border)' strokeWidth='1.5' />
          <circle cx='360' cy='180' r='52' fill='none' stroke='var(--border)' strokeWidth='1.5' />
          <circle cx='360' cy='180' r='30' fill='var(--accent)' stroke='var(--primary)' strokeWidth='1.5' />
        </g>

        <defs>
          <path id='ar-curve' d='M 360 180 m -60 0 a 60 60 0 1 1 132 0' fill='none' />
          <marker id='arrow' markerWidth='8' markerHeight='8' refX='8' refY='4' orient='auto'>
            <path d='M0,0 L8,4 L0,8 Z' fill='var(--muted-foreground)' />
          </marker>
        </defs>

        <text fontFamily='var(--font-sans)' fontSize='18' fill='var(--foreground)'>
          <textPath href='#ar-curve' startOffset='30%'>
            AxonHub
          </textPath>
        </text>

        <g transform='translate(360 180)'>
          <g transform='translate(-10 -10)'>
            <circle cx='10' cy='10' r='10' fill='var(--accent)' opacity='0.95' />
            <path d='M3 16 L10 4 L17 16 M6.5 10.5 H13.5' fill='none' stroke='var(--primary)' strokeWidth='1.6' strokeLinecap='round' />
          </g>
        </g>

        <g>
          <rect x='70' y='98' rx='10' ry='10' width='120' height='44' fill='var(--card)' stroke='var(--border)' />
          <text x='130' y='125' textAnchor='middle' fontSize='16' fill='var(--foreground)' fontFamily='var(--font-sans)'>
            Deepseek
          </text>

          <rect x='70' y='168' rx='10' ry='10' width='120' height='44' fill='var(--card)' stroke='var(--border)' />
          <text x='130' y='195' textAnchor='middle' fontSize='16' fill='var(--foreground)' fontFamily='var(--font-sans)'>
            OpenAI
          </text>

          <rect x='70' y='238' rx='10' ry='10' width='120' height='44' fill='var(--card)' stroke='var(--border)' />
          <text x='130' y='265' textAnchor='middle' fontSize='16' fill='var(--foreground)' fontFamily='var(--font-sans)'>
            Anthropic
          </text>
        </g>

        <path d='M190 120 C 240 120, 280 144, 328 164' fill='none' stroke='var(--muted-foreground)' strokeOpacity='0.7' strokeWidth='1.5' className='ar-dash' />
        <path d='M190 190 C 240 190, 280 184, 328 184' fill='none' stroke='var(--muted-foreground)' strokeOpacity='0.7' strokeWidth='1.5' className='ar-dash' />
        <path d='M190 260 C 240 260, 280 216, 328 196' fill='none' stroke='var(--muted-foreground)' strokeOpacity='0.7' strokeWidth='1.5' className='ar-dash' />

        <g>
          <circle cx='588' cy='110' r='18' fill='var(--card)' stroke='var(--border)' />
          <path d='M588 104 a5 5 0 1 0 0.0001 0 M578 120 c0-5 20-5 20 0' fill='none' stroke='var(--muted-foreground)' strokeWidth='1.2' strokeLinecap='round' />

          <circle cx='588' cy='180' r='18' fill='var(--card)' stroke='var(--border)' />
          <path d='M588 174 a5 5 0 1 0 0.0001 0 M578 190 c0-5 20-5 20 0' fill='none' stroke='var(--muted-foreground)' strokeWidth='1.2' strokeLinecap='round' />

          <circle cx='588' cy='250' r='18' fill='var(--card)' stroke='var(--border)' />
          <path d='M588 244 a5 5 0 1 0 0.0001 0 M578 260 c0-5 20-5 20 0' fill='none' stroke='var(--muted-foreground)' strokeWidth='1.2' strokeLinecap='round' />
        </g>

        <path d='M392 180 C 436 180, 470 180, 568 180' fill='none' stroke='var(--muted-foreground)' strokeOpacity='0.75' strokeWidth='1.6' className='ar-dash' markerEnd='url(#arrow)' />
        <path d='M392 176 C 440 152, 520 128, 568 110' fill='none' stroke='var(--muted-foreground)' strokeOpacity='0.35' strokeWidth='1.3' className='ar-dash' markerEnd='url(#arrow)' />
        <path d='M392 184 C 440 208, 520 232, 568 250' fill='none' stroke='var(--muted-foreground)' strokeOpacity='0.35' strokeWidth='1.3' className='ar-dash' markerEnd='url(#arrow)' />
      </svg>
    </div>
  );
}
