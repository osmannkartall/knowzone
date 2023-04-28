import { styled } from '@mui/material/styles';
import { useState } from 'react';
import ExplorePosts from '../components/explore/ExplorePosts';
import ReadOnlyChips from '../components/common/ReadOnlyChips';
import PopularTopics from '../components/explore/PopularTopics';
import { topbarHeight } from '../constants/styles';
import { WHITE } from '../constants/colors';

const ExploreChips = styled('div')(({ theme }) => ({
  position: 'sticky',
  top: topbarHeight + 1,
  zIndex: 1,
  padding: theme.spacing(2),
  backgroundColor: WHITE,
}));

const PopularTopicsWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
}));

const exploreItems = [
  { name: 'Posts', component: <ExplorePosts /> },
  { name: 'Topics', component: <PopularTopicsWrapper><PopularTopics /></PopularTopicsWrapper> },
];

function Explore() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleChange = (event, index) => setSelectedIndex(index);

  return (
    <div>
      <ExploreChips>
        <ReadOnlyChips
          chips={exploreItems.map((eI) => eI.name)}
          onClick={handleChange}
          selectedIndex={selectedIndex}
        />
      </ExploreChips>
      {exploreItems.map((eI, i) => selectedIndex === i && <div key={eI.name}>{eI.component}</div>)}
    </div>
  );
}

export default Explore;
