import { useEffect, useState } from 'react';
import { Box, CircularProgress, Container, Grid, Typography } from '@mui/material';
import Header from '../components/Header';
import BookCard from '../components/BookCard';
import { getFavoriteBooks } from '../favoriteService';

function FavoritePage({
  user,
  favoriteIds = [],
  onAddClick,
  onBookClick,
  onLogoClick,
  onFavoritesClick,
  onToggleFavorite,
}) {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFavoriteBooks = async () => {
      if (!user?.id) {
        setBooks([]);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);
        const data = await getFavoriteBooks(user.id);
        setBooks(data);
      } catch (err) {
        console.error('즐겨찾기 도서 불러오기 실패:', err);
        setError('즐겨찾기 도서를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavoriteBooks();
  }, [user]);

  // 하트 해제 후 바로 목록에서 빼기
  const favoriteBooks = books.filter((book) =>
    favoriteIds.includes(Number(book.id))
  );

  return (
    <Box sx={{ bgcolor: 'grey.50', minHeight: '100vh' }}>
      <Header
        onAddClick={onAddClick}
        onLogoClick={onLogoClick}
        onFavoritesClick={onFavoritesClick}
      />

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 3 }}>
          즐겨찾기 도서
        </Typography>

        {isLoading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 12, gap: 2 }}>
            <CircularProgress />
            <Typography variant="body1" color="text.secondary">즐겨찾기 도서를 불러오는 중입니다...</Typography>
          </Box>
        ) : error ? (
          <Box sx={{ py: 8, textAlign: 'center', color: 'error.main', border: '1px dashed', borderColor: 'error.light', borderRadius: 1 }}>
            <Typography variant="body1">{error}</Typography>
          </Box>
        ) : favoriteBooks.length === 0 ? (
          <Box sx={{ py: 8, textAlign: 'center', color: 'text.secondary', border: '1px dashed', borderColor: 'grey.300', borderRadius: 1 }}>
            <Typography variant="body1">즐겨찾기한 도서가 없습니다.</Typography>
          </Box>
        ) : (
          <Grid container spacing={4} rowSpacing={5}>
            {favoriteBooks.map((book) => (
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

export default FavoritePage;
