const OPENAI_IMAGE_API_URL = 'https://api.openai.com/v1/images/generations';
const DEFAULT_IMAGE_MODEL = 'gpt-image-2';
const DEFAULT_IMAGE_SIZE = '1024x1536';
const DEFAULT_IMAGE_QUALITY = 'medium';

const STYLE_LABELS = {
  watercolor: '수채화 일러스트',
  oil: '유화 느낌',
  digital: '디지털 아트',
  minimal: '미니멀한 책 표지 디자인',
  vintage: '빈티지 편집 디자인',
  일러스트: '일러스트',
  수채화: '수채화 일러스트',
  디지털아트: '디지털 아트',
  미니멀: '미니멀한 책 표지 디자인',
  사진: '사진 느낌의 책 표지',
};

export const buildCoverPrompt = (book, options = {}) => {
  const style = STYLE_LABELS[options.style] || options.style || '전문적인 책 표지 일러스트';
  const keywords = options.keywords?.trim();
  const colorTone = options.colorTone && options.colorTone !== '자동' ? options.colorTone : '';
  const content = book?.content || book?.description || '책 소개가 없습니다.';

  return [
    '책 제목과 저자명이 잘 보이는 도서 표지 이미지를 만들어줘.',
    `책 제목: ${book?.title || '제목 없음'}`,
    `저자: ${book?.author || '저자 미상'}`,
    `책 소개: ${content}`,
    `시각 스타일: ${style}`,
    colorTone ? `색감: ${colorTone}` : null,
    keywords ? `추가 분위기 키워드: ${keywords}` : null,
    '책 소개의 핵심 분위기가 표지 그림과 짧은 설명 문구에 자연스럽게 드러나게 해줘.',
    '실제 서점에 놓일 법한 완성도 있는 표지처럼 구성해줘.',
  ]
    .filter(Boolean)
    .join('\n');
};

export const b64ToDataUrl = (b64Json, format = 'png') => {
  if (!b64Json) {
    throw new Error('이미지 응답 데이터가 없습니다.');
  }
  return `data:image/${format};base64,${b64Json}`;
};

export const generateCoverImage = async ({
  apiKey,
  prompt,
  model = DEFAULT_IMAGE_MODEL,
  size = DEFAULT_IMAGE_SIZE,
  quality = DEFAULT_IMAGE_QUALITY,
  outputFormat = 'png',
}) => {
  if (!apiKey?.trim()) {
    throw new Error('OpenAI API Key를 입력해주세요.');
  }

  if (!prompt?.trim()) {
    throw new Error('표지 생성을 위한 프롬프트가 없습니다.');
  }

  const response = await fetch(OPENAI_IMAGE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey.trim()}`,
    },
    body: JSON.stringify({
      model,
      prompt,
      n: 1,
      size,
      quality,
      output_format: outputFormat,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const message = errorData?.error?.message || 'OpenAI 표지 생성 요청에 실패했습니다.';
    throw new Error(message);
  }

  const data = await response.json();
  return b64ToDataUrl(data.data?.[0]?.b64_json, outputFormat);
};
