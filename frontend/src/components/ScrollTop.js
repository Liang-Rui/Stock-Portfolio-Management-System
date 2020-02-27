import { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { saveScrollPosition } from '../actions/index'
import { connect } from 'react-redux';


// store scroll position for all the pages
class ScrollToTop extends Component {

    componentDidUpdate() {
        if (this.props.scrollPositionCache[this.props.location.pathname] !== undefined) {
            const position = this.props.scrollPositionCache[this.props.location.pathname]
            window.scrollTo(position.scrollX, position.scrollY);
        } else {
            const { hash } = window.location
            if (hash !== '') {
                const id = hash.replace('#', '');
                const element = document.getElementById(id)
                if (element) element.scrollIntoView()
            } else {
                window.scrollTo(0, 0)
            }
        }
    }

    render() {
        return this.props.children;
    }
}


const mapStateToProps = (state) => {
    return {
        scrollPositionCache: state.scrollPositionCache
    }
}

const mapDispatchToProps = {
    saveScrollPosition
};


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ScrollToTop));