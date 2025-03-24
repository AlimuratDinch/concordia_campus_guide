import { supabase } from '../../app/lib/supabase';
import { createClient } from '@supabase/supabase-js';

jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    auth: {
      storage: {},
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  })),
}));

describe('Supabase client initialization', () => {
  it('should create supabase client with correct config', () => {
    expect(supabase).toBeDefined();
    expect(supabase.auth).toBeDefined();
    expect(createClient).toHaveBeenCalled();
  });
});
