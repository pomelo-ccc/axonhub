import { IconHome2 } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface HomePortalLinkProps {
  className?: string;
}

export function HomePortalLink({ className }: HomePortalLinkProps) {
  const { t } = useTranslation();
  const label = t('common.homePortal');

  return (
    <a
      href='/'
      data-home-link='portal'
      aria-label={label}
      title={label}
      className={cn(
        'inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border/80 bg-card/80 text-muted-foreground transition-colors hover:border-border hover:bg-background hover:text-foreground',
        className
      )}
    >
      <IconHome2 className='h-4 w-4' />
    </a>
  );
}
