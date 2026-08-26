import { compressImage } from './imageCompressor';

const PERF_DB = 'wipa-performance-cache';
const FEED_STORE = 'feed';
const GROUPS_STORE = 'groups';
const FEED_KEY = 'latest-v1';
const GROUPS_KEY = 'groups-list-v1';
const MAX_CACHED_POSTS = 16;

/**
 * Read cached feed from IndexedDB for 0ms initial load
 */
export async function readCachedFeed<T>(): Promise<T[]> {
  if (typeof indexedDB === 'undefined') return [];
  return new Promise((resolve) => {
    const request = indexedDB.open(PERF_DB, 2);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(FEED_STORE)) db.createObjectStore(FEED_STORE);
      if (!db.objectStoreNames.contains(GROUPS_STORE)) db.createObjectStore(GROUPS_STORE);
    };
    request.onerror = () => resolve([]);
    request.onsuccess = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(FEED_STORE)) {
        db.close();
        return resolve([]);
      }
      const tx = db.transaction(FEED_STORE, 'readonly');
      const get = tx.objectStore(FEED_STORE).get(FEED_KEY);
      get.onerror = () => resolve([]);
      get.onsuccess = () => resolve(Array.isArray(get.result?.posts) ? get.result.posts : []);
      tx.oncomplete = () => db.close();
    };
  });
}

/**
 * Write fresh feed items to IndexedDB
 */
export async function writeCachedFeed<T>(posts: T[]): Promise<void> {
  if (typeof indexedDB === 'undefined') return;
  return new Promise((resolve) => {
    const request = indexedDB.open(PERF_DB, 2);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(FEED_STORE)) db.createObjectStore(FEED_STORE);
      if (!db.objectStoreNames.contains(GROUPS_STORE)) db.createObjectStore(GROUPS_STORE);
    };
    request.onerror = () => resolve();
    request.onsuccess = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(FEED_STORE)) {
        db.close();
        return resolve();
      }
      const tx = db.transaction(FEED_STORE, 'readwrite');
      tx.objectStore(FEED_STORE).put({ posts: posts.slice(0, MAX_CACHED_POSTS), savedAt: Date.now() }, FEED_KEY);
      tx.oncomplete = () => { db.close(); resolve(); };
      tx.onerror = () => { db.close(); resolve(); };
    };
  });
}

/**
 * Read cached groups from IndexedDB for 0ms initial load
 */
export async function readCachedGroups<T>(): Promise<T[]> {
  if (typeof indexedDB === 'undefined') return [];
  return new Promise((resolve) => {
    const request = indexedDB.open(PERF_DB, 2);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(FEED_STORE)) db.createObjectStore(FEED_STORE);
      if (!db.objectStoreNames.contains(GROUPS_STORE)) db.createObjectStore(GROUPS_STORE);
    };
    request.onerror = () => resolve([]);
    request.onsuccess = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(GROUPS_STORE)) {
        db.close();
        return resolve([]);
      }
      const tx = db.transaction(GROUPS_STORE, 'readonly');
      const get = tx.objectStore(GROUPS_STORE).get(GROUPS_KEY);
      get.onerror = () => resolve([]);
      get.onsuccess = () => resolve(Array.isArray(get.result?.groups) ? get.result.groups : []);
      tx.oncomplete = () => db.close();
    };
  });
}

/**
 * Write fresh groups to IndexedDB
 */
export async function writeCachedGroups<T>(groups: T[]): Promise<void> {
  if (typeof indexedDB === 'undefined') return;
  return new Promise((resolve) => {
    const request = indexedDB.open(PERF_DB, 2);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(FEED_STORE)) db.createObjectStore(FEED_STORE);
      if (!db.objectStoreNames.contains(GROUPS_STORE)) db.createObjectStore(GROUPS_STORE);
    };
    request.onerror = () => resolve();
    request.onsuccess = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(GROUPS_STORE)) {
        db.close();
        return resolve();
      }
      const tx = db.transaction(GROUPS_STORE, 'readwrite');
      tx.objectStore(GROUPS_STORE).put({ groups, savedAt: Date.now() }, GROUPS_KEY);
      tx.oncomplete = () => { db.close(); resolve(); };
      tx.onerror = () => { db.close(); resolve(); };
    };
  });
}

/**
 * Smart Client-Side Upload Optimization (WebP compression + EXIF stripping)
 */
export async function optimizeFeedUpload(file: File, maxEdge = 1920, quality = 0.84): Promise<File> {
  if (!file.type.startsWith('image/') || file.type === 'image/gif' || file.type === 'image/svg+xml') {
    return file;
  }

  try {
    const compressed = await compressImage(file, {
      maxWidth: maxEdge,
      maxHeight: maxEdge,
      quality,
      mimeType: 'image/webp',
      maxSizeBytes: 400 * 1024
    });
    return compressed.file;
  } catch (err) {
    console.warn('Fallback: Uploading original file without client compression:', err);
    return file;
  }
}
