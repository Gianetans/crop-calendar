export type FrostTolerance = 'sensitive' | 'tolerant' | 'hardy';
export type CropCategory = 'Vegetable' | 'Fruit' | 'Herb' | 'Grain' | 'Legume';
export type PlantingWindowStatus = 'too-early' | 'optimal' | 'late' | 'too-late';
export type CropStatus = 'planned' | 'planted' | 'harvesting' | 'harvested';

export interface UserProfile {
  id: string;
  location?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  last_frost_date: string;
  first_frost_date?: string;
  hardiness_zone?: string;
  created_at: string;
  updated_at: string;
}

export interface Crop {
  id: string;
  name: string;
  scientific_name?: string;
  category: CropCategory;
  days_to_maturity: number;
  frost_tolerance: FrostTolerance;
  planting_depth?: string;
  spacing?: string;
  soil_temp_min?: number;
  indoor_start_weeks?: number;
  transplant_weeks?: number;
  direct_sow_weeks_before_frost?: number;
  direct_sow_weeks_after_frost?: number;
  succession_planting_weeks?: number;
  companion_plants?: string[];
  avoid_plants?: string[];
  notes?: string;
  image_url?: string;
  created_at: string;
}

export interface UserCrop {
  id: string;
  user_id: string;
  crop_id: string;
  planned_plant_date?: string;
  actual_plant_date?: string;
  estimated_harvest_date?: string;
  status: CropStatus;
  quantity?: string;
  notes?: string;
  created_at: string;
  crop?: Crop;
}

export interface PlantingDates {
  indoorStartDate?: Date;
  transplantDate?: Date;
  directSowEarliest?: Date;
  directSowLatest?: Date;
  estimatedHarvestDate?: Date;
}

export interface PlantingInstructions {
  indoorStart?: string;
  transplant?: string;
  directSow?: string;
  harvest?: string;
}
