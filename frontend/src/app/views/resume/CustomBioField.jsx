import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    IconButton
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

const CustomBioField = ({ label, value, onChange, name }) => {
    const [editable, setEditable] = useState(false);
    const [localValue, setLocalValue] = useState(value);

    const handleToggleEditable = () => {
        if (editable) {
            onChange(name, localValue);
        }
        setEditable(!editable);
    };

    const handleInputChange = (event) => {
        setLocalValue(event.target.value);
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            p: '10px',
            border: '1px solid',
            borderColor: editable ? 'grey.300' : 'transparent',
            borderRadius: '8px',
            bgcolor: editable ? 'background.paper' : 'white',
            overflow: 'hidden',
            height: '150px'
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography sx={{ minWidth: 100, fontWeight: 'medium', flexShrink: 0 }}>{label}</Typography>
                <IconButton
                    onClick={handleToggleEditable}
                    sx={{
                        padding: '0.25rem',
                        fontSize: '0.75rem',
                        borderRadius: '50%',
                        bgcolor: '#959bf7',
                        '&:hover': {
                            bgcolor: '#c1c5fb',
                        }
                    }}
                >
                    {editable ? <SaveIcon sx={{ fontSize: '1rem', color: 'white' }} /> : <EditIcon sx={{ fontSize: '1rem', color: 'white' }} />}
                </IconButton>
            </Box>
            {!editable ? (
                <Typography
                    sx={{
                        flexGrow: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        WebkitLineClamp: 3,
                        height: '100%',
                        overflowY: 'auto',
                        padding: '8px'
                    }}
                >
                    {value}
                </Typography>
            ) : (
                <TextField
                    multiline
                    rows={3}
                    value={localValue}
                    onChange={handleInputChange}
                    variant="outlined"
                    fullWidth
                    sx={{
                        flexGrow: 1,
                        border: 'none',
                        borderRadius: '4px',
                        padding: '8px',
                        fontSize: '1rem',
                        outline: 'none',
                        width: '100%',
                        height: '100%',
                        overflowY: 'auto',
                    }}
                />
            )}
        </Box>
    );
};

export default CustomBioField;