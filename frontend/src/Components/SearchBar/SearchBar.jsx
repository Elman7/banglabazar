import { Container, InputAdornment, TextField, Typography, Box, Paper, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import { AiOutlineSearch } from 'react-icons/ai';
import { styled } from '@mui/material/styles';
import { Link } from "react-router-dom";
import { getAllProducts } from "../../Constants/Constant";

// Styled Item component for displaying search results
const Item = styled(Paper)(({ theme }) => ({
    borderRadius: '8px',
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
    '&:hover': {
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
        transform: 'scale(1.02)',
    },
}));

const SearchBar = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        getAllProducts(setData);
    }, []);

    const handleSearch = event => {
        setSearchTerm(event.target.value);
        const newFilteredData = data.filter(item =>
            (item.name && item.name.toLowerCase().includes(event.target.value.toLowerCase())) ||
            (item.type && item.type.toLowerCase().includes(event.target.value.toLowerCase())) ||
            (item.brand && item.brand.toLowerCase().includes(event.target.value.toLowerCase())) ||
            (item.category && item.category.toLowerCase().includes(event.target.value.toLowerCase())) ||
            (item.author && item.author.toLowerCase().includes(event.target.value.toLowerCase())) ||
            (item.description && item.description.toLowerCase().includes(event.target.value.toLowerCase())) ||
            (item.gender && item.gender.toLowerCase().includes(event.target.value.toLowerCase()))
        );
        setFilteredData(newFilteredData);
    };

    return (
        <Container
            sx={{
                display: "flex",
                justifyContent: 'center',
                alignItems: 'center',
                flexDirection: 'column',
                padding: 5,
            }}
        >
            {/* Search Bar */}
            <TextField
                id="search"
                type="search"
                label="Search Products"
                value={searchTerm}
                onChange={handleSearch}
                sx={{
                    width: { xs: 350, sm: 500, md: 800 },
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                    },
                    '& label.Mui-focused': {
                        color: '#1976d2',
                    },
                    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#1976d2',
                    },
                }}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <AiOutlineSearch style={{ color: '#1976d2', fontSize: '1.5rem' }} />
                        </InputAdornment>
                    ),
                }}
            />

            {/* Search Results */}
            {searchTerm.length > 0 && (
                <Box
                    sx={{
                        width: { xs: 350, sm: 500, md: 800 },
                        overflowY: "auto",
                        maxHeight: "250px",
                        border: '1px solid #e0e0e0',
                        borderRadius: '8px',
                        boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
                        backgroundColor: '#fff',
                    }}
                >
                    <Stack spacing={0}>
                        {filteredData.length === 0 ? (
                            <Typography variant="h6" textAlign="center" margin="25px 0">
                                Product Not Found
                            </Typography>
                        ) : (
                            filteredData.map(products => (
                                <Link to={`/Detail/type/${products.type}/${products._id}`} key={products._id} style={{ textDecoration: 'none' }}>
                                    <Item
                                        sx={{
                                            borderRadius: 0,
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            padding: "10px 15px",
                                            alignItems: 'center',
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: '#333',
                                                fontWeight: 500,
                                                maxWidth: '70%',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                            }}
                                        >
                                            {products.name.slice(0, 35)}
                                        </Typography>
                                        <img
                                            src={products.image}
                                            alt={products.name}
                                            style={{
                                                width: 55,
                                                height: 65,
                                                borderRadius: '4px',
                                                objectFit: 'cover',
                                                border: '1px solid #e0e0e0',
                                            }}
                                        />
                                    </Item>
                                </Link>
                            ))
                        )}
                    </Stack>
                </Box>
            )}
        </Container>
    );
}

export default SearchBar;
