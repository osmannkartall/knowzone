import { styled } from '@mui/material/styles';
import { topbarHeight } from '../../constants/styles';
import { GRAY3, WHITE } from '../../constants/colors';

const MainContentWrapperContainer = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
}));

const MainContentWrapperHeaderContainer = styled('div')(({ theme, $staticHeader }) => ({
  position: $staticHeader ? 'static' : 'sticky',
  top: topbarHeight,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1, 2),
  margin: theme.spacing(2, 0),
  marginTop: $staticHeader ? 0 : theme.spacing(2),
  border: `1px solid ${GRAY3}`,
  borderRadius: 4,
  backgroundColor: WHITE,
  zIndex: 100,
}));

function MainContentWrapper({ LeftHeader, RightHeader, children, staticHeader }) {
  return (
    <MainContentWrapperContainer>
      <MainContentWrapperHeaderContainer $staticHeader={staticHeader}>
        {LeftHeader}
        {RightHeader}
      </MainContentWrapperHeaderContainer>
      {children}
    </MainContentWrapperContainer>
  );
}

export default MainContentWrapper;
