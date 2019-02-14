import React from 'react';

const context = React.createContext({
  folders: [],
  notes: [],
  onDeleteClick: () => {},
});

export default context;
