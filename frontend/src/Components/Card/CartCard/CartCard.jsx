import { Button, Card, CardActionArea, CardActions, CardContent, Rating, Tooltip, Typography } from '@mui/material'
import { Box } from '@mui/system'
import { Link } from 'react-router-dom'
import { AiFillDelete } from 'react-icons/ai'
import styles from './CartCard.module.css'
const CartCard = ({ product, removeFromCart }) => {


    return (
        <Card className={styles.main_cart} sx={{ transition: 'transform 0.3s ease, box-shadow 0.3s ease', '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 10px 20px rgba(0, 0, 0, 0.15)' } }}>
            <Link to={`/Detail/type/${product?.productId?.type}/${product?.productId?._id}`}>
                <CardActionArea className={styles.card_action}>
                    <Box className={styles.img_box}>
                        <img
                            alt={product?.productId?.name}
                            loading="lazy"
                            src={product?.productId?.image}
                            className={styles.img}
                        />
                    </Box>
                    <CardContent sx={{ padding: '16px 24px', textAlign: 'center' }}>
                        <Typography
                            gutterBottom
                            variant="h6"
                            sx={{ fontWeight: 600, color: '#333', fontSize: '1.1rem' }}
                        >
                            {product?.productId?.name.length > 20
                                ? product?.productId?.name.slice(0, 20) + '...'
                                : product?.productId?.name}
                        </Typography>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: 2,
                            }}
                        >
                            {product.quantity && (
                                <Button sx={{ padding: '6px 16px', fontSize: '0.875rem', color: '#1976d2', background: 'rgba(25, 118, 210, 0.1)' }}>
                                    Quantity: {product.quantity}
                                </Button>
                            )}
                            <Typography
                                variant="h6"
                                sx={{ fontWeight: 600, color: '#1976d2', fontSize: '1.125rem' }}
                            >
                                ৳{product?.productId?.price}
                            </Typography>
                        </Box>
                    </CardContent>
                </CardActionArea>
            </Link>
            <CardActions
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '8px 16px',
                }}
            >
                <Tooltip title="Remove From Cart">
                    <Button
                        sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            backgroundColor: '#f44336',
                            '&:hover': {
                                backgroundColor: '#d32f2f',
                            },
                        }}
                        variant="contained"
                        onClick={() => removeFromCart(product)}
                    >
                        <AiFillDelete style={{ fontSize: 18, color: '#fff' }} />
                    </Button>
                </Tooltip>
                <Rating
                    name="read-only"
                    value={Math.round(product?.productId?.rating)}
                    readOnly
                    precision={0.5}
                    sx={{ color: '#1976d2' }}
                />
            </CardActions>
        </Card>
    );
    
    
}

export default CartCard