'use server';

import { readData } from '@/services/db';

export async function getPublicSettings() {
  try {
    return await readData('settings');
  } catch (error) {
    return {};
  }
}
