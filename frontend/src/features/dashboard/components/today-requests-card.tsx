import { Activity } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formatNumber } from '@/utils/format-number';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useDashboardStats } from '../data/dashboard';

export function TodayRequestsCard() {
  const { t } = useTranslation();
  const { data: stats, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return (
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <Skeleton className='h-4 w-[120px]' />
          <Skeleton className='h-4 w-4' />
        </CardHeader>
        <CardContent>
          <div className='space-y-2'>
            <Skeleton className='h-8 w-[80px]' />
            <Skeleton className='mt-1 h-4 w-[140px]' />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
          <div className='flex items-center gap-2'>
            <div className='bg-secondary text-primary rounded-md border border-border/80 p-1.5'>
              <Activity className='h-4 w-4' />
            </div>
            <CardTitle className='text-sm font-medium'>{t('dashboard.stats.todayRequests')}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className='text-sm text-red-500'>{t('common.loadError')}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className='hover-card border-ring/20 bg-accent/65'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <div className='flex items-center gap-2'>
          <div className='flex h-8 w-8 items-center justify-center rounded-md border border-ring/20 bg-background/70 text-primary'>
            <Activity className='h-4 w-4' />
          </div>
          <CardTitle className='text-sm font-medium'>{t('dashboard.stats.todayRequests')}</CardTitle>
        </div>
        <div className='h-2 w-2 rounded-full bg-primary' />
      </CardHeader>
      <CardContent>
        <div className='space-y-4'>
          <div className='mt-2 font-mono text-4xl font-bold tracking-tight'>{formatNumber(stats?.requestStats?.requestsToday || 0)}</div>
          <div className='mt-4 flex justify-between border-t border-border/75 pt-3 text-xs text-muted-foreground'>
            <span>
              {t('dashboard.stats.thisWeek')}: {formatNumber(stats?.requestStats?.requestsThisWeek || 0)}
            </span>
            <span>
              {t('dashboard.stats.thisMonth')}: {formatNumber(stats?.requestStats?.requestsThisMonth || 0)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
