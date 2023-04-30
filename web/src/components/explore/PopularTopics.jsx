import { useEffect, useState } from 'react';
import TopicChips from '../common/TopicChips';
import getPopularTopics from '../../api/search/getPopularTopics';
import STYLES from '../../constants/styles';

function PopularTopics() {
  const [popularTopics, setPopularTopics] = useState([]);

  useEffect(() => {
    let mounted = true;

    async function fetchPopularTopics() {
      if (mounted) {
        setPopularTopics(await getPopularTopics());
      }
    }

    fetchPopularTopics();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <div style={{ fontWeight: 'bold', fontSize: 18 }}>Popular Topics</div>
      <div style={{ margin: `${STYLES.MUI_SPACING_UNIT}px 0px` }}>
        <TopicChips chips={(popularTopics ?? []).map((pT) => pT.topic)} />
      </div>
    </>
  );
}

export default PopularTopics;
