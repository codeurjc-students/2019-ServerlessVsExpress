import { connect } from 'react-redux';
import React, { Component } from 'react';

// Material-UI components
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';

class Main extends Component {
    render() {
        return (
            <Grid
                container
                direction="row"
                justify="center"
                className='main-section'
            >
                <CssBaseline/>
                <div className='main-container'>
                    <div className="home-content">
                        Navigate to the sections to test roles (User role & Admin role)
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
)(Main)