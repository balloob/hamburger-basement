'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x, _x2, _x3) { var _again = true; _function: while (_again) { desc = parent = getter = undefined; _again = false; var object = _x,
    property = _x2,
    receiver = _x3; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x = parent; _x2 = property; _x3 = receiver; _again = true; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; }

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
    bottom: 0 } };

var HambugerBasement = (function (_React$Component) {
  function HambugerBasement(props) {
    _classCallCheck(this, HambugerBasement);

    _get(Object.getPrototypeOf(HambugerBasement.prototype), 'constructor', this).call(this, props);

    this.state = {
      open: false, // Is the basement currently open?
      position: 0, // Position of the overlay
      touching: false, // Is touch interaction currently happening?
      currentBasementWidth: 0, // Current width of basement element, will be set after rendering and on resize
      touchOrigin: 0, // X position of last touchstart-event
      originalPosition: 0 // Original overlay position before touch started
    };

    this.resize = this.resize.bind(this);
    this.onClickSidebarToggle = this.onClickSidebarToggle.bind(this);
    this.touchStart = this.touchStart.bind(this);
    this.touchMove = this.touchMove.bind(this);
    this.touchEnd = this.touchEnd.bind(this);
  }

  _inherits(HambugerBasement, _React$Component);

  _createClass(HambugerBasement, [{
    key: 'toggle',

    // Toggle open/closed
    value: function toggle() {
      if (!(this.state.open && this.props.forceOpen)) {
        this.setState({ open: !this.state.open });
      }
    }
  }, {
    key: 'touchStart',
    value: function touchStart(e) {
      var posX = e.targetTouches[0].clientX;

      // only allow touch within 'toggleDistanceDelta' pixels right from the edge
      if (!this.props.forceOpen && posX > this.state.position && posX < this.state.position + this.props.toggleDistanceDelta) {

        this.setState({
          touching: true,
          touchOrigin: e.targetTouches[0].clientX,
          originalPosition: this.state.position
        });
      }
    }
  }, {
    key: 'touchMove',
    value: function touchMove(e) {
      if (this.state.touching) {
        var newPos = Math.max(0, this.state.originalPosition + (e.targetTouches[0].clientX - this.state.touchOrigin));

        this.setState({ position: newPos });
      }
    }
  }, {
    key: 'touchEnd',
    value: function touchEnd() {
      if (this.state.touching) {
        var shouldToggle = Math.abs(this.state.originalPosition - this.state.position) > this.props.toggleDistanceDelta;

        if (shouldToggle) {
          this.setState({ touching: false, open: !this.state.open });
        } else {
          this.setState({ touching: false, position: this.state.originalPosition });
        }
      }
    }
  }, {
    key: 'openPosition',

    // Calculate overlay position when the basement is open
    value: function openPosition() {
      return this.props.basementWidth || this.state.currentBasementWidth - this.props.openOffset;
    }
  }, {
    key: 'resize',
    value: function resize() {
      this.setState({ currentBasementWidth: this.refs.basement.getDOMNode().offsetWidth });
      if (this.state.open) {
        this.setState({ position: this.openPosition() });
      }
    }
  }, {
    key: 'onClickSidebarToggle',
    value: function onClickSidebarToggle(ev) {
      if (ev.target.getAttribute(toggleSidebarAttr) === '1') {
        this.toggle();
        ev.preventDefault();
      }
    }
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate(prevProps, prevState) {
      // Check to see if we should toggle the overlay position
      if (prevState.open !== this.state.open) {
        this.setState({ position: this.state.open ? this.openPosition() : 0 });
      }
    }
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      // Make sure resizing the window is supported
      // This should also handle portrait/landscape switching on mobile
      window.addEventListener('resize', this.resize);
      this.setState({ currentBasementWidth: this.refs.basement.getDOMNode().offsetWidth });
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      window.removeEventListener('resize', this.resize);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if ('forceOpen' in nextProps) {
        this.setState({ open: nextProps.forceOpen });
      }
    }
  }, {
    key: 'render',
    value: function render() {
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
        { style: styles.root, onClick: this.onClickSidebarToggle,
          className: 'hamburger-basement' },
        _reactAddons2['default'].createElement(
          'div',
          { style: styles.basement, ref: 'basement',
            className: 'hamburger-basement-basement' },
          this.props.basement
        ),
        _reactAddons2['default'].createElement(
          'div',
          { style: mainStyle, className: 'hamburger-basement-content',
            onTouchStart: this.touchStart, onTouchMove: this.touchMove,
            onTouchEnd: this.touchEnd, onTouchCancel: this.touchEnd },
          this.props.children
        )
      );
    }
  }]);

  return HambugerBasement;
})(_reactAddons2['default'].Component);

;

HambugerBasement.defaultProps = {
  animationDuration: 0.4,
  basementWidth: 0, // 0 = set automatically
  toggleDistanceDelta: 50,
  openOffset: 85,
  forceOpen: false };

exports['default'] = HambugerBasement;
module.exports = exports['default'];
