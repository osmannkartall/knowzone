import { Button, makeStyles } from '@material-ui/core';
import React, { useEffect, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import CloudUpload from '@material-ui/icons/CloudUpload';
import { GRAY2, GRAY3, GRAY4, PRIMARY } from '../constants/colors';

const NUM_MAX_FILES = 2;
const MAX_FILES_SIZE = 1 * 1024 * 1024; // 1 MB
const ACCEPTED_TYPES = 'image/jpeg, image/png, image/gif'; // 'image/*' to allow all image sub types

const THUMB_WIDTH = 300;
const THUMB_HEIGHT = 300;
const activeStyle = { borderColor: '#2196f3' };
const acceptStyle = { borderColor: PRIMARY };
const rejectStyle = { borderColor: '#ff1744' };

const useStyles = makeStyles((theme) => ({
  thumb: {
    display: 'inline-flex',
    borderRadius: 2,
    border: `1px solid ${GRAY3}`,
    width: THUMB_WIDTH,
    height: THUMB_HEIGHT,
    padding: 4,
    boxSizing: 'border-box',
  },
  thumbBtn: {
    width: THUMB_WIDTH,
    margin: theme.spacing(1, 0),
    opacity: 0.5,
    '&:hover': {
      opacity: 1,
    },
    alignSelf: 'center',
  },
  img: {
    display: 'block',
    width: 'auto',
    height: '100%',
  },
  thumbsContainer: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    marginTop: theme.spacing(1),
  },
  thumbInner: {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden',
  },
  thumbOuter: {
    display: 'flex',
    flexDirection: 'column',
    marginRight: theme.spacing(4),
  },
}));

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
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

const FileUploader = ({ files, setFiles }) => {
  const classes = useStyles();
  const infoTitle = 'Drag n drop some images here, or click to select';
  const infoSubtitle = `(Maximum ${NUM_MAX_FILES} files)`;

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: ACCEPTED_TYPES,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles && acceptedFiles.length) {
        setFiles(acceptedFiles.map((file) => Object.assign(file, {
          preview: URL.createObjectURL(file),
        })));
      }
    },
    maxFiles: NUM_MAX_FILES,
    maxSize: MAX_FILES_SIZE,
    onDropRejected: (uploadedFiles) => {
      if (uploadedFiles && uploadedFiles.length > NUM_MAX_FILES)
        alert(`You cannot upload more than ${NUM_MAX_FILES} files.`);
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

  const thumbs = files.map((file) => (
    <div className={classes.thumbOuter} key={file.name}>
      <div className={classes.thumb}>
        <div className={classes.thumbInner}>
          <img
            src={file.preview}
            className={classes.img}
            alt="img"
          />
        </div>
      </div>
      <Button
        className={classes.thumbBtn}
        variant="contained"
        color="primary"
        onClick={() => onClickDelete(file)}
      >
        Delete
      </Button>
    </div>
  ));

  useEffect(() => {
    let mounted = true;

    if (mounted)
      files.forEach((file) => URL.revokeObjectURL(file.preview));

    return function cleanup() {
      mounted = false;
    };
  }, [files]);

  return (
    <section className="container">
      {files && files.length < NUM_MAX_FILES ? (
        <div {...getRootProps({ style })}>
          <input {...getInputProps()} />
          <CloudUpload />
          <p>{infoTitle}</p>
          <em>{infoSubtitle}</em>
        </div>
      ) : null}
      <aside className={classes.thumbsContainer}>
        {thumbs}
      </aside>
    </section>
  );
};

export default FileUploader;
