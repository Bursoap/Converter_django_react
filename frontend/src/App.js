import React, { Component } from 'react';
import './App.css';
import $ from 'jquery';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        number: '',
        result: '',
        errors: ''
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
  this.setState({number: event.target.value});
  }

  handleSubmit(event) {
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            var csrftoken = getCookie('csrftoken');
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });
    $.ajax({
        url:    'http://localhost:8000/',
        type:   'POST',
        data:    JSON.stringify({"number": 123}),
        contentType: 'application/json',
        dataType: 'json',
        success: function(response){
            $('.invalid-feedback').hide();
            $('.is-invalid').removeClass('is-invalid');
            console.log(response['post']);
            this.setState({result: response['post']});
         }.bind(this),
        error: function(response) {
            var error = response["detail"];
            this.setState({errors: response['errors']});
            $(".number").html(error).show();
            $("#number").addClass('is-invalid')
        }.bind(this)
    });
    return false;
}

  render() {
    return (
        <div>
            <textarea value={this.state.value} onChange={this.handleChange} />
            <input type="submit" value="Submit" onClick={this.handleSubmit}/>
            <textarea value={this.state.result} readOnly></textarea>
        </div>
    );
  }
}

function csrfSafeMethod(method) {
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = $.trim(cookies[i]);
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
export default App;
