import { createClient } from '@supabase/supabase-js';
import { Database } from '@/lib/database.types';

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export async function signUp(email: string, password: string, userData: { full_name: string, user_type: 'client' | 'translator' }) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  });
  
  return { data, error };
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  
  return { data, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

export async function getCurrentUser() {
  const { data: { session }, error } = await supabase.auth.getSession();
  
  if (error || !session) {
    return { user: null, error };
  }
  
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', session.user.id)
    .single();
    
  return { 
    user: session.user,
    profile,
    error: profileError 
  };
}

export async function createTranslationRequest(requestData: any) {
  const { data, error } = await supabase
    .from('translation_requests')
    .insert(requestData)
    .select()
    .single();
    
  return { data, error };
}

export async function getTranslationRequests(clientId: string) {
  const { data, error } = await supabase
    .from('translation_requests')
    .select(`
      *,
      source_language:source_language_id(name),
      target_language:target_language_id(name),
      assignments:translation_assignments(
        *,
        translator:translator_id(
          *,
          profile:profile_id(*)
        )
      )
    `)
    .eq('client_id', clientId)
    .order('created_at', { ascending: false });
    
  return { data, error };
}

export async function getAvailableRequests() {
  const { data, error } = await supabase
    .from('translation_requests')
    .select(`
      *,
      client:client_id(
        *
      ),
      source_language:source_language_id(name),
      target_language:target_language_id(name)
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });
    
  return { data, error };
}

export async function applyForRequest(requestId: string, translatorId: string) {
  const { data, error } = await supabase
    .from('translation_assignments')
    .insert({
      request_id: requestId,
      translator_id: translatorId,
      status: 'pending'
    })
    .select()
    .single();
    
  return { data, error };
}

export async function getTranslatorProfile(profileId: string) {
  const { data, error } = await supabase
    .from('translator_profiles')
    .select(`
      *,
      profile:profile_id(*),
      languages:translator_languages(
        *,
        language:language_id(*)
      )
    `)
    .eq('profile_id', profileId)
    .single();
    
  return { data, error };
}

export async function updateTranslatorProfile(translatorId: string, profileData: any) {
  const { data, error } = await supabase
    .from('translator_profiles')
    .update(profileData)
    .eq('id', translatorId)
    .select()
    .single();
    
  return { data, error };
}

export async function getLanguages() {
  const { data, error } = await supabase
    .from('languages')
    .select('*')
    .order('name');
    
  return { data, error };
}