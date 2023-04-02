import { IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { toast } from 'react-toastify';
import uniqueId from 'lodash/uniqueId';
import { GRAY2, GRAY3, GRAY4, IRREVERSIBLE_ACTION, PRIMARY, WHITE } from '../../constants/colors';

const NUM_MAX_FILES = 2;
const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1 MB

const THUMBNAIL_WIDTH = 300;
const THUMBNAIL_HEIGHT = 300;
const THUMBNAIL_BUTTON_SIZE = 40;
const THUMBNAIL_SMALL_BUTTON_SIZE = 30;

const PREFIX = 'FileUploader';

const classes = {
  container: `${PREFIX}-container`,
  thumbnailsContainer: `${PREFIX}-thumbnailsContainer`,
  thumbnails: `${PREFIX}-thumbnails`,
  thumbnail: `${PREFIX}-thumbnail`,
  imageContainer: `${PREFIX}-imageContainer`,
  image: `${PREFIX}-image`,
  thumbnailDeleteButton: `${PREFIX}-thumbnailDeleteButton`,
  closeIcon: `${PREFIX}-closeIcon`,
};

const Root = styled('section')(({ theme }) => ({
  [`&.${classes.container}`]: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },

  [`& .${classes.thumbnailsContainer}`]: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },

  [`& .${classes.thumbnails}`]: {
    display: 'flex',
    flexDirection: 'column',
    marginRight: theme.spacing(4),
    [theme.breakpoints.down('md')]: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  },

  [`& .${classes.thumbnail}`]: {
    display: 'inline-flex',
    borderRadius: 2,
    border: `1px solid ${GRAY3}`,
    width: THUMBNAIL_WIDTH,
    height: THUMBNAIL_HEIGHT,
    boxSizing: 'border-box',
    position: 'relative',
    '&:hover $thumbnailDeleteButton': {
      display: 'flex',
    },
    '&:hover $image': {
      opacity: 0.4,
    },
    [theme.breakpoints.down('md')]: {
      width: THUMBNAIL_WIDTH / 2,
      height: THUMBNAIL_HEIGHT / 2,
    },
  },

  [`& .${classes.imageContainer}`]: {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden',
  },

  [`& .${classes.image}`]: {
    display: 'block',
    width: 'auto',
    height: '100%',
    opacity: 0.6,
    '&:hover': {
      opacity: 1,
      transition: 'opacity .2s ease-in-out',
    },
  },

  [`& .${classes.thumbnailDeleteButton}`]: {
    position: 'absolute',
    top: 10,
    right: 10,
    color: WHITE,
    width: THUMBNAIL_BUTTON_SIZE,
    height: THUMBNAIL_BUTTON_SIZE,
    backgroundColor: IRREVERSIBLE_ACTION,
    opacity: 1,
    [theme.breakpoints.down('md')]: {
      width: THUMBNAIL_SMALL_BUTTON_SIZE,
      height: THUMBNAIL_SMALL_BUTTON_SIZE,
    },
  },

  [`& .${classes.closeIcon}`]: {
    width: THUMBNAIL_BUTTON_SIZE,
    height: THUMBNAIL_BUTTON_SIZE,
    [theme.breakpoints.down('md')]: {
      width: THUMBNAIL_SMALL_BUTTON_SIZE,
      height: THUMBNAIL_SMALL_BUTTON_SIZE,
    },
  },
}));

const activeStyle = { borderColor: PRIMARY };
const acceptStyle = { borderColor: PRIMARY };
const rejectStyle = { borderColor: IRREVERSIBLE_ACTION };

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: GRAY3,
  borderStyle: 'dashed',
  backgroundColor: GRAY4,
  color: GRAY2,
  outline: 'none',
  transition: 'border .24s ease-in-out',
};

const getImageSource = (file) => {
  if (file.preview) {
    return file.preview;
  }
  return `${process.env.REACT_APP_KNOWZONE_BE_URI}/${file.path}`;
};

function Image({ file }) {
  const imageSource = getImageSource(file);

  return (
    <div className={classes.imageContainer}>
      <img src={imageSource} className={classes.image} alt={file.name} />
    </div>
  );
}

function FileUploader({ files, setFiles }) {
  const infoTitle = 'Drag n drop some images here, or click to select';
  const infoSubtitle = `(You can select ${NUM_MAX_FILES} files and the maximum size of a single file is 1 MB)`;

  const hasAvailableSpace = (acceptedFiles) => (
    Array.isArray(acceptedFiles)
    && Array.isArray(files)
    && acceptedFiles.length + files.length <= NUM_MAX_FILES
  );

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: { 'image/*': [] },
    onDrop: (acceptedFiles) => {
      if (hasAvailableSpace(acceptedFiles)) {
        const newFiles = acceptedFiles.map((file) => Object.assign(file, {
          preview: URL.createObjectURL(file),
          _id: uniqueId(),
        }));
        setFiles([...files, ...newFiles]);
      } else {
        toast.error('Too many files');
      }
    },
    maxFiles: NUM_MAX_FILES,
    maxSize: MAX_FILE_SIZE,
    onDropRejected: (uploadedFiles) => {
      toast.error(uploadedFiles[0].errors[0].message);
    },
  });

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isDragActive ? activeStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {}),
  }), [
    isDragActive,
    isDragReject,
    isDragAccept,
  ]);

  const onClickDelete = (file) => {
    const newFiles = [...files];
    const index = files.indexOf(file);

    if (index !== -1) {
      newFiles.splice(index, 1);
      setFiles(newFiles);
    }
  };

  return (
    <Root className={classes.container}>
      {Array.isArray(files) && files.length < NUM_MAX_FILES ? (
        <div {...getRootProps({ style })}>
          <input id="images" {...getInputProps()} />
          <CloudUploadIcon />
          <p>{infoTitle}</p>
          <em>{infoSubtitle}</em>
        </div>
      ) : null}
      <aside className={classes.thumbnailsContainer}>
        {files.map((file) => (
          <div className={classes.thumbnails} key={file._id ?? file.name}>
            <div className={classes.thumbnail}>
              <Image file={file} />
              <IconButton
                className={classes.thumbnailDeleteButton}
                onClick={() => onClickDelete(file)}
                size="large"
              >
                <CloseIcon className={classes.closeIcon} />
              </IconButton>
            </div>
          </div>
        ))}
      </aside>
    </Root>
  );
}

export default FileUploader;
