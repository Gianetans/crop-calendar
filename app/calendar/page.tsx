'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { supabase } from '@/lib/supabase';
import { calculatePlantingDates, getPlantingWindow, formatDate } from '@/lib/planting-calc';
import { parseISO, format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns';
import type { Crop, CropCategory } from '@/types';

export default function CalendarPage() {
  const router = useRouter();
  const [userCrops, setUserCrops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState<CropCategory | 'All'>('All');
  const [lastFrostDate, setLastFrostDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const categories: Array<CropCategory | 'All'> = ['All', 'Vegetable', 'Fruit', 'Herb', 'Grain', 'Legume'];

  useEffect(() => {
    loadCalendar();
  }, []);

  const loadCalendar = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/auth/login');
        return;
      }

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (!profile || !profile.last_frost_date) {
        router.push('/setup');
        return;
      }

      setLastFrostDate(parseISO(profile.last_frost_date));

      const { data: crops, error } = await supabase
        .from('user_crops')
        .select(`
          *,
          crop:crops(*)
        `)
        .eq('user_id', session.user.id)
        .order('planned_plant_date', { ascending: true });

      if (error) throw error;
      setUserCrops(crops || []);
    } catch (error) {
      console.error('Error loading calendar:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFilteredCrops = () => {
    if (filterCategory === 'All') {
      return userCrops;
    }
    return userCrops.filter(uc => uc.crop && uc.crop.category === filterCategory);
  };

  const getDaysInMonth = () => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    return eachDayOfInterval({ start, end });
  };

  const getCropsForDay = (day: Date) => {
    const filtered = getFilteredCrops();
    return filtered.filter(uc => {
      if (!uc.crop || !lastFrostDate) return false;
      
      const crop = uc.crop as Crop;
      const dates = calculatePlantingDates(crop, lastFrostDate);
      
      // Check if this day matches any planting date
      return (
        (dates.indoorStartDate && isSameDay(dates.indoorStartDate, day)) ||
        (dates.transplantDate && isSameDay(dates.transplantDate, day)) ||
        (dates.directSowEarliest && isSameDay(dates.directSowEarliest, day)) ||
        (dates.estimatedHarvestDate && isSameDay(dates.estimatedHarvestDate, day))
      );
    });
  };

  const getEventType = (crop: Crop, day: Date) => {
    if (!lastFrostDate) return null;
    const dates = calculatePlantingDates(crop, lastFrostDate);
    
    if (dates.indoorStartDate && isSameDay(dates.indoorStartDate, day)) return 'indoor';
    if (dates.transplantDate && isSameDay(dates.transplantDate, day)) return 'transplant';
    if (dates.directSowEarliest && isSameDay(dates.directSowEarliest, day)) return 'sow';
    if (dates.estimatedHarvestDate && isSameDay(dates.estimatedHarvestDate, day)) return 'harvest';
    return null;
  };

  const days = getDaysInMonth();
  const today = new Date();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading calendar...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">📅 Planting Calendar</h1>
              <p className="text-sm text-gray-600 mt-1">Visual timeline of your garden</p>
            </div>
            <div className="flex gap-3">
              <Link href="/dashboard">
                <Button variant="secondary" size="sm">Dashboard</Button>
              </Link>
              <Link href="/garden">
                <Button variant="secondary" size="sm">My Garden</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {userCrops.length === 0 ? (
          <Card className="text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No crops in your garden yet</h2>
            <p className="text-gray-600 mb-6">Add crops to see your planting timeline</p>
            <Link href="/crops">
              <Button variant="primary" size="lg">Browse Crop Library</Button>
            </Link>
          </Card>
        ) : (
          <>
            {/* Filters and Month Navigation */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  >
                    ← Previous
                  </Button>
                  <h2 className="text-xl font-bold text-gray-900">
                    {format(currentMonth, 'MMMM yyyy')}
                  </h2>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  >
                    Next →
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setCurrentMonth(new Date())}
                  >
                    Today
                  </Button>
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      filterCategory === cat
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Legend */}
            <Card className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Legend:</h3>
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-200 rounded"></div>
                  <span>Indoor Start</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-200 rounded"></div>
                  <span>Transplant</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-200 rounded"></div>
                  <span>Direct Sow</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-purple-200 rounded"></div>
                  <span>Harvest</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-200 border-2 border-red-500 rounded"></div>
                  <span>Today</span>
                </div>
              </div>
            </Card>

            {/* Calendar Grid */}
            <Card>
              <div className="grid grid-cols-7 gap-2">
                {/* Day Headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center font-semibold text-gray-700 py-2">
                    {day}
                  </div>
                ))}

                {/* Empty cells for days before start of month */}
                {Array.from({ length: days[0].getDay() }).map((_, i) => (
                  <div key={`empty-${i}`} className="min-h-24"></div>
                ))}

                {/* Calendar Days */}
                {days.map(day => {
                  const cropsForDay = getCropsForDay(day);
                  const isToday = isSameDay(day, today);

                  return (
                    <div
                      key={day.toISOString()}
                      className={`min-h-24 p-2 border rounded-lg ${
                        isToday ? 'bg-red-50 border-red-500 border-2' : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className={`text-sm font-medium mb-1 ${
                        isToday ? 'text-red-600' : 'text-gray-700'
                      }`}>
                        {format(day, 'd')}
                      </div>
                      <div className="space-y-1">
                        {cropsForDay.map(uc => {
                          const crop = uc.crop as Crop;
                          const eventType = getEventType(crop, day);
                          const bgColor = {
                            indoor: 'bg-blue-200',
                            transplant: 'bg-green-200',
                            sow: 'bg-yellow-200',
                            harvest: 'bg-purple-200',
                          }[eventType || ''] || 'bg-gray-200';

                          return (
                            <div
                              key={uc.id}
                              className={`text-xs p-1 rounded ${bgColor} truncate`}
                              title={`${crop.name} - ${eventType}`}
                            >
                              {crop.name}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Timeline List View */}
            <div className="mt-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Timeline View</h2>
              <div className="space-y-4">
                {getFilteredCrops().map(uc => {
                  const crop = uc.crop as Crop;
                  if (!lastFrostDate) return null;
                  
                  const dates = calculatePlantingDates(crop, lastFrostDate);
                  const window = getPlantingWindow(crop, lastFrostDate);

                  return (
                    <Card key={uc.id}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="text-lg font-semibold text-gray-900">{crop.name}</h3>
                            <Badge type="category" value={crop.category} />
                            <Badge type="window" value={window} />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-sm">
                            {dates.indoorStartDate && (
                              <div className="p-2 bg-blue-50 rounded">
                                <div className="font-medium text-blue-900">Indoor Start</div>
                                <div className="text-blue-700">{formatDate(dates.indoorStartDate)}</div>
                              </div>
                            )}
                            {dates.transplantDate && (
                              <div className="p-2 bg-green-50 rounded">
                                <div className="font-medium text-green-900">Transplant</div>
                                <div className="text-green-700">{formatDate(dates.transplantDate)}</div>
                              </div>
                            )}
                            {dates.directSowEarliest && (
                              <div className="p-2 bg-yellow-50 rounded">
                                <div className="font-medium text-yellow-900">Direct Sow</div>
                                <div className="text-yellow-700">{formatDate(dates.directSowEarliest)}</div>
                              </div>
                            )}
                            {dates.estimatedHarvestDate && (
                              <div className="p-2 bg-purple-50 rounded">
                                <div className="font-medium text-purple-900">Harvest</div>
                                <div className="text-purple-700">{formatDate(dates.estimatedHarvestDate)}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
