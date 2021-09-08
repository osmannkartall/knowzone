import React from 'react';
import { Grid } from '@material-ui/core';

const ContentWrapper = ({ title, children }) => (
  <div style={{ flexGrow: 1 }}>
    <h2>{title}</h2>
    <Grid container spacing={3}>
      {children}
    </Grid>
  </div>
);

export default ContentWrapper;
