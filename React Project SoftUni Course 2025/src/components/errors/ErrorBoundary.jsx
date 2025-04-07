import React from 'react';
import { Alert, Box } from '@mui/material';

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('Error:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <Box m={2}>
                    <Alert severity="error">
                        Something went wrong. Please try again later.
                    </Alert>
                </Box>
            );
        }

        return this.props.children;
    }
}