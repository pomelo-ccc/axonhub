import { useEffect } from 'react';
import { IconCheck, IconMoon, IconSun, IconPalette } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { useTheme } from '@/context/theme-context';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function ThemeSwitch() {
  const { theme, setTheme, colorScheme, setColorScheme } = useTheme();
  const { t } = useTranslation();

  const colorSchemes = [
    { name: 'stone', label: t('theme.colors.stone'), color: 'bg-amber-700' },
    { name: 'paper', label: t('theme.colors.paper'), color: 'bg-stone-300' },
    { name: 'ink', label: t('theme.colors.ink'), color: 'bg-slate-700' },
  ] as const;

  /* Update theme-color meta tag when theme is updated */
  useEffect(() => {
    const themeColorMap = {
      light: {
        stone: '#f6f2eb',
        paper: '#faf7ef',
        ink: '#f0f3f6',
      },
      dark: {
        stone: '#211b18',
        paper: '#29231f',
        ink: '#191c24',
      },
    } as const;
    const resolvedTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    const themeColor = themeColorMap[resolvedTheme][colorScheme];
    const metaThemeColor = document.querySelector("meta[name='theme-color']");
    if (metaThemeColor) metaThemeColor.setAttribute('content', themeColor);
  }, [theme, colorScheme]);

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='icon' className='relative size-8 rounded-full border-border/80 bg-card/80 shadow-none'>
          <IconSun className='size-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90' />
          <IconMoon className='absolute size-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0' />
          <span
            className={cn(
              'absolute right-1.5 bottom-1.5 h-1.5 w-1.5 rounded-full ring-2 ring-background',
              colorSchemes.find((scheme) => scheme.name === colorScheme)?.color || 'bg-amber-700'
            )}
          />
          <span className='sr-only'>{t('theme.toggle')}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem onClick={() => setTheme('light')}>
          {t('theme.light')} <IconCheck size={14} className={cn('ml-auto', theme !== 'light' && 'hidden')} />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          {t('theme.dark')}
          <IconCheck size={14} className={cn('ml-auto', theme !== 'dark' && 'hidden')} />
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          {t('theme.system')}
          <IconCheck size={14} className={cn('ml-auto', theme !== 'system' && 'hidden')} />
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <IconPalette size={14} className='mr-2' />
            {t('theme.colorScheme')}
            <div className={cn('ml-auto h-3 w-3 rounded-full', colorSchemes.find((s) => s.name === colorScheme)?.color || 'bg-amber-700')} />
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {colorSchemes.map((scheme) => (
              <DropdownMenuItem key={scheme.name} onClick={() => setColorScheme(scheme.name)} className='flex items-center justify-between'>
                <div className='flex items-center'>
                  <div className={cn('mr-2 h-3 w-3 rounded-full', scheme.color)} />
                  {scheme.label}
                </div>
                <IconCheck size={14} className={cn('ml-auto', colorScheme !== scheme.name && 'hidden')} />
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
