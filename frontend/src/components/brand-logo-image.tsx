import * as React from 'react';
import { ImageOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { resolveAppAssetPath } from '@/lib/app-base';

interface BrandLogoImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null;
}

export function BrandLogoImage({ src, alt = 'Brand Logo', className, ...props }: BrandLogoImageProps) {
  const defaultSrc = React.useMemo(() => {
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/api')) {
      return '/api/logo.jpg';
    }

    return resolveAppAssetPath('/logo.jpg');
  }, []);

  const resolveLogoSrc = React.useCallback(
    (nextSrc?: string | null) => {
      if (!nextSrc) {
        return defaultSrc;
      }

      if (nextSrc === '/logo.jpg') {
        return defaultSrc;
      }

      return resolveAppAssetPath(nextSrc, defaultSrc);
    },
    [defaultSrc]
  );

  const [resolvedSrc, setResolvedSrc] = React.useState(() => resolveLogoSrc(src));
  const [hasFailed, setHasFailed] = React.useState(false);

  React.useEffect(() => {
    setResolvedSrc(resolveLogoSrc(src));
    setHasFailed(false);
  }, [resolveLogoSrc, src]);

  if (hasFailed) {
    return (
      <div
        aria-hidden='true'
        className={cn(
          'flex items-center justify-center rounded-[inherit] border border-border/80 bg-card/80 text-muted-foreground',
          className
        )}
      >
        <ImageOff className='h-4 w-4' />
      </div>
    );
  }

  return (
    <img
      {...props}
      src={resolvedSrc}
      alt={alt}
      className={className}
      onError={() => {
        if (resolvedSrc !== defaultSrc) {
          setResolvedSrc(defaultSrc);
          return;
        }
        setHasFailed(true);
      }}
    />
  );
}
