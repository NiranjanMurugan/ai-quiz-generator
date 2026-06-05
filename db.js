/* ================================================
   DB — Supabase (production) or local JSON file (dev)
   ================================================ */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'sets.json');
const MAX_SETS = 50;

let supabase = null;

function initDb() {
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (url && key) {
    supabase = createClient(url, key, { auth: { persistSession: false } });
    console.log('Database: Supabase (PostgreSQL)');
    return 'supabase';
  }
  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]', 'utf8');
  console.log('Database: local file (data/sets.json) — add SUPABASE_* to .env for cloud DB');
  return 'file';
}

function normalizeRow(row) {
  return {
    id: row.id,
    topic: row.topic,
    flashcards: row.flashcards || [],
    quiz: row.quiz || null,
  };
}

function readFileSets() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8') || '[]');
  } catch {
    return [];
  }
}

function writeFileSets(sets) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(sets, null, 2), 'utf8');
}

async function listSets() {
  if (supabase) {
    const { data, error } = await supabase
      .from('study_sets')
      .select('id, topic, flashcards, quiz, created_at')
      .order('created_at', { ascending: false })
      .limit(MAX_SETS);
    if (error) throw error;
    return (data || []).map(normalizeRow);
  }
  return readFileSets()
    .sort((a, b) => (b.created_at || 0) - (a.created_at || 0))
    .slice(0, MAX_SETS)
    .map(({ created_at, ...rest }) => normalizeRow(rest));
}

async function getSet(id) {
  if (supabase) {
    const { data, error } = await supabase
      .from('study_sets')
      .select('id, topic, flashcards, quiz')
      .eq('id', id)
      .maybeSingle();
    if (error) throw error;
    return data ? normalizeRow(data) : null;
  }
  return readFileSets().find(s => s.id === id) || null;
}

async function upsertSet(set) {
  const payload = {
    id: set.id,
    topic: set.topic || 'Untitled',
    flashcards: set.flashcards || [],
    quiz: set.quiz || null,
  };

  if (supabase) {
    const { data, error } = await supabase
      .from('study_sets')
      .upsert(payload, { onConflict: 'id' })
      .select('id, topic, flashcards, quiz')
      .single();
    if (error) throw error;
    return normalizeRow(data);
  }

  const sets = readFileSets();
  const idx = sets.findIndex(s => s.id === payload.id);
  const record = { ...payload, created_at: Date.now() };
  if (idx > -1) sets[idx] = record;
  else sets.unshift(record);
  if (sets.length > MAX_SETS) sets.length = MAX_SETS;
  writeFileSets(sets);
  return normalizeRow(record);
}

async function deleteSet(id) {
  if (supabase) {
    const { error } = await supabase.from('study_sets').delete().eq('id', id);
    if (error) throw error;
    return;
  }
  writeFileSets(readFileSets().filter(s => s.id !== id));
}

async function clearSets() {
  if (supabase) {
    const { error } = await supabase.from('study_sets').delete().neq('id', '');
    if (error) throw error;
    return;
  }
  writeFileSets([]);
}

function getProvider() {
  return supabase ? 'supabase' : 'file';
}

module.exports = {
  initDb,
  listSets,
  getSet,
  upsertSet,
  deleteSet,
  clearSets,
  getProvider,
};
