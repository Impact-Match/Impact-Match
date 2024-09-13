import React from 'react';
import {
    Box,
    Typography,
    IconButton
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';

const EditableField = ({ label, value, onChange, editable, toggleEditable, name, showEditIcon = true }) => {
    const handleInputChange = (event) => {
        onChange(name, event.target.value);
    };

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            p: '10px',
            border: '1px solid',
            borderColor: editable ? 'grey.300' : 'transparent',
            borderRadius: '8px',
            bgcolor: editable ? 'background.paper' : 'white',
            overflow: 'hidden'
        }}>
            <Typography sx={{ minWidth: 30, fontWeight: 'medium', flexShrink: 0, paddingRight: '0px' }}>{label}</Typography>
            {!editable ? (
                <Typography
                    sx={{
                        flexGrow: 1,
                        cursor: 'pointer',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        border: '1px solid transparent',
                        padding: '8px'
                    }}
                    onClick={showEditIcon ? () => toggleEditable(name) : undefined}  // Only clickable if edit icon is allowed
                >
                    {value}
                </Typography>
            ) : (
                <input
                    type="text"
                    value={value}
                    onChange={handleInputChange}
                    onBlur={() => toggleEditable(name)}
                    autoFocus
                    style={{
                        flexGrow: 1,
                        border: 'none',
                        borderRadius: '4px',
                        padding: '8px',
                        fontSize: '1rem',
                        outline: 'none',
                        width: '100%'
                    }}
                />
            )}
            {showEditIcon && !editable && (
                <IconButton
                    onClick={() => toggleEditable(name)}
                    sx={{
                        marginLeft: 'auto',
                        padding: '0.15rem',
                        fontSize: '0.85rem',
                        borderRadius: '50%',
                        bgcolor: '#959bf7',
                        '&:hover': {
                            bgcolor: '#c1c5fb',
                        }
                    }}
                >
                    <EditIcon sx={{ fontSize: '0.75rem', color: 'white' }} />
                </IconButton>
            )}
        </Box>
    );
};

export default EditableField;