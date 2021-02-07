import React, { useContext } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import { AuthContext } from '~/context/AuthContext';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  link: {
    color: '#fff',
  },
  title: {
    flexGrow: 1,
  },
}));

const NavBar = inject("authStore")(observer((props) => {
  const { authStore } = props;
  const classes = useStyles();
  const history = useHistory();
  // const auth = useContext(AuthContext);

  const handleLogout = event => {
    event.preventDefault();
    authStore.logout();
    history.push('/');
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          {/*<Typography variant="h6" className={classes.title}>
            News
          </Typography>*/}
          <Typography variant="h6" className={classes.title}>
            <NavLink to="/dashboard">Дашборд</NavLink>
            <NavLink to="/links">Links</NavLink>
          </Typography>
          {`${authStore.user?.firstName} ${authStore.user?.lastName}`}
          <Button color="inherit" onClick={handleLogout}>Выйти</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}));

export default NavBar;
