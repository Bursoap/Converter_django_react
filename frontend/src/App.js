import React, { Component } from 'react';
import './App.css';
import $ from 'jquery';
import { csrfSafeMethod, getCookie } from './utils.js';


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
        data:    JSON.stringify({"number": this.state.number}),
        contentType: 'application/json',
        dataType: 'json',
        success: function(response){
            $('.invalid-feedback').hide();
            $('.is-invalid').removeClass('is-invalid');
            this.setState({result: response['data']});
         }.bind(this),
        error: function(response) {
            var error = response["responseJSON"]["detail"];
            console.log(error, response);
            this.setState({errors: error});
            $(".number").show();
            $("#number").addClass('is-invalid')
        }.bind(this)
    });
    return false;
}

  render() {
    return (
        <div className="container justify-content-center">
            <p id="legend">
                This is a two-way converter: from Roman to Arabic numbers and from Arabic to Roman.
                To convert, enter your number in the first box and click convert.
                In the second window you will see the result of the conversion.
                Max Roman number is MMMCMXCIX and 3999 in Arabic system.
            </p>
            <div className="form-group row">
                <div className="form-group col-md-5">
                    <textarea id="number" className="form-control" rows="2" value={this.state.value}
                       onChange={this.handleChange} placeholder="Input nubmer to convert"></textarea>
                </div>
                <div id="button_container" className="form-group  col-md-2">
                    <button className="form-control btn btn-primary align-middle" id="btn1" onClick={this.handleSubmit}>
                        convert
                    </button>
                </div>
                <div className="form-group col-md-5">
                    <textarea readOnly className="form-control" id="result" rows="2"
                             value={this.state.result} placeholder="Your result"></textarea>
                </div>
            </div>
            <div id="error_row" className="form-group row">
                <div className="form-group col-md-5">
                    <div className="invalid-feedback number">{this.state.errors}</div>
                </div>
            </div>
        </div>
    );
  }
}

export default App;
