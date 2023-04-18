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
      <div style={{ display: 'flex', width: '100%' }}>
        <Sidebar isSidebarOpen={isSidebarOpen} />
        <Content isSidebarOpen={isSidebarOpen}>
          {children}
        </Content>
      </div>
    </Grid>
  );
}

export default Dashboard;
