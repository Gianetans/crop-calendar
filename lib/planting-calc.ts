import { addWeeks, subWeeks, addDays, differenceInDays, format, parseISO, isBefore, isAfter } from 'date-fns';
import type { Crop, PlantingDates, PlantingInstructions, PlantingWindowStatus } from '@/types';

/**
 * Calculate all planting dates for a crop based on last frost date
 */
export function calculatePlantingDates(crop: Crop, lastFrostDate: Date): PlantingDates {
  const dates: PlantingDates = {};

  // Indoor start date
  if (crop.indoor_start_weeks) {
    dates.indoorStartDate = subWeeks(lastFrostDate, crop.indoor_start_weeks);
  }

  // Transplant date
  if (crop.transplant_weeks !== null && crop.transplant_weeks !== undefined) {
    dates.transplantDate = addWeeks(lastFrostDate, crop.transplant_weeks);
  }

  // Direct sow dates
  if (crop.direct_sow_weeks_before_frost) {
    dates.directSowEarliest = subWeeks(lastFrostDate, crop.direct_sow_weeks_before_frost);
  }
  if (crop.direct_sow_weeks_after_frost) {
    dates.directSowLatest = addWeeks(lastFrostDate, crop.direct_sow_weeks_after_frost);
  }

  // If both direct sow values exist, create a range
  if (dates.directSowEarliest && !dates.directSowLatest) {
    dates.directSowLatest = addWeeks(dates.directSowEarliest, 4); // Default 4 week window
  }
  if (dates.directSowLatest && !dates.directSowEarliest) {
    dates.directSowEarliest = dates.directSowLatest;
  }

  // Calculate estimated harvest date based on the earliest planting date
  const earliestPlantDate = getEarliestPlantDate(dates);
  if (earliestPlantDate && crop.days_to_maturity) {
    dates.estimatedHarvestDate = addDays(earliestPlantDate, crop.days_to_maturity);
  }

  return dates;
}

/**
 * Get the earliest planting date from calculated dates
 */
function getEarliestPlantDate(dates: PlantingDates): Date | null {
  const possibleDates = [
    dates.indoorStartDate,
    dates.transplantDate,
    dates.directSowEarliest
  ].filter(Boolean) as Date[];

  if (possibleDates.length === 0) return null;
  
  return possibleDates.reduce((earliest, current) => 
    isBefore(current, earliest) ? current : earliest
  );
}

/**
 * Determine the current planting window status
 */
export function getPlantingWindow(crop: Crop, lastFrostDate: Date): PlantingWindowStatus {
  const today = new Date();
  const dates = calculatePlantingDates(crop, lastFrostDate);

  // Get the relevant planting date (prefer transplant or direct sow)
  const mainPlantDate = dates.transplantDate || dates.directSowEarliest || dates.indoorStartDate;
  
  if (!mainPlantDate) {
    return 'optimal'; // Default if no dates available
  }

  const daysUntil = differenceInDays(mainPlantDate, today);
  
  // Too early (more than 4 weeks before planting date)
  if (daysUntil > 28) {
    return 'too-early';
  }
  
  // Optimal window (4 weeks before to 1 week after)
  if (daysUntil >= -7 && daysUntil <= 28) {
    return 'optimal';
  }
  
  // Late (1-4 weeks past planting date)
  if (daysUntil >= -28 && daysUntil < -7) {
    return 'late';
  }
  
  // Too late (more than 4 weeks past)
  return 'too-late';
}

/**
 * Get days until planting (negative means overdue)
 */
export function getDaysUntilPlanting(crop: Crop, lastFrostDate: Date): number {
  const today = new Date();
  const dates = calculatePlantingDates(crop, lastFrostDate);
  
  const mainPlantDate = dates.transplantDate || dates.directSowEarliest || dates.indoorStartDate;
  
  if (!mainPlantDate) {
    return 0;
  }
  
  return differenceInDays(mainPlantDate, today);
}

/**
 * Get formatted planting instructions
 */
export function getPlantingInstructions(crop: Crop, lastFrostDate: Date): PlantingInstructions {
  const dates = calculatePlantingDates(crop, lastFrostDate);
  const instructions: PlantingInstructions = {};

  if (dates.indoorStartDate) {
    instructions.indoorStart = `Start seeds indoors on ${format(dates.indoorStartDate, 'MMMM d, yyyy')}`;
  }

  if (dates.transplantDate) {
    instructions.transplant = `Transplant outdoors on ${format(dates.transplantDate, 'MMMM d, yyyy')}`;
  }

  if (dates.directSowEarliest && dates.directSowLatest) {
    if (dates.directSowEarliest.getTime() === dates.directSowLatest.getTime()) {
      instructions.directSow = `Direct sow on ${format(dates.directSowEarliest, 'MMMM d, yyyy')}`;
    } else {
      instructions.directSow = `Direct sow between ${format(dates.directSowEarliest, 'MMMM d')} and ${format(dates.directSowLatest, 'MMMM d, yyyy')}`;
    }
  } else if (dates.directSowEarliest) {
    instructions.directSow = `Direct sow starting ${format(dates.directSowEarliest, 'MMMM d, yyyy')}`;
  }

  if (dates.estimatedHarvestDate) {
    instructions.harvest = `Estimated harvest: ${format(dates.estimatedHarvestDate, 'MMMM d, yyyy')}`;
  }

  return instructions;
}

/**
 * Get succession planting dates
 */
export function getSuccessionPlantingDates(crop: Crop, lastFrostDate: Date, count: number): Date[] {
  if (!crop.succession_planting_weeks || count < 1) {
    return [];
  }

  const dates = calculatePlantingDates(crop, lastFrostDate);
  const firstPlantDate = dates.transplantDate || dates.directSowEarliest || dates.indoorStartDate;
  
  if (!firstPlantDate) {
    return [];
  }

  const successionDates: Date[] = [firstPlantDate];
  
  for (let i = 1; i < count; i++) {
    const nextDate = addWeeks(successionDates[i - 1], crop.succession_planting_weeks);
    successionDates.push(nextDate);
  }

  return successionDates;
}

/**
 * Format a date string for display
 */
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) return 'Not set';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, 'MMMM d, yyyy');
  } catch {
    return 'Invalid date';
  }
}

/**
 * Check if a date is in the past
 */
export function isPast(date: Date | string): boolean {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return isBefore(dateObj, new Date());
}

/**
 * Calculate days difference from today
 */
export function daysFromToday(date: Date | string): number {
  const dateObj = typeof date === 'string' ? parseISO(date) : date;
  return differenceInDays(dateObj, new Date());
}
