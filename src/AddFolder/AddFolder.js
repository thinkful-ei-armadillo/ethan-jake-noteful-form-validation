import React, { Component } from 'react'
import NotefulForm from '../NotefulForm/NotefulForm'
import RouteContext from '../RouteContext'
import './AddFolder.css'

export default class AddFolder extends Component {
  static contextType = RouteContext;

  state = {
    folderName: '',
    folderNameValid: false,
    formValid: false,
    errorMessages: {}
  }


  validateName(e){
    
    if(e.target.value.length >= 4 ){
      this.setState({
        folderNameValid: true,
        folderName: e.target.value,
        errorMessages:{folderName: null}
      })
    } else{
      this.setState({
        folderNameValid: false,
        folderName: e.target.value,
        errorMessages: {folderName: 'Folder name must be greater than 3 characters'}
      })
    }

  }

  validateForm(e){
    e.preventDefault();
    if(this.state.folderNameValid){
      this.setState({
        formValid:true
      }, () => {this.context.createNewFolder(this.state)})
      this.props.history.goBack()
    } else{
      this.setState({
        formValid: false
      })
    }
  

  }


  render() {
    return (
      <section className='AddFolder'>
        <h2>Create a folder</h2>
        <NotefulForm id='notefulForm' name='nameForm' onSubmit={(e) => {this.validateForm(e)}}>
          <div className='field'>
            <label htmlFor='folder-name-input'>
              Name
            </label>
            <input type='text' id='folder-name-input' name='folderName' onChange={(e) => this.validateName(e)} />
          </div>
          <div className='buttons'>
            <button type='submit'>
              Add folder
            </button>
          </div>
        </NotefulForm>
      </section>
    )
  }
}
