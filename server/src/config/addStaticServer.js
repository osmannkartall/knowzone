import express from 'express';

function addStaticServer() {
  return express.static(process.env.PUBLIC_UPLOAD_PATH);
}

export default addStaticServer;
