import React from 'react';
import { Box, Chip, Paper, Stack, Typography } from '@mui/material';

export default function CandidateProfile({ responseData = {}, title = 'Candidate profile' }) {
    const candidate = responseData?.candidate || responseData?.data || responseData || {};
    const fullName = candidate.full_name || candidate.name || 'Candidate';
    const email = candidate.email || 'No email provided';
    const phone = candidate.phone_no || candidate.phone || 'No phone provided';
    const location = candidate.location || candidate.current_location || 'Location not provided';

    return (
        <Box sx={{ width: '100%', maxWidth: '100%', mt: { lg: 1, xl: 5 } }}>
            <Paper elevation={0} sx={{ p: { xs: 2, md: 3 }, borderRadius: 3, border: '1px solid #e0e0e0', bgcolor: '#fff' }}>
                <Stack spacing={1.5}>
                    <Typography variant="h6" fontWeight={700}>{fullName}</Typography>
                    <Typography variant="body2" color="text.secondary">{title}</Typography>
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1}>
                        <Chip label={email} size="small" />
                        <Chip label={phone} size="small" />
                    </Stack>
                    <Typography variant="body2">{location}</Typography>
                </Stack>
            </Paper>
        </Box>
    );
}