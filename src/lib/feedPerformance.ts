const FEED_DB = 'wipa-performance-cache';
const FEED_STORE = 'feed';
const FEED_KEY = 'latest-v1';
const MAX_CACHED_POSTS = 16;

export async function readCachedFeed<T>(): Promise<T[]> {
  if (typeof indexedDB === 'undefined') return [];
  return new Promise((resolve) => {
    const request = indexedDB.open(FEED_DB, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(FEED_STORE);
    request.onerror = () => resolve([]);
    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction(FEED_STORE, 'readonly');
      const get = tx.objectStore(FEED_STORE).get(FEED_KEY);
      get.onerror = () => resolve([]);
      get.onsuccess = () => resolve(Array.isArray(get.result?.posts) ? get.result.posts : []);
      tx.oncomplete = () => db.close();
    };
  });
}

export async function writeCachedFeed<T>(posts: T[]): Promise<void> {
  if (typeof indexedDB === 'undefined') return;
  return new Promise((resolve) => {
    const request = indexedDB.open(FEED_DB, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(FEED_STORE);
    request.onerror = () => resolve();
    request.onsuccess = () => {
      const db = request.result;
      const tx = db.transaction(FEED_STORE, 'readwrite');
      tx.objectStore(FEED_STORE).put({ posts: posts.slice(0, MAX_CACHED_POSTS), savedAt: Date.now() }, FEED_KEY);
      tx.oncomplete = () => { db.close(); resolve(); };
      tx.onerror = () => { db.close(); resolve(); };
    };
  });
}

export async function optimizeFeedUpload(file: File, maxEdge = 1600, quality = 0.78): Promise<File> {
  if (!file.type.startsWith('image/') || file.type === 'image/gif' || file.type === 'image/svg+xml') return file;
  if (typeof createImageBitmap === 'undefined') return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxEdge / Math.max(bitmap.width, bitmap.height));
    const width = Math.max(1, Math.round(bitmap.width * scale));
    const height = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) return file;
    context.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/webp', quality));
    if (!blob || blob.size >= file.size) return file;
    const originalName = file.name.replace(/\.[^.]+$/, '');
    return new File([blob], `${originalName}.webp`, { type: 'image/webp', lastModified: Date.now() });
  } catch {
    return file;
  }
}
