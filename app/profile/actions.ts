'use server';

import { createClient } from '@/utils/supabase/server';

export async function getFollowers(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('follows')
    .select(`
      follower:profiles!follows_follower_id_fkey (
        username,
        full_name,
        avatar_url
      )
    `)
    .eq('following_id', userId);

  if (error) {
    console.error("Followers Error:", error);
    return [];
  }

  return data.map((d: any) => d.follower).filter(Boolean);
}

export async function getFollowing(userId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('follows')
    .select(`
      target:profiles!follows_following_id_fkey (
        username,
        full_name,
        avatar_url
      )
    `)
    .eq('follower_id', userId);

  if (error) {
    console.error("Following Error:", error);
    return [];
  }

  return data.map((d: any) => d.target).filter(Boolean);
}
