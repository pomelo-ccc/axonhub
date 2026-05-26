import { HTMLAttributes, useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { passwordSchema } from '@/lib/validation';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/password-input';
import { useSignIn, useOIDCProviders, useOIDCAuthorize } from '@/features/auth/data/auth';
import { LogIn } from 'lucide-react';

type UserAuthFormProps = HTMLAttributes<HTMLFormElement>;

// Create form schema with dynamic validation messages
const createFormSchema = (t: (key: string) => string) =>
  z.object({
    email: z.email().min(1, { message: t('auth.signIn.validation.emailRequired') }),
    password: passwordSchema(t),
  });

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const { t } = useTranslation();
  const signInMutation = useSignIn();
  const [rememberMe, setRememberMe] = useState(false);
  const { data: oidcProviders } = useOIDCProviders();
  const oidcAuthorizeMutation = useOIDCAuthorize();

  const formSchema = createFormSchema(t);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(data: z.infer<typeof formSchema>) {
    signInMutation.mutate(data);
  }

  const isPasswordLoginDisabled = oidcProviders?.some((p) => p.active && p.oidc_login_only);

  return (
    <Form {...form}>
      {!isPasswordLoginDisabled && (
        <form onSubmit={form.handleSubmit(onSubmit)} className={cn('grid gap-5', className)} {...props}>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel className='text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground'>{t('auth.signIn.form.email.label')}</FormLabel>
                <FormControl>
                  <Input type='email' placeholder={t('auth.signIn.form.email.placeholder')} className='h-11' data-testid='sign-in-email' {...field} />
                </FormControl>
                <FormMessage className='text-red-600' />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem className='relative'>
                <div className='flex items-center justify-between'>
                  <FormLabel className='text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground'>{t('auth.signIn.form.password.label')}</FormLabel>
                  <Link to='/forgot-password' className='text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-foreground'>
                    {t('auth.signIn.links.forgotPassword')}
                  </Link>
                </div>
                <FormControl>
                  <PasswordInput placeholder={t('auth.signIn.form.password.placeholder')} className='h-11' data-testid='sign-in-password' {...field} />
                </FormControl>
                <FormMessage className='text-red-600' />
              </FormItem>
            )}
          />

          <div className='flex items-center justify-between border-t border-border/75 pt-4'>
            <label className='flex cursor-pointer items-center gap-3 text-sm text-muted-foreground'>
              <input
                type='checkbox'
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className='h-4 w-4 rounded border border-input bg-background accent-[var(--primary)]'
              />
              <span>{t('auth.signIn.form.rememberMe')}</span>
            </label>
          </div>

          <Button type='submit' className='mt-2 h-11 w-full' disabled={signInMutation.isPending} data-testid='sign-in-submit'>
            {signInMutation.isPending ? (
              <div className='flex items-center justify-center gap-2'>
                <div className='h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white'></div>
                {t('auth.signIn.form.signingIn')}
              </div>
            ) : (
              t('auth.signIn.form.signInButton')
            )}
          </Button>
        </form>
      )}
        
        {oidcProviders && oidcProviders.length > 0 && (
          <div className={cn(!isPasswordLoginDisabled && 'mt-6')}>
            {!isPasswordLoginDisabled && (
              <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                  <span className='w-full border-t border-border/75' />
                </div>
                <div className='relative flex justify-center text-[11px] uppercase tracking-[0.16em]'>
                  <span className='bg-card px-3 text-muted-foreground'>Or continue with</span>
                </div>
              </div>
            )}

            <div className={cn(oidcProviders.length > 0 && !isPasswordLoginDisabled && 'mt-6', 'grid gap-2')}>
              {oidcProviders.map((provider) => {
                const isInactive = provider.active === false;
                const providerId = provider.id || provider.name;
                const providerLabel = provider.display_name || provider.name;

                return (
                  <Button
                    key={providerId}
                    type='button'
                    variant='outline'
                    className={cn('h-auto w-full justify-start border-border/80 bg-background/70 py-3 disabled:opacity-50', isInactive && 'border-2 border-destructive')}
                    style={
                      provider.button_color
                        ? {
                            backgroundColor: provider.button_color,
                            color: '#ffffff',
                            borderColor: isInactive ? 'var(--destructive)' : provider.button_color,
                          }
                        : undefined
                    }
                    disabled={oidcAuthorizeMutation.isPending}
                    onClick={() => oidcAuthorizeMutation.mutate(providerId)}
                    title={isInactive ? t('common.status.inactiveRetry') : undefined}
                  >
                    {oidcAuthorizeMutation.isPending && oidcAuthorizeMutation.variables === providerId ? (
                      <div className='mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current/30 border-t-current'></div>
                    ) : provider.icon_url ? (
                      <img src={provider.icon_url} alt={providerLabel} className='mr-2 h-4 w-4 object-contain' />
                    ) : (
                      <LogIn className='mr-2 h-4 w-4' />
                    )}
                    <span className='flex min-w-0 flex-col items-center'>
                      <span className='truncate'>{providerLabel}</span>
                      {isInactive && <span className='text-xs font-medium text-current/85'>{t('common.status.inactiveRetry')}</span>}
                    </span>
                  </Button>
                );
              })}
            </div>
          </div>
        )}

    </Form>
  );
}
