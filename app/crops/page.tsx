'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CropCard from '@/components/CropCard';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';
import { getPlantingWindow } from '@/lib/planting-calc';
import { parseISO } from 'date-fns';
import type { Crop, CropCategory } from '@/types';

export default function CropsPage() {
  const router = useRouter();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [filteredCrops, setFilteredCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CropCategory | 'All'>('All');
  const [sortBy, setSortBy] = useState<'name' | 'maturity'>('name');
  const [userProfile, setUserProfile] = useState<Record<string, unknown> | null>(null);
  const [message, setMessage] = useState('');

  const categories: Array<CropCategory | 'All'> = ['All', 'Vegetable', 'Fruit', 'Herb', 'Grain', 'Legume'];

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    filterAndSortCrops();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [crops, searchQuery, selectedCategory, sortBy]);

  const loadData = async () => {
    try {
      // Get user session and profile
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        setUserProfile(profile);
      }

      // Get all crops
      const { data: cropsData, error } = await supabase
        .from('crops')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setCrops(cropsData || []);
    } catch (error) {
      console.error('Error loading crops:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortCrops = () => {
    let filtered = [...crops];

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(crop =>
        crop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        crop.scientific_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(crop => crop.category === selectedCategory);
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else {
        return a.days_to_maturity - b.days_to_maturity;
      }
    });

    setFilteredCrops(filtered);
  };

  const handleAddToGarden = async (crop: Crop) => {
    if (!userProfile) {
      router.push('/auth/login');
      return;
    }

    const lastFrostDateStr = userProfile.last_frost_date as string | undefined;
    if (!lastFrostDateStr) {
      router.push('/setup');
      return;
    }

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth/login');
        return;
      }

      // Calculate planting date
      const lastFrostDate = parseISO(lastFrostDateStr);
      const { calculatePlantingDates } = await import('@/lib/planting-calc');
      const dates = calculatePlantingDates(crop, lastFrostDate);
      const plantDate = dates.transplantDate || dates.directSowEarliest || dates.indoorStartDate;

      const { error } = await supabase
        .from('user_crops')
        .insert({
          user_id: session.user.id,
          crop_id: crop.id,
          planned_plant_date: plantDate?.toISOString().split('T')[0],
          estimated_harvest_date: dates.estimatedHarvestDate?.toISOString().split('T')[0],
          status: 'planned',
        });

      if (error) {
        if (error.code === '23505') { // Unique violation
          setMessage(`${crop.name} is already in your garden!`);
        } else {
          throw error;
        }
      } else {
        setMessage(`${crop.name} added to your garden!`);
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error adding to garden:', error);
      setMessage('Failed to add crop to garden');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading crops...</div>
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
              <h1 className="text-2xl font-bold text-gray-900">🌱 Crop Library</h1>
              <p className="text-sm text-gray-600 mt-1">{crops.length} crops available</p>
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" size="sm" onClick={() => router.push('/dashboard')}>
                Dashboard
              </Button>
              <Button variant="secondary" size="sm" onClick={() => router.push('/garden')}>
                My Garden
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Message */}
        {message && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
            {message}
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Input
              placeholder="Search crops..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as CropCategory | 'All')}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'name' | 'maturity')}
              >
                <option value="name">Name (A-Z)</option>
                <option value="maturity">Days to Maturity</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mt-4">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCategory === cat
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Crops Grid */}
        {filteredCrops.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCrops.map(crop => {
              const lastFrostDateStr = userProfile?.last_frost_date as string | undefined;
              const plantingWindow = lastFrostDateStr
                ? getPlantingWindow(crop, parseISO(lastFrostDateStr))
                : undefined;
              
              return (
                <CropCard
                  key={crop.id}
                  crop={crop}
                  plantingWindow={plantingWindow}
                  onAddToGarden={handleAddToGarden}
                />
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No crops found matching your filters.</p>
          </div>
        )}
      </main>
    </div>
  );
}
