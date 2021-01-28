import React, { useState, useEffect, useContext } from 'react';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import SignIn from '../components/auth/SignIn';
import SignUp from '../components/auth/SignUp';

import { useHttp } from '../hooks/http.hook';

import { AuthContext } from "../context/AuthContext";

export default function AuthPage () {
  const auth = useContext(AuthContext);

  const { request, loading, error, clearError } = useHttp();

  const [snackState, setSnackState] = useState({
    open: false, sev: 'success', ver: 'bottom', hor: 'left', msg: '',
  });

  const [isSignIn, setSignIn] = useState(true);

  const [form, setForm] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  useEffect(() => {
    if (!error) return;
    setSnackState({
      ...snackState,
      open: true,
      msg: error,
      sev: 'info'
    });
    clearError();
  }, [error, snackState, clearError/*,message*/]);

  const handleSnackClose = () => {
    setSnackState({ ...snackState, open: false });
  };

  const handleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  const handleSignIn = async (event) => {
    event.preventDefault();

    try {
      const { token, userId } = await request(
        '/api/auth/signin',
        'POST',
        {
          email: form.email,
          password: form.password
        },
      );
      auth.login(token, userId);
    } catch (e) {
      /* Отслежение useEffect() */
    }
  };

  const handleSignUp = async (event) => {
    event.preventDefault();
    try {
      const requestResult = await request(
        '/api/auth/signup',
        'POST',
        {...form}
      );
      console.log(requestResult);
    } catch (e) {
      /* Отслежение useEffect() */
    }
  };

  return (<>
    <Snackbar
      anchorOrigin={{vertical: snackState.ver, horizontal: snackState.hor}}
      open={snackState.open}
      onClose={handleSnackClose}
      key={snackState.ver + snackState.hor}
    >
      <MuiAlert
        elevation={6}
        variant="filled"
        severity={snackState.sev}
        onClose={handleSnackClose}
      >
        {snackState.msg}
      </MuiAlert>
    </Snackbar>

    {isSignIn
      ? <SignIn
        isLoading={loading}
        setSignIn={setSignIn}
        changeHandler={handleChange}
        submitHandler={handleSignIn}
      />
      : <SignUp
        isLoading={loading}
        setSignIn={setSignIn}
        changeHandler={handleChange}
        submitHandler={handleSignUp}
      />}
  </>)
};
