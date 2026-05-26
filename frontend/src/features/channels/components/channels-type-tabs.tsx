import { useMemo, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import type { ChannelTypeCount } from '../data/channels';
import { CHANNEL_CONFIGS } from '../data/config_channels';

interface ChannelsTypeTabsProps {
  typeCounts: ChannelTypeCount[];
  selectedTab: string;
  onTabChange: (tab: string) => void;
}

interface GroupedTypeCount {
  prefix: string;
  types: string[];
  totalCount: number;
}

/**
 * Groups channel types by their prefix and aggregates counts
 * For example: deepseek (5) and deepseek_anthropic (3) -> deepseek (8)
 */
function groupTypesByPrefix(typeCounts: ChannelTypeCount[]): GroupedTypeCount[] {
  const groups = new Map<string, { types: string[]; totalCount: number }>();

  typeCounts.forEach(({ type, count }) => {
    // Find the base prefix (before the first underscore or the whole string)
    const prefix = type.split('_')[0];

    if (!groups.has(prefix)) {
      groups.set(prefix, { types: [], totalCount: 0 });
    }
    const group = groups.get(prefix)!;
    group.types.push(type);
    group.totalCount += count;
  });

  // Convert to array and sort by count (descending), then by prefix
  return Array.from(groups.entries())
    .map(([prefix, { types, totalCount }]) => ({
      prefix,
      types,
      totalCount,
    }))
    .sort((a, b) => b.totalCount - a.totalCount || a.prefix.localeCompare(b.prefix));
}

export const ChannelsTypeTabs = memo(function ChannelsTypeTabs({ typeCounts, selectedTab, onTabChange }: ChannelsTypeTabsProps) {
  const { t } = useTranslation();

  // Group types by prefix and get top 8
  const groupedTypes = useMemo(() => {
    const groups = groupTypesByPrefix(typeCounts);
    return groups.slice(0, 8);
  }, [typeCounts]);

  // Calculate total count for "all" tab
  const totalCount = useMemo(() => {
    return typeCounts.reduce((sum, { count }) => sum + count, 0);
  }, [typeCounts]);

  if (typeCounts.length === 0) {
    return null;
  }

  // Get icon for a prefix
  const getIcon = (prefix: string) => {
    const config = CHANNEL_CONFIGS[prefix as keyof typeof CHANNEL_CONFIGS];
    return config?.icon;
  };

  return (
    <div className='mb-6 w-full overflow-hidden'>
      <div
        className='hide-scroll flex flex-nowrap items-center gap-2 overflow-x-auto rounded-full border border-border/70 bg-muted/30 p-1.5 scroll-smooth'
        onWheel={(e) => { e.currentTarget.scrollLeft += e.deltaY; }}
      >
        {/* All tab */}
        <button
          onClick={() => onTabChange('all')}
          className={cn(
            'flex shrink-0 items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-[background-color,border-color,color]',
            selectedTab === 'all'
              ? 'border border-border bg-background text-foreground shadow-none'
              : 'border border-transparent bg-transparent text-muted-foreground hover:border-border/80 hover:bg-background/80 hover:text-foreground'
          )}
        >
          {t('channels.tabs.all')}{' '}
          <span
            className={cn(
              'ml-1 rounded-full border border-transparent bg-muted px-1.5 text-[11px] text-muted-foreground',
              selectedTab === 'all' && 'border-border/70 bg-muted/70 text-foreground'
            )}
          >
            {totalCount}
          </span>
        </button>

        {/* Type tabs */}
        {groupedTypes.map(({ prefix, totalCount }) => {
          const Icon = getIcon(prefix);
          return (
            <button
              key={prefix}
              onClick={() => onTabChange(prefix)}
              className={cn(
                'flex shrink-0 items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-[background-color,border-color,color]',
                selectedTab === prefix
                  ? 'border border-border bg-background text-foreground shadow-none'
                  : 'border border-transparent bg-transparent text-muted-foreground hover:border-border/80 hover:bg-background/80 hover:text-foreground'
              )}
            >
              {Icon && <Icon size={16} />}
              {t(`channels.types.${prefix}`)}{' '}
              <span
                className={cn(
                  'rounded-full border border-transparent bg-muted px-1.5 text-[11px] text-muted-foreground',
                  selectedTab === prefix && 'border-border/70 bg-muted/70 text-foreground'
                )}
              >
                {totalCount}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
});
