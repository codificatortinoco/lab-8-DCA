import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase credentials');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export const uploadMeme = async (file: File) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { data, error } = await supabase.storage
    .from('memes')
    .upload(filePath, file);

  if (error) throw error;
  return data;
};

export const getMemes = async () => {
  const { data, error } = await supabase.storage
    .from('memes')
    .list();

  if (error) throw error;
  return data;
};

export const getMemeUrl = (path: string) => {
  const { data } = supabase.storage
    .from('memes')
    .getPublicUrl(path);
  return data.publicUrl;
}; 