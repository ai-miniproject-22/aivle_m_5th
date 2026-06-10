import { useState } from 'react';
import { Box } from '@mui/material';
import BookListPage from './pages/BookListPage';
import BookDetailPage from './pages/BookDetailPage';
import BookFormPage from './pages/BookFormPage';

function App() {
  const [page, setPage] = useState('list'); // 'list' | 'detail' | 'form'
  const [selectedId, setSelectedId] = useState(null); // 어떤 책을 볼지/수정할지 ID 저장

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

  return (
    <Box sx={{ textAlign: 'left', width: '100%' }}>
      {page === 'list' && (
        <BookListPage
          onAddClick={() => goForm()}
          onBookClick={(id) => goDetail(id)}
          onLogoClick={goList}
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
        />
      )}
    </Box>
  );
}

export default App;
