import { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputAdornment,
  Typography,
  Grid,
  Stack,
  Divider,
  Button,
  CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import Header from '../components/Header';
import BookCard from '../components/BookCard';
import { getBooks } from '../bookService';
import { getBookPreferences } from '../preferenceService';
import { getPersonalizedRecommendations } from '../recommendationService';

function BookListPage({ onAddClick, onBookClick, onLogoClick, onFavoritesClick, favoriteIds = [], onToggleFavorite }) {
  const [books, setBooks] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [customGenreFilter, setCustomGenreFilter] = useState('');
  const [genreFilterOpen, setGenreFilterOpen] = useState(false);
  const [preferences, setPreferences] = useState(null);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getBooks();
        setBooks(data);
      } catch (err) {
        console.error('목록 불러오기 실패:', err);
        setError('도서 목록을 불러오는 중 오류가 발생했습니다. 서버 연결을 확인하세요.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooks();
  }, []);

  useEffect(() => {
    setPreferences(getBookPreferences());
  }, []);

  // 직접 입력값이 있으면 그걸 우선 사용
  const activeGenreFilter = customGenreFilter || selectedGenre;

  const personalizedBooks = useMemo(
    () => getPersonalizedRecommendations(books, preferences),
    [books, preferences],
  );

  const filteredBooks = books.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      (book.author && book.author.toLowerCase().includes(searchKeyword.toLowerCase()));

    const matchesGenre =
      activeGenreFilter === '' ||
      (book.genres && book.genres.includes(activeGenreFilter));

    return matchesSearch && matchesGenre;
  });

  if (isLoading) {
    return (
      <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh' }}>
        <Header onAddClick={onAddClick} onLogoClick={onLogoClick} onFavoritesClick={onFavoritesClick} />
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 20, gap: 2 }}>
          <CircularProgress />
          <Typography variant="body1" color="text.secondary">도서 목록을 불러오는 중입니다...</Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh' }}>
        <Header onAddClick={onAddClick} onLogoClick={onLogoClick} onFavoritesClick={onFavoritesClick} />
        <Container maxWidth="lg" sx={{ py: 10, textAlign: 'center' }}>
          <Box sx={{ py: 6, border: '1px dashed', borderColor: 'error.light', borderRadius: 1, bgcolor: 'error.50' }}>
            <Typography variant="h6" color="error" sx={{ fontWeight: 700, mb: 1 }}>불러오기 실패</Typography>
            <Typography variant="body2" color="error.main">{error}</Typography>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh' }}>
      <Header onAddClick={onAddClick} onLogoClick={onLogoClick} onFavoritesClick={onFavoritesClick} />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        {personalizedBooks.length > 0 && (
          <Box sx={{ mb: 5 }}>
            <Stack spacing={0.75} sx={{ mb: 2.5 }}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                나를 위한 추천 도서
              </Typography>
              <Typography variant="body2" color="text.secondary">
                최근 본 도서의 태그와 장르를 바탕으로 골랐어요.
              </Typography>
            </Stack>

            <Grid container spacing={4} rowSpacing={5}>
              {personalizedBooks.map((book) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={book.id}>
                  <BookCard
                    book={book}
                    onClick={() => onBookClick?.(book.id)}
                    isFavorite={favoriteIds.includes(Number(book.id))}
                    onToggleFavorite={onToggleFavorite}
                  />
                </Grid>
              ))}
            </Grid>

            <Divider sx={{ mt: 5 }} />
          </Box>
        )}

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ alignItems: { xs: 'stretch', sm: 'center' }, mb: 5 }}
        >
          <TextField
            placeholder="제목 / 저자 검색..."
            size="small"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            sx={{ flexGrow: 1, maxWidth: { sm: 480 } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />

          <FormControl size="small" sx={{ minWidth: 140 }}>
            <Select
              value={selectedGenre}
              open={genreFilterOpen}
              onOpen={() => setGenreFilterOpen(true)}
              onClose={() => setGenreFilterOpen(false)}
              onChange={(e) => {
                setSelectedGenre(e.target.value);
                setCustomGenreFilter('');
              }}
              MenuProps={{ autoFocus: false, disableAutoFocusItem: true }}
              renderValue={(val) => {
                if (customGenreFilter) return `직접 입력: ${customGenreFilter}`;
                if (!val) return '전체 장르';
                return val;
              }}
              displayEmpty
            >
              <MenuItem value="">전체 장르</MenuItem>
              <MenuItem value="소설">소설</MenuItem>
              <MenuItem value="에세이">에세이</MenuItem>
              <MenuItem value="자기계발">자기계발</MenuItem>
              <MenuItem value="인문">인문</MenuItem>
              <MenuItem value="경제경영">경제경영</MenuItem>
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
                  placeholder="예: 과학"
                  value={customGenreFilter}
                  onChange={(e) => setCustomGenreFilter(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      e.stopPropagation();
                      setTimeout(() => {
                        setSelectedGenre('');
                        setGenreFilterOpen(false);
                      }, 0);
                    }
                  }}
                  autoComplete="off"
                />
                <Button
                  size="small"
                  variant="outlined"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedGenre('');
                    setGenreFilterOpen(false);
                  }}
                  sx={{ flexShrink: 0 }}
                >
                  적용
                </Button>
              </Box>
            </Select>
          </FormControl>

          <Box sx={{ flexGrow: 1 }} />
          <Typography variant="body2" color="text.secondary">
            총 {filteredBooks.length}권
          </Typography>
        </Stack>

        {filteredBooks.length === 0 ? (
          <Box sx={{ py: 8, textAlign: 'center', color: 'text.secondary', border: '1px dashed', borderColor: 'grey.300', borderRadius: 1 }}>
            <Typography variant="body1">해당 조건의 도서가 없습니다.</Typography>
          </Box>
        ) : (
          <Grid container spacing={4} rowSpacing={5}>
            {filteredBooks.map((book) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={book.id}>
                <BookCard
                  book={book}
                  onClick={() => onBookClick?.(book.id)}
                  isFavorite={favoriteIds.includes(Number(book.id))}
                  onToggleFavorite={onToggleFavorite}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}

export default BookListPage;
