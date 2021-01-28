import React, { useContext } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { AuthContext } from '../../context/AuthContext';

const useStyles = makeStyles(theme => ({
  root: {
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
}));

export default function Navbar () {
  const history = useHistory();
  const auth = useContext(AuthContext);
  const classes = useStyles();

  const handleLogout = event => {
    event.preventDefault();
    auth.logout();
    history.push('/');
  };

  return (<div>
    <Typography className={classes.root}>
      <NavLink to="/create">Create</NavLink>
      <NavLink to="/links">Links</NavLink>
      <a href="#!" onClick={handleLogout}>Logout</a>
    </Typography>
  </div>)
}
