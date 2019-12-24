import React, { Component } from 'react';

import SnackbarContent from '@material-ui/core/SnackbarContent';
import IconButton from '@material-ui/core/IconButton';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import WarningIcon from '@material-ui/icons/Warning';
import CloseIcon from '@material-ui/icons/Close';

const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon,
};

class SnackbarWrapper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showSnackbar: this.props.show
        }
    }

    static getDerivedStateFromProps = (props, state) => {
        if(props.show !== state.showSnackbar) {
            return {
                showSnackbar: props.show
            }
        }
        return null;
    }

    render() {
        const {message, variant, handleClose} = this.props;
        const Icon = variantIcon[variant];

        let snackbarClosed = (!this.state.showSnackbar) ? 'snackbar-closed' : '';

        return (
            <SnackbarContent
                className={"snackbar-" + variant + " " + snackbarClosed}
                aria-describedby="client-snackbar"
                message={
                    <span id="client-snackbar" className='message'>
                        <Icon className='icon icon-variant icon-snackbar' /> {message}
                    </span>
                        }
                action={[
                            <IconButton key="close" aria-label="close" color="inherit" onClick={handleClose}>
                                <CloseIcon className='icon' />
                            </IconButton>,
                        ]}
            />
        );
    }
}

export default SnackbarWrapper;