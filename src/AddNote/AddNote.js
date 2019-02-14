import React, { Component } from 'react'
import NotefulForm from '../NotefulForm/NotefulForm'
import './AddNote.css'
import RouteContext from '../RouteContext'

export default class AddNote extends Component {

  static defaultProps = {
    folders: [],
  }

  static contextType = RouteContext

  static state = {
    formValid: false,

    nameValid: false,
    contentValid: false,
    folderIdValid: false,

    name: '',
    content: '',
    folderId: '',

    errorMessages: {},
  }

  updateName = (e) => {

    let isValid      = true;
    let errorMessage = null;

    if (e.target.value.length < 3) {
      isValid = false;
      errorMessage = 'Name must be greater than 2 characters in length';
    }

    if (e.target.value === 'foobar') {
      isValid = false;
      errorMessage = 'Name must not be "foobar"'
    }

    this.setState({
      name: e.target.value,
      nameValid: isValid,
      errorMessages: {
        name: errorMessage,
      }
    });
  };

  updateContent = (e) => {

    let isValid      = true;
    let errorMessage = null;

    if (e.target.value.length < 5) {
      isValid = false;
      errorMessage = 'Content must be greater than 5 characters in length';
    }

    if (e.target.value === 'foobar') {
      isValid = false;
      errorMessage = 'Content must not be "foobar"'
    }

    this.setState({
      content: e.target.value,
      contentValid: isValid,
      errorMessages: {
        content: errorMessage,
      }
    });
  };

  updateFolderId = (e) => {

    let isValid      = true;
    let errorMessage = null;

    if (e.target.value === '...') {
      isValid = false;
      errorMessage = 'Please choose a folder'
    }

    this.setState({
      folderId: e.target.value,
      folderIdValid: isValid,

      errorMessages: {
        folderId: errorMessage,
      }
    });
  };

  handleSubmit = (e) => {
    e.preventDefault();

    if (this.state.nameValid && this.state.contentValid && this.state.folderIdValid) {

      this.setState({ formValid: true });
      this.context.createNewNote({
        name     : this.state.name,
        content  : this.state.content,
        folderId : this.state.folderId
      });
      this.props.history.goBack();
    } else {

      this.setState({ formValid: false });
    }
  }

  render() {
    const { folders } = this.context
    return (
      <section className='AddNote'>
        <h2>Create a note</h2>
        <NotefulForm onSubmit={(e) => { this.handleSubmit(e) }}>
          <div className='field'>
            <label htmlFor='note-name-input'>
              Name
            </label>
            <input type='text' id='note-name-input' onChange={(e) => { this.updateName(e) }}/>
            <p class="form-error">{this.state && this.state.errorMessages.name}</p>
          </div>
          <div className='field'>
            <label htmlFor='note-content-input'>
              Content
            </label>
            <textarea id='note-content-input'  onChange={(e) => { this.updateContent(e) }}/>
            <p class="form-error">{this.state && this.state.errorMessages.content}</p>
          </div>
          <div className='field'>
            <label htmlFor='note-folder-select'>
              Folder
            </label>
            <select id='note-folder-select'  onChange={(e) => { this.updateFolderId(e) }}>
              <option value={null}>...</option>
              {folders.map(folder =>
                <option key={folder.id} value={folder.id}>
                  {folder.name}
                </option>
              )}
            </select>
            <p class="form-error">{this.state && this.state.errorMessages.folderId}</p>
          </div>
          <div className='buttons'>
            <button type='submit'>
              Add note
            </button>
          </div>
        </NotefulForm>
      </section>
    )
  }
}
