const TAG_WEIGHT = 3;
const GENRE_WEIGHT = 1;
const DEFAULT_LIMIT = 3;

// localStorage에 쌓인 태그/장르 선호 횟수를 추천 점수로 변환
const sumPreferenceScore = (values = [], counts = {}, weight) => (
  values.reduce((total, value) => total + (counts[value] || 0) * weight, 0)
);

export const getBookRecommendationScore = (book, preferences) => {
  if (!book || !preferences) return 0;

  const tagScore = sumPreferenceScore(book.tags, preferences.tags, TAG_WEIGHT);
  const genreScore = sumPreferenceScore(book.genres, preferences.genres, GENRE_WEIGHT);

  return tagScore + genreScore;
};

export const getPersonalizedRecommendations = (books = [], preferences, limit = DEFAULT_LIMIT) => {
  if (!preferences) return [];

  // 이미 상세 페이지에서 본 책은 추천 목록에서 제외
  const viewedBookIds = new Set((preferences.viewedBookIds || []).map(String));

  return books
    .filter((book) => !viewedBookIds.has(String(book.id)))
    .map((book) => ({
      ...book,
      recommendationScore: getBookRecommendationScore(book, preferences),
    }))
    .filter((book) => book.recommendationScore > 0)
    .sort((a, b) => b.recommendationScore - a.recommendationScore)
    .slice(0, limit);
};
