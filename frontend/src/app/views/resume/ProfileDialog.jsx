import React from 'react';
import {
    Box,
    Dialog,
    DialogTitle,
    Typography,
    IconButton,
    styled,
    Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { MatxLoading, StyleDialog } from "../../components";
import UserProfile from '../resume/UserProfile';

const CustomDialogTitle = styled(DialogTitle)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: theme.spacing(2),
}));

const ProfileDialog = ({ open, onClose, influencer, loading }) => {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <CustomDialogTitle>
                <Typography variant="h6">Profile</Typography>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </CustomDialogTitle>
            <Divider />
            <StyleDialog>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                        <MatxLoading />
                    </Box>
                ) : (
                    influencer && <UserProfile influencer={influencer} />
                )}
            </StyleDialog>
        </Dialog>
    );
};

export default ProfileDialog;