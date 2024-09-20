import React, { useEffect } from 'react'
import axios from 'axios'
import { Container, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { useContext } from 'react'
import { ContextFunction } from '../../Context/Context'
import CategoryCard from '../../Components/Category_Card/CategoryCard';
import BannerData from '../../Helpers/HomePageBanner';
import Carousel from '../../Components/Carousel/Carousel'
import SearchBar from '../../Components/SearchBar/SearchBar'
import CopyRight from '../../Components/CopyRight/CopyRight'
const HomePage = () => {
    const { setCart } = useContext(ContextFunction)
    let authToken = localStorage.getItem('Authorization')
    useEffect(() => {
        getCart()
        window.scroll(0, 0)
    }, [])
  
    const getCart = async () => {
        if (authToken !== null) {
            try {
                const { data } = await axios.get(`${process.env.REACT_APP_GET_CART}`, {
                    headers: {
                        'Authorization': authToken
                    }
                });
                setCart(data);
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    // Token might be expired, try refreshing the token
                    const newAuthToken = await refreshAccessToken();
                    if (newAuthToken) {
                        // Retry the getCart request with the new token
                        localStorage.setItem('Authorization', newAuthToken);
                        const { data } = await axios.get(`${process.env.REACT_APP_GET_CART}`, {
                            headers: {
                                'Authorization': newAuthToken
                            }
                        });
                        setCart(data);
                    }
                }
            }
        }
    }
    
    const refreshAccessToken = async () => {
        const refreshToken = localStorage.getItem('RefreshToken');
        if (refreshToken) {
            try {
                const { data } = await axios.post(`${process.env.REACT_APP_REFRESH_TOKEN}`, {
                    refreshToken
                });
                return data.newAuthToken;  // Assuming API returns a new access token
            } catch (error) {
                console.error('Error refreshing access token', error);
                // Handle refresh failure (e.g., log out user)
            }
        }
        return null;
    }
    


    return (
        <>
            <Container maxWidth='xl' style={{ display: 'flex', justifyContent: "center", padding: 0, flexDirection: "column", marginBottom: 70 }}>
                <Box padding={1}>
                    <Carousel />
                </Box>
                <Container style={{ marginTop: 90, display: "flex", justifyContent: 'center' }}>
                    <SearchBar />
                </Container>
                <Typography variant='h3' sx={{ textAlign: 'center', marginTop: 10, color: '#1976d2', fontWeight: 'bolder' }}>Categories</Typography>
                <Container maxWidth='xl' style={{ marginTop: 90, display: "flex", justifyContent: 'center', flexGrow: 1, flexWrap: 'wrap', gap: 50, }}>
                    {
                        BannerData.map(data => (
                            <CategoryCard data={data} key={data.img} />
                        ))
                    }
                </Container>
            </Container >
            <CopyRight sx={{ mt: 8, mb: 10 }} />
        </ >
    )
}

export default HomePage