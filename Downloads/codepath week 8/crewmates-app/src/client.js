import { createClient } from '@supabase/supabase-js';

const URL = 'https://ebghddfacgjbjlctnhqj.supabase.co';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImViZ2hkZGZhY2dqYmpsY3RuaHFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4NTQ3OTIsImV4cCI6MjA2OTQzMDc5Mn0.x4_pw7Xbhff5r8xKbSfO5BMCCl8E62jiwR32SFirboQ';

export const supabase = createClient(URL, API_KEY);