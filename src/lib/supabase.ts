import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase ortam değişkenleri eksik');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    storage: window.localStorage,
    storageKey: 'sb-auth-token',
    detectSessionInUrl: true,
    flowType: 'pkce',
    debug: true,
    retryAttempts: 3,
    retryInterval: 1000
  },
  global: {
    headers: {
      'x-client-info': 'koalang-web'
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  db: {
    schema: 'public'
  },
  headers: {
    'x-client-info': 'koalang-web'
  }
});

// Bağlantıyı test et
supabase.auth.onAuthStateChange((event, session) => {
  console.log('🔵 Auth durumu değişti:', { event, user: session?.user?.email });
  if (session?.user) {
    console.log('🟢 Bağlantı başarılı, kullanıcı:', session.user.email);
  } else {
    console.log('🟡 Aktif oturum yok');
  }
});

// Realtime bağlantısını test et
const channel = supabase.channel('db-changes')
  .on('postgres_changes', { event: '*', schema: 'public' }, (payload) => {
    console.log('🔵 Realtime değişiklik:', payload);
  })
  .subscribe((status) => {
    console.log('🔵 Realtime bağlantı durumu:', status);
  });

// Veritabanı bağlantısını test et
export const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('count')
      .single();

    if (error) throw error;
    console.log('🟢 Veritabanı bağlantısı başarılı');
    return true;
  } catch (error) {
    console.error('🔴 Veritabanı bağlantı hatası:', error);
    return false;
  }
};

// Oturum durumunu kontrol et
export const checkAuth = async () => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.error('🔴 Oturum kontrolü hatası:', error);
    return null;
  }
};