import React from 'react'
import Note from '../Note/Note'
import './NotePageMain.css'
import NotePageContext from '../NotePageContext';
import { findNote } from '../notes-helpers'

export default class NotePageMain extends React.Component{
  static contextType = NotePageContext;

  deleteAndRedirect = (noteID) => {
    this.context.onDeleteClick(noteID)
      .then(() => {
        this.props.history.goBack();
      });
  }

  render() {
    const note = findNote(this.context.notes, this.props.match.params.noteId)

    if (!note) {
      return <section className='NotePageMain'></section>
    }

    return (
    <section className='NotePageMain'>
      <Note
        id={this.props.match.params.noteId}
        name={note.name}
        modified={note.modified}
        onDeleteClick={(id) => { this.deleteAndRedirect(id) }}
      />
      <div className='NotePageMain__content'>
        {note.content.split(/\n \r|\n/).map((para, i) =>
          <p key={i}>{para}</p>
        )}
      </div>
    </section>
  )
}
}

NotePageMain.defaultProps = {
  note: {
    content: '',
  }
}
