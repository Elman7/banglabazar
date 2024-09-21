import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Rating from '@mui/material/Rating';
import {
    MdSentimentSatisfiedAlt,
    MdSentimentDissatisfied,
    MdSentimentVeryDissatisfied,
    MdSentimentNeutral,
    MdSentimentVerySatisfied,
    MdStarRate,
    MdOutlineSentimentVeryDissatisfied,
    MdSend,
    MdOutlineFilterAlt
} from 'react-icons/md';
import Box from '@mui/material/Box';
import { Button, MenuItem, Select, TextField, Tooltip, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import './Review.css';
import CommentCard from '../Card/Comment Card/CommentCard';
import { customerReview } from '../../Assets/Images/Image';

const labels = {
    0: <MdOutlineSentimentVeryDissatisfied style={{ color: 'red' }} />,
    0.5: <MdOutlineSentimentVeryDissatisfied style={{ color: 'red' }} />,
    1: <MdSentimentVeryDissatisfied style={{ color: 'red' }} />,
    1.5: <MdSentimentVeryDissatisfied style={{ color: 'red' }} />,
    2: <MdSentimentDissatisfied style={{ color: 'orange' }} />,
    2.5: <MdSentimentDissatisfied style={{ color: 'orange' }} />,
    3: <MdSentimentNeutral style={{ color: 'gold' }} />,
    3.5: <MdSentimentNeutral style={{ color: 'gold' }} />,
    4: <MdSentimentSatisfiedAlt style={{ color: 'green' }} />,
    4.5: <MdSentimentSatisfiedAlt style={{ color: 'green' }} />,
    5: <MdSentimentVerySatisfied style={{ color: 'green' }} />,
};

const getLabelText = (value) => {
    return `${value} Star${value !== 1 ? 's' : ''}, ${labels[value]}`;
};

const ProductReview = ({ authToken, setProceed, setOpenAlert, id }) => {
    const [value, setValue] = useState(0);
    const [hover, setHover] = useState(-1);
    const [reviews, setReviews] = useState([]);
    const [comment, setComment] = useState('');
    const [filterOption, setFilterOption] = useState('All');
    const [title, setTitle] = useState('All');

    const commentFilter = ["All", "Most Recent", "Old", "Positive First", "Negative First"];

    const handleChange = (e) => {
        setFilterOption(e.target.value.split(" ").join("").toLowerCase());
        setTitle(e.target.value);
        fetchReviews();
    };

    const fetchReviews = async () => {
        const filter = filterOption.toLowerCase();
        try {
            const { data } = await axios.post(`${process.env.REACT_APP_GET_REVIEW}/${id}`, { filterType: filter });
            setReviews(data);
        } catch (error) {
            toast.error("Failed to fetch reviews.", { theme: "colored", autoClose: 500 });
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [title, id]);

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!comment || value <= 0) {
            toast.error("Please fill all fields", { theme: "colored", autoClose: 500 });
            return;
        }

        if (comment.length <= 4) {
            toast.error("Please add more than 4 characters", { theme: "colored", autoClose: 500 });
            return;
        }

        try {
            if (setProceed) {
                const { data } = await axios.post(`${process.env.REACT_APP_ADD_REVIEW}`, { id, comment, rating: value }, {
                    headers: {
                        'Authorization': authToken
                    }
                });
                toast.success(data.msg, { theme: "colored", autoClose: 500 });
                fetchReviews();
            } else {
                setOpenAlert(true);
            }
            setComment('');
            setValue(0);
        } catch (error) {
            toast.error(error.response?.data?.msg || "Error submitting review", { theme: "colored", autoClose: 600 });
            setComment('');
            setValue(0);
        }
    };

    return (
        <>
            <Box className='form-container' sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
                <form onSubmit={handleSubmitReview} className='form' style={{ width: '100%', maxWidth: '400px' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Rating
                            name="hover-feedback"
                            value={value}
                            precision={0.5}
                            getLabelText={getLabelText}
                            onChange={(event, newValue) => {
                                setValue(newValue);
                            }}
                            onChangeActive={(event, newHover) => {
                                setHover(newHover);
                            }}
                            emptyIcon={<MdStarRate style={{ opacity: 0.55 }} fontSize="inherit" />}
                        />
                        {value !== null && (
                            <Box className='expression-icon' sx={{ ml: 2 }}>{labels[hover !== -1 ? hover : value]}</Box>
                        )}
                    </Box>

                    <TextField
                        id="filled-textarea"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        label="Add Review"
                        placeholder="What did you like or dislike?"
                        multiline
                        variant="outlined"
                        sx={{ mb: 2 }}
                    />

                    <Tooltip title='Send Review'>
                        <Button variant='contained' type='submit' endIcon={<MdSend />} fullWidth>
                            Send
                        </Button>
                    </Tooltip>
                </form>

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                    <img src={customerReview} loading='lazy' alt="Customer Review" className='review-img' style={{ width: '100%', maxWidth: '300px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }} />
                </Box>
            </Box>

            {reviews.length >= 1 ? (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: "80vw", mt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Button endIcon={<MdOutlineFilterAlt />}>Filters</Button>
                        <Select
                            labelId="filter-select-label"
                            id="filter-select"
                            value={title}
                            onChange={handleChange}
                            sx={{ width: 200 }}
                        >
                            {commentFilter.map(prod => (
                                <MenuItem key={prod} value={prod}>{prod}</MenuItem>
                            ))}
                        </Select>
                    </Box>
                </Box>
            ) : (
                <Typography sx={{ textAlign: 'center', mt: 2 }}>
                    No reviews have been submitted for this product yet. Be the first to add a review!
                </Typography>
            )}

            <Box className='review-box' sx={{ mt: 2, width: '100%', maxWidth: '800px' }}>
                {reviews.map(review => (
                    <CommentCard 
                        userReview={review} 
                        key={review._id} 
                        authToken={authToken} 
                        setReviews={setReviews} 
                        reviews={reviews} 
                        fetchReviews={fetchReviews} 
                    />
                ))}
            </Box>
        </>
    );
};

export default ProductReview;
