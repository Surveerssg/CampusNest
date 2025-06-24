class CacheService {
  static CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
  static STORAGE_KEY = 'foursquare_cache';

  static getCache() {
    const cacheData = localStorage.getItem(this.STORAGE_KEY);
    if (!cacheData) {
      return {};
    }
    return JSON.parse(cacheData);
  }

  static setCache(key, data) {
    const cache = this.getCache();
    cache[key] = {
      data,
      timestamp: new Date().getTime()
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cache));
  }

  static getCachedData(key) {
    const cache = this.getCache();
    const cachedItem = cache[key];
    
    if (!cachedItem) {
      return null;
    }

    const now = new Date().getTime();
    if (now - cachedItem.timestamp > this.CACHE_DURATION) {
      // Cache expired
      delete cache[key];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cache));
      return null;
    }

    return cachedItem.data;
  }

  static clearCache() {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  static generateCacheKey(endpoint, params) {
    return `${endpoint}-${JSON.stringify(params)}`;
  }
}

export default CacheService; 