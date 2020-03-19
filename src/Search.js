import React, { Component } from 'react'
import {connect} from 'react-redux'

class Search extends Component {
    state = {
        content: ''
    }

    // handleChange = (e) =>{
    //     this.setState({
    //         content : e.target.value
    //     })

    // }
    handleSubmit = (e) =>{
        e.preventDefault();
        this.props.updateCity(e.target.value);
        this.setState({
            content:e.target.value
        })
    }
    render() {
        console.log(this.props);
        
        return (
            <div>
                <form className="col s12" onSubmit={this.handleSubmit}>
                    <div className="row">
                        <div className="input-field col s4 offset-s4">
                            <input id="city" type="text" className="validate"></input>
                            <label htmlFor="city">Search For a City</label>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateCity: (city) => { dispatch({type:'UPDATE_CITY',city:city}) }
    }
}

export default connect(null,mapDispatchToProps)(Search)
