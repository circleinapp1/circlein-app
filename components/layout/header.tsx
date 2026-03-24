'use client';

import { NotificationBell, NotificationPanel } from '@/components/notifications/NotificationSystem';
import { usePathname } from 'next/navigation';
import { Search, User, Settings, UserCircle, LogOut, ChevronRight, X } from 'lucide-react';

// Mock session for preview
const mockSession = {
  user: {
    id: 'preview-user',
    name: 'Preview User',
    email: 'preview@circlein.app',
    image: null,
    role: 'admin',
  }
};
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSearch } from '@/components/providers/search-provider';
import Link from 'next/link';
import { HamburgerMenu } from '@/components/ui/hamburger-menu';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onMenuClick?: () => void;
  isMenuOpen?: boolean;
}

export function Header({ onMenuClick, isMenuOpen = false }: HeaderProps) {
  const session = mockSession; // Using mock for preview
  const { searchQuery, setSearchQuery } = useSearch();
  const pathname = usePathname();
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  
  const isAdminUser = session?.user?.role === 'admin';

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 md:px-6 lg:px-8 relative z-40">
      <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
        {/* Hamburger Menu - Only on mobile/tablet */}
        <div className="lg:hidden shrink-0">
          <HamburgerMenu isOpen={isMenuOpen} onClick={onMenuClick || (() => {})} />
        </div>

        {/* Search Bar */}
        <div className="relative flex-1 max-w-[240px] md:max-w-md lg:max-w-lg">
          <div className="relative">
            <Search className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors duration-100",
              isSearchFocused ? "text-[hsl(var(--accent))]" : "text-muted-foreground"
            )} />
            <input
              ref={searchRef}
              type="text"
              placeholder="Search amenities..."
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className={cn(
                "w-full h-10 pl-9 pr-12 rounded-[10px]",
                "text-sm text-foreground",
                "placeholder:text-muted-foreground",
                "bg-background",
                "border border-border",
                "hover:border-[hsl(var(--border))]",
                "focus:bg-[#FAFAF8] dark:focus:bg-card",
                "focus:border-[hsl(var(--accent))]",
                "focus:ring-2 focus:ring-[hsl(var(--accent))/0.15]",
                "outline-none transition-all duration-150"
              )}
            />
            {/* Clear button or keyboard hint */}
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 flex items-center">
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    searchRef.current?.focus();
                  }}
                  className={cn(
                    "p-1 rounded-md",
                    "text-muted-foreground hover:text-foreground",
                    "hover:bg-muted",
                    "transition-colors duration-100"
                  )}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              ) : (
                <kbd className={cn(
                  "px-1.5 py-0.5 text-[10px] font-medium rounded hidden md:block",
                  "text-muted-foreground",
                  "bg-muted",
                  "border border-border",
                  isSearchFocused && "opacity-0"
                )}>
                  CMD K
                </kbd>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0 ml-3">
        {/* Notifications */}
        <NotificationBell />
        <NotificationPanel />

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              className={cn(
                "relative h-10 w-10 rounded-full p-0",
                "hover:bg-muted",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--accent))] focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                "transition-colors duration-100"
              )}
            >
              <Avatar className="h-9 w-9">
                <AvatarImage src={session?.user?.image || ''} className="object-cover" />
                <AvatarFallback className="bg-[hsl(var(--accent))] text-white text-sm font-medium">
                  {session?.user?.name?.[0]?.toUpperCase() || <User className="w-4 h-4" />}
                </AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[hsl(var(--success))] border-2 border-card rounded-full" />
            </Button>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent 
            className={cn(
              "w-56 p-0 overflow-hidden",
              "bg-card",
              "border border-border",
              "shadow-elevated",
              "rounded-xl"
            )}
            align="end" 
            sideOffset={6}
          >
            {/* Identity Section */}
            <div className="px-4 py-4 bg-muted/50">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={session?.user?.image || ''} className="object-cover" />
                  <AvatarFallback className="bg-[hsl(var(--accent))] text-white text-sm font-medium">
                    {session?.user?.name?.[0]?.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {session?.user?.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {session?.user?.email}
                  </p>
                  {isAdminUser && (
                    <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-medium text-[hsl(var(--warning))]">
                      Admin
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="py-1">
              <DropdownMenuItem asChild className={cn(
                "mx-1 rounded-lg px-3 py-2.5 cursor-pointer",
                "focus:bg-muted",
                "transition-colors duration-75"
              )}>
                <Link href="/profile" className="flex items-center gap-3">
                  <UserCircle className="h-4 w-4 text-muted-foreground" />
                  <span className="flex-1 text-sm text-foreground">Profile</span>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild className={cn(
                "mx-1 rounded-lg px-3 py-2.5 cursor-pointer",
                "focus:bg-muted",
                "transition-colors duration-75"
              )}>
                <Link href={isAdminUser ? "/admin/settings" : "/settings"} className="flex items-center gap-3">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <span className="flex-1 text-sm text-foreground">Settings</span>
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                </Link>
              </DropdownMenuItem>
            </div>
            
            {/* Sign Out */}
            <div className="py-1 border-t border-border">
              <DropdownMenuItem 
                onClick={() => alert('Sign out disabled for preview')} 
                className={cn(
                  "mx-1 rounded-lg px-3 py-2.5 cursor-pointer",
                  "focus:bg-[hsl(var(--destructive))/0.1]",
                  "transition-colors duration-75"
                )}
              >
                <div className="flex items-center gap-3 w-full">
                  <LogOut className="h-4 w-4 text-[hsl(var(--destructive))]" />
                  <span className="text-sm text-[hsl(var(--destructive))]">Sign out</span>
                </div>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
