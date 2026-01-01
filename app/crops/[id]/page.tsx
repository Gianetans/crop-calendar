import React from 'react';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import { calculatePlantingDates, getPlantingInstructions } from '@/lib/planting-calc';
import { parseISO } from 'date-fns';
import type { Crop } from '@/types';
import { createServerClient } from '@/lib/supabase';

export default async function CropDetailPage({ params }: { params: { id: string } }) {
  const supabase = createServerClient();
  
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/auth/login');
  }

  // Get crop details
  const { data: crop, error } = await supabase
    .from('crops')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error || !crop) {
    notFound();
  }

  // Get user profile for frost date
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (!profile || !profile.last_frost_date) {
    redirect('/setup');
  }

  const lastFrostDate = parseISO(profile.last_frost_date);
  calculatePlantingDates(crop as Crop, lastFrostDate);
  const instructions = getPlantingInstructions(crop as Crop, lastFrostDate);

  // Check if crop is in user's garden
  const { data: userCrop } = await supabase
    .from('user_crops')
    .select('*')
    .eq('user_id', session.user.id)
    .eq('crop_id', crop.id)
    .single();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/crops">
              <Button variant="secondary" size="sm">← Back to Library</Button>
            </Link>
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

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Crop Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{crop.name}</h1>
              {crop.scientific_name && (
                <p className="text-lg text-gray-500 italic">{crop.scientific_name}</p>
              )}
            </div>
            <Badge type="category" value={crop.category} />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{crop.days_to_maturity}</div>
              <div className="text-sm text-gray-600 mt-1">Days to Maturity</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="mt-2">
                <Badge type="tolerance" value={crop.frost_tolerance} />
              </div>
              <div className="text-sm text-gray-600 mt-1">Frost Tolerance</div>
            </div>
            {crop.spacing && (
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-lg font-semibold text-gray-900">{crop.spacing}</div>
                <div className="text-sm text-gray-600 mt-1">Spacing</div>
              </div>
            )}
            {crop.planting_depth && (
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-lg font-semibold text-gray-900">{crop.planting_depth}</div>
                <div className="text-sm text-gray-600 mt-1">Planting Depth</div>
              </div>
            )}
          </div>
        </div>

        {/* Planting Dates */}
        <Card className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">📅 Planting Schedule</h2>
          <div className="space-y-3">
            {instructions.indoorStart && (
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <span className="font-medium text-gray-900">Indoor Start</span>
                <span className="text-gray-700">{instructions.indoorStart}</span>
              </div>
            )}
            {instructions.transplant && (
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <span className="font-medium text-gray-900">Transplant</span>
                <span className="text-gray-700">{instructions.transplant}</span>
              </div>
            )}
            {instructions.directSow && (
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
                <span className="font-medium text-gray-900">Direct Sow</span>
                <span className="text-gray-700">{instructions.directSow}</span>
              </div>
            )}
            {instructions.harvest && (
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <span className="font-medium text-gray-900">Harvest</span>
                <span className="text-gray-700">{instructions.harvest}</span>
              </div>
            )}
          </div>
        </Card>

        {/* Growing Information */}
        <Card className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🌱 Growing Information</h2>
          <div className="space-y-4">
            {crop.soil_temp_min && (
              <div>
                <span className="font-medium text-gray-700">Minimum Soil Temperature:</span>
                <span className="ml-2 text-gray-900">{crop.soil_temp_min}°F</span>
              </div>
            )}
            {crop.succession_planting_weeks && (
              <div>
                <span className="font-medium text-gray-700">Succession Planting:</span>
                <span className="ml-2 text-gray-900">Every {crop.succession_planting_weeks} week(s)</span>
              </div>
            )}
            {crop.notes && (
              <div>
                <h3 className="font-medium text-gray-700 mb-2">Growing Notes:</h3>
                <p className="text-gray-900 leading-relaxed">{crop.notes}</p>
              </div>
            )}
          </div>
        </Card>

        {/* Companion Plants */}
        {(crop.companion_plants && crop.companion_plants.length > 0) && (
          <Card className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">✅ Good Companions</h2>
            <p className="text-gray-600 mb-4">These plants grow well with {crop.name}:</p>
            <div className="flex flex-wrap gap-2">
              {crop.companion_plants.map((companion: string) => (
                <span
                  key={companion}
                  className="px-4 py-2 bg-green-100 text-green-800 rounded-lg font-medium"
                >
                  {companion}
                </span>
              ))}
            </div>
          </Card>
        )}

        {/* Plants to Avoid */}
        {(crop.avoid_plants && crop.avoid_plants.length > 0) && (
          <Card className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">⚠️ Plants to Avoid</h2>
            <p className="text-gray-600 mb-4">Keep {crop.name} away from these plants:</p>
            <div className="flex flex-wrap gap-2">
              {crop.avoid_plants.map((avoid: string) => (
                <span
                  key={avoid}
                  className="px-4 py-2 bg-red-100 text-red-800 rounded-lg font-medium"
                >
                  {avoid}
                </span>
              ))}
            </div>
          </Card>
        )}

        {/* Add to Garden */}
        {!userCrop && (
          <Card className="bg-green-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to grow {crop.name}?</h3>
                <p className="text-gray-700">Add it to your garden to track planting and harvest dates.</p>
              </div>
              <form action="/api/add-to-garden" method="POST">
                <input type="hidden" name="cropId" value={crop.id} />
                <Button type="submit" variant="primary" size="lg">
                  Add to Garden
                </Button>
              </form>
            </div>
          </Card>
        )}

        {userCrop && (
          <Card className="bg-blue-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">✓ Already in your garden</h3>
                <p className="text-gray-700">View and manage this crop in your garden plan.</p>
              </div>
              <Link href="/garden">
                <Button variant="primary" size="lg">
                  Go to My Garden
                </Button>
              </Link>
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}
