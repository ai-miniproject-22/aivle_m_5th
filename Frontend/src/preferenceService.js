const STORAGE_KEY = 'bookPreferences';
const VIEW_COOLDOWN_MS = 30 * 60 * 1000;
const MAX_VIEWED_BOOKS = 20;

const DEFAULT_PREFERENCES = {
  tags: {},
  genres: {},
  viewedBookIds: [],
  lastViewedAt: {},
};

const readPreferences = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return {
      ...DEFAULT_PREFERENCES,
      ...saved,
      tags: saved?.tags || {},
      genres: saved?.genres || {},
      viewedBookIds: saved?.viewedBookIds || [],
      lastViewedAt: saved?.lastViewedAt || {},
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
};

const writePreferences = (preferences) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
};

const increaseCounts = (counts, values = []) => {
  values.forEach((value) => {
    if (!value) return;
    counts[value] = (counts[value] || 0) + 1;
  });
};

export const saveBookPreference = (book) => {
  if (!book?.id) return;

  const preferences = readPreferences();
  const bookId = String(book.id);
  const now = new Date();
  const lastViewed = preferences.lastViewedAt[bookId]
    ? new Date(preferences.lastViewedAt[bookId]).getTime()
    : 0;
  const shouldIncreaseScore = now.getTime() - lastViewed > VIEW_COOLDOWN_MS;

  if (shouldIncreaseScore) {
    increaseCounts(preferences.tags, book.tags);
    increaseCounts(preferences.genres, book.genres);
  }

  preferences.viewedBookIds = [
    book.id,
    ...preferences.viewedBookIds.filter((id) => String(id) !== bookId),
  ].slice(0, MAX_VIEWED_BOOKS);
  preferences.lastViewedAt[bookId] = now.toISOString();

  writePreferences(preferences);
};

export const getBookPreferences = () => readPreferences();

export const clearBookPreferences = () => {
  localStorage.removeItem(STORAGE_KEY);
};
