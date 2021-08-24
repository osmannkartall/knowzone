import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MoreHoriz from '@material-ui/icons/MoreHoriz';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Grid from '@material-ui/core/Grid';
import { Divider } from '@material-ui/core';
import { GRAY3, GRAY4, PRIMARY } from '../constants/colors';
import TagPicker from '../common/TagPicker/TagPicker';
import POST_TYPES from '../constants/post-types';

const useStyles = makeStyles((theme) => ({
  gridContainer: {
    border: `1px solid ${GRAY3}`,
    borderRadius: 4,
  },
  container: {
    padding: theme.spacing(2),
  },
  tagContainer: {
    padding: theme.spacing(1),
  },
  postTopbar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(2),
  },
  postSectionContent: {
    backgroundColor: GRAY4,
    overflowY: 'auto',
    height: 'auto',
    maxHeight: '200px',
    padding: theme.spacing(2),
    borderRadius: 4,
  },
  owner: {
    fontSize: 16,
    alignSelf: 'center',
    fontWeight: '600',
  },
  description: {
    marginRight: theme.spacing(7),
  },
  link: {
    marginTop: theme.spacing(1),
  },
  actionBtn: {
    color: PRIMARY,
  },
  timeInfo: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    fontWeight: '100',
    fontSize: 14,
    '& > :nth-child(2)': {
      margin: theme.spacing(0, 2),
      fontSize: 10,
    },
  },
  imgContainer: {
    marginTop: theme.spacing(2),
    overflow: 'auto',
    maxWidth: 400,
  },
}));

const PostSection = ({ title, children }) => {
  const classes = useStyles();

  return (
    <>
      <h3>{title}</h3>
      <div className={classes.postSectionContent}>{children}</div>
    </>
  );
};

const PostTopbar = ({ editable, owner, onClickUpdate, onClickDelete }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);

  const handleClose = () => setAnchorEl(null);

  return (
    <div className={classes.postTopbar}>
      <div className={classes.owner}>{owner}</div>
      {editable ? (
        <div>
          <IconButton
            aria-label="update post"
            aria-controls="post-menu"
            aria-haspopup="true"
            onClick={handleMenu}
            className={classes.actionBtn}
          >
            <MoreHoriz />
          </IconButton>
          <Menu
            id="post-menu"
            anchorEl={anchorEl}
            keepMounted
            open={open}
            onClose={handleClose}
          >
            <MenuItem onClick={() => { onClickUpdate(); handleClose(); }}>Update</MenuItem>
            <MenuItem onClick={() => { onClickDelete(); handleClose(); }}>Delete</MenuItem>
          </Menu>
        </div>
      ) : null}
    </div>
  );
};

const Post = ({
  editable,
  type,
  owner,
  content,
  onClickUpdate,
  onClickDelete,
}) => {
  const classes = useStyles();
  const lastModifiedDateInfo = `Last Modified ${content.lastModifiedDate}`;
  const insertDateInfo = `Created ${content.insertDate}`;

  return (
    <Grid item xs={8}>
      <div className={classes.gridContainer}>
        <div className={classes.container}>
          <PostTopbar
            editable={editable}
            owner={owner.username}
            onClickUpdate={onClickUpdate}
            onClickDelete={onClickDelete}
          />
          <div className={classes.description}>{content.description}</div>
          {type === POST_TYPES.BUG_FIX.value ? (
            <>
              <PostSection title="Error">
                <div>{content.error}</div>
              </PostSection>
              <PostSection title="Solution">
                <div>{content.solution}</div>
              </PostSection>
            </>
          ) : null}
          {content.image && (
            <div className={classes.imgContainer}>
              <img
                src={content.image}
                width="400"
                height="300"
                alt="post"
                style={{ borderRadius: 4, overflow: 'auto' }}
              />
            </div>
          )}
          {content.links && content.links.length ? (
            <PostSection title="Link">
              <ul>
                {content.links.map((link) => (
                  <li key={link} className={classes.link}><a href={link}>{link}</a></li>
                ))}
              </ul>
            </PostSection>
          ) : null}
          <div className={classes.timeInfo}>
            {content.lastModifiedDate && <div>{lastModifiedDateInfo}</div>}
            <div>●</div>
            <div>{insertDateInfo}</div>
          </div>
        </div>
        <Divider />
        <div className={classes.tagContainer}>
          <TagPicker tags={content.topics} readOnly />
        </div>
      </div>
    </Grid>
  );
};

export default Post;
