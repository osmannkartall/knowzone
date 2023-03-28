import { useState } from 'react';
import { Grid } from '@mui/material';
import Topbar from './Topbar';
import Sidebar from './Sidebar';
import Content from './Content';

function Dashboard({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const openSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <Grid container>
      <Topbar openSidebar={openSidebar} />
      <Sidebar isSidebarOpen={isSidebarOpen} />
      <Content isSidebarOpen={isSidebarOpen}>
        {children}
      </Content>
    </Grid>
  );
}

export default Dashboard;
