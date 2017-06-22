import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import agent from '../agent';

import Header from './Header';

const mapStateToProps = (state) => ({
    appName: state.common.appName,
    currentUser: state.common.currentUser,
    redirectTo: state.common.redirectTo
});

const mapDispatchToProps = (dispatch) => ({
  onLoad: (payload, token) => 
    dispatch({ type: 'APP_LOAD', payload, token }),
  onRedirect: () => 
    dispatch({ type: 'REDIRECT' })
});

class App extends React.Component { 
  componentWillMount() {
    const token = window.localStorage.getItem('jwt');
    if (token) {
      agent.setToken(token);
    }

    this.props.onLoad(token ? agent.Auth.current() : null, token);
  }

  
  componentWillReceiveProps(nextProps) {
    if (nextProps.redirectTo) {
      this.context.router.replace(nextProps.redirectTo);
      this.props.onRedirect();
    }
  }

  render() {
    return (
      <div>
        <Header appName={this.props.appName} currentUser={this.props.currentUser} />
        {this.props.children}
      </div>
    );
  }
}

App.contextTypes = {
  router: PropTypes.object.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
