 import AsyncStorage from '@react-native-async-storage/async-storage';

 const KEYS = {
   API_KEY: '@codex_api_key',
   MODEL: '@codex_model',
   NOTES: '@codex_notes',
   CHAT_HISTORY: '@codex_chat_history',
 };

 // ===== API Key =====
 export async function getApiKey() {
   try {
     return await AsyncStorage.getItem(KEYS.API_KEY);
   } catch { return null; }
 }

 export async function saveApiKey(key) {
   try {
     await AsyncStorage.setItem(KEYS.API_KEY, key);
     return true;
   } catch { return false; }
 }

 // ===== Model =====
 export async function getModel() {
   try {
     const model = await AsyncStorage.getItem(KEYS.MODEL);
     return model || 'deepseek-chat';
   } catch { return 'deepseek-chat'; }
 }

 export async function saveModel(model) {
   try {
     await AsyncStorage.setItem(KEYS.MODEL, model);
     return true;
   } catch { return false; }
 }

 // ===== Notes =====
 export async function getNotes() {
   try {
     const data = await AsyncStorage.getItem(KEYS.NOTES);
     return data ? JSON.parse(data) : [];
   } catch { return []; }
 }

 export async function saveNotes(notes) {
   try {
     await AsyncStorage.setItem(KEYS.NOTES, JSON.stringify(notes));
     return true;
   } catch { return false; }
 }

 export async function addNote(text) {
   const notes = await getNotes();
   const newNote = {
     id: Date.now().toString(),
     text,
     createdAt: new Date().toISOString(),
   };
   notes.unshift(newNote);
   await saveNotes(notes);
   return newNote;
 }

 export async function deleteNote(id) {
   const notes = await getNotes();
   await saveNotes(notes.filter(n => n.id !== id));
 }

 // ===== Chat History =====
 export async function getChatHistory() {
   try {
     const data = await AsyncStorage.getItem(KEYS.CHAT_HISTORY);
     return data ? JSON.parse(data) : [];
   } catch { return []; }
 }

 export async function saveChatHistory(messages) {
   try {
     await AsyncStorage.setItem(KEYS.CHAT_HISTORY, JSON.stringify(messages));
     return true;
   } catch { return false; }
 }

 export async function clearChatHistory() {
   try {
     await AsyncStorage.removeItem(KEYS.CHAT_HISTORY);
     return true;
   } catch { return false; }
 }
