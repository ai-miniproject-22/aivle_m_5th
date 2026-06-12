const rawBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/books';
const normalizedBaseUrl = rawBaseUrl.replace(/\/+$/, '');
const BASE_URL = normalizedBaseUrl.endsWith('/books')
  ? normalizedBaseUrl
  : `${normalizedBaseUrl}/books`;

// 1. 도서 목록 조회
export const getBooks = async () => {
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) throw new Error('도서 목록 조회 실패');
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 2. 상세 도서 조회
export const getBookById = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`);
    if (!response.ok) throw new Error('도서 상세 조회 실패');
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 3. 도서 등록
export const createBook = async (bookData) => {
  try {
    const newBook = {
      ...bookData,
      coverImageUrl: '', 
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const response = await fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newBook),
    });
    if (!response.ok) throw new Error('도서 등록 실패');
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 4. 도서 정보 수정 (PATCH)
export const updateBook = async (id, updateData) => {
  try {
    const patchData = {
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patchData),
    });
    if (!response.ok) throw new Error('도서 수정 실패');
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 5. 도서 삭제
export const deleteBook = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`, { method: 'DELETE' });
    if (!response.ok) throw new Error('도서 삭제 실패');
    return true;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// 6. AI 표지 이미지 및 태그 저장
export const updateBookCover = async (id, coverImageUrl, tags) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}/cover`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        coverImageUrl,
        tags,
      }),
    });
    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      throw new Error(`표지 이미지 저장 실패 (${response.status})${errorText ? `: ${errorText}` : ''}`);
    }
    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};
