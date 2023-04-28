import { useState } from 'react';
import { Grid } from '@mui/material';
import { useLocation } from 'react-router-dom';
import Topbar from './Topbar';
import Sidebar from './Sidebar';
import MainContent from './MainContent';
import { FE_ROUTES } from '../../constants/routes';
import SideContent from './SideContent';
import ExploreSideContent from '../explore/ExploreSideContent';

function Dashboard({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleIsSidebarOpen = (value) => setIsSidebarOpen(value);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const location = useLocation();

  return (
    <Grid container>
      <Topbar toggleSidebar={toggleSidebar} />
      <div style={{ display: 'flex', width: '100%' }}>
        <Sidebar isSidebarOpen={isSidebarOpen} handleIsSidebarOpen={handleIsSidebarOpen} />
        <MainContent>{children}</MainContent>
        {location.pathname !== `/${FE_ROUTES.EXPLORE}` && (
          <SideContent><ExploreSideContent /></SideContent>
        )}
      </div>
    </Grid>
  );
}

export default Dashboard;
