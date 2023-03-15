import { useState } from 'react';
import { makeStyles, IconButton, Menu, MenuItem, Divider } from '@material-ui/core';
import MoreHoriz from '@material-ui/icons/MoreHoriz';
import { GRAY3, GRAY4, PRIMARY } from '../../constants/colors';
import TagPicker from '../common/TagPicker/TagPicker';
import { convertDate } from '../../utils';
import MarkdownPreview from '../common/MarkdownPreview';
import FORM_COMPONENT_TYPES from '../../constants/form-components-types';

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
  text: {
    whiteSpace: 'pre-wrap',
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
  list: {
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
  listItem: {
    marginTop: theme.spacing(1),
  },
  postBodySectionContent: {
    backgroundColor: GRAY4,
    borderRadius: 4,
    height: 'auto',
    maxHeight: 500,
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

const TextPart = ({ value }) => {
  const classes = useStyles();

  return (
    <div className={classes.text}>{value}</div>
  );
};

const ListPart = ({ title, listItems }) => {
  const classes = useStyles();

  return (
    <PostBodySection title={title ?? 'List'}>
      <ul className={classes.list}>
        {listItems.map((listItem) => (
          <li key={listItem} className={classes.listItem}>{listItem}</li>
        ))}
      </ul>
    </PostBodySection>
  );
};

const EditorPart = ({ title, text }) => (
  <PostBodySection title={title}>
    <MarkdownPreview text={text} />
  </PostBodySection>
);

const ImagePart = ({ images }) => {
  const classes = useStyles();

  return (
    <div className={classes.imageContainer}>
      {
        images.map((i) => (
          <img
            key={i._id}
            src={`${process.env.REACT_APP_KNOWZONE_BE_URI}/${i.path}`}
            width="300"
            height="200"
            alt={i.name ? i.name : 'image'}
            style={{ borderRadius: 4, overflow: 'auto', marginRight: 10 }}
          />
        ))
      }
    </div>
  );
};

const TopicsPart = ({ topics }) => {
  const classes = useStyles();

  return (
    <div className={classes.tagContainer}>
      <TagPicker tags={topics} readOnly />
    </div>
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

const DynamicPart = ({ post, fields }) => Object.entries(post.content ?? {}).map(([k, v]) => {
  if (fields?.[k] === FORM_COMPONENT_TYPES.TEXT) return <TextPart key={k} value={v} />;
  if (fields?.[k] === FORM_COMPONENT_TYPES.LIST) return <ListPart key={k} title={k} listItems={v} />;
  if (fields?.[k] === FORM_COMPONENT_TYPES.EDITOR) return <EditorPart key={k} title={k} text={v} />;
  if (fields?.[k] === FORM_COMPONENT_TYPES.IMAGE) return <ImagePart key={k} images={v} />;
  return null;
});

const TimestampBar = ({ post }) => {
  const classes = useStyles();

  const updatedAtInfo = `Last Modified ${convertDate(post.updatedAt)}`;
  const createdAtInfo = `Created ${convertDate(post.createdAt)}`;

  return (
    <div className={classes.timeInfo}>
      {post.updatedAt && <div>{updatedAtInfo}</div>}
      <div>|</div>
      <div>{createdAtInfo}</div>
    </div>
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
            <div className={classes.postTypeText}>
              { type }
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

const PostBody = ({ owner, fields, post }) => {
  const classes = useStyles();

  return (
    <div className={classes.postBodyContainer}>
      <OwnerTopbar owner={owner?.username} />
      <DynamicPart post={post} fields={fields} />
      <TimestampBar post={post} />
    </div>
  );
};

const Post = ({ showType, editable, fields, post, onClickUpdate, onClickDelete }) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <PostTopbar
        showType={showType}
        editable={editable}
        type={post.type}
        onClickUpdate={onClickUpdate}
        onClickDelete={onClickDelete}
      />
      <PostBody owner={post.owner} fields={fields} post={post} />
      <Divider />
      <TopicsPart topics={post.topics ?? []} />
    </div>
  );
};

export default Post;
