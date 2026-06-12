import { AppBar, Toolbar, Typography, Button, ButtonBase } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import FavoriteIcon from '@mui/icons-material/Favorite';

function Header({ onAddClick, onLogoClick, onFavoritesClick }) {
  return (
    <AppBar
      position="static"
      elevation={1}
      sx={{ bgcolor: 'background.paper', color: 'text.primary' }}
    >
      <Toolbar sx={{ minHeight: 64 }}>
        <ButtonBase
          onClick={onLogoClick}
          disableRipple
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            flexGrow: 1,
            justifyContent: 'flex-start',
            borderRadius: 1,
            px: 0.5,
            '&:hover': { opacity: 0.8 },
          }}
        >
          <MenuBookIcon color="primary" />
          <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
            BookShelf
          </Typography>
        </ButtonBase>
        <Button
          variant="outlined"
          startIcon={<FavoriteIcon />}
          onClick={onFavoritesClick}
          sx={{ mr: 1 }}
        >
          즐겨찾기
        </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddClick}
        >
          도서 등록
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
