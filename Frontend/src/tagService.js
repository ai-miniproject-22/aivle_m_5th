const OPENAI_RESPONSES_API_URL = 'https://api.openai.com/v1/responses';
const DEFAULT_TAG_MODEL = 'gpt-4o-mini';
const TAG_COUNT = 3;

export const TAG_CANDIDATES = [
  '감성', '경제', '과학', '관계', '기술',
  '긴장감', '데이터', '리더십', '모험', '미래',
  '미스터리', '변화', '분석', '비밀', '사랑',
  '사유', '사회문제', '생산성', '성장', '소통',
  '습관', '실무', '실용', '실천', '여행',
  '역사', '유머', '이별', '일상', '자아탐색',
  '창의성', '철학', '추리', '치유', '투자',
  '판타지', '학습', '현실적', '환경', '희망',
];

export const buildTagPrompt = (book) => {
  const content = book?.content || book?.description || '책 소개가 없습니다.';

  return [
    `다음 도서 정보를 바탕으로 추천 알고리즘에 사용할 태그 ${TAG_COUNT}개를 골라줘.`,
    '반드시 아래 후보 태그 목록 중에서만 골라줘.',
    '후보에 없는 태그는 만들지 마.',
    '책 소개가 짧으므로 가장 확실한 핵심 태그만 선택해줘.',
    '',
    `후보 태그: ${TAG_CANDIDATES.join(', ')}`,
    '',
    `제목: ${book?.title || '제목 없음'}`,
    `저자: ${book?.author || '저자 미상'}`,
    `책 소개: ${content}`,
  ].join('\n');
};

const extractResponseText = (data) => {
  if (data?.output_text) return data.output_text;

  return data?.output
    ?.flatMap((item) => item.content || [])
    ?.map((content) => content.text)
    ?.filter(Boolean)
    ?.join('\n');
};

const normalizeTags = (tags) => {
  if (!Array.isArray(tags)) {
    throw new Error('태그 응답 형식이 올바르지 않습니다.');
  }

  const uniqueTags = tags
    .map((tag) => String(tag).trim())
    .filter((tag) => TAG_CANDIDATES.includes(tag))
    .filter((tag, index, array) => array.indexOf(tag) === index);

  if (uniqueTags.length !== TAG_COUNT) {
    throw new Error(`후보 태그 중 정확히 ${TAG_COUNT}개를 생성하지 못했습니다.`);
  }

  return uniqueTags;
};

export const generateBookTags = async ({
  apiKey,
  book,
  model = DEFAULT_TAG_MODEL,
}) => {
  if (!apiKey?.trim()) {
    throw new Error('OpenAI API Key를 입력해주세요.');
  }

  const response = await fetch(OPENAI_RESPONSES_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey.trim()}`,
    },
    body: JSON.stringify({
      model,
      input: buildTagPrompt(book),
      text: {
        format: {
          type: 'json_schema',
          name: 'book_tags',
          strict: true,
          schema: {
            type: 'object',
            additionalProperties: false,
            properties: {
              tags: {
                type: 'array',
                minItems: TAG_COUNT,
                maxItems: TAG_COUNT,
                items: {
                  type: 'string',
                  enum: TAG_CANDIDATES,
                },
              },
            },
            required: ['tags'],
          },
        },
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const message = errorData?.error?.message || 'OpenAI 태그 생성 요청에 실패했습니다.';
    throw new Error(message);
  }

  const data = await response.json();
  const text = extractResponseText(data);

  if (!text) {
    throw new Error('태그 응답 데이터가 없습니다.');
  }

  const parsed = JSON.parse(text);
  return normalizeTags(parsed.tags);
};
