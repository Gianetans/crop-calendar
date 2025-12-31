import React from 'react';
import { redirect } from 'next/navigation';
import LocationSetup from '@/components/LocationSetup';
import { createServerClient } from '@/lib/supabase';

export default async function SetupPage() {
  const supabase = createServerClient();
  
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/auth/login');
  }

  const { data: profile } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4">
      <LocationSetup userId={session.user.id} existingProfile={profile || undefined} />
    </div>
  );
}
