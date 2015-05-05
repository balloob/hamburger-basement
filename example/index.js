import React from 'react';

import HambugerBasement from '../hamburger-basement.es6';

var App = React.createClass({
  getInitialState() {
    return {
      content: 'Hello',
    };
  },

  setContent(content) {
    this.setState({content: content});
  },

  createMenuItem(content) {
    return (
      <li key={content}>
        <a href='#'
           onClick={this.setContent.bind(this, content)}
           data-sidebar-toggle='1'>
           {content}
        </a>
      </li>
    );
  },

  render() {
    let menu = <ul>{['Hello', 'World'].map(this.createMenuItem)}</ul>;

    return (
      <HambugerBasement basement={menu} basementWidth={256} openOffset={0}>
        <h1><button data-sidebar-toggle='1'>M</button> Hello header</h1>
        <b>{this.state.content}</b>
      </HambugerBasement>
    )
  }
})

React.render(<App />, document.getElementById('example'))
