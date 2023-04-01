const express = require('express');

function addStaticServer() {
  return express.static(process.env.PUBLIC_UPLOAD_PATH);
}

module.exports = addStaticServer;
