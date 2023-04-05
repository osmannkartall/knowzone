import { useState } from 'react';
import { styled } from '@mui/material/styles';
import { IconButton, Menu, MenuItem, Divider } from '@mui/material';
import MoreHoriz from '@mui/icons-material/MoreHoriz';
import { GRAY3, GRAY4, PRIMARY } from '../../constants/colors';
import TagPicker from '../common/TagPicker/TagPicker';
import MarkdownPreview from '../common/MarkdownPreview';
import FORM_COMPONENT_TYPES from '../form/formComponentTypes';

const PREFIX = 'Post';

const classes = {
  container: `${PREFIX}-container`,
  postTopbar: `${PREFIX}-postTopbar`,
  postTypeContainer: `${PREFIX}-postTypeContainer`,
  postTypeText: `${PREFIX}-postTypeText`,
  actionButton: `${PREFIX}-actionButton`,
  ownerTopbar: `${PREFIX}-ownerTopbar`,
  ownerTitle: `${PREFIX}-ownerTitle`,
  postBodyContainer: `${PREFIX}-postBodyContainer`,
  text: `${PREFIX}-text`,
  imageContainer: `${PREFIX}-imageContainer`,
  list: `${PREFIX}-list`,
  timeInfo: `${PREFIX}-timeInfo`,
  listItem: `${PREFIX}-listItem`,
  postBodySectionContent: `${PREFIX}-postBodySectionContent`,
  tagContainer: `${PREFIX}-tagContainer`,
};

const Root = styled('div')(({ theme }) => ({
  [`& .${classes.container}`]: {
    border: `1px solid ${GRAY3}`,
    borderRadius: 4,
    marginBottom: theme.spacing(2),
  },

  [`& .${classes.postTopbar}`]: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: theme.spacing(2),
    alignItems: 'center',
  },

  [`& .${classes.postTypeContainer}`]: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    color: PRIMARY,
  },

  [`& .${classes.postTypeText}`]: {
    fontWeight: 'bold',
    marginLeft: theme.spacing(1),
  },

  [`& .${classes.actionButton}`]: {
    color: PRIMARY,
  },

  [`& .${classes.ownerTopbar}`]: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(2),
    alignItems: 'center',
  },

  [`& .${classes.ownerTitle}`]: {
    fontSize: 16,
    alignSelf: 'center',
    fontWeight: '600',
  },

  [`& .${classes.postBodyContainer}`]: {
    padding: theme.spacing(2),
  },

  [`& .${classes.text}`]: {
    whiteSpace: 'pre-wrap',
    overflow: 'auto',
  },

  [`& .${classes.imageContainer}`]: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: theme.spacing(2),
    overflow: 'auto',
    maxWidth: 1000,
    [theme.breakpoints.down('md')]: {
      display: 'block',
    },
  },

  [`& .${classes.list}`]: {
    margin: 0,
  },

  [`& .${classes.timeInfo}`]: {
    marginTop: theme.spacing(2),
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    fontWeight: '100',
    fontSize: 14,
    '& > :nth-of-type(2)': {
      margin: theme.spacing(0, 2),
      fontSize: 10,
    },
    [theme.breakpoints.only('xs')]: {
      justifyContent: 'center',
    },
  },

  [`& .${classes.listItem}`]: {
    marginTop: theme.spacing(1),
  },

  [`&.${classes.postBodySectionContent}`]: {
    backgroundColor: GRAY4,
    borderRadius: 4,
    height: 'auto',
    maxHeight: 500,
    overflow: 'auto',
    padding: theme.spacing(2),
  },

  [`& .${classes.tagContainer}`]: {
    padding: theme.spacing(2),
    [theme.breakpoints.down('md')]: {
      overflowX: 'auto',
    },
  },
}));

function convertDate(dateStr) {
  return new Date(dateStr).toLocaleString('en-GB');
}

function PostBodySection({ title, children }) {
  return (
    <>
      <h3>{title}</h3>
      <div className={classes.postBodySectionContent}>
        {children}
      </div>
    </>
  );
}

function TextPart({ value }) {
  return (
    <div className={classes.text}>{value}</div>
  );
}

function ListPart({ title, listItems }) {
  return (
    <PostBodySection title={title ?? 'List'}>
      <ul className={classes.list}>
        {(listItems ?? []).map((listItem) => (
          <li key={listItem} className={classes.listItem}>{listItem}</li>
        ))}
      </ul>
    </PostBodySection>
  );
}

function EditorPart({ title, text }) {
  return (
    <PostBodySection title={title}>
      <MarkdownPreview text={text} />
    </PostBodySection>
  );
}

function ImagePart({ images }) {
  return (
    <div className={classes.imageContainer}>
      {
        images.map((i) => (
          <img
            key={i.name}
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
}

function TopicsPart({ topics }) {
  return (
    <div className={classes.tagContainer}>
      <TagPicker tags={topics} readOnly />
    </div>
  );
}

function OwnerTopbar({ owner }) {
  return (
    <div className={classes.ownerTopbar}>
      <div className={classes.ownerTitle}>{owner}</div>
    </div>
  );
}

const DynamicPart = ({ post, content }) => Object.entries(post.content ?? {}).map(([k, v]) => {
  const { TEXT, LIST, EDITOR, IMAGE } = FORM_COMPONENT_TYPES;
  if (content?.[k] === TEXT) return <TextPart key={k} value={v} />;
  if (content?.[k] === LIST) return <ListPart key={k} title={k} listItems={v} />;
  if (content?.[k] === EDITOR) return <EditorPart key={k} title={k} text={v} />;
  if (content?.[k] === IMAGE) return <ImagePart key={k} images={v} />;
  return null;
});

function TimestampBar({ post }) {
  const updatedAtInfo = `Last Modified ${convertDate(post.updatedAt)}`;
  const createdAtInfo = `Created ${convertDate(post.createdAt)}`;

  return (
    <div className={classes.timeInfo}>
      {post.updatedAt && <div>{updatedAtInfo}</div>}
      <div>|</div>
      <div>{createdAtInfo}</div>
    </div>
  );
}

function PostTopbar({ showType, editable, type, onClickUpdate, onClickDelete }) {
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
                  size="large"
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
}

function PostBody({ owner, content, post }) {
  return (
    <div className={classes.postBodyContainer}>
      <OwnerTopbar owner={owner?.username} />
      <DynamicPart post={post} content={content} />
      <TimestampBar post={post} />
    </div>
  );
}

function Post({ showType, editable, content, post, onClickUpdate, onClickDelete }) {
  return (
    <Root>
      <div className={classes.container}>
        <PostTopbar
          showType={showType}
          editable={editable}
          type={post.type}
          onClickUpdate={onClickUpdate}
          onClickDelete={onClickDelete}
        />
        <PostBody owner={post.owner} content={content} post={post} />
        <Divider />
        <TopicsPart topics={post.topics ?? []} />
      </div>
    </Root>
  );
}

export default Post;
