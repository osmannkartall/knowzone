import React, { useState } from 'react';
import { makeStyles, IconButton, Menu, MenuItem, Divider } from '@material-ui/core';
import MoreHoriz from '@material-ui/icons/MoreHoriz';
import uniqueId from 'lodash/uniqueId';
import { GRAY3, GRAY4, PRIMARY } from '../constants/colors';
import TagPicker from './TagPicker/TagPicker';
import POST_TYPES from '../constants/post-types';
import { convertDate, bufferToBase64 } from '../utils';

const useStyles = makeStyles((theme) => ({
  container: {
    border: `1px solid ${GRAY3}`,
    borderRadius: 4,
    marginBottom: theme.spacing(2),
  },
  postTopbar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: theme.spacing(2),
    alignItems: 'center',
  },
  postTypeContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    color: PRIMARY,
  },
  postTypeText: {
    fontWeight: 'bold',
    marginLeft: theme.spacing(1),
  },
  actionButton: {
    color: PRIMARY,
  },
  ownerTopbar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(2),
    alignItems: 'center',
  },
  ownerTitle: {
    fontSize: 16,
    alignSelf: 'center',
    fontWeight: '600',
  },
  postBodyContainer: {
    padding: theme.spacing(2),
  },
  description: {
    overflow: 'auto',
  },
  imageContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: theme.spacing(2),
    overflow: 'auto',
    maxWidth: 1000,
    [theme.breakpoints.down('sm')]: {
      display: 'block',
    },
  },
  links: {
    margin: 0,
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
    [theme.breakpoints.only('xs')]: {
      justifyContent: 'center',
    },
  },
  link: {
    marginTop: theme.spacing(1),
  },
  postBodySectionContent: {
    backgroundColor: GRAY4,
    borderRadius: 4,
    height: 'auto',
    maxHeight: 200,
    overflow: 'auto',
    padding: theme.spacing(2),
  },
  tagContainer: {
    padding: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      overflowX: 'auto',
    },
  },
}));

const PostBodySection = ({ title, children }) => {
  const classes = useStyles();

  return (
    <>
      <h3>{title}</h3>
      <div className={classes.postBodySectionContent}>
        {children}
      </div>
    </>
  );
};

const PostTopbar = ({ showType, editable, type, onClickUpdate, onClickDelete }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);

  const handleClose = () => setAnchorEl(null);

  return (
    showType ? (
      <>
        <div className={classes.postTopbar}>
          <div className={classes.postTypeContainer}>
            { POST_TYPES.get(type).icon }
            <div className={classes.postTypeText}>
              { POST_TYPES.get(type).name }
            </div>
          </div>
          {
            editable && (
              <div>
                <IconButton
                  aria-label="update post"
                  aria-controls="post-menu"
                  aria-haspopup="true"
                  onClick={handleMenu}
                  className={classes.actionButton}
                  style={{ width: 30, height: 30 }}
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
            )
          }
        </div>
        <Divider />
      </>
    ) : null
  );
};

const OwnerTopbar = ({ owner }) => {
  const classes = useStyles();

  return (
    <div className={classes.ownerTopbar}>
      <div className={classes.ownerTitle}>{owner}</div>
    </div>
  );
};

const Post = ({
  showType,
  editable,
  type,
  owner,
  content,
  onClickUpdate,
  onClickDelete,
}) => {
  const classes = useStyles();

  const lastModifiedDateInfo = `Last Modified ${convertDate(content.lastModifiedDate)}`;
  const insertDateInfo = `Created ${convertDate(content.insertDate)}`;

  return (
    <div className={classes.container}>
      <PostTopbar
        showType={showType}
        editable={editable}
        type={type}
        onClickUpdate={onClickUpdate}
        onClickDelete={onClickDelete}
      />
      <div className={classes.postBodyContainer}>
        <OwnerTopbar owner={owner.username} />
        <div className={classes.description}>{content.description}</div>
        {type === POST_TYPES.get('bugfix').value ? (
          <>
            <PostBodySection title="Error">
              <div>{content.error}</div>
            </PostBodySection>
            <PostBodySection title="Solution">
              <div>{content.solution}</div>
            </PostBodySection>
          </>
        ) : null}
        {Array.isArray(content.images) && content.images.length ? (
          <div className={classes.imageContainer}>
            {
              content.images.map((i) => (
                <img
                  key={i._id}
                  src={`data:${i.mime};base64,${bufferToBase64(i.content)}`}
                  width="300"
                  height="200"
                  alt={i.name ? i.name : 'image'}
                  style={{ borderRadius: 4, overflow: 'auto', marginRight: 10 }}
                />
              ))
            }
          </div>
        ) : null}
        {Array.isArray(content.links) && content.links.length ? (
          <PostBodySection title="Link">
            <ul className={classes.links}>
              {content.links.map((link) => (
                <li key={uniqueId()} className={classes.link}><a href={link}>{link}</a></li>
              ))}
            </ul>
          </PostBodySection>
        ) : null}
        <div className={classes.timeInfo}>
          {content.lastModifiedDate && <div>{lastModifiedDateInfo}</div>}
          <div>|</div>
          <div>{insertDateInfo}</div>
        </div>
      </div>
      <Divider />
      <div className={classes.tagContainer}>
        <TagPicker tags={content.topics} readOnly />
      </div>
    </div>
  );
};

export default Post;
