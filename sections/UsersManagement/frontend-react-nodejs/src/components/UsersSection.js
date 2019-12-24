import { connect } from 'react-redux';
import React, { Component } from 'react';

// Material-UI components
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';

import TopNavigator from '../components/TopNavigator';

class UsersSection extends Component {
    render() {
        return (
            <Grid
                container
                direction="row"
                justify="center"
                //alignItems="center"
                className='main-section'
            >
                <CssBaseline/>
                <div className='main-container'>
                    <TopNavigator/>
                    <div className="users-content">
                        Users section!
                    </div>
                </div>
            </Grid>
        );
    }
}

const mapStateToProps = (state /*, ownProps*/) => {
    return {
        
    }
};

const mapDispatchToProps = {

};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UsersSection)