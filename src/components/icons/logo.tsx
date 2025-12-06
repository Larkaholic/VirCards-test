import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width="40"
      height="40"
      aria-label="VisceraVerse Logo"
      {...props}
    >
      <defs>
        <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="hsl(var(--primary))" />
          <stop offset="100%" stopColor="hsl(var(--accent))" />
        </linearGradient>
      </defs>
      <path
        d="M50,10 C70,10 90,30 90,50 C90,70 70,90 50,90 C30,90 10,70 10,50 C10,30 30,10 50,10 Z"
        fill="none"
        stroke="url(#grad1)"
        strokeWidth="5"
      />
      <path
        d="M50,20 C65,20 80,35 80,50 C80,65 65,80 50,80 C35,80 20,65 20,50 C20,35 35,20 50,20 Z"
        fill="none"
        stroke="hsl(var(--foreground))"
        strokeOpacity="0.5"
        strokeWidth="2"
        strokeDasharray="5,5"
      />
       <path
        d="M35,50 C35,41.71 41.71,35 50,35 C58.28,35 65,41.71 65,50 C65,58.28 58.28,65 50,65"
        fill="none"
        stroke="hsl(var(--accent))"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}
