import history from './history';
import React, { SFC } from 'react';
import { App, Callback, Home, Ping, Profile, Admin } from '../Components';
import { Redirect, Route, RouteComponentProps } from 'react-router';
import { Router } from 'react-router-dom';
import { WebAuthentication } from '../auth/WebAuthentication';

const auth = new WebAuthentication();

const handleAuthentication = (props: RouteComponentProps<{}>) => {
  if (/access_token|id_token|error/.test(location.hash)) {
    auth.handleAuthentication();
  }
};

const Routes: SFC<{}> = () => {
  const { authenticated, userHasScopes } = auth;
  return (
    <Router history={history}>
      <div>
        <Route path="/" render={props => <App auth={auth} {...props} />} />
        <main role="main">
          <Route
            path="/home"
            render={props => <Home auth={auth} {...props} />}
          />
          <Route
            path="/profile"
            render={props =>
              !authenticated ? (
                <Redirect to="/home" />
              ) : (
                <Profile auth={auth} {...props} />
              )
            }
          />
          <Route
            path="/ping"
            render={props =>
              !authenticated ? (
                <Redirect to="/home" />
              ) : (
                <Ping auth={auth} {...props} />
              )
            }
          />
          <Route
            path="/admin"
            render={props =>
              !authenticated || !userHasScopes(['write:messages']) ? (
                <Redirect to="/home" />
              ) : (
                <Admin auth={auth} {...props} />
              )
            }
          />
          <Route
            path="/callback"
            render={props => {
              handleAuthentication(props);
              return <Callback {...props} />;
            }}
          />
        </main>
      </div>
    </Router>
  );
};
export default Routes;
