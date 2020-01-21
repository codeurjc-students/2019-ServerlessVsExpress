import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Link as LinkRouter } from 'react-router-dom';

import Grid from '@material-ui/core/Grid';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';

class ActivationMessage extends Component {
    render() {
        return(
            <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
            >
                <CssBaseline/>
                <Container className="activation-email-sent-container">
                    <Grid 
                        item
                        container
                        spacing={0}
                        direction="column"
                        alignItems="center"
                        justify="center"
                        style={{ minHeight: '100vh' }}
                    >
                        A link has been sent to your email. Click on it to activate your account!
                        <LinkRouter to={'/login'}>
                            <span>
                                {"Go to login"}
                            </span>
                        </LinkRouter>
                    </Grid>
                </Container>
            </Grid>
        );
    }
}

export default connect()(ActivationMessage);