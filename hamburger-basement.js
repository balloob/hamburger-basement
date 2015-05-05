'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _reactAddons = require('react/addons');

var _reactAddons2 = _interopRequireDefault(_reactAddons);

var update = _reactAddons2['default'].addons.update;

var toggleSidebarAttr = 'data-sidebar-toggle';

var styles = {
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden' },

  basement: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'scroll',
    WebkitOverflowScrolling: 'touch' },

  main: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    boxShadow: '0 0 5px black',
    backgroundColor: '#CCC' } };

exports['default'] = _reactAddons2['default'].createClass({
  displayName: 'hamburger-basement.es6',

  getDefaultProps: function getDefaultProps() {
    return {
      basement: _reactAddons2['default'].createElement(
        'div',
        null,
        'I am basement'
      ),
      animationDuration: 0.4,
      basementWidth: 0, // 0 = set automatically
      toggleDistanceDelta: 50,
      openOffset: 85,
      forceOpen: false };
  },

  getInitialState: function getInitialState() {
    return {
      open: false, // Is the basement currently open?
      position: 0, // Position of the overlay
      touching: false, // Is touch interaction currently happening?
      currentBasementWidth: 0, // Current width of basement element, will be set after rendering and on resize
      touchOrigin: 0, // X position of last touchstart-event
      originalPosition: 0 // Original overlay position before touch started
    };
  },

  // Toggle open/closed
  toggle: function toggle() {
    if (!(this.state.open && this.props.forceOpen)) {
      this.setState({ open: !this.state.open });
    }
  },

  touchStart: function touchStart(e) {
    if (!this.props.forceOpen) {
      this.setState({
        touching: true,
        touchOrigin: e.targetTouches[0].clientX,
        originalPosition: this.state.position
      });
    }
  },

  touchMove: function touchMove(e) {
    if (this.state.touching) {
      var newPos = Math.max(0, this.state.originalPosition + (e.targetTouches[0].clientX - this.state.touchOrigin));

      this.setState({
        position: newPos
      });
    }
  },

  touchEnd: function touchEnd() {
    if (this.state.touching) {
      var shouldToggle = Math.abs(this.state.originalPosition - this.state.position) > this.props.toggleDistanceDelta;

      if (shouldToggle) {
        this.setState({
          touching: false,
          open: !this.state.open
        });
      } else {
        this.setState({
          touching: false,
          position: this.state.originalPosition
        });
      }
    }
  },

  // Calculate overlay position when the basement is open
  openPosition: function openPosition() {
    return this.props.basementWidth || this.state.currentBasementWidth - this.props.openOffset;
  },

  resize: function resize() {
    this.setState({ currentBasementWidth: this.refs.basement.getDOMNode().offsetWidth });
    if (this.state.open) {
      this.setState({ position: this.openPosition() });
    }
  },

  onClickSidebarToggle: function onClickSidebarToggle(ev) {
    if (ev.target.getAttribute(toggleSidebarAttr) === '1') {
      this.toggle();
      ev.preventDefault();
    }
  },

  componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
    // Check to see if we should toggle the overlay position
    if (prevState.open !== this.state.open) {
      this.setState({ position: this.state.open ? this.openPosition() : 0 });
    }
  },

  componentDidMount: function componentDidMount() {
    // Make sure resizing the window is supported
    // This should also handle portrait/landscape switching on mobile
    window.addEventListener('resize', this.resize);
    this.setState({ currentBasementWidth: this.refs.basement.getDOMNode().offsetWidth });
  },

  componentWillUnmount: function componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  },

  componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
    if ('forceOpen' in nextProps) {
      this.setState({ open: nextProps.forceOpen });
    }
  },

  render: function render() {
    var mainStyle = update(styles.main, { $merge: {
        WebkitTransform: 'translate3d(' + this.state.position + 'px, 0, 0)',
        MozTransform: 'translateX(' + this.state.position + 'px)',
        OTransform: 'translateX(' + this.state.position + 'px)',
        transform: 'translateX(' + this.state.position + 'px)',
        WebkitTransition: this.state.touching ? 'none' : '-webkit-transform ' + this.props.animationDuration + 's ease-out',
        MozTransition: this.state.touching ? 'none' : '-moz-transform ' + this.props.animationDuration + 's ease-out',
        OTransition: this.state.touching ? 'none' : '-o-transform ' + this.props.animationDuration + 's ease-out',
        transition: this.state.touching ? 'none' : 'transform ' + this.props.animationDuration + 's ease-out'
      } });

    return _reactAddons2['default'].createElement(
      'div',
      { style: styles.root, onClick: this.onClickSidebarToggle },
      _reactAddons2['default'].createElement(
        'div',
        { style: styles.basement, ref: 'basement' },
        this.props.basement
      ),
      _reactAddons2['default'].createElement(
        'div',
        { style: mainStyle,
          onTouchStart: this.touchStart, onTouchMove: this.touchMove,
          onTouchEnd: this.touchEnd, onTouchCancel: this.touchEnd },
        _reactAddons2['default'].createElement(
          'div',
          { className: 'hamburger-basement-content' },
          this.props.children
        )
      )
    );
  }
});
module.exports = exports['default'];
