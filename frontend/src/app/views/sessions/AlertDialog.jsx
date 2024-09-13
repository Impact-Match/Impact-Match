import React from "react";
import { Modal, Box, Typography, IconButton, Link } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { styled } from "@mui/system";

const StyledModalBox = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 580,
  backgroundColor: theme.palette.background.paper,
  boxShadow: 24,
  padding: theme.spacing(4, 4, 4),
  borderRadius: 10,
  display: 'flex',
  alignItems: 'center',
  gap: 10,
}));

const CloseButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: theme.spacing(1),
  top: theme.spacing(1),
}));

const ContentBox = styled(Box)(({ theme }) => ({
  flexGrow: 2,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  height: '100%',
}));

const AlertImage = styled('img')(({ theme }) => ({
  height: 80,
  width: 'auto',
  flexShrink: 0,
}));

export default function AlertDialog({ open, onClose }) {
  return (
      <Modal open={open} onClose={onClose}>
        <StyledModalBox>
          <AlertImage src="/assets/images/alert.png" alt="Alert" />
          <ContentBox>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#000000' }}>
              A server error has occurred
            </Typography>
            <Typography variant="h6" sx={{ color: '#757575' }}>
              Please contact us at <Link href="mailto:tech@thenovibox.com" sx={{ textDecoration: 'underline' }}>tech@thenovibox.com</Link>.
            </Typography>
          </ContentBox>
          <CloseButton onClick={onClose}>
            <CloseIcon sx={{ fontSize: 40 }}/>
          </CloseButton>
        </StyledModalBox>
      </Modal>
  );
}