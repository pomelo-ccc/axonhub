import { Link } from '@tanstack/react-router';
import { BadgeCheck, ChevronsUpDown, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useSignOut } from '@/features/auth/data/auth';

interface HeaderUserMenuProps {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}

export function HeaderUserMenu({ user }: HeaderUserMenuProps) {
  const signOut = useSignOut();
  const { t } = useTranslation();

  const isAvatarUrl = user.avatar.startsWith('http') || user.avatar.startsWith('/') || user.avatar.startsWith('data:');
  const avatarFallback = isAvatarUrl ? user.name.charAt(0).toUpperCase() : user.avatar;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className='inline-flex h-10 max-w-[15rem] items-center gap-3 rounded-full border border-border/80 bg-card/80 px-2.5 pr-3 text-left shadow-none transition-[background-color,border-color] hover:border-ring/20 hover:bg-accent/70'>
          <Avatar className='h-8 w-8 rounded-full border border-border/70'>
            {isAvatarUrl && <AvatarImage src={user.avatar} alt={user.name} />}
            <AvatarFallback className='rounded-full'>{avatarFallback}</AvatarFallback>
          </Avatar>
          <div className='hidden min-w-0 md:block'>
            <div className='truncate text-sm font-medium tracking-[-0.01em]'>{user.name}</div>
            <div className='truncate text-[11px] text-muted-foreground'>{user.email}</div>
          </div>
          <ChevronsUpDown className='size-3.5 shrink-0 text-muted-foreground' />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='min-w-64 rounded-xl' align='end' sideOffset={8}>
        <DropdownMenuLabel className='p-0 font-normal'>
          <div className='flex items-center gap-3 px-3 py-2.5 text-left'>
            <Avatar className='h-10 w-10 rounded-full border border-border/70'>
              {isAvatarUrl && <AvatarImage src={user.avatar} alt={user.name} />}
              <AvatarFallback className='rounded-full'>{avatarFallback}</AvatarFallback>
            </Avatar>
            <div className='min-w-0'>
              <div className='truncate text-sm font-medium'>{user.name}</div>
              <div className='truncate text-xs text-muted-foreground'>{user.email}</div>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link to='/settings/profile'>
              <BadgeCheck />
              {t('sidebar.userMenu.account')}
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={signOut}>
          <LogOut />
          {t('sidebar.userMenu.logOut')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
