import React, { FC, ReactElement } from 'react';
import { Avatar, Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';

interface IProfile {
  name?: string;
}

const StyledAvatar = styled(Avatar)`
  ${({ theme }) => `
  cursor: pointer;
  transition: ${theme.transitions.create(['background-color', 'transform'], {
    duration: theme.transitions.duration.standard,
  })};
  &:hover {
    background-color: ${theme.palette.primary.light};
    transform: scale(1.2);
  }
  `}
`;

export const Profile: FC<IProfile> = (props): ReactElement => {
  // Destructure Props
  const { name = 'Tanner' } = props;
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <StyledAvatar
        sx={{
          width: '96px',
          height: '96px',
          backgroundColor: 'primary.main',
          marginBottom: '16px',
        }}
      >
        <Typography variant="h4" color="text.primary">
          {`${name.at(0)}`}
        </Typography>
      </StyledAvatar>
      <Typography variant="h6" color="text.primary" fontWeight="600">
        {`Welcome, ${name}`}
      </Typography>
      <Typography variant="body1" color="text.primary" fontWeight="300">
        This is your personal tasks manager
      </Typography>
    </Box>
  );
};

Profile.propTypes = {
  name: PropTypes.string,
};
