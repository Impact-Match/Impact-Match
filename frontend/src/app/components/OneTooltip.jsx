import React from 'react';
import { Tooltip, Typography } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

const OneTooltip = ({ title }) => (
    <Tooltip
        title={<Typography variant="body2" style={{ color: "gray" }}>{title}</Typography>}
        placement="right"
        arrow
        PopperProps={{
            modifiers: [
                {
                    name: 'offset',
                    options: {
                        offset: [0, 8],
                    },
                },
            ],
        }}
        componentsProps={{
            tooltip: {
                sx: {
                    backgroundColor: '#E7EAFF',
                    fontSize: '1rem',
                },
            },
            arrow: {
                sx: {
                    color: '#E7EAFF',
                },
            },
        }}
    >
        <InfoIcon style={{ color: "#9d9d9d", marginLeft: 6, fontSize: '18px'}} />
    </Tooltip>
);

export default OneTooltip;
