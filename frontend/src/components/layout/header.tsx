import React from 'react';
import { cn } from '@/lib/utils';

interface HeaderProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean;
  ref?: React.Ref<HTMLElement>;
}

export const Header = ({ className, fixed, children, ...props }: HeaderProps) => {
  const [offset, setOffset] = React.useState(0);

  React.useEffect(() => {
    const onScroll = () => {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop);
    };

    // Add scroll listener to the body
    document.addEventListener('scroll', onScroll, { passive: true });

    // Clean up the event listener on unmount
    return () => document.removeEventListener('scroll', onScroll);
  }, []);

  // Don't render if there's no children
  if (!children) {
    return null;
  }

  return (
    <header
      className={cn(
        'bg-background/72 flex h-14 items-center gap-3 border-b border-border/75 px-5 backdrop-blur-md sm:gap-4 sm:px-6',
        fixed && 'header-fixed peer/header fixed z-50 w-[inherit] rounded-lg',
        offset > 10 && fixed ? 'shadow-xs' : 'shadow-none',
        className
      )}
      {...props}
    >
      {children}
    </header>
  );
};

Header.displayName = 'Header';
