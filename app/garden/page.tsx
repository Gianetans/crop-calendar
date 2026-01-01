'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { supabase } from '@/lib/supabase';
import { getDaysUntilPlanting, formatDate, daysFromToday } from '@/lib/planting-calc';
import { parseISO } from 'date-fns';
import type { Crop, CropStatus } from '@/types';

export default function GardenPage() {
  const router = useRouter();
  const [userCrops, setUserCrops] = useState<Array<Record<string, unknown>>>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<CropStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');
  const [lastFrostDate, setLastFrostDate] = useState<Date | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDate, setEditDate] = useState('');

  useEffect(() => {
    loadGarden();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadGarden = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/auth/login');
        return;
      }

      // Get user profile
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

      // Get user's crops
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
      console.error('Error loading garden:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (cropId: string, newStatus: CropStatus) => {
    try {
      const { error } = await supabase
        .from('user_crops')
        .update({ status: newStatus })
        .eq('id', cropId);

      if (error) throw error;
      loadGarden();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDateUpdate = async (cropId: string) => {
    try {
      const { error } = await supabase
        .from('user_crops')
        .update({ actual_plant_date: editDate })
        .eq('id', cropId);

      if (error) throw error;
      setEditingId(null);
      setEditDate('');
      loadGarden();
    } catch (error) {
      console.error('Error updating date:', error);
    }
  };

  const handleDelete = async (cropId: string) => {
    if (!confirm('Are you sure you want to remove this crop from your garden?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('user_crops')
        .delete()
        .eq('id', cropId);

      if (error) throw error;
      loadGarden();
    } catch (error) {
      console.error('Error deleting crop:', error);
    }
  };

  const getFilteredAndSorted = () => {
    let filtered = [...userCrops];

    if (filterStatus !== 'all') {
      filtered = filtered.filter(uc => uc.status === filterStatus);
    }

    filtered.sort((a, b) => {
      if (sortBy === 'name') {
        const cropA = a.crop as Crop | undefined;
        const cropB = b.crop as Crop | undefined;
        return (cropA?.name || '').localeCompare(cropB?.name || '');
      } else {
        const dateA = (a.actual_plant_date as string) || (a.planned_plant_date as string) || '';
        const dateB = (b.actual_plant_date as string) || (b.planned_plant_date as string) || '';
        return dateA.localeCompare(dateB);
      }
    });

    return filtered;
  };

  const filteredCrops = getFilteredAndSorted();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading your garden...</div>
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
              <h1 className="text-2xl font-bold text-gray-900">🌿 My Garden</h1>
              <p className="text-sm text-gray-600 mt-1">{userCrops.length} crops in your garden</p>
            </div>
            <div className="flex gap-3">
              <Link href="/dashboard">
                <Button variant="secondary" size="sm">Dashboard</Button>
              </Link>
              <Link href="/crops">
                <Button variant="primary" size="sm">+ Add Crops</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {userCrops.length === 0 ? (
          <Card className="text-center py-12">
            <div className="text-6xl mb-4">🌱</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your garden is empty</h2>
            <p className="text-gray-600 mb-6">Start by adding some crops from our library</p>
            <Link href="/crops">
              <Button variant="primary" size="lg">Browse Crop Library</Button>
            </Link>
          </Card>
        ) : (
          <>
            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as CropStatus | 'all')}
                  >
                    <option value="all">All Crops</option>
                    <option value="planned">Planned</option>
                    <option value="planted">Planted</option>
                    <option value="harvesting">Harvesting</option>
                    <option value="harvested">Harvested</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'date' | 'name')}
                  >
                    <option value="date">Plant Date</option>
                    <option value="name">Crop Name</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Crops List */}
            <div className="space-y-4">
              {filteredCrops.map((userCrop) => {
                const crop = userCrop.crop as Crop;
                const plantDate = (userCrop.actual_plant_date as string) || (userCrop.planned_plant_date as string);
                const daysUntil = lastFrostDate ? getDaysUntilPlanting(crop, lastFrostDate) : null;
                const harvestDate = userCrop.estimated_harvest_date as string | undefined;
                const harvestDays = harvestDate 
                  ? daysFromToday(harvestDate)
                  : null;

                return (
                  <Card key={userCrop.id as string}>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      {/* Crop Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Link href={`/crops/${crop.id}`}>
                            <h3 className="text-xl font-semibold text-gray-900 hover:text-green-600">
                              {crop.name}
                            </h3>
                          </Link>
                          <Badge type="category" value={crop.category} />
                          <Badge type="status" value={(userCrop.status as string) || 'planned'} />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                          {/* Plant Date */}
                          <div>
                            <span className="text-gray-600">Plant Date: </span>
                            {editingId === (userCrop.id as string) ? (
                              <div className="flex gap-2 mt-1">
                                <input
                                  type="date"
                                  value={editDate}
                                  onChange={(e) => setEditDate(e.target.value)}
                                  className="px-2 py-1 border border-gray-300 rounded text-sm"
                                />
                                <Button size="sm" onClick={() => handleDateUpdate(userCrop.id as string)}>
                                  Save
                                </Button>
                                <Button size="sm" variant="secondary" onClick={() => setEditingId(null)}>
                                  Cancel
                                </Button>
                              </div>
                            ) : (
                              <button
                                onClick={() => {
                                  setEditingId(userCrop.id as string);
                                  setEditDate((userCrop.actual_plant_date as string) || (userCrop.planned_plant_date as string) || '');
                                }}
                                className="font-medium text-gray-900 hover:text-green-600"
                              >
                                {plantDate ? formatDate(plantDate) : 'Not set'} ✏️
                              </button>
                            )}
                          </div>

                          {/* Days Until/Overdue */}
                          {(userCrop.status as string) === 'planned' && daysUntil !== null ? (
                            <div>
                              <span className="text-gray-600">
                                {daysUntil >= 0 ? 'Days until planting: ' : 'Overdue: '}
                              </span>
                              <span className={`font-medium ${daysUntil < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                                {Math.abs(daysUntil)} day{Math.abs(daysUntil) !== 1 ? 's' : ''}
                              </span>
                            </div>
                          ) : null}

                          {/* Harvest Date */}
                          {((userCrop.status as string) === 'planted' || (userCrop.status as string) === 'harvesting') && harvestDays !== null ? (
                            <div>
                              <span className="text-gray-600">
                                {harvestDays >= 0 ? 'Harvest in: ' : 'Ready to harvest!'}
                              </span>
                              <span className="font-medium text-gray-900">
                                {harvestDays >= 0 ? `${harvestDays} day${harvestDays !== 1 ? 's' : ''}` : ''}
                              </span>
                            </div>
                          ) : null}

                          {/* Quantity */}
                          {userCrop.quantity ? (
                            <div>
                              <span className="text-gray-600">Quantity: </span>
                              <span className="font-medium text-gray-900">{userCrop.quantity as string}</span>
                            </div>
                          ) : null}
                        </div>

                        {userCrop.notes ? (
                          <p className="text-sm text-gray-600 mt-2">📝 {userCrop.notes as string}</p>
                        ) : null}
                      </div>

                      {/* Actions */}
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={(userCrop.status as string) === 'planned' ? 'primary' : 'secondary'}
                            onClick={() => handleStatusChange(userCrop.id as string, 'planned')}
                          >
                            Planned
                          </Button>
                          <Button
                            size="sm"
                            variant={(userCrop.status as string) === 'planted' ? 'success' : 'secondary'}
                            onClick={() => handleStatusChange(userCrop.id as string, 'planted')}
                          >
                            Planted
                          </Button>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={(userCrop.status as string) === 'harvesting' ? 'primary' : 'secondary'}
                            onClick={() => handleStatusChange(userCrop.id as string, 'harvesting')}
                          >
                            Harvesting
                          </Button>
                          <Button
                            size="sm"
                            variant={(userCrop.status as string) === 'harvested' ? 'secondary' : 'secondary'}
                            onClick={() => handleStatusChange(userCrop.id as string, 'harvested')}
                          >
                            Harvested
                          </Button>
                        </div>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDelete(userCrop.id as string)}
                          className="w-full"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
