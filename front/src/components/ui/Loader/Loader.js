import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    position: 'fixed',
    left: '50%',
    top: '43%',
    transform: 'translate(-50%, -50%)',
    color: '#1976d2',
    '& > * + *': {
      marginLeft: theme.spacing(2),
    },
  },
}));

export default function CircularIndeterminate() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CircularProgress color="inherit" />
    </div>
  );
}
