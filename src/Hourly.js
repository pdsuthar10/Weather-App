import React, { Component } from 'react'
import axios from 'axios'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { connect } from 'react-redux';

class Hourly extends Component {

    state={
        dayInformation: []
    }

    componentDidMount(){
        const city = this.props.location.state.city;
        console.log(this.props);
        const unit = (this.props.unit === "F")? "imperial": "metric";
        axios.get('https://api.openweathermap.org/data/2.5/forecast?q='+city+'&appid=57808ae0e0093dd410d6cf81f988f653&units='+unit)
            .then(res => {
                console.log(res)
                this.setState({
                    dayInformation: res.data.list
                })
            })
    }

    handleClick = (e) =>{
       // this.props.location.props.updateCity(this.props.location.state.city)
        this.props.history.push("/")
       
    }

    tConvert = (time) =>{
        // Check correct time format and split into components
        time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

        if (time.length > 1) { // If time format correct
            time = time.slice (1);  // Remove full string match value
            time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
            time[0] = +time[0] % 12 || 12; // Adjust hours
        }
        console.log(time);
        return time[0]+" "+time[5]; // return adjusted time or original string
    }

    
    
    render() {
        const { dayInformation } = this.state;
        const tempDay = []
        var j=0;
        var i=0;
        //console.log(this.props);
        var date2 = this.props.location.state.date.split(' ');
        console.log(date2);
        for(i;i<dayInformation.length;i++){
            let date1 = dayInformation[i].dt_txt.split(' ');
                if(date1[0] === date2[0])
                    tempDay[j++] = dayInformation[i];
        }
        console.log("In hourly");
        console.log(tempDay);
        const dayCards = tempDay.length ? (
        tempDay.map(day=>{
            return(
                <div className="col s12 m3" key={day.dt_txt}>
                    <div className="card opacity medium blue darken-1">
                        <div className="card-content white-text">
                        {console.log(day.weather[0].main)}
                            <h5 style={{color:"rgb(199, 35, 35)", fontWeight:"bold"}}>{this.tConvert(day.dt_txt.split(' ')[1])}</h5>
                            <span className="card-title bold">{day.weather[0].main}</span>
                            <img src={"http://openweathermap.org/img/wn/"+day.weather[0].icon+"@2x.png"} />
                            
                            <h5><strong>{Math.floor(day.main.temp)}&deg;</strong> <small>{this.props.unit}</small></h5>
                            <h5>Feels like: {Math.floor(day.main.feels_like)}&deg; <small>{this.props.unit}</small></h5>
                        </div>
                    </div>
                </div>
            )
        })
    ):(
         <div className="center">No posts yet</div>
    );
        console.log(this.props);
        return (
            <div className="container">
            {/* <Link to="/" style={{
                position: "absolute",
                top: "48%",   
                left: "10%"        */}
            <button onClick={this.handleClick} id="backButton">
            <FontAwesomeIcon id="backIcon" icon={faChevronLeft} style={
                {
                    fontSize: "50px",
                    color: "rgb(199, 35, 35)"
                }
            }/></button>
            {/* </Link> */}
                <h4 style={{color:"rgb(199, 35, 35)",textAlign:"center",fontWeight:"bold"}}>{moment(this.props.location.state.date).format("dddd, MMMM Do YYYY")}</h4>
                <div className="row">
                    {dayCards}
                </div>    
            </div>
        )
    }
}

const mapStateToProps = (state) =>{
    return{
        city: state.city,
        unit: state.unit,
        speed: state.speed,
        toggle: state.toggle
    }
}

export default connect(mapStateToProps)(Hourly)
