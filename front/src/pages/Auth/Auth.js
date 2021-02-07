import React, { Component } from 'react';

import { inject, observer } from 'mobx-react';
import { observable, makeObservable } from 'mobx';

import { useHttp } from '~/hooks/http.hook';
import { AuthContext } from "~/context/AuthContext";

import SignIn from '~/components/auth/SignIn';
import SignUp from '~/components/auth/SignUp';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import styled from 'styled-components';

const S = {
  MuiAlert: styled(MuiAlert)`
    white-space: pre;
  `,
};

@inject('authStore')
@observer
class Auth extends Component {
  constructor(props) {
    super(props);
    makeObservable(this, {
      formState: observable,
      isSignInStep: observable,
    });
  }

  formState = {
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  };

  isSignInStep = true;

  handleSnackClose = _ => this.props.authStore.clearError();

  handleChange = event => this.formState[event.target.name] = event.target.value;

  setSignIn = _ => this.isSignInStep = true;

  setSignUp = _ => this.isSignInStep = false;

  handleSignUp = async event => {
    event.preventDefault();

    const { signup } = this.props.authStore;

    try {
      const result = await signup({...this.formState});
      console.log(result);
    } catch (error) {
      /* TODO: to realize */
    }
  };

  handleSignIn = async event => {
    event.preventDefault();

    const { signin } = this.props.authStore;

    try {
      const { email, password } = this.formState;
      const result = await signin({ email, password });
      console.log(result);
    } catch (error) {
      /* TODO: to realize */
    }
  };

  render() {
    const {
      isSignInStep,
      setSignIn,
      setSignUp,
      handleChange,
      handleSignIn,
      handleSignUp,
      handleSnackClose,
    } = this;

    const { loading, error } = this.props.authStore;
    let errorText;
    if (error) {
      errorText = error.message;
      if (error.details) {
        errorText += error.details.reduce(
          (acc, cur) => `${acc}.\n${cur.msg}`,
          ''
        );
      }
    }

    return (<>
      {error &&
        <Snackbar
          anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
          open={true}
          onClose={handleSnackClose}
        >
          <S.MuiAlert
            elevation={6}
            variant="filled"
            severity="warning"
            onClose={handleSnackClose}
          >
            {errorText}
          </S.MuiAlert>
        </Snackbar>
      }

      {isSignInStep
        ? <SignIn
          isLoading={loading}
          setSignUp={setSignUp}
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
  }
}

export default Auth;
