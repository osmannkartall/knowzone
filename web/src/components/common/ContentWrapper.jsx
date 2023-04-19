import { styled } from '@mui/material/styles';
import { topbarHeight } from '../../constants/styles';
import { GRAY3, WHITE } from '../../constants/colors';

const ContentWrapperContainer = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
}));

const ContentWrapperHeaderContainer = styled('div')(({ theme }) => ({
  position: 'sticky',
  top: topbarHeight,
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: theme.spacing(1, 2),
  margin: theme.spacing(2, 0),
  border: `1px solid ${GRAY3}`,
  borderRadius: 4,
  backgroundColor: WHITE,
  zIndex: 100,
}));

function ContentWrapper({ LeftHeader, RightHeader, children }) {
  return (
    <ContentWrapperContainer>
      <ContentWrapperHeaderContainer>
        {LeftHeader}
        {RightHeader}
      </ContentWrapperHeaderContainer>
      {children}
    </ContentWrapperContainer>
  );
}

export default ContentWrapper;
