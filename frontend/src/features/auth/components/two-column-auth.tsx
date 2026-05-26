import type React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AutoRouterDiagram from '../sign-in/components/auto-router-diagram';

export interface TwoColumnAuthProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  rightFooter?: React.ReactNode;
  rightMaxWidthClassName?: string;
}

export default function TwoColumnAuth({
  title,
  description,
  children,
  rightFooter,
  rightMaxWidthClassName = 'max-w-md',
}: TwoColumnAuthProps) {
  const { t } = useTranslation();

  return (
    <div className='grid min-h-[calc(100vh-5rem)] lg:grid-cols-[1.08fr_0.92fr]'>
      <div className='relative hidden border-r border-border/75 lg:flex'>
        <div className='flex w-full flex-col justify-between px-10 py-12 xl:px-14'>
          <div className='max-w-xl space-y-8'>
            <div className='space-y-3'>
              <p className='text-[11px] uppercase tracking-[0.22em] text-muted-foreground'>{t('auth.brand.title')}</p>
              <h2 className='max-w-[10ch] text-5xl font-medium tracking-[-0.04em] text-foreground xl:text-6xl'>AxonHub</h2>
              <p className='max-w-[32rem] text-base leading-7 text-muted-foreground xl:text-lg'>{t('auth.brand.description')}</p>
            </div>

            <div className='grid gap-3 text-sm text-muted-foreground'>
              <div className='flex items-center justify-between border-b border-border/75 py-3'>
                <span className='uppercase tracking-[0.14em]'>Surface</span>
                <span className='text-foreground'>Gateway operations</span>
              </div>
              <div className='flex items-center justify-between border-b border-border/75 py-3'>
                <span className='uppercase tracking-[0.14em]'>Focus</span>
                <span className='text-foreground'>Requests, channels, keys</span>
              </div>
              <div className='flex items-center justify-between border-b border-border/75 py-3'>
                <span className='uppercase tracking-[0.14em]'>Mode</span>
                <span className='text-foreground'>Quiet by default</span>
              </div>
            </div>
          </div>

          <div className='max-w-xl rounded-xl border border-border/80 bg-card/75 p-6 shadow-xs backdrop-blur-sm'>
            <p className='mb-4 text-[11px] uppercase tracking-[0.22em] text-muted-foreground'>Routing diagram</p>
            <AutoRouterDiagram />
          </div>
        </div>
      </div>

      <div className='relative flex items-center justify-center px-6 py-10 sm:px-8 lg:px-10'>
        <div id='auth-card-wrapper' data-testid='auth-card-wrapper' className={`relative z-10 w-full ${rightMaxWidthClassName} py-6`}>
          <Card className='border-border/85 bg-card/95 shadow-sm'>
            <CardHeader className='px-6 pt-8 pb-6 text-left sm:px-8 sm:pb-8'>
              <p className='text-[11px] uppercase tracking-[0.22em] text-muted-foreground'>{t('auth.signIn.title')}</p>
              <CardTitle className='mt-3 text-3xl font-medium tracking-[-0.03em] sm:text-[2rem]'>{title}</CardTitle>
              {description ? <CardDescription className='max-w-[34ch] pt-1 text-sm leading-7 sm:text-base'>{description}</CardDescription> : null}
            </CardHeader>
            <CardContent className='px-6 pb-8 sm:px-8'>{children}</CardContent>
          </Card>

          {rightFooter ? <div className='mt-6 px-1 text-left sm:mt-8'>{rightFooter}</div> : null}
        </div>
      </div>
    </div>
  );
}
