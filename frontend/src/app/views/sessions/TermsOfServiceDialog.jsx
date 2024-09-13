import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Link } from '@mui/material';

const TermsOfServiceDialog = ({ open, onClose, onAgree, onDisagree }) => {
    const [selected, setSelected] = useState(null);

    const handleAgree = () => {
        setSelected('agree');
        onAgree();
    };

    const handleDisagree = () => {
        setSelected('disagree');
        onDisagree();
    };

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Terms of Service</DialogTitle>
            <DialogContent>
                <Box mb={3}>
                    <Typography variant="h5" gutterBottom>Welcome to NOVI BOX!</Typography>
                    <Typography variant="body1" gutterBottom>
                        We're excited to have you on board with our Influencer Tracking System ("the System"). By accessing or using the System, you agree to comply with and be bound by the following terms and conditions ("Terms of Service"). Please review the following terms carefully. If you do not agree to these terms, you should not use the System.
                    </Typography>
                </Box>
                <Box mb={2}>
                    <Typography variant="h6" gutterBottom>1. Acceptance of Agreement</Typography>
                    <Typography variant="body2" gutterBottom>
                        You agree to the terms and conditions outlined in this Terms of Service Agreement ("Agreement") with respect to the System. This Agreement constitutes the entire and only agreement between us and you, and supersedes all prior or contemporaneous agreements, representations, warranties, and understandings with respect to the System, the content, products, or services provided by or through the System, and the subject matter of this Agreement. We may amend this Agreement at any time without specific notice to you. The latest Agreement will be posted on the System, and you should review this Agreement prior to using the System.
                    </Typography>
                </Box>
                <Box mb={2}>
                    <Typography variant="h6" gutterBottom>2. Personal Information</Typography>
                    <Typography variant="body2" gutterBottom>
                        As part of the registration process, users will be required to provide personal information. By registering, you agree that all information provided is accurate, current, and complete. You are responsible for maintaining the confidentiality of your account and password and for restricting access to your computer, and you agree to accept responsibility for all activities that occur under your account or password.
                    </Typography>
                </Box>
                <Box mb={2}>
                    <Typography variant="h6" gutterBottom>3. Privacy</Typography>
                    <Typography variant="body2" gutterBottom>
                        We are committed to protecting your privacy. All personal information collected from users will be kept confidential and will not be shared with any third parties without your consent, except as required by law. Our complete Privacy Policy is available [here].
                    </Typography>
                </Box>
                <Box mb={2}>
                    <Typography variant="h6" gutterBottom>4. Transparency of Sales Data</Typography>
                    <Typography variant="body2" gutterBottom>
                        We ensure that all sales data provided through the System is transparent and accurate. We do not alter any sales data. All data is presented as received from the respective platforms and sources.
                    </Typography>
                </Box>
                <Box mb={2}>
                    <Typography variant="h6" gutterBottom>5. Use of System</Typography>
                    <Typography variant="body2" gutterBottom>
                        You are granted a non-exclusive, non-transferable, revocable license to access and use the System strictly in accordance with this Agreement. As a condition of your use of the System, you warrant to us that you will not use the System for any purpose that is unlawful or prohibited by these terms, conditions, and notices. You may not use the System in any manner which could damage, disable, overburden, or impair the System or interfere with any other party's use and enjoyment of the System.
                    </Typography>
                </Box>
                <Box mb={2}>
                    <Typography variant="h6" gutterBottom>6. Intellectual Property</Typography>
                    <Typography variant="body2" gutterBottom>
                        The content, organization, graphics, design, compilation, magnetic translation, digital conversion, and other matters related to the System are protected under applicable copyrights, trademarks, and other proprietary rights. The copying, redistribution, use, or publication by you of any such matters or any part of the System, except as allowed by Section 5, is strictly prohibited. You do not acquire ownership rights to any content, document, or other materials viewed through the System.
                    </Typography>
                </Box>
                <Box mb={2}>
                    <Typography variant="h6" gutterBottom>7. Limitation of Liability</Typography>
                    <Typography variant="body2" gutterBottom>
                        You agree that under no circumstances, including, but not limited to, negligence, shall we be liable for any direct, indirect, incidental, special, or consequential damages that result from the use of, or the inability to use, the System, including our messaging, blogs, comments of others, books, emails, products, or services, or third-party materials, products, or services made available through the System.
                    </Typography>
                </Box>
                <Box mb={2}>
                    <Typography variant="h6" gutterBottom>8. Governing Law</Typography>
                    <Typography variant="body2" gutterBottom>
                        This Agreement shall be governed by and construed in accordance with the laws of the State of New York, without regard to its conflict of law rules. You expressly agree that the exclusive jurisdiction for any claim or dispute under this Agreement and or your use of the System resides in the courts located in New York, and you hereby consent to the personal jurisdiction of such courts.
                    </Typography>
                </Box>
                <Box mb={2}>
                    <Typography variant="h6" gutterBottom>9. Changes to Terms</Typography>
                    <Typography variant="body2" gutterBottom>
                        We reserve the right, in our sole discretion, to change the Terms under which the System is offered. The most current version of the Terms will supersede all previous versions. We encourage you to periodically review the Terms to stay informed of our updates.
                    </Typography>
                </Box>
                <Box mb={2}>
                    <Typography variant="h6" gutterBottom>10. Contact Us</Typography>
                    <Typography variant="body2" gutterBottom>
                        If you have any questions about these Terms, please contact us at:
                        <Link href="mailto:affiliate@thenovibox.com" color="primary">
                            affiliate@thenovibox.com
                        </Link>
                        . By using the System, you acknowledge that you have read these terms of service and agree to be bound by them.
                    </Typography>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleDisagree} color={selected === 'disagree' ? "primary" : "inherit"}>
                    Disagree
                </Button>
                <Button onClick={handleAgree} color={selected === 'agree' ? "primary" : "inherit"}>
                    Agree
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TermsOfServiceDialog;