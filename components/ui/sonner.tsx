'use client';

import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = 'system' } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-card group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-elevated group-[.toaster]:rounded-xl',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton:
            'group-[.toast]:bg-[hsl(var(--accent))] group-[.toast]:text-white group-[.toast]:rounded-[8px]',
          cancelButton:
            'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:rounded-[8px]',
          success: 'group-[.toaster]:!bg-[hsl(var(--success))/0.1] group-[.toaster]:!text-[hsl(var(--success))] group-[.toaster]:!border-[hsl(var(--success))/0.2]',
          error: 'group-[.toaster]:!bg-[hsl(var(--destructive))/0.1] group-[.toaster]:!text-[hsl(var(--destructive))] group-[.toaster]:!border-[hsl(var(--destructive))/0.2]',
          warning: 'group-[.toaster]:!bg-[hsl(var(--warning))/0.1] group-[.toaster]:!text-[hsl(var(--warning))] group-[.toaster]:!border-[hsl(var(--warning))/0.2]',
          info: 'group-[.toaster]:!bg-[hsl(var(--primary))/0.1] group-[.toaster]:!text-[hsl(var(--primary))] group-[.toaster]:!border-[hsl(var(--primary))/0.2]',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
