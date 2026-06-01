import { Link, useLocation } from '@tanstack/react-router';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { NavCollapsible, NavGroup, NavItem, NavLink } from './types';

interface TopNavigationGroupsProps {
  navGroups: NavGroup[];
}

const getVisibleItems = (items: NavItem[]) =>
  items.filter((item) => {
    if (!item.items) {
      if (item.isDisabled) return false;
      if ((item as NavLink).mobileOnly) return false;
      return true;
    }

    return item.items.some((subItem) => !subItem.isDisabled) && !item.isDisabled;
  });

const checkIsActive = (href: string, item: NavItem, mainNav = false) =>
  href === item.url ||
  href.split('?')[0] === item.url ||
  !!item?.items?.filter((i) => i.url === href).length ||
  (mainNav && href.split('/')[1] !== '' && href.split('/')[1] === item?.url?.split('/')[1]);

export function TopNavigationGroups({ navGroups }: TopNavigationGroupsProps) {
  const href = useLocation({ select: (location) => location.href });

  return (
    <div className='hidden border-t border-border/70 md:block'>
      <div className='flex items-center gap-6 overflow-x-auto px-6 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden'>
        {navGroups.map((group) => {
          const visibleItems = getVisibleItems(group.items);

          if (visibleItems.length === 0) {
            return null;
          }

          return (
            <section key={group.title} className='flex shrink-0 items-center gap-3'>
              <span className='text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground'>{group.title}</span>
              <div className='flex items-center gap-2'>
                {visibleItems.map((item) => {
                  const key = `${group.title}-${item.title}`;

                  if (!item.items) {
                    const isActive = checkIsActive(href, item);
                    return (
                      <Link
                        key={key}
                        to={item.url}
                        className={cn(
                          'inline-flex h-9 items-center gap-2 rounded-full border px-3.5 text-[13px] font-medium transition-[background-color,border-color,color]',
                          isActive
                            ? 'border-foreground/10 bg-foreground text-background'
                            : 'border-border/80 bg-card/60 text-muted-foreground hover:border-ring/20 hover:bg-accent/70 hover:text-foreground'
                        )}
                      >
                        {item.icon && <item.icon className='size-3.5 shrink-0' />}
                        <span className='whitespace-nowrap'>{item.title}</span>
                      </Link>
                    );
                  }

                  return <TopNavigationDropdown key={key} item={item} href={href} />;
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

function TopNavigationDropdown({ item, href }: { item: NavCollapsible; href: string }) {
  const visibleSubItems = item.items.filter((subItem) => !subItem.isDisabled);
  const isActive = checkIsActive(href, item, true);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            'inline-flex h-9 items-center gap-2 rounded-full border px-3.5 text-[13px] font-medium transition-[background-color,border-color,color]',
            isActive
              ? 'border-foreground/10 bg-foreground text-background'
              : 'border-border/80 bg-card/60 text-muted-foreground hover:border-ring/20 hover:bg-accent/70 hover:text-foreground'
          )}
        >
          {item.icon && <item.icon className='size-3.5 shrink-0' />}
          <span className='whitespace-nowrap'>{item.title}</span>
          <ChevronDown className='size-3.5 shrink-0' />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start' sideOffset={8} className='min-w-56 rounded-xl'>
        {visibleSubItems.map((subItem) => (
          <DropdownMenuItem key={`${item.title}-${subItem.title}`} asChild>
            <Link to={subItem.url} className='gap-2'>
              {subItem.icon && <subItem.icon className='size-4 shrink-0' />}
              <span>{subItem.title}</span>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
