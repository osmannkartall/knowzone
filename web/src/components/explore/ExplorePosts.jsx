import PostAddIcon from '@mui/icons-material/PostAdd';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import { useState } from 'react';
import { BE_ROUTES } from '../../constants/routes';
import usePagination from '../../hooks/usePagination';
import Posts from '../post/Posts';

function ExplorePosts() {
  const [selectedDateRange, setSelectedDateRange] = useState('weekly');

  const { data, getNextPage, status, errorMessage } = usePagination({
    url: `${process.env.REACT_APP_KNOWZONE_BE_URI}/${BE_ROUTES.EXPLORE_POSTS}`,
    method: 'GET',
    queryParameters: { since: selectedDateRange },
  });

  const { forms, posts } = data ?? {};

  const handleSelectedDateRange = (e) => setSelectedDateRange(e.target.value);

  return (
    <Posts
      errorMessage={errorMessage}
      forms={forms}
      getNextPage={getNextPage}
      LeftHeader={(
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <PostAddIcon sx={{ fontSize: 40 }} />
          <h2>Latest Posts</h2>
        </div>
      )}
      posts={posts}
      RightHeader={(
        <FormControl sx={{ minWidth: 200 }} size="small">
          <InputLabel id="date-range-select-label">Date Range</InputLabel>
          <Select
            labelId="date-range-select-label"
            id="date-range-select"
            value={selectedDateRange}
            label="Date Range"
            onChange={handleSelectedDateRange}
          >
            <MenuItem value="daily">Today</MenuItem>
            <MenuItem value="weekly">This Week</MenuItem>
            <MenuItem value="monthly">This Month</MenuItem>
          </Select>
        </FormControl>
      )}
      staticHeader
      status={status}
    />
  );
}

export default ExplorePosts;
