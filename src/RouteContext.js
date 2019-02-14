import React from 'react';

const context = React.createContext({
  folders: [],
  notes: [],
  createNewFolder: () => {},
  createNewNote: () => {}
});

export default context;
