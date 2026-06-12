import { useEffect, useState } from 'react';
import { Box, Button, Stack, Typography } from '@mui/material';
import BookListPage from './pages/BookListPage';
import BookDetailPage from './pages/BookDetailPage';
import BookFormPage from './pages/BookFormPage';
import AuthPanel from './components/AuthPanel';
import { supabase } from './SupabaseClient';
import FavoritePage from './pages/FavoritePage';
import { addFavorite, getFavoriteBookIds, removeFavorite } from './favoriteService';

function App() {
  const [page, setPage] = useState('list'); // 'list' | 'detail' | 'form'
  const [selectedId, setSelectedId] = useState(null); // 어떤 책을 볼지/수정할지 ID 저장
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  const [favoriteIds, setFavoriteIds] = useState([]);

  const handleToggleFavorite = async (book) => {
    if (!user?.id) {
      alert('로그인 후 이용해주세요.');
      return;
    }

    const bookId = Number(book.id);
    const wasFavorite = favoriteIds.includes(bookId);

    // 먼저 화면에 반영하고 실패하면 되돌리기
    setFavoriteIds((prev) => (
      wasFavorite ? prev.filter((id) => id !== bookId) : [...prev, bookId]
    ));

    try {
      if (wasFavorite) {
        await removeFavorite(bookId, user.id);
      } else {
        await addFavorite(bookId, user.id, user.email);
      }
    } catch (error) {
      console.error('즐겨찾기 변경 실패:', error);
      setFavoriteIds((prev) => (
        wasFavorite ? [...prev, bookId] : prev.filter((id) => id !== bookId)
      ));
      alert('즐겨찾기 변경에 실패했습니다.');
    }
  };

  const goFavorites = () => {
    // 즐겨찾기 모아보기로 이동
    setPage('favorites');
    setSelectedId(null);
  };

  useEffect(() => {
    // 새로고침해도 로그인 유지
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setIsAuthLoading(false);
    });

    // 로그인 상태 바뀌면 화면 갱신
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setIsAuthLoading(false);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchFavoriteIds = async () => {
      if (!user?.id) {
        setFavoriteIds([]);
        return;
      }

      try {
        const ids = await getFavoriteBookIds(user.id);
        setFavoriteIds(ids.map(Number));
      } catch (error) {
        console.error('즐겨찾기 ID 조회 실패:', error);
        setFavoriteIds([]);
      }
    };

    fetchFavoriteIds();
  }, [user]);

  const goList = () => {
    setPage('list');
    setSelectedId(null);
  };

  const goDetail = (id) => {
    setSelectedId(id);
    setPage('detail');
  };

  const goForm = (id = null) => {
    setSelectedId(id); // id가 있으면 수정(id 전달), 없으면 등록(null)
    setPage('form');
  };

  const handleLogout = async () => {
    // 로그아웃 후 목록 첫 화면으로
    await supabase.auth.signOut();
    setUser(null);
    goList();
  };

  if (isAuthLoading) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>로그인 상태 확인 중...</Typography>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', bgcolor: 'grey.50', p: 3 }}>
        <Box sx={{ width: '100%', maxWidth: 420, bgcolor: 'background.paper', p: 4, border: '1px solid', borderColor: 'grey.200', borderRadius: 1 }}>
          <AuthPanel onAuthChange={setUser} />
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ textAlign: 'left', width: '100%' }}>
      <Stack
        direction="row"
        spacing={2}
        sx={{ alignItems: 'center', justifyContent: 'flex-end', px: 3, py: 1, bgcolor: 'grey.100' }}
      >
        <Typography variant="body2" color="text.secondary">
          {user.email}
        </Typography>
        <Button size="small" variant="outlined" onClick={handleLogout}>
          로그아웃
        </Button>
      </Stack>

      {page === 'list' && (
        <BookListPage
          favoriteIds={favoriteIds}
          onToggleFavorite={handleToggleFavorite}
          onAddClick={() => goForm()}
          onBookClick={(id) => goDetail(id)}
          onLogoClick={goList}
          onFavoritesClick={goFavorites}
        />
      )}

      {page === 'favorites' && (
        <FavoritePage
          user={user}
          favoriteIds={favoriteIds}
          onToggleFavorite={handleToggleFavorite}
          onAddClick={() => goForm()}
          onBookClick={(id) => goDetail(id)}
          onLogoClick={goList}
          onFavoritesClick={goFavorites}
        />
      )}

      {page === 'detail' && (
        <BookDetailPage
          bookId={selectedId} // 전달받은 ID를 상세 페이지로 넘김
          onAddClick={() => goForm()}
          onBackClick={goList}
          onEditClick={() => goForm(selectedId)} // 수정 시 기존 ID 전달
          onDeleteClick={goList}
          onBookClick={(id) => goDetail(id)} // 추천 도서 클릭 시 해당 도서로 이동
          onLogoClick={goList}
          onFavoritesClick={goFavorites}
          favoriteIds={favoriteIds}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

      {page === 'form' && (
        <BookFormPage
          bookId={selectedId} // 수정일 경우 ID가 넘어가고, 등록일 경우 null
          onAddClick={() => goForm()}
          onBackClick={goList}
          onCancel={selectedId ? () => goDetail(selectedId) : goList}
          onSubmit={goList}
          onLogoClick={goList}
          onFavoritesClick={goFavorites}
        />
      )}
    </Box>
  );
}

export default App;
