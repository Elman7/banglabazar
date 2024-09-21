import React, { useContext, useEffect, useState } from 'react';
import { Button, Container, Dialog, DialogActions, DialogContent, Grid, TextField, Typography } from '@mui/material';
import './Chekout.module.css'; // Updated import statement
import { BsFillCartCheckFill } from 'react-icons/bs';
import { MdUpdate } from 'react-icons/md';
import axios from 'axios';
import { ContextFunction } from '../../Context/Context';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import CopyRight from '../CopyRight/CopyRight';
import { Transition, handleClose } from '../../Constants/Constant';
import { AiFillCloseCircle, AiOutlineSave } from 'react-icons/ai';
import emailjs from 'emailjs-com'; // Import EmailJS

const CheckoutForm = () => {
    const { cart } = useContext(ContextFunction);
    const [userData, setUserData] = useState([]);
    const [openAlert, setOpenAlert] = useState(false);
    const [orderComplete, setOrderComplete] = useState(false);

    let authToken = localStorage.getItem('Authorization');
    let setProceed = authToken ? true : false;
    let navigate = useNavigate();
    let totalAmount = sessionStorage.getItem('totalAmount');

    useEffect(() => {
        if (setProceed) {
            getUserData();
        } else {
            navigate('/');
        }
    }, []);

    const [userDetails, setUserDetails] = useState({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        userEmail: '',
        address: '',
        zipCode: '',
        city: '',
        userState: '',
    });

    const getUserData = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_GET_USER_DETAILS}`, {
                headers: {
                    'Authorization': authToken
                }
            });
            setUserData(data);
            if (!data.address || !data.city || !data.zipCode || !data.userState) {
                setOpenAlert(true);
            }
            setUserDetails({
                firstName: data.firstName,
                lastName: data.lastName,
                userEmail: data.email,
                phoneNumber: data.phoneNumber,
                address: data.address,
                zipCode: data.zipCode,
                city: data.city,
                userState: data.userState
            });
        } catch (error) {
            console.log(error);
        }
    };

    const checkOutHandler = (e) => {
        e.preventDefault();
    
        if (!userDetails.firstName || !userDetails.lastName || !userDetails.userEmail || !userDetails.phoneNumber || !userDetails.address || !userDetails.zipCode || !userDetails.city || !userDetails.userState) {
            toast.error("Please fill all fields", { autoClose: 500, theme: "colored" });
        } else {
            // Prepare email parameters
            const templateParams = {
                email_to: 'elmanaust@gmail.com',
                from_name: `${userDetails.firstName} ${userDetails.lastName}`,
                message: `
                    Order Details:
                    Name: ${userDetails.firstName} ${userDetails.lastName}
                    Email: ${userDetails.userEmail}
                    Phone: ${userDetails.phoneNumber}
                    Address: ${userDetails.address}, ${userDetails.city}, ${userDetails.zipCode}, ${userDetails.userState}
                    Total Amount: $${totalAmount}
    
                    Cart Items:
                    ${cart.map(item => `${item.productId.name} - Quantity: ${item.quantity}`).join('\n')}
                `
            };
    
            // Use EmailJS to send the email
            emailjs.send(
                'service_krg35hv',   //  EmailJS Service ID
                'template_djuhrlj',  //  EmailJS Template ID
                templateParams,
                'cBi6mXGNaEI7hlh9s'    // EmailJS Public Key
            )
            .then((response) => {
                console.log('Email sent successfully', response.status, response.text);
                setOrderComplete(true);
                toast.success("Order placed successfully. Confirmation sent via email.", { autoClose: 500, theme: "colored" });
            })
            .catch((err) => {
                console.error('Failed to send email', err);
                toast.error("Failed to send order confirmation email.", { autoClose: 500, theme: "colored" });
            });
        }
    };
    

    const handleOnchange = (e) => {
        setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
    };

    return (
        <>
            <Container 
                sx={{ 
                    width: '100%', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    flexDirection: 'column', 
                    marginBottom: 10, 
                    padding: '20px', 
                    backgroundColor: '#f7f7f7', 
                    borderRadius: '10px', 
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)' 
                }}>
                <Typography 
                    variant='h6' 
                    sx={{ 
                        margin: '20px 0', 
                        fontFamily: 'Playfair Display, serif', 
                        fontWeight: '600', 
                        color: '#333' 
                    }}>
                    Checkout
                </Typography>
    
                <form noValidate autoComplete="off" className="checkout_form" onSubmit={checkOutHandler} >
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField 
                                inputProps={{ readOnly: true }} 
                                disabled 
                                label="First Name" 
                                name='firstName' 
                                value={userDetails.firstName || ''} 
                                onChange={handleOnchange} 
                                variant="outlined" 
                                fullWidth 
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField 
                                inputProps={{ readOnly: true }} 
                                disabled 
                                label="Last Name" 
                                name='lastName' 
                                value={userDetails.lastName || ''} 
                                onChange={handleOnchange} 
                                variant="outlined" 
                                fullWidth 
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField 
                                inputProps={{ readOnly: true }} 
                                disabled 
                                label="Contact Number" 
                                type='tel' 
                                name='phoneNumber' 
                                value={userDetails.phoneNumber || ''} 
                                onChange={handleOnchange} 
                                variant="outlined" 
                                fullWidth 
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField 
                                inputProps={{ readOnly: true }} 
                                disabled 
                                label="Email" 
                                name='userEmail' 
                                value={userDetails.userEmail || ''} 
                                onChange={handleOnchange} 
                                variant="outlined" 
                                fullWidth 
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField 
                                label="Address" 
                                name='address' 
                                value={userDetails.address || ''} 
                                onChange={handleOnchange} 
                                variant="outlined" 
                                fullWidth 
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField 
                                label="City" 
                                name='city' 
                                value={userDetails.city || ''} 
                                onChange={handleOnchange} 
                                variant="outlined" 
                                fullWidth 
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField 
                                type='tel' 
                                label="Postal/Zip Code" 
                                name='zipCode' 
                                value={userDetails.zipCode || ''} 
                                onChange={handleOnchange} 
                                variant="outlined" 
                                fullWidth 
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField 
                                label="Province/State" 
                                name='userState' 
                                value={userDetails.userState || ''} 
                                onChange={handleOnchange} 
                                variant="outlined" 
                                fullWidth 
                            />
                        </Grid>
                    </Grid>
    
                    <Container 
                        sx={{ 
                            display: 'flex', 
                            gap: 2, 
                            justifyContent: 'center', 
                            marginTop: 5 
                        }}>
                        <Link to='/update'>
                            <Button 
                                variant='contained' 
                                endIcon={<MdUpdate />} 
                                sx={{ 
                                    backgroundColor: '#4CAF50', 
                                    '&:hover': { backgroundColor: '#45a049' } 
                                }}>
                                Update
                            </Button>
                        </Link>
                        <Button 
                            variant='contained' 
                            endIcon={<BsFillCartCheckFill />} 
                            type='submit' 
                            sx={{ 
                                backgroundColor: '#007bff', 
                                '&:hover': { backgroundColor: '#0056b3' } 
                            }}>
                            Checkout
                        </Button>
                    </Container>
                </form>
    
                {/* Alert Dialog */}
                <Dialog
                    open={openAlert}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={() => handleClose(setOpenAlert)}
                    aria-describedby="alert-dialog-slide-description"
                >
                    <DialogContent sx={{ width: { xs: 280, md: 350, xl: 400 }, display: 'flex', justifyContent: 'center' }}>
                        <Typography 
                            variant='h6' 
                            sx={{ 
                                fontFamily: 'Playfair Display, serif', 
                                color: '#555' 
                            }}>
                            Add permanent address so you don't have to add it again.
                        </Typography>
                    </DialogContent>
                    <DialogActions sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                        <Link to='/update'>
                            <Button 
                                variant='contained' 
                                endIcon={<AiOutlineSave />} 
                                color='primary' 
                                sx={{ 
                                    backgroundColor: '#4CAF50', 
                                    '&:hover': { backgroundColor: '#45a049' } 
                                }}>
                                Add
                            </Button>
                        </Link>
                        <Button 
                            variant='contained' 
                            color='error' 
                            endIcon={<AiFillCloseCircle />} 
                            onClick={() => handleClose(setOpenAlert)}>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
    
                {/* Order Complete Dialog */}
                <Dialog
                    open={orderComplete}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={() => setOrderComplete(false)}
                    aria-describedby="order-complete-dialog"
                >
                    <DialogContent sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography 
                            variant='h6' 
                            sx={{ 
                                fontFamily: 'Playfair Display, serif', 
                                fontWeight: '600', 
                                color: '#333' 
                            }}>
                            Order Complete
                        </Typography>
                        <Typography 
                            variant='body1' 
                            sx={{ color: '#555', marginTop: '10px' }}>
                            Thank you for your purchase!
                        </Typography>
                    </DialogContent>
                    <DialogActions sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Button 
                            variant='contained' 
                            color='primary' 
                            onClick={() => setOrderComplete(false)} 
                            sx={{ 
                                backgroundColor: '#007bff', 
                                '&:hover': { backgroundColor: '#0056b3' } 
                            }}>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
            <CopyRight sx={{ mt: 8, mb: 10 }} />
        </>
    );
};

export default CheckoutForm;
