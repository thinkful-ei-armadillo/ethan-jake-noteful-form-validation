import React, { Component } from 'react'
import { Route, Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import NoteListNav from '../NoteListNav/NoteListNav'
import NotePageNav from '../NotePageNav/NotePageNav'
import NoteListMain from '../NoteListMain/NoteListMain'
import NotePageMain from '../NotePageMain/NotePageMain'
import AddFolder from '../AddFolder/AddFolder'
import AddNote from '../AddNote/AddNote'
import RouteContext from '../RouteContext';
import NotePageContext from '../NotePageContext';

import './App.css'

class App extends Component {
  state = {
    notes: [],
    folders: [],
  };

  deleteNote = (noteId) => {

    return fetch(`http://localhost:9090/notes/${noteId}`, { method: 'DELETE' })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Error deleting note ${noteId}`);
        }

        return res.json();
      })
      .then(() => {
        // get notes from api, set state
        fetch('http://localhost:9090/notes')
          .then((res) => {
            if (!res.ok) {
              throw new Error('Error retrieving notes list');
            }

            return res.json()
          })
          .then((notes) => {
            this.setState({ notes })
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  createNewFolder = (newFolder) => {
    console.log(newFolder)
    const url = 'http://localhost:9090/folders'
    fetch(url, {
      headers: {
      "Content-Type": "application/json"},
      method: 'POST', 
      body: JSON.stringify({name: newFolder.folderName})
    })
    .then(res => {
      if(!res.ok) {
        console.log('Response not OK');
        throw new Error("Failed to create new folder")
      }
      return res.json();
    })
    .then((data) => {
      this.setState({
        folders: [data, ...this.state.folders]
      })
    })
    .catch(err => {
      console.log(err.message)
    });
  };

  componentDidMount() {

    const data = {};

    const folderPromise = fetch('http://localhost:9090/folders')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Error retrieving folders list');
        }

        return res.json();
      });

    const notesPromise = fetch('http://localhost:9090/notes')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Error retrieving notes list');
        }

        return res.json();
      });

    Promise
      .all([folderPromise, notesPromise])
      .then((apiData) => {
        data.folders = apiData[0];
        data.notes   = apiData[1];

        this.setState(data);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  renderNavRoutes() {
    const { notes, folders } = this.state
    return (
      <>
        {['/', '/folder/:folderId'].map(path =>
          // <Route
          //   exact
          //   key={path}
          //   path={path}
          //   render={routeProps =>
          //     <NoteListNav
          //       folders={folders}
          //       notes={notes}
          //       {...routeProps}
          //     />
          //   }
          // />
          <RouteContext.Provider key={path} value={{folders, notes}} >
            <Route
              exact
              key={path}
              path={path}
              component={NoteListNav}
            />
          </RouteContext.Provider>
        )}
        {/* <Route
          path='/note/:noteId'
          render={routeProps => {
            const { noteId } = routeProps.match.params
            const note = findNote(notes, noteId) || {}
            const folder = findFolder(folders, note.folderId)
            return (
              <NotePageNav
                {...routeProps}
                folder={folder}
              />
            )
          }}
        /> */}
        <RouteContext.Provider key="notePageNav" value={{folders, notes}} >
          <Route
            path='/note/:noteId'
            component={NotePageNav}
          />
        </RouteContext.Provider>
        <Route
          path='/add-folder'
          component={NotePageNav}
        />
        <Route
          path='/add-note'
          component={NotePageNav}
        />
      </>
    )
  }

  renderMainRoutes() {
    const { notes, folders } = this.state
    return (
      <>
        {['/', '/folder/:folderId'].map(path =>
          // <Route
          //   exact
          //   key={path}
          //   path={path}
          //   render={routeProps => {
          //     const { folderId } = routeProps.match.params
          //     const notesForFolder = getNotesForFolder(notes, folderId)
          //     return (
          //       <NoteListMain
          //         {...routeProps}
          //         notes={notesForFolder}
          //       />
          //     )
          //   }}
          // />
          <NotePageContext.Provider key={path} value={{folders, notes, onDeleteClick: this.deleteNote}} >
          <Route
            exact
            key={path}
            path={path}
            component={NoteListMain}
          />
          </NotePageContext.Provider>
        )}
        {/* <Route
          path='/note/:noteId'
          render={routeProps => {
            const { noteId } = routeProps.match.params
            const note = findNote(notes, noteId)
            return (
              <NotePageMain
                {...routeProps}
                note={note}
              />
            )
          }}
        /> */}
        <NotePageContext.Provider key="notePageMain" value={{folders, notes, onDeleteClick: this.deleteNote}} >
        <Route
          path='/note/:noteId'
          component={NotePageMain}
              />
        </NotePageContext.Provider >
        <RouteContext.Provider value={{createNewFolder: this.createNewFolder}}>
        <Route
          path='/add-folder'
          component={AddFolder}
        />
        </RouteContext.Provider>
        {/* <Route
          path='/add-note'
          render={routeProps => {
            return (
              <AddNote
                {...routeProps}
                folders={folders}
              />
            )
          }}
        /> */}
        <RouteContext.Provider key="addNote" value={{folders}} >
        <Route
          path='/add-note'
          component={AddNote}
        />
        </RouteContext.Provider>
      </>
    )
  }

  render() {
    return (
      <div className='App'>
        <nav className='App__nav'>
          {this.renderNavRoutes()}
        </nav>
        <header className='App__header'>
          <h1>
            <Link to='/'>Noteful</Link>
            {' '}
            <FontAwesomeIcon icon='check-double' />
          </h1>
        </header>
        <main className='App__main'>
          {this.renderMainRoutes()}
        </main>
      </div>
    )
  }
}

export default App
