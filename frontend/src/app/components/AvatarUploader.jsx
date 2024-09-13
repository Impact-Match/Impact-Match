import React, { useState, useRef, useEffect } from 'react';
import {
    Button,
    Box,
    Modal,
    Slider,
    Typography,
    IconButton
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import AvatarEditor from 'react-avatar-editor';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
};

const closeButtonStyle = {
    position: 'absolute',
    top: '8px',
    right: '8px',
};

const AvatarUploader = ({ imagePreview, setImagePreview, handleFileChange }) => {
    const [editorOpen, setEditorOpen] = useState(false);
    const [editorImage, setEditorImage] = useState(null);
    const [scale, setScale] = useState(1.2);
    const editorRef = useRef(null);
    const [error, setError] = useState('');

    const handleCrop = () => {
        if (editorRef.current) {
            const canvasScaled = editorRef.current.getImageScaledToCanvas().toDataURL();
            setImagePreview(canvasScaled);
            handleFileChange(canvasScaled); // Pass the base64 string to the parent component
            setEditorOpen(false);
        }
    };

    const handleCloseEditor = () => {
        setEditorOpen(false);
    };

    const handleScaleChange = (event, newValue) => {
        setScale(newValue);
    };

    const onFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const validImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!validImageTypes.includes(file.type)) {
                setError('Invalid file type. Please select an image file.');
                return;
            }
            setError('');
            const reader = new FileReader();
            reader.onload = () => {
                setEditorImage(reader.result);
                setEditorOpen(true);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center">
            <div style={{ borderRadius: '50%', overflow: 'hidden', width: 120, height: 120 }}>
                {imagePreview ? (
                    <img src={imagePreview} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    <img src="/assets/images/illustrations/user.png" alt="upgrade" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
            </div>
            {error && <Typography color="error">{error}</Typography>}
            <Button
                variant="contained"
                component="label"
                style={{
                    backgroundColor: '#ffffff',
                    color: '#5c5bfb',
                    borderRadius: 25,
                    textTransform: 'none',
                    fontWeight: 'bold',
                    fontSize: 16,
                    marginTop: '15px',
                    minWidth: '60px',
                    border: '2px solid #5c5bfb',
                    boxShadow: 'none',
                }}
            >
                Upload
                <input type="file" hidden onChange={onFileChange} />
            </Button>

            <Modal
                open={editorOpen}
                onClose={handleCloseEditor}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={modalStyle}>
                    <IconButton onClick={handleCloseEditor} sx={closeButtonStyle}>
                        <CloseIcon />
                    </IconButton>
                    {editorImage && (
                        <AvatarEditor
                            ref={editorRef}
                            image={editorImage}
                            width={250}
                            height={250}
                            border={50}
                            borderRadius={125}
                            color={[255, 255, 255, 0.6]} // RGBA
                            scale={scale}
                            rotate={0}
                        />
                    )}
                    <Slider
                        value={scale}
                        min={1}
                        max={2}
                        step={0.01}
                        aria-labelledby="zoom-slider"
                        onChange={handleScaleChange}
                        sx={{ mt: 2, width: '80%' }}
                    />
                    <Button variant="contained" color="primary" onClick={handleCrop} sx={{ mt: 2 }}>
                        Save
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
};

export default AvatarUploader;