'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Home, Settings, BookOpen, Users, Shield, Sun, Moon, Bell, LogOut, MessageCircle } from 'lucide-react';
import { useTheme } from '../providers/theme-provider';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { CircleInLogo } from '@/components/ui';

// Mock session for preview
const mockSession = {
  user: {
    id: 'preview-user',
    name: 'Preview User',
    email: 'preview@circlein.app',
    role: 'admin', // Show admin features for demo
  }
};

// Fluid sidebar animation - expands on hover
const sidebarVariants = {
  expanded: { 
    width: '280px',
    transition: { 
      type: "spring",
      stiffness: 300, 
      damping: 30 
    }
  },
  collapsed: { 
    width: '72px',
    transition: { 
      type: "spring",
      stiffness: 300, 
      damping: 30 
    }
  },
};

const textVariants = {
  hidden: { opacity: 0, x: -10, width: 0 },
  visible: { 
    opacity: 1, 
    x: 0, 
    width: 'auto',
    transition: { delay: 0.05, duration: 0.15 } 
  },
};

interface SidebarProps {
  onClose?: () => void;
  onCollapseChange?: (collapsed: boolean) => void;
}

export function Sidebar({ onClose, onCollapseChange }: SidebarProps = {}) {
  const [isHovered, setIsHovered] = useState(false);
  const [mounted, setMounted] = useState(false);
  const session = mockSession; // Using mock for preview
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  // For mobile, always expanded. For desktop, collapse/expand on hover
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;
  const isExpanded = isMobile || onClose ? true : isHovered;

  // Notify parent when collapse state changes
  useEffect(() => {
    onCollapseChange?.(!isExpanded);
  }, [isExpanded, onCollapseChange]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const baseNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'My Bookings', href: '/bookings', icon: BookOpen },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'Notifications', href: '/notifications', icon: Bell },
    { name: 'Contact Us', href: '/contact', icon: MessageCircle },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const navigation = session?.user?.role === 'admin' 
    ? baseNavigation.filter(item => item.name !== 'Settings')
    : baseNavigation;

  const adminNavigation = [
    { name: 'Admin Panel', href: '/admin', icon: Shield },
    { name: 'Manage Users', href: '/admin/users', icon: Users },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  // Show basic layout during SSR
  if (!mounted) {
    return (
      <div className="h-screen w-[72px] bg-sidebar-background border-r border-sidebar-border flex flex-col relative z-50">
        <div className="p-4 flex justify-center">
          <CircleInLogo size={40} />
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider delayDuration={0}>
      <motion.div
        variants={sidebarVariants}
        initial="collapsed"
        animate={isExpanded ? 'expanded' : 'collapsed'}
        onMouseEnter={() => !onClose && setIsHovered(true)}
        onMouseLeave={() => !onClose && setIsHovered(false)}
        className={cn(
          "h-screen flex flex-col relative overflow-hidden",
          "bg-[hsl(var(--sidebar-background))] border-r",
          "border-[hsl(var(--sidebar-border))]"
        )}
        style={{ zIndex: 50 }}
      >
        {/* Header */}
        <div className="p-4 border-b border-[hsl(var(--sidebar-border))] shrink-0">
          <div className={cn(
            "flex items-center",
            isExpanded ? "gap-3" : "justify-center"
          )}>
            <div className="shrink-0">
              <CircleInLogo size={40} />
            </div>
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="overflow-hidden"
                >
                  <span className="font-serif text-xl text-foreground whitespace-nowrap">
                    CircleIn
                  </span>
                  <p className="text-xs text-muted-foreground whitespace-nowrap">
                    Community Hub
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Info - Only when expanded */}
          <AnimatePresence>
            {isExpanded && session?.user && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="overflow-hidden"
              >
                <div className="p-3 bg-card rounded-xl border border-subtle shadow-card">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[hsl(var(--accent))] flex items-center justify-center text-white text-sm font-medium shrink-0">
                      {session.user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground truncate">
                        {session.user.name}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {session.user.email}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className={cn(
          "flex-1 overflow-y-auto overflow-x-hidden py-4",
          isExpanded ? "px-3" : "px-2"
        )}>
          {/* Section Label */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="px-3 mb-2"
              >
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Navigation
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              
              return (
                <div key={item.name} className={cn(isExpanded ? "" : "flex justify-center")}>
                  {!isExpanded ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href={item.href}
                          onClick={() => onClose?.()}
                          className={cn(
                            "relative flex items-center justify-center w-11 h-11 rounded-xl transition-colors duration-150",
                            isActive
                              ? "text-[hsl(var(--accent))]"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {/* Active indicator - terracotta bar */}
                          {isActive && (
                            <motion.div
                              layoutId="activeIndicator"
                              className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[60%] bg-[hsl(var(--accent))] rounded-r"
                              transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            />
                          )}
                          <item.icon className="w-5 h-5" />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="font-medium">
                        {item.name}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={() => onClose?.()}
                      className={cn(
                        "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150",
                        isActive
                          ? "text-[hsl(var(--accent))]"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {/* Active indicator - terracotta bar */}
                      {isActive && (
                        <motion.div
                          layoutId="activeIndicatorExpanded"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[60%] bg-[hsl(var(--accent))] rounded-r"
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}
                      <item.icon className="w-5 h-5 shrink-0" />
                      <span>{item.name}</span>
                    </Link>
                  )}
                </div>
              );
            })}
          </div>

          {/* Admin Section */}
          {session?.user?.role === 'admin' && (
            <>
              <div className="my-4 px-3">
                <div className={cn(
                  "border-t border-[hsl(var(--sidebar-border))]",
                  isExpanded && "relative"
                )}>
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-[hsl(var(--sidebar-background))] px-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider"
                      >
                        Admin
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <div className="space-y-1">
                {adminNavigation.map((item) => {
                  const isActive = pathname === item.href;
                  
                  return (
                    <div key={item.name} className={cn(isExpanded ? "" : "flex justify-center")}>
                      {!isExpanded ? (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link
                              href={item.href}
                              onClick={() => onClose?.()}
                              className={cn(
                                "relative flex items-center justify-center w-11 h-11 rounded-xl transition-colors duration-150",
                                isActive
                                  ? "text-[hsl(var(--accent))]"
                                  : "text-muted-foreground hover:text-foreground"
                              )}
                            >
                              {isActive && (
                                <motion.div
                                  layoutId="activeIndicatorAdmin"
                                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[60%] bg-[hsl(var(--accent))] rounded-r"
                                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                />
                              )}
                              <item.icon className="w-5 h-5" />
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="font-medium">
                            {item.name}
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <Link
                          href={item.href}
                          onClick={() => onClose?.()}
                          className={cn(
                            "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150",
                            isActive
                              ? "text-[hsl(var(--accent))]"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          {isActive && (
                            <motion.div
                              layoutId="activeIndicatorAdminExpanded"
                              className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-[60%] bg-[hsl(var(--accent))] rounded-r"
                              transition={{ type: "spring", stiffness: 400, damping: 30 }}
                            />
                          )}
                          <item.icon className="w-5 h-5 shrink-0" />
                          <span>{item.name}</span>
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </nav>

        {/* Footer */}
        <div className={cn(
          "border-t border-[hsl(var(--sidebar-border))] shrink-0 py-3",
          isExpanded ? "px-3" : "px-2"
        )}>
          {/* Theme Toggle */}
          <div className={cn(isExpanded ? "" : "flex justify-center")}>
            {!isExpanded ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="w-11 h-11 rounded-xl hover:bg-muted"
                  >
                    {theme === 'dark' ? (
                      <Sun className="w-5 h-5 text-amber-500" />
                    ) : (
                      <Moon className="w-5 h-5 text-muted-foreground" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </TooltipContent>
              </Tooltip>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="w-full justify-start gap-3 px-3 py-2.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-amber-500" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
                <span className="text-sm font-medium">
                  {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                </span>
              </Button>
            )}
          </div>

          {/* Logout Button */}
          <div className={cn("mt-1", isExpanded ? "" : "flex justify-center")}>
            {!isExpanded ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => alert('Sign out disabled for preview')}
                    className="w-11 h-11 rounded-xl hover:bg-[hsl(var(--destructive))/0.1]"
                  >
                    <LogOut className="w-5 h-5 text-[hsl(var(--destructive))]" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Sign out</TooltipContent>
              </Tooltip>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => alert('Sign out disabled for preview')}
                className="w-full justify-start gap-3 px-3 py-2.5 rounded-xl hover:bg-[hsl(var(--destructive))/0.1] text-[hsl(var(--destructive))]"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium">Sign out</span>
              </Button>
            )}
          </div>

          {/* Version info */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mt-3 text-center"
              >
                <span className="text-[11px] text-muted-foreground">
                  CircleIn v1.0.0
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </TooltipProvider>
  );
}
