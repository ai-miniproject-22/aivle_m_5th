import { useMemo, useState } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  IconButton,
  Box,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import KeyIcon from '@mui/icons-material/Key';
import CloseIcon from '@mui/icons-material/Close';
import { updateBookCover } from '../bookService';
import {
  buildCoverPrompt,
  generateCoverImage,
} from '../coverService';
import { generateBookTags } from '../tagService';

function AiCoverPanel({ book, onCoverGenerated, onClose }) {
  const [apiKey, setApiKey] = useState('');
  const [extraKeyword, setExtraKeyword] = useState('');
  const [style, setStyle] = useState('수채화');
  const [customStyle, setCustomStyle] = useState('');
  const [styleOpen, setStyleOpen] = useState(false);
  const [colorTone, setColorTone] = useState('자동');
  const [customColorTone, setCustomColorTone] = useState('');
  const [colorToneOpen, setColorToneOpen] = useState(false);
  const [ratio, setRatio] = useState('1024x1536');
  const [customRatio, setCustomRatio] = useState('');
  const [ratioOpen, setRatioOpen] = useState(false);
  const [quality, setQuality] = useState('medium');
  const [error, setError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const selectedStyle = customStyle.trim() || style;
  const selectedColorTone = customColorTone.trim() || colorTone;
  const selectedRatio = customRatio.trim() || ratio;

  const prompt = useMemo(
    () =>
      buildCoverPrompt(book, {
        keywords: extraKeyword,
        style: selectedStyle,
        colorTone: selectedColorTone,
      }),
    [book, extraKeyword, selectedStyle, selectedColorTone]
  );

  const handleGenerate = async () => {
    if (!book?.id) {
      setError('저장된 도서 상세 페이지에서 표지를 생성할 수 있습니다.');
      return;
    }

    try {
      setIsGenerating(true);
      setError('');
      const [imageSrc, tags] = await Promise.all([
        generateCoverImage({
          apiKey,
          prompt,
          size: selectedRatio,
          quality,
        }),
        generateBookTags({
          apiKey,
          book,
        }),
      ]);
      const updatedBook = await updateBookCover(book.id, imageSrc, tags);
      onCoverGenerated?.(updatedBook);
    } catch (err) {
      setError(err.message || '표지 생성에 실패했습니다.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Stack spacing={2}>
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          borderColor: 'primary.light',
          backgroundColor: 'rgba(25, 118, 210, 0.04)',
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: 'center', mb: 0.5 }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 700, flexGrow: 1 }}>
            AI 표지 자동 생성
          </Typography>
          {onClose && (
            <IconButton
              size="small"
              onClick={onClose}
              aria-label="닫기"
              sx={{ ml: 'auto' }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Stack>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block' }}
        >
          이 책의 제목·책 소개·장르를 기반으로 OpenAI가 표지를 생성합니다.
        </Typography>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ display: 'block' }}
        >
          아래 옵션으로 분위기와 이미지 품질을 조정할 수 있습니다.
        </Typography>

        <Stack spacing={1.5} sx={{ mt: 2 }}>
          <TextField
            label="추가 키워드 (선택)"
            placeholder="예: 푸른 색감, 가을 분위기"
            size="small"
            value={extraKeyword}
            onChange={(e) => setExtraKeyword(e.target.value)}
            fullWidth
          />

          <Stack direction="row" spacing={1}>
            <FormControl size="small" fullWidth>
              <InputLabel>스타일</InputLabel>
              <Select
                label="스타일"
                value={style}
                open={styleOpen}
                onOpen={() => setStyleOpen(true)}
                onClose={() => setStyleOpen(false)}
                onChange={(e) => {
                  setStyle(e.target.value);
                  setCustomStyle('');
                }}
                MenuProps={{
                  autoFocus: false,
                  disableAutoFocusItem: true,
                }}
                renderValue={(val) => {
                  if (customStyle) return `직접 입력: ${customStyle}`;
                  if (val === '디지털아트') return '디지털 아트';
                  return val;
                }}
              >
                <MenuItem value="일러스트">일러스트</MenuItem>
                <MenuItem value="수채화">수채화</MenuItem>
                <MenuItem value="디지털아트">디지털 아트</MenuItem>
                <MenuItem value="미니멀">미니멀</MenuItem>
                <MenuItem value="사진">사진</MenuItem>
                <Divider />
                <Box
                  sx={{ px: 2, py: 1, display: 'flex', gap: 1 }}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                  onKeyDownCapture={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="예: 콜라주"
                    value={customStyle}
                    onChange={(e) => setCustomStyle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        e.stopPropagation();
                        setTimeout(() => setStyleOpen(false), 0);
                      }
                    }}
                    autoComplete="off"
                  />
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={(e) => {
                      e.stopPropagation();
                      setStyleOpen(false);
                    }}
                    sx={{ flexShrink: 0 }}
                  >
                    적용
                  </Button>
                </Box>
              </Select>
            </FormControl>

            <FormControl size="small" fullWidth>
              <InputLabel>색감</InputLabel>
              <Select
                label="색감"
                value={colorTone}
                open={colorToneOpen}
                onOpen={() => setColorToneOpen(true)}
                onClose={() => setColorToneOpen(false)}
                onChange={(e) => {
                  setColorTone(e.target.value);
                  setCustomColorTone('');
                }}
                MenuProps={{
                  autoFocus: false,
                  disableAutoFocusItem: true,
                }}
                renderValue={(val) => {
                  if (customColorTone) return `직접 입력: ${customColorTone}`;
                  return val;
                }}
              >
                <MenuItem value="자동">자동</MenuItem>
                <MenuItem value="따뜻한 톤">따뜻한 톤</MenuItem>
                <MenuItem value="푸른 톤">푸른 톤</MenuItem>
                <MenuItem value="파스텔">파스텔</MenuItem>
                <MenuItem value="비비드">비비드</MenuItem>
                <Divider />
                <Box
                  sx={{ px: 2, py: 1, display: 'flex', gap: 1 }}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                  onKeyDownCapture={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="예: 청록색 위주"
                    value={customColorTone}
                    onChange={(e) => setCustomColorTone(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        e.stopPropagation();
                        setTimeout(() => setColorToneOpen(false), 0);
                      }
                    }}
                    autoComplete="off"
                  />
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={(e) => {
                      e.stopPropagation();
                      setColorToneOpen(false);
                    }}
                    sx={{ flexShrink: 0 }}
                  >
                    적용
                  </Button>
                </Box>
              </Select>
            </FormControl>
          </Stack>

          <Stack direction="row" spacing={1}>
            <FormControl size="small" fullWidth>
              <InputLabel>이미지 비율</InputLabel>
              <Select
                label="이미지 비율"
                value={ratio}
                open={ratioOpen}
                onOpen={() => setRatioOpen(true)}
                onClose={() => setRatioOpen(false)}
                onChange={(e) => {
                  setRatio(e.target.value);
                  setCustomRatio('');
                }}
                MenuProps={{
                  autoFocus: false,
                  disableAutoFocusItem: true,
                }}
                renderValue={(val) => {
                  if (customRatio) return `직접 입력: ${customRatio}`;
                  if (val === '1024x1536') return '세로 (1024x1536)';
                  if (val === '1024x1024') return '정사각형 (1024x1024)';
                  if (val === '1536x1024') return '가로 (1536x1024)';
                  return val;
                }}
              >
                <MenuItem value="1024x1536">세로 (1024x1536)</MenuItem>
                <MenuItem value="1024x1024">정사각형 (1024x1024)</MenuItem>
                <MenuItem value="1536x1024">가로 (1536x1024)</MenuItem>
                <Divider />
                <Box
                  sx={{ px: 2, py: 1, display: 'flex', gap: 1 }}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) => e.stopPropagation()}
                  onKeyDownCapture={(e) => e.stopPropagation()}
                  onMouseDown={(e) => e.stopPropagation()}
                >
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="예: 1024x1536"
                    value={customRatio}
                    onChange={(e) => setCustomRatio(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        e.stopPropagation();
                        setTimeout(() => setRatioOpen(false), 0);
                      }
                    }}
                    autoComplete="off"
                  />
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={(e) => {
                      e.stopPropagation();
                      setRatioOpen(false);
                    }}
                    sx={{ flexShrink: 0 }}
                  >
                    적용
                  </Button>
                </Box>
              </Select>
            </FormControl>

            <FormControl size="small" fullWidth>
              <InputLabel>품질</InputLabel>
              <Select
                label="품질"
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
              >
                <MenuItem value="low">저품질</MenuItem>
                <MenuItem value="medium">표준</MenuItem>
                <MenuItem value="high">고품질</MenuItem>
                <MenuItem value="auto">자동</MenuItem>
              </Select>
            </FormControl>
          </Stack>

          <TextField
            label="프롬프트 미리보기"
            value={prompt}
            multiline
            minRows={5}
            size="small"
            fullWidth
            InputProps={{ readOnly: true }}
          />

          {error && <Alert severity="error">{error}</Alert>}

          <Button
            variant="contained"
            fullWidth
            disabled={isGenerating}
            onClick={handleGenerate}
          >
            {isGenerating ? (
              <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                <CircularProgress color="inherit" size={18} />
                <span>표지·태그 생성 중...</span>
              </Stack>
            ) : (
              '이 도서 내용으로 표지 생성'
            )}
          </Button>

          <Typography variant="caption" color="text.secondary">
            ※ 이미지와 태그 생성 시 OpenAI API 사용량에 따라 비용이 발생할 수 있습니다.
          </Typography>
        </Stack>
      </Paper>

      <Paper
        variant="outlined"
        sx={{
          p: 1.5,
          borderColor: 'warning.light',
          backgroundColor: 'rgba(255, 152, 0, 0.04)',
        }}
      >
        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: 'center', mb: 1 }}
        >
          <KeyIcon color="warning" fontSize="small" />
          <Typography variant="caption" sx={{ fontWeight: 700 }}>
            OpenAI API Key
          </Typography>
        </Stack>
        <TextField
          type="password"
          placeholder="sk-..."
          size="small"
          value={apiKey}
          onChange={(event) => setApiKey(event.target.value)}
          fullWidth
        />
      </Paper>
    </Stack>
  );
}

export default AiCoverPanel;
