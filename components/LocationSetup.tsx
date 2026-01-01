'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from './ui/Input';
import Button from './ui/Button';
import { supabase } from '@/lib/supabase';

interface LocationSetupProps {
  userId: string;
  existingProfile?: {
    city?: string;
    state?: string;
    zip_code?: string;
    last_frost_date: string;
    first_frost_date?: string;
    hardiness_zone?: string;
  };
}

export default function LocationSetup({ userId, existingProfile }: LocationSetupProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    city: existingProfile?.city || '',
    state: existingProfile?.state || '',
    zip_code: existingProfile?.zip_code || '',
    last_frost_date: existingProfile?.last_frost_date || '',
    first_frost_date: existingProfile?.first_frost_date || '',
    hardiness_zone: existingProfile?.hardiness_zone || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!formData.last_frost_date) {
      setError('Last frost date is required');
      return;
    }

    setLoading(true);

    try {
      const { error: upsertError } = await supabase
        .from('user_profiles')
        .upsert({
          id: userId,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zip_code,
          last_frost_date: formData.last_frost_date,
          first_frost_date: formData.first_frost_date || null,
          hardiness_zone: formData.hardiness_zone || null,
          location: formData.city && formData.state ? `${formData.city}, ${formData.state}` : null,
          updated_at: new Date().toISOString(),
        });

      if (upsertError) throw upsertError;

      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      console.error('Error saving profile:', err);
      setError('Failed to save profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {existingProfile ? 'Update Your Location' : 'Set Up Your Location'}
        </h2>
        <p className="text-gray-600 mb-6">
          Enter your location and frost dates to get personalized planting recommendations.
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="City"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="Enter your city"
            />
            
            <Input
              label="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
              placeholder="e.g., CA, TX, NY"
            />
          </div>

          <Input
            label="Zip Code"
            name="zip_code"
            value={formData.zip_code}
            onChange={handleChange}
            placeholder="Enter your zip code"
          />

          <Input
            label="Last Frost Date (Spring) *"
            name="last_frost_date"
            type="date"
            value={formData.last_frost_date}
            onChange={handleChange}
            helperText="The average date of the last frost in spring. This is crucial for calculating planting dates."
            required
          />

          <Input
            label="First Frost Date (Fall)"
            name="first_frost_date"
            type="date"
            value={formData.first_frost_date}
            onChange={handleChange}
            helperText="The average date of the first frost in fall (optional)."
          />

          <Input
            label="USDA Hardiness Zone"
            name="hardiness_zone"
            value={formData.hardiness_zone}
            onChange={handleChange}
            placeholder="e.g., 7a, 9b"
            helperText="Optional. Find your zone at planthardiness.ars.usda.gov"
          />

          <div className="pt-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? 'Saving...' : existingProfile ? 'Update Profile' : 'Save and Continue'}
            </Button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">💡 How to find your frost dates:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Check your local agricultural extension office</li>
            <li>• Search online for &quot;[your city] last frost date&quot;</li>
            <li>• Ask experienced gardeners in your area</li>
            <li>• Use the USDA Plant Hardiness Zone Map as a guide</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
