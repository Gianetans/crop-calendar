import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { getDaysUntilPlanting, getPlantingWindow } from '@/lib/planting-calc';
import { parseISO } from 'date-fns';
import type { Crop } from '@/types';
import { createServerClient } from '@/lib/supabase';

export default async function DashboardPage() {
  const supabase = createServerClient();
  
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/auth/login');
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (!profile || !profile.last_frost_date) {
    redirect('/setup');
  }

  // Get user's garden crops
  const { data: userCrops } = await supabase
    .from('user_crops')
    .select(`
      *,
      crop:crops(*)
    `)
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false });

  const lastFrostDate = parseISO(profile.last_frost_date);

  // Calculate statistics
  const totalCrops = userCrops?.length || 0;
  
  const cropsReadyToPlant = userCrops?.filter(uc => {
    if (!uc.crop || uc.status !== 'planned') return false;
    const crop = uc.crop as unknown as Crop;
    const window = getPlantingWindow(crop, lastFrostDate);
    return window === 'optimal';
  }).length || 0;

  const overduePlantings = userCrops?.filter(uc => {
    if (!uc.crop || uc.status !== 'planned') return false;
    const crop = uc.crop as unknown as Crop;
    const days = getDaysUntilPlanting(crop, lastFrostDate);
    return days < 0;
  }).length || 0;

  const upcomingHarvests = userCrops?.filter(uc => 
    uc.status === 'planted' || uc.status === 'harvesting'
  ).length || 0;

  // Get crops to plant this week
  const cropsThisWeek = userCrops?.filter(uc => {
    if (!uc.crop || uc.status !== 'planned') return false;
    const crop = uc.crop as unknown as Crop;
    const days = getDaysUntilPlanting(crop, lastFrostDate);
    return days >= 0 && days <= 7;
  }) || [];

  // Get next planting
  let daysToNextPlanting = null;
  const plannedCrops = userCrops?.filter(uc => uc.status === 'planned' && uc.crop) || [];
  if (plannedCrops.length > 0) {
    const upcomingDays = plannedCrops
      .map(uc => {
        const crop = uc.crop as unknown as Crop;
        return getDaysUntilPlanting(crop, lastFrostDate);
      })
      .filter(d => d >= 0)
      .sort((a, b) => a - b);
    
    if (upcomingDays.length > 0) {
      daysToNextPlanting = upcomingDays[0];
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">🌱 CropCalendar</h1>
              <p className="text-sm text-gray-600 mt-1">
                {profile.location || profile.city ? `${profile.location || profile.city}` : 'Your Garden'}
              </p>
            </div>
            <nav className="flex gap-4">
              <Link href="/crops">
                <Button variant="secondary" size="sm">Crop Library</Button>
              </Link>
              <Link href="/garden">
                <Button variant="secondary" size="sm">My Garden</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back! 👋</h2>
          <p className="text-gray-600">
            Your last frost date is set to <strong>{new Date(profile.last_frost_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</strong>
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">{totalCrops}</div>
              <div className="text-gray-600">Total Crops</div>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">{cropsReadyToPlant}</div>
              <div className="text-gray-600">Ready to Plant</div>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {daysToNextPlanting !== null ? daysToNextPlanting : '—'}
              </div>
              <div className="text-gray-600">Days to Next Planting</div>
            </div>
          </Card>

          <Card>
            <div className="text-center">
              <div className="text-4xl font-bold text-amber-600 mb-2">{upcomingHarvests}</div>
              <div className="text-gray-600">Upcoming Harvests</div>
            </div>
          </Card>
        </div>

        {/* Action Items */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">🌿 Action Items</h3>
            
            {overduePlantings > 0 && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                <div className="flex items-center">
                  <span className="text-red-700 font-semibold">⚠️ {overduePlantings} overdue planting(s)</span>
                </div>
              </div>
            )}

            {cropsThisWeek.length > 0 ? (
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Plant this week:</h4>
                <div className="space-y-2">
                  {cropsThisWeek.slice(0, 5).map((uc) => {
                    const crop = uc.crop as unknown as Crop;
                    const days = getDaysUntilPlanting(crop, lastFrostDate);
                    return (
                      <div key={uc.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <span className="font-medium text-gray-900">{crop.name}</span>
                        <Badge type="category" value={crop.category} />
                        <span className="text-sm text-gray-600">
                          {days === 0 ? 'Today!' : `in ${days} day${days !== 1 ? 's' : ''}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-gray-500">No crops to plant this week. Check the crop library to add more!</p>
            )}
          </Card>

          <Card>
            <h3 className="text-xl font-semibold text-gray-900 mb-4">🚀 Quick Actions</h3>
            <div className="space-y-3">
              <Link href="/crops" className="block">
                <Button variant="primary" size="md" className="w-full">
                  Browse Crop Library
                </Button>
              </Link>
              <Link href="/garden" className="block">
                <Button variant="secondary" size="md" className="w-full">
                  Manage My Garden
                </Button>
              </Link>
              <Link href="/calendar" className="block">
                <Button variant="secondary" size="md" className="w-full">
                  View Planting Calendar
                </Button>
              </Link>
              <Link href="/companion" className="block">
                <Button variant="secondary" size="md" className="w-full">
                  Companion Planting Guide
                </Button>
              </Link>
              <Link href="/setup" className="block">
                <Button variant="secondary" size="md" className="w-full">
                  Update Location Settings
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Getting Started */}
        {totalCrops === 0 && (
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">🌱 Getting Started</h3>
            <p className="text-gray-700 mb-4">
              Welcome to CropCalendar! Let&apos;s get your garden started:
            </p>
            <ol className="list-decimal list-inside space-y-2 text-gray-700 mb-6">
              <li>Browse the crop library to discover what you can grow</li>
              <li>Add crops to your garden with the &quot;Add to Garden&quot; button</li>
              <li>Track planting dates and harvest times</li>
              <li>Use the companion planting guide to optimize your garden layout</li>
            </ol>
            <Link href="/crops">
              <Button variant="primary" size="lg">
                Explore Crops →
              </Button>
            </Link>
          </Card>
        )}
      </main>
    </div>
  );
}
