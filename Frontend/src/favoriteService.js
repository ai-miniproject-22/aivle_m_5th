const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/books';
const normalizedBaseUrl = rawBaseUrl.replace(/\/+$/, '');
const API_BASE_URL = normalizedBaseUrl.endsWith('/books')
  ? normalizedBaseUrl.replace(/\/books$/, '')
  : normalizedBaseUrl;

// 공통 응답 체크
const checkResponse = async (response, message) => {
  if (!response.ok) {
    const errorText = await response.text().catch(() => '');
    throw new Error(`${message} (${response.status})${errorText ? `: ${errorText}` : ''}`);
  }
};

// 하트 표시용 ID 목록
export const getFavoriteBookIds = async (userId) => {
  const response = await fetch(
    `${API_BASE_URL}/favorites/book-ids?userId=${encodeURIComponent(userId)}`,
  );

  await checkResponse(response, '즐겨찾기 ID 조회 실패');
  return response.json();
};

// 모아보기용 도서 목록
export const getFavoriteBooks = async (userId) => {
  const response = await fetch(
    `${API_BASE_URL}/favorites?userId=${encodeURIComponent(userId)}`,
  );

  await checkResponse(response, '즐겨찾기 도서 조회 실패');
  return response.json();
};

// 즐겨찾기 추가
export const addFavorite = async (bookId, userId, email) => {
  const response = await fetch(`${API_BASE_URL}/books/${bookId}/favorites`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, email }),
  });

  await checkResponse(response, '즐겨찾기 추가 실패');
};

// 즐겨찾기 해제
export const removeFavorite = async (bookId, userId) => {
  const response = await fetch(
    `${API_BASE_URL}/books/${bookId}/favorites?userId=${encodeURIComponent(userId)}`,
    { method: 'DELETE' },
  );

  await checkResponse(response, '즐겨찾기 삭제 실패');
};
