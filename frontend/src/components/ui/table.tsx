import * as React from 'react';
import { cn } from '@/lib/utils';

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(({ className, ...props }, ref) => (
  <table ref={ref} data-slot='table' className={cn('w-full caption-bottom text-sm text-foreground/95', className)} {...props} />
));
Table.displayName = 'Table';

function TableHeader({ className, ...props }: React.ComponentProps<'thead'>) {
  return <thead data-slot='table-header' className={cn('bg-muted/42 [&_tr]:border-b [&_tr]:border-border/80', className)} {...props} />;
}

function TableBody({ className, ...props }: React.ComponentProps<'tbody'>) {
  return <tbody data-slot='table-body' className={cn('[&_tr:last-child]:border-0', className)} {...props} />;
}

function TableFooter({ className, ...props }: React.ComponentProps<'tfoot'>) {
  return <tfoot data-slot='table-footer' className={cn('bg-muted/42 border-t border-border/80 font-medium [&>tr]:last:border-b-0', className)} {...props} />;
}

const TableRow = React.forwardRef<HTMLTableRowElement, React.ComponentProps<'tr'>>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    data-slot='table-row'
    className={cn('border-b border-border/80 transition-colors hover:bg-accent/65 data-[state=selected]:bg-accent/80', className)}
    {...props}
  />
));
TableRow.displayName = 'TableRow';

function TableHead({ className, ...props }: React.ComponentProps<'th'>) {
  return (
    <th
      data-slot='table-head'
      className={cn(
        'text-muted-foreground h-10 px-3 text-left align-middle text-[11px] font-semibold whitespace-nowrap uppercase tracking-[0.12em] [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]',
        className
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }: React.ComponentProps<'td'>) {
  return (
    <td
      data-slot='table-cell'
      className={cn('px-3 py-2.5 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]', className)}
      {...props}
    />
  );
}

function TableCaption({ className, ...props }: React.ComponentProps<'caption'>) {
  return <caption data-slot='table-caption' className={cn('text-muted-foreground mt-4 text-sm', className)} {...props} />;
}

export { Table, TableHeader, TableBody, TableFooter, TableHead, TableRow, TableCell, TableCaption };
