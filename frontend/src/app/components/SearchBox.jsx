// Import necessary components from MUI
import React from 'react';
import {InputAdornment, styled, TextField} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search'; // Import the search icon

// Style your SearchBox width
const StyledSearchBox = styled(TextField)(({theme}) => ({
    width: '100%',
    margin: theme.spacing(0), // Add some margin
    '& .MuiOutlinedInput-root': {
        padding: '0 8px', // Adjust the padding as needed
        height: '36px', // Adjust the height as needed
        '& .MuiInputAdornment-root': {
            marginRight: theme.spacing(1), // Adjust the margin as needed
        },
        '& input': {
            padding: '8px 0', // Adjust the input padding as needed
            fontSize: '14px', // Adjust the font size as needed
        },
    },
}));

// SearchBox Component
const SearchBox = ({onChange}) => {
    return (
        <StyledSearchBox
            variant="outlined"
            placeholder="Search ..."
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon/>
                    </InputAdornment>
                ),
            }}
            onChange={onChange} // Propagate the onChange event
        />
    );
};

export default SearchBox;