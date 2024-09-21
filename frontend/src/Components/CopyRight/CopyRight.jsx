import { Typography } from '@mui/material';
import React from 'react';
import { FaFacebook } from 'react-icons/fa';

const CopyRight = (props) => {
    return (
        <a href='https://www.facebook.com/mdtanjir.rahman' target='_blank' rel='noreferrer' style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FaFacebook style={{ marginRight: '8px', color: '#1976d2' }} />
            <Typography variant="body1" fontWeight="bold" color="text.secondary" align="center" {...props} style={{ color: '#1976d2' }}>
                {new Date().getFullYear()} © BANGLA BAZAAR
            </Typography>
        </a>
    );
}

export default CopyRight;
