import React from 'react/addons';

const update = React.addons.update;

const toggleSidebarAttr = 'data-sidebar-toggle';

const styles = {
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
 
  basement: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'scroll',
    WebkitOverflowScrolling: 'touch',
  },

  main: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
};

class HambugerBasement extends React.Component {
  constructor(props) {
    super(props);

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

  // Toggle open/closed
  toggle() {
    if (!(this.state.open && this.props.forceOpen)) {
      this.setState({ open: !this.state.open });
    }
  }

  touchStart(e) {
    let posX = e.targetTouches[0].clientX;

    // only allow touch within 'toggleDistanceDelta' pixels right from the edge
    if (!this.props.forceOpen && posX > this.state.position &&
        posX < this.state.position + this.props.toggleDistanceDelta) {

      this.setState({
        touching: true,
        touchOrigin: e.targetTouches[0].clientX,
        originalPosition: this.state.position
      });
    }
  }

  touchMove(e) {
    if (this.state.touching) {
      var newPos = Math.max(
        0, this.state.originalPosition + (e.targetTouches[0].clientX -
                                          this.state.touchOrigin));

      this.setState({position: newPos});
    }
  }

  touchEnd() {
    if (this.state.touching) {
      var shouldToggle = Math.abs(
        this.state.originalPosition - this.state.position) > this.props.toggleDistanceDelta;

      if (shouldToggle) {
        this.setState({touching: false, open: !this.state.open});
      } else {
        this.setState({touching: false, position: this.state.originalPosition});
      }
    }
  }

  // Calculate overlay position when the basement is open
  openPosition() {
    return this.props.basementWidth ||
           this.state.currentBasementWidth - this.props.openOffset;
  }

  resize() {
    this.setState({ currentBasementWidth: this.refs.basement.getDOMNode().offsetWidth });
    if (this.state.open) {
      this.setState({ position: this.openPosition() });
    }
  }

  onClickSidebarToggle(ev) {
    if (ev.target.getAttribute(toggleSidebarAttr) === '1') {
      this.toggle();
      ev.preventDefault();
    } 
  }

  componentDidUpdate(prevProps, prevState) {
    // Check to see if we should toggle the overlay position
    if (prevState.open !== this.state.open) {
      this.setState({ position: this.state.open ? this.openPosition() : 0 });
    }
  }

  componentDidMount() {
    // Make sure resizing the window is supported
    // This should also handle portrait/landscape switching on mobile
    window.addEventListener('resize', this.resize);
    this.setState({ currentBasementWidth: this.refs.basement.getDOMNode().offsetWidth });
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize);
  }

  componentWillReceiveProps (nextProps) {
    if ('forceOpen' in nextProps) {
      this.setState({open: nextProps.forceOpen});
    }
  }

  render() {
    let mainStyle = update(styles.main, {$merge: {
      WebkitTransform: `translate3d(${this.state.position}px, 0, 0)`,
      MozTransform: `translateX(${this.state.position}px)`,
      OTransform: `translateX(${this.state.position}px)`,
      transform: `translateX(${this.state.position}px)`,
      WebkitTransition: (this.state.touching ? 'none' : `-webkit-transform ${this.props.animationDuration}s ease-out`),
      MozTransition: (this.state.touching ? 'none' : `-moz-transform ${this.props.animationDuration}s ease-out`),
      OTransition: (this.state.touching ? 'none' : `-o-transform ${this.props.animationDuration}s ease-out`),
      transition: (this.state.touching ? 'none' : `transform ${this.props.animationDuration}s ease-out`)
    }});

    return (
      <div style={styles.root} onClick={this.onClickSidebarToggle}
           className='hamburger-basement'>
        <div style={styles.basement} ref='basement'
             className='hamburger-basement-basement'>
          {this.props.basement}
        </div>
        <div style={mainStyle} className='hamburger-basement-content'
             onTouchStart={this.touchStart} onTouchMove={this.touchMove}
             onTouchEnd={this.touchEnd} onTouchCancel={this.touchEnd}>
          {this.props.children}
        </div>
      </div>
    );
  }
};

HambugerBasement.defaultProps = {
  animationDuration: 0.4,
  basementWidth: 0, // 0 = set automatically
  toggleDistanceDelta: 50,
  openOffset: 85,
  forceOpen: false,
};

export default HambugerBasement;
