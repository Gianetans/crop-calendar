'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { supabase } from '@/lib/supabase';
import type { Crop } from '@/types';

export default function CompanionPage() {
  const router = useRouter();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<Crop | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCrops();
  }, []);

  const loadCrops = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        router.push('/auth/login');
        return;
      }

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading companion planting guide...</div>
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
              <h1 className="text-2xl font-bold text-gray-900">🤝 Companion Planting Guide</h1>
              <p className="text-sm text-gray-600 mt-1">Learn which crops grow well together</p>
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
        {/* Educational Content */}
        <Card className="mb-8 bg-gradient-to-br from-green-50 to-emerald-50">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">What is Companion Planting?</h2>
          <div className="space-y-3 text-gray-700">
            <p>
              Companion planting is the practice of growing different crops in proximity for mutual benefit. 
              Some plants help each other by repelling pests, attracting beneficial insects, or improving soil nutrients.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div className="p-4 bg-white rounded-lg">
                <h3 className="font-semibold text-green-700 mb-2">✅ Benefits of Good Companions:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Natural pest control</li>
                  <li>Improved pollination</li>
                  <li>Better use of space</li>
                  <li>Enhanced growth and flavor</li>
                  <li>Soil nutrient optimization</li>
                </ul>
              </div>
              <div className="p-4 bg-white rounded-lg">
                <h3 className="font-semibold text-red-700 mb-2">⚠️ Why Avoid Certain Combinations:</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Competition for nutrients</li>
                  <li>Shared pests and diseases</li>
                  <li>Allelopathy (chemical inhibition)</li>
                  <li>Space and light competition</li>
                  <li>Different watering needs</li>
                </ul>
              </div>
            </div>
          </div>
        </Card>

        {/* Crop Selection */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select a crop to see its companions:
          </label>
          <select
            className="w-full md:w-96 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
            value={selectedCrop?.id || ''}
            onChange={(e) => {
              const crop = crops.find(c => c.id === e.target.value);
              setSelectedCrop(crop || null);
            }}
          >
            <option value="">Choose a crop...</option>
            {crops.map(crop => (
              <option key={crop.id} value={crop.id}>
                {crop.name}
              </option>
            ))}
          </select>
        </div>

        {/* Selected Crop Details */}
        {selectedCrop ? (
          <div className="space-y-6">
            <Card>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Companion Planting for {selectedCrop.name}
              </h2>
              
              {selectedCrop.companion_plants && selectedCrop.companion_plants.length > 0 ? (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-green-700 mb-3">
                    ✅ Good Companions ({selectedCrop.companion_plants.length})
                  </h3>
                  <p className="text-gray-600 mb-4">
                    These plants grow well with {selectedCrop.name} and provide mutual benefits:
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {selectedCrop.companion_plants.map((companion) => {
                      const companionCrop = crops.find(c => c.name === companion);
                      return (
                        <button
                          key={companion}
                          onClick={() => companionCrop && setSelectedCrop(companionCrop)}
                          className="p-4 bg-green-50 hover:bg-green-100 border-2 border-green-200 rounded-lg text-center transition-colors"
                        >
                          <div className="font-semibold text-gray-900">{companion}</div>
                          {companionCrop && (
                            <div className="text-xs text-gray-600 mt-1">{companionCrop.category}</div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg text-gray-600">
                  No companion plant data available for {selectedCrop.name}
                </div>
              )}

              {selectedCrop.avoid_plants && selectedCrop.avoid_plants.length > 0 ? (
                <div>
                  <h3 className="text-lg font-semibold text-red-700 mb-3">
                    ⚠️ Plants to Avoid ({selectedCrop.avoid_plants.length})
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Keep {selectedCrop.name} away from these plants:
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {selectedCrop.avoid_plants.map((avoid) => {
                      const avoidCrop = crops.find(c => c.name === avoid);
                      return (
                        <button
                          key={avoid}
                          onClick={() => avoidCrop && setSelectedCrop(avoidCrop)}
                          className="p-4 bg-red-50 hover:bg-red-100 border-2 border-red-200 rounded-lg text-center transition-colors"
                        >
                          <div className="font-semibold text-gray-900">{avoid}</div>
                          {avoidCrop && (
                            <div className="text-xs text-gray-600 mt-1">{avoidCrop.category}</div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg text-gray-600">
                  No plants to avoid for {selectedCrop.name}
                </div>
              )}
            </Card>

            <Card>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Growing Information</h3>
              {selectedCrop.notes && (
                <p className="text-gray-700 leading-relaxed">{selectedCrop.notes}</p>
              )}
              <div className="mt-4">
                <Link href={`/crops/${selectedCrop.id}`}>
                  <Button variant="secondary">View Full Crop Details →</Button>
                </Link>
              </div>
            </Card>
          </div>
        ) : (
          <Card className="text-center py-12">
            <div className="text-6xl mb-4">🌻</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Select a crop above to see its companion planting information
            </h3>
            <p className="text-gray-600">
              Learn which plants work well together and which ones to keep apart
            </p>
          </Card>
        )}

        {/* Popular Combinations */}
        <Card className="mt-8 bg-gradient-to-br from-blue-50 to-indigo-50">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🌟 Popular Companion Combinations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-white rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Three Sisters Garden</h4>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Corn + Beans + Squash</strong>
              </p>
              <p className="text-sm text-gray-600">
                A traditional Native American planting method where corn provides structure for beans to climb, 
                beans fix nitrogen, and squash covers the ground to retain moisture.
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Classic Herb Pairing</h4>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Tomato + Basil</strong>
              </p>
              <p className="text-sm text-gray-600">
                Basil repels pests that attack tomatoes and may improve tomato flavor. 
                They also have similar water and sun requirements.
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">The Carrot & Onion Pair</h4>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Carrot + Onion</strong>
              </p>
              <p className="text-sm text-gray-600">
                Onions help deter carrot flies, while carrots can help deter onion flies. 
                They use space efficiently with different root depths.
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">Lettuce Under Protection</h4>
              <p className="text-sm text-gray-700 mb-2">
                <strong>Lettuce + Cucumber</strong>
              </p>
              <p className="text-sm text-gray-600">
                Lettuce benefits from the shade provided by cucumber vines during hot weather, 
                extending the lettuce harvest season.
              </p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
