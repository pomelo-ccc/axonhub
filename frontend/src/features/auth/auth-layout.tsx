import { LanguageSwitch } from '@/components/language-switch';

interface Props {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: Props) {
  return (
    <div className='relative min-h-screen overflow-hidden bg-background'>
      <div className='pointer-events-none absolute inset-0'>
        <div
          className='absolute inset-0 opacity-20'
          style={{
            backgroundImage:
              'linear-gradient(to right, color-mix(in oklab, var(--border) 80%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--border) 80%, transparent) 1px, transparent 1px)',
            backgroundSize: '4rem 4rem',
          }}
        />
        <div
          className='absolute inset-x-0 top-0 h-56'
          style={{
            backgroundImage: 'radial-gradient(circle at top, color-mix(in oklab, var(--primary) 16%, transparent), transparent 72%)',
          }}
        />
      </div>

      <nav className='relative z-20 flex items-center justify-between px-6 py-5 lg:px-10'>
        <div className='flex items-center gap-3'>
          <img src='/logo.jpg' alt='AxonHub logo' className='h-9 w-9 rounded-md border border-border/80 bg-card/80 object-cover' />
          <div>
            <p className='text-[11px] uppercase tracking-[0.18em] text-muted-foreground'>AxonHub</p>
            <h1 className='text-sm font-medium tracking-[-0.01em]'>API Control Surface</h1>
          </div>
        </div>

        <div className='flex items-center gap-3'>
          <span className='hidden text-[11px] uppercase tracking-[0.18em] text-muted-foreground lg:inline'>Secure access</span>
          <LanguageSwitch />
        </div>
      </nav>

      <main className='relative z-10 min-h-[calc(100vh-5rem)]'>{children}</main>
    </div>
  );
}
