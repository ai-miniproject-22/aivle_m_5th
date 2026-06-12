import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  Stack,
  Chip,
  Box,
} from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import IconButton from '@mui/material/IconButton';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

function BookCard({ book, onClick, isFavorite = false, onToggleFavorite }) {
  const { title, author, genres = [], coverImageUrl } = book;

  return (
    <Card elevation={1} sx={{ height: '100%', position: 'relative' }}>
      <CardActionArea onClick={onClick} sx={{ height: '100%' }}>
        <Box
          sx={{
            width: '100%',
            aspectRatio: '2 / 3',
            bgcolor: 'grey.100',
            border: '1px dashed',
            borderColor: 'grey.300',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'grey.500',
          }}
        >
          {coverImageUrl ? (
            <Box
              component="img"
              src={coverImageUrl}
              alt={title}
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <Stack spacing={0.5} sx={{ alignItems: 'center' }}>
              <ImageIcon />
              <Typography variant="caption">표지</Typography>
            </Stack>
          )}
        </Box>
        <CardContent>
          <Typography variant="subtitle1" noWrap sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom noWrap>
            {author}
          </Typography>
          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
            {genres.map((genre) => (
              <Chip
                key={genre}
                label={genre}
                size="small"
                color="primary"
                variant="outlined"
              />
            ))}
          </Stack>
        </CardContent>
      </CardActionArea>

      {/* 카드 이동과 하트 클릭 분리 */}
      <IconButton
        size="small"
        aria-label={isFavorite ? '즐겨찾기 해제' : '즐겨찾기 추가'}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggleFavorite?.(book);
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 10,
          bgcolor: 'rgba(255, 255, 255, 0.9)',
          boxShadow: 1,
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 1)',
          },
        }}
      >
        {isFavorite ? (
          <FavoriteIcon color="error" fontSize="small" />
        ) : (
          <FavoriteBorderIcon fontSize="small" />
        )}
      </IconButton>
    </Card>
  );
}

export default BookCard;
