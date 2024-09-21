import { Container } from '@mui/system'
import axios from 'axios'
import CartCard from '../../Components/Card/CartCard/CartCard'
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { ContextFunction } from '../../Context/Context'
import { useNavigate } from 'react-router-dom'
import { Box, Button, Dialog, DialogActions, DialogContent, Typography } from '@mui/material'
import { AiFillCloseCircle, AiOutlineLogin } from 'react-icons/ai'
import { EmptyCart } from '../../Assets/Images/Image';
import { Transition } from '../../Constants/Constant'
import CopyRight from '../../Components/CopyRight/CopyRight'

const Wishlist = () => {
    const { wishlistData, setWishlistData } = useContext(ContextFunction)
    const [openAlert, setOpenAlert] = useState(false);

    let authToken = localStorage.getItem('Authorization')
    let setProceed = authToken ? true : false
    let navigate = useNavigate()
    useEffect(() => {
        getWishList()
    }, [])
    const getWishList = async () => {
        if (setProceed) {
            const { data } = await axios.get(`${process.env.REACT_APP_GET_WISHLIST}`,
                {
                    headers: {
                        'Authorization': authToken
                    }
                })
            setWishlistData(data)
        }
        else {
            setOpenAlert(true)
        }
    }
    const removeFromWishlist = async (product) => {
        if (setProceed) {
            try {
                const deleteProduct = await axios.delete(`${process.env.REACT_APP_DELETE_WISHLIST}/${product._id}`, {
                    headers: {
                        'Authorization': authToken
                    }
                })
                setWishlistData(wishlistData.filter(c => c.productId._id !== product.productId._id))
                toast.success("Removed From Wishlist", { autoClose: 500, theme: 'colored' })
            } catch (error) {
                toast.error(error, { autoClose: 500, theme: 'colored' })
            }
        }
    }
    const handleClose = () => {
        setOpenAlert(false);
        navigate('/')
    };
    const handleToLogin = () => {
        navigate('/login')
    };

    return (
        <>
            <Typography 
                variant='h3' 
                sx={{ 
                    textAlign: 'center', 
                    margin: "30px 0", 
                    color: '#1565c0', 
                    fontWeight: 'bold', 
                    letterSpacing: '0.5px', 
                    transition: 'color 0.3s ease', 
                    '&:hover': { color: '#0d47a1' }
                }}
            >
                Wishlist
            </Typography>
    
            {setProceed && wishlistData.length <= 0 ? (
                <Box 
                    sx={{ 
                        width: '100%', 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        flexDirection: 'column', 
                        padding: '30px', 
                        backgroundColor: '#f5f5f5', 
                        borderRadius: '10px',
                        transition: 'box-shadow 0.3s ease',
                        '&:hover': { boxShadow: '0px 8px 20px rgba(0, 0, 0, 0.15)' }
                    }}
                >
                    <img 
                        src={EmptyCart} 
                        alt="Empty wishlist" 
                        className="empty-cart-img" 
                        style={{ maxWidth: '220px', marginBottom: '20px' }} 
                    />
                    <Typography 
                        variant='h6' 
                        sx={{ 
                            textAlign: 'center', 
                            color: '#1565c0', 
                            fontWeight: 'bold', 
                            letterSpacing: '0.2px' 
                        }}
                    >
                        No products in wishlist
                    </Typography>
                </Box>
            ) : (
                <Container 
                    maxWidth='xl' 
                    sx={{ 
                        display: "flex", 
                        justifyContent: 'center', 
                        flexWrap: "wrap", 
                        gap: '25px', 
                        paddingBottom: '30px',
                        transition: 'all 0.3s ease' 
                    }}
                >
                    {wishlistData.map(product => (
                        <CartCard 
                            product={product} 
                            removeFromCart={removeFromWishlist} 
                            key={product._id} 
                            sx={{ 
                                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', 
                                borderRadius: '12px', 
                                padding: '25px', 
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease', 
                                '&:hover': { 
                                    transform: 'scale(1.05)', 
                                    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.2)' 
                                } 
                            }}
                        />
                    ))}
                </Container>
            )}
    
            <Dialog
                open={openAlert}
                keepMounted
                onClose={handleClose}
                TransitionComponent={Transition}
                aria-describedby="alert-dialog-slide-description"
                sx={{ textAlign: 'center' }}
            >
                <DialogContent 
                    sx={{ 
                        width: { xs: 280, md: 350, xl: 400 }, 
                        display: 'flex', 
                        justifyContent: 'center', 
                        flexDirection: 'column',
                        backgroundColor: '#fafafa',
                        borderRadius: '10px'
                    }}
                >
                    <Typography 
                        variant='h5' 
                        sx={{ 
                            fontWeight: 'bold', 
                            color: '#1565c0', 
                            marginBottom: '20px', 
                            letterSpacing: '0.5px' 
                        }}
                    >
                        Please Login to Proceed
                    </Typography>
                </DialogContent>
                <DialogActions 
                    sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-evenly', 
                        padding: '20px' 
                    }}
                >
                    <Button 
                        variant='contained' 
                        onClick={handleToLogin} 
                        endIcon={<AiOutlineLogin />} 
                        color='primary'
                        sx={{ 
                            padding: '10px 20px', 
                            fontWeight: 'bold', 
                            letterSpacing: '0.2px',
                            transition: 'background-color 0.3s ease', 
                            '&:hover': { backgroundColor: '#0d47a1' } 
                        }}
                    >
                        Login
                    </Button>
                    <Button 
                        variant='contained' 
                        color='error' 
                        onClick={handleClose} 
                        endIcon={<AiFillCloseCircle />}
                        sx={{ 
                            padding: '10px 20px', 
                            fontWeight: 'bold', 
                            letterSpacing: '0.2px',
                            transition: 'background-color 0.3s ease', 
                            '&:hover': { backgroundColor: '#b71c1c' } 
                        }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
            
            <CopyRight sx={{ mt: 8, mb: 10 }} />
        </>
    );
    

}

export default Wishlist