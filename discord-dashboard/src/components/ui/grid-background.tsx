'use client';

import { cn } from '@/lib/utils';

interface GridBackgroundProps {
  className?: string;
  children?: React.ReactNode;
  size?: number;
  color?: string;
  opacity?: number;
}

export function GridBackground({
  className,
  children,
  size = 40,
  color = 'rgba(148, 163, 184, 0.1)',
  opacity = 1,
}: GridBackgroundProps) {
  return (
    <div
      className={cn(
        'relative min-h-screen w-full bg-charcoal-950',
        className
      )}
      style={{
        backgroundImage: `
          linear-gradient(${color} 1px, transparent 1px),
          linear-gradient(90deg, ${color} 1px, transparent 1px)
        `,
        backgroundSize: `${size}px ${size}px`,
        backgroundPosition: '-0.5px -0.5px',
        opacity,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-charcoal-900/50" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// Alternative animated version with subtle pulse
export function AnimatedGridBackground({
  className,
  children,
  size = 40,
  color = 'rgba(148, 163, 184, 0.1)',
}: GridBackgroundProps) {
  return (
    <div
      className={cn(
        'relative min-h-screen w-full bg-charcoal-950',
        className
      )}
    >
      <div
        className="absolute inset-0 animate-pulse"
        style={{
          backgroundImage: `
            linear-gradient(${color} 1px, transparent 1px),
            linear-gradient(90deg, ${color} 1px, transparent 1px)
          `,
          backgroundSize: `${size}px ${size}px`,
          backgroundPosition: '-0.5px -0.5px',
          animationDuration: '8s',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-transparent to-transparent" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

// Dotted grid variant
export function DottedGridBackground({
  className,
  children,
  size = 20,
  color = 'rgba(148, 163, 184, 0.15)',
}: GridBackgroundProps) {
  return (
    <div
      className={cn(
        'relative min-h-screen w-full bg-charcoal-950',
        className
      )}
      style={{
        backgroundImage: `radial-gradient(circle, ${color} 1px, transparent 1px)`,
        backgroundSize: `${size}px ${size}px`,
      }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-charcoal-900/20 via-transparent to-transparent" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}