// component to make sure only logged in users can access private routes

import React from 'react';
// route
import { Route, Redirect } from 'react-router-dom';
// redux
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

// ...rest = rest of properties
// check if user is authenticated and either load component or redirect to login
const PrivateRoute = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      auth.isAuthenticated === true ? (
        <Component {...props} />
      ) : (
        <Redirect to="/login" />
      )
    }
  />
);

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(PrivateRoute);
