'use client';

export const dynamic = 'force-dynamic';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  Users, 
  Ban, 
  AlertTriangle, 
  ArrowRight,
  Building2,
  BookOpen,
  CalendarDays,
  MessageCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useUserCreation } from '@/hooks/useUserCreation';
import { useSearch } from '@/components/providers/search-provider';
import { cn } from '@/lib/utils';

interface Amenity {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  communityId: string;
  isActive: boolean;
  createdAt: any;
  updatedAt: any;
  isBlocked?: boolean;
  blockReason?: string;
  blockedAt?: any;
  booking?: {
    maxPeople: number;
    slotDuration: number;
    weekdayHours: { startTime: string; endTime: string; };
    weekendHours: { startTime: string; endTime: string; };
  };
  rules?: {
    maxSlotsPerFamily: number;
    blackoutDates: any[];
  };
}

// Premium stagger animation
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 400, damping: 30 },
  },
};

// Skeleton Card for loading
function SkeletonCard() {
  return (
    <div className="bg-card rounded-xl overflow-hidden shadow-card">
      <div className="h-40 skeleton" />
      <div className="p-6 space-y-4">
        <div className="h-5 skeleton rounded w-3/4" />
        <div className="space-y-2">
          <div className="h-4 skeleton rounded w-full" />
          <div className="h-4 skeleton rounded w-2/3" />
        </div>
        <div className="flex gap-4 pt-2">
          <div className="h-4 skeleton rounded w-16" />
          <div className="h-4 skeleton rounded w-16" />
        </div>
        <div className="h-10 skeleton rounded-[10px] w-full mt-4" />
      </div>
    </div>
  );
}

// Premium Amenity Card with hover elevation
function AmenityCard({ amenity }: { amenity: Amenity }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div variants={itemVariants}>
      <Link href={`/amenity/${amenity.id}`} className="block h-full group">
        <div className={cn(
          "h-full bg-card rounded-xl overflow-hidden",
          "shadow-card transition-all duration-200",
          "hover:shadow-card-hover hover:-translate-y-1",
          "border border-transparent hover:border-[hsl(var(--border))]",
          amenity.isBlocked && "opacity-75"
        )}>
          {/* Image */}
          <div className="relative h-40 overflow-hidden bg-muted">
            <img
              src={amenity.imageUrl || 'https://images.pexels.com/photos/296282/pexels-photo-296282.jpeg?auto=compress&cs=tinysrgb&w=600'}
              alt={amenity.name}
              className={cn(
                "w-full h-full object-cover transition-all duration-500",
                "group-hover:scale-105",
                imageLoaded ? "opacity-100" : "opacity-0"
              )}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
            />
            
            {/* Status Pill */}
            <div className="absolute top-3 right-3">
              {amenity.isBlocked ? (
                <span className="badge-error flex items-center gap-1">
                  <Ban className="w-3 h-3" />
                  Blocked
                </span>
              ) : (
                <span className="badge-success flex items-center gap-1">
                  Available
                </span>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <h3 className="font-serif text-lg text-foreground mb-2 group-hover:text-[hsl(var(--accent))] transition-colors">
              {amenity.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
              {amenity.description}
            </p>

            {/* Block Reason */}
            {amenity.isBlocked && amenity.blockReason && (
              <div className="mb-4 p-3 bg-[hsl(var(--destructive))/0.05] rounded-lg border-l-2 border-[hsl(var(--destructive))]">
                <div className="flex items-start gap-2 text-sm text-[hsl(var(--destructive))]">
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span className="line-clamp-2">{amenity.blockReason}</span>
                </div>
              </div>
            )}

            {/* Meta */}
            <div className="flex items-center gap-4 mb-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                <span>Max {amenity.booking?.maxPeople || 2}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{amenity.booking?.slotDuration || 2}h slots</span>
              </div>
            </div>

            {/* CTA */}
            <Button 
              className={cn(
                "w-full h-10 rounded-[10px] font-medium text-sm",
                amenity.isBlocked 
                  ? "bg-muted text-muted-foreground cursor-not-allowed" 
                  : "bg-[hsl(var(--accent))] text-white hover:bg-[hsl(16,55%,45%)]"
              )}
              disabled={amenity.isBlocked}
            >
              {amenity.isBlocked ? (
                <>
                  <Ban className="w-4 h-4 mr-2" />
                  Unavailable
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Now
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// Quick Action Card
function QuickActionCard({ 
  href, 
  icon: Icon, 
  title, 
  description,
  color
}: { 
  href: string; 
  icon: any; 
  title: string; 
  description: string;
  color: string;
}) {
  return (
    <Link href={href} className="block group">
      <div className={cn(
        "p-6 rounded-xl bg-card shadow-card",
        "border border-transparent hover:border-[hsl(var(--border))]",
        "transition-all duration-200 hover:shadow-card-hover hover:-translate-y-1"
      )}>
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
          color
        )}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <h3 className="font-medium text-foreground mb-1 group-hover:text-[hsl(var(--accent))] transition-colors">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground">
          {description}
        </p>
      </div>
    </Link>
  );
}

// Empty State
function EmptyState({ title, description, action }: { 
  title: string; 
  description: string; 
  action?: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-6"
    >
      <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center mb-6">
        <Building2 className="w-8 h-8 text-muted-foreground" />
      </div>
      <h3 className="font-serif text-lg text-foreground mb-2 text-center">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground text-center max-w-sm mb-6">
        {description}
      </p>
      {action}
    </motion.div>
  );
}

export default function Dashboard() {
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);
  const { session, status } = useUserCreation();
  const router = useRouter();
  const { searchQuery, setSearchQuery } = useSearch();

  // Filter amenities based on search
  const filteredAmenities = useMemo(() => {
    if (!searchQuery.trim()) return amenities;
    return amenities.filter((amenity) =>
      amenity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      amenity.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [amenities, searchQuery]);

  // Get today's date formatted
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  // Community stats
  const availableCount = amenities.filter(a => !a.isBlocked).length;

  // Check admin onboarding
  useEffect(() => {
    const checkOnboarding = async () => {
      if (status === 'loading') return;
      
      const urlParams = new URLSearchParams(window.location.search);
      const fromOnboarding = urlParams.get('from') === 'onboarding' || 
                           sessionStorage.getItem('onboarding-completed') === 'true';
      
      if (fromOnboarding) {
        sessionStorage.removeItem('onboarding-completed');
        return;
      }
      
      if (session?.user?.role === 'admin' && session.user.communityId) {
        try {
          const amenitiesQuery = query(
            collection(db, 'amenities'),
            where('communityId', '==', session.user.communityId)
          );
          const amenitiesSnapshot = await getDocs(amenitiesQuery);
          
          if (amenitiesSnapshot.size === 0) {
            router.push('/admin/onboarding');
          }
        } catch (error) {
          console.error('Error checking onboarding:', error);
        }
      }
    };

    checkOnboarding();
  }, [session, status, router]);

  useEffect(() => {
    if (session?.user?.communityId) {
      fetchAmenities();
    }
  }, [session]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && session?.user?.communityId) {
        fetchAmenities();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [session]);

  const fetchAmenities = async () => {
    try {
      if (!session?.user?.communityId) return;

      const q = query(
        collection(db, 'amenities'), 
        where('communityId', '==', session.user.communityId)
      );
      
      const querySnapshot = await getDocs(q);
      const amenityList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Amenity[];
      
      amenityList.sort((a, b) => a.name.localeCompare(b.name));
      setAmenities(amenityList);
    } catch (error) {
      console.error('Error fetching amenities:', error);
    } finally {
      setLoading(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Skeleton */}
          <div className="mb-10">
            <div className="h-10 skeleton rounded-lg w-72 mb-3" />
            <div className="h-5 skeleton rounded w-96" />
          </div>
          
          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        
        {/* Zone 1: Community Pulse */}
        <motion.section
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="bg-card rounded-xl p-6 sm:p-8 shadow-card">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="font-serif text-2xl sm:text-3xl text-foreground mb-1">
                  {formattedDate}
                </h1>
                <p className="text-muted-foreground">
                  {session?.user?.communityId ? 'Your Community' : 'Welcome back'}
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-[hsl(var(--success))/0.1] rounded-full">
                <div className="w-2 h-2 rounded-full bg-[hsl(var(--success))] animate-pulse" />
                <span className="text-sm font-medium text-[hsl(var(--success))]">
                  {availableCount} amenities available
                </span>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Zone 2: Quick Actions */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <h2 className="font-serif text-lg text-foreground mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickActionCard
              href="/dashboard"
              icon={Calendar}
              title="Book Amenity"
              description="Reserve a space"
              color="bg-[hsl(var(--primary))]"
            />
            <QuickActionCard
              href="/bookings"
              icon={BookOpen}
              title="My Bookings"
              description="View reservations"
              color="bg-[hsl(var(--accent))]"
            />
            <QuickActionCard
              href="/calendar"
              icon={CalendarDays}
              title="View Calendar"
              description="Check availability"
              color="bg-[hsl(var(--success))]"
            />
            <QuickActionCard
              href="/contact"
              icon={MessageCircle}
              title="Contact Admin"
              description="Get help"
              color="bg-[hsl(var(--warning))]"
            />
          </div>
        </motion.section>

        {/* Search Results Indicator */}
        <AnimatePresence>
          {searchQuery.trim() && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <div className="flex items-center gap-3 px-4 py-3 bg-[hsl(var(--primary))/0.05] rounded-xl border border-[hsl(var(--primary))/0.1]">
                <span className="text-sm text-[hsl(var(--primary))]">
                  {filteredAmenities.length} result{filteredAmenities.length !== 1 ? 's' : ''} for "{searchQuery}"
                </span>
                <button 
                  onClick={() => setSearchQuery('')}
                  className="ml-auto text-sm text-[hsl(var(--primary))] hover:underline font-medium"
                >
                  Clear
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Zone 3: Amenity Grid */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-lg text-foreground">
              Amenities
            </h2>
          </div>

          {/* Empty States */}
          {amenities.length === 0 && !loading && (
            <EmptyState
              title="No amenities found"
              description="Your community amenities will appear here once they're set up."
              action={
                <Button
                  onClick={() => {
                    setLoading(true);
                    fetchAmenities();
                  }}
                  className="btn-secondary"
                >
                  Retry Loading
                </Button>
              }
            />
          )}

          {amenities.length > 0 && filteredAmenities.length === 0 && searchQuery.trim() && (
            <EmptyState
              title="No matching amenities"
              description={`No amenities match "${searchQuery}". Try different search terms.`}
              action={
                <Button
                  onClick={() => setSearchQuery('')}
                  className="btn-secondary"
                >
                  Clear Search
                </Button>
              }
            />
          )}

          {/* Amenities Grid */}
          {filteredAmenities.length > 0 && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredAmenities.map((amenity) => (
                <AmenityCard key={amenity.id} amenity={amenity} />
              ))}
            </motion.div>
          )}
        </section>
      </div>
    </div>
  );
}
