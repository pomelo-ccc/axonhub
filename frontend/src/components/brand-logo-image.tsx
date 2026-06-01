import * as React from 'react';
import { ImageOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { resolveAppAssetPath } from '@/lib/app-base';

interface BrandLogoImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null;
}

export function BrandLogoImage({ src, alt = 'Brand Logo', className, ...props }: BrandLogoImageProps) {
  const defaultSrc = React.useMemo(() => resolveAppAssetPath('/logo.jpg'), []);
  const [resolvedSrc, setResolvedSrc] = React.useState(() => resolveAppAssetPath(src, '/logo.jpg'));
  const [hasFailed, setHasFailed] = React.useState(false);

  React.useEffect(() => {
    setResolvedSrc(resolveAppAssetPath(src, '/logo.jpg'));
    setHasFailed(false);
  }, [src]);

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
