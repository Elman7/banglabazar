import { Typography } from '@mui/material';
import React from 'react';
import { FaFacebook } from 'react-icons/fa';

const CopyRight = (props) => {
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            {/* Facebook Icon with adjusted positioning and size */}
            <a
                href='https://www.facebook.com/mdtanjir.rahman'
                target='_blank'
                rel='noreferrer'
                style={{
                    textDecoration: 'none',
                    position: 'relative',
                    top: '-3px',         
                    left: '-10px',        
                    fontSize: '1.5rem',   
                }}
            >
                <FaFacebook style={{ color: '#1976d2' }} />
            </a>

            {/* Non-clickable Copyright Text */}
            <Typography
                variant="body1"
                fontWeight="bold"
                color="text.secondary"
                align="center"
                {...props}
                style={{ color: '#1976d2' }}
            >
                {new Date().getFullYear()} © BANGLA BAZAAR
            </Typography>
        </div>
    );
}

export default CopyRight;
