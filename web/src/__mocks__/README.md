# `__mocks__`

## Problematic packages

Jest gives error when testing components that uses the packages below:

```
react-markdown.jsx
remark-gfm.js
react-syntax-highlighter/dist/esm/styles/prism.js
```

### Solution

We mocked those packages under `__mocks__` folder. Jest gives error when trying to place them under a different folder.

See [details](https://github.com/remarkjs/react-markdown/issues/635#issuecomment-956158474)

## Mock Service Worker

`api.js` contains handlers used by mock service worker.