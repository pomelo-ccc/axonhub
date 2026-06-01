import { useState, useCallback } from 'react';
import { Link } from '@tanstack/react-router';
import { IconSettings } from '@tabler/icons-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { LanguageSwitch } from '@/components/language-switch';
import { ThemeSwitch } from '@/components/theme-switch';
import { QuotaBadges } from '@/components/quota-badges';
import { PermissionGuard } from '@/components/permission-guard';
import { HomePortalLink } from '@/components/home-portal-link';
import { BrandLogoImage } from '@/components/brand-logo-image';
import { checkProviderQuotas } from '@/features/system/data/quotas';
import { useBrandSettings } from '@/features/system/data/system';
import { HeaderUserMenu } from './header-user-menu';
import { ProjectSwitcher } from './project-switcher';
import { TopNavigationGroups } from './top-navigation-groups';
import { SidebarData } from './types';
import { toast } from 'sonner';

interface AppHeaderProps {
  sidebarData: SidebarData;
}

export function AppHeader({ sidebarData }: AppHeaderProps) {
  const { data: brandSettings } = useBrandSettings();
  const { t } = useTranslation();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const queryClient = useQueryClient();
  const { isMobile } = useSidebar();
  const displayName = brandSettings?.brandName || 'AxonHub';

  const refreshMutation = useMutation({
    mutationFn: async () => {
      return checkProviderQuotas();
    },
    onSuccess: () => {
      void queryClient.refetchQueries({ queryKey: ['provider-quotas'] });
      toast.success(t('system.providerQuota.refresh.success'));
    },
    onError: (error: any) => {
      toast.error(error.message || t('system.providerQuota.refresh.failure'));
    },
  });

  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    refreshMutation.mutate(undefined, {
      onSettled: () => setIsRefreshing(false),
    });
  }, [refreshMutation]);

  return (
    <header className='fixed top-0 z-50 w-full border-b border-border/80 bg-background/88 backdrop-blur-md'>
      <div className='flex h-16 items-center justify-between px-4 sm:px-6'>
        <div className='flex min-w-0 items-center gap-3'>
          <HomePortalLink />
          {isMobile && <SidebarTrigger className='size-8 rounded-full' />}

          <div className='flex min-w-0 items-center gap-3'>
            <div className='flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-md border border-border/80 bg-card/80'>
              <BrandLogoImage src={brandSettings?.brandLogo} alt='Brand Logo' width={28} height={28} className='size-8 object-cover' />
            </div>
            <div className='min-w-0'>
              <span className='block truncate text-sm font-medium tracking-[-0.01em]'>{displayName}</span>
              <span className='hidden text-[11px] uppercase tracking-[0.16em] text-muted-foreground lg:block'>Unified gateway control</span>
            </div>
          </div>

          <div className='hidden h-6 w-px bg-border/70 lg:block' />
          <div className='hidden lg:block'>
            <ProjectSwitcher />
          </div>
        </div>

        <div className='flex items-center gap-2'>
          {!isMobile && <QuotaBadges onRefresh={handleRefresh} isRefreshing={isRefreshing} />}

          {!isMobile && (
            <>
              <PermissionGuard requiredSystemScope='read_system'>
                <Link to='/system'>
                  <Button variant='outline' size='icon' className='size-8 rounded-full border-border/80 bg-card/80 shadow-none'>
                    <IconSettings className='h-4 w-4' />
                  </Button>
                </Link>
              </PermissionGuard>
              <LanguageSwitch />
              <ThemeSwitch />
              <HeaderUserMenu user={sidebarData.user} />
            </>
          )}
        </div>
      </div>

      <TopNavigationGroups navGroups={sidebarData.navGroups} />
    </header>
  );
}
