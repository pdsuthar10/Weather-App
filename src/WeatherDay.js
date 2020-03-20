import React, { Component } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudSun, faSun } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios';
import moment from 'moment';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom'
import thunderstorm from './thunderstorm.png'
import drizzle from './drizzle.jpg'
import rain from './rain.png'
import snow from './snow.png'
import clouds from './clouds.jpg'


class WeatherDay extends Component {
   
    _isMounted = false;

    constructor(props){
        super(props);
        this.state = {
            current: {},
            days: [],
            //content: this.props.match.params.city,
            tempContent: '',
        }

    }

    checkWeather(weather){
        switch (weather) {
            case "Rain":
                return (
                    <img src={rain} className="weatherIcon"/>
                )  
            case "Drizzle":
                return (
                     <img src={drizzle} className="weatherIcon"/>
                )
            case "Thunderstorm":
                return (
                     <img src={thunderstorm} className="weatherIcon"/>
                )
            case "Snow":
                return (
                     <img src={snow} className="weatherIcon"/>
                )
            case "Clouds":
                return (
                     <img src={clouds} className="weatherIcon"/>
                )
            case "Clear":
                return (
                     <FontAwesomeIcon icon={faSun} size="2x" color="yellow"/>
                )
            default:
                return false
        }

    }

    callApi(city){
        axios.get('https://api.openweathermap.org/data/2.5/forecast?q='+city+'&appid=57808ae0e0093dd410d6cf81f988f653&units=imperial')
            .then(res => {
                console.log(res);   
                    this.setState({
                    days: res.data.list
                })
            }).catch(error => {
                console.log("Hello worlds");
                    this.props.updateCity('Please Enter a Valid City Name')
                    this.setState({
                    content: 'Please Enter a Valid City Name',
                    days: [],
                    current: {temp: '-', icon:'-', wind:'-', feels_like:'-'}
                })

            })
        
        axios.get('https://api.openweathermap.org/data/2.5/weather?q='+city+'&appid=57808ae0e0093dd410d6cf81f988f653&units=imperial')
            .then(res => {
                console.log(res)
                this.setState({
                    current : {temp: res.data.main.temp, icon:res.data.weather[0].icon, wind:res.data.wind.speed, feels_like:res.data.main.feels_like}
                })
                console.log(this.state.current)
            }).catch( error => {
                this.setState({
                    content: 'Please Enter a Valid City Name',
                    days: [],
                    current: {temp: '-', icon:'-', wind:'-', feels_like:'-'}
                    
                })

            })
    }

    // updateCity = (city) =>{
    //     this.setState({
    //         content: city
    //     })
    // }

    componentDidMount(){
        
        const city = this.props.city;
        console.log(this.props);
        axios.get('http://api.openweathermap.org/data/2.5/forecast?q='+city+'&appid=57808ae0e0093dd410d6cf81f988f653&units=imperial')
            .then(res => {
                console.log(res)
                this.setState({
                    days: res.data.list
                })
            })
        
        axios.get('http://api.openweathermap.org/data/2.5/weather?q='+city+'&appid=57808ae0e0093dd410d6cf81f988f653&units=imperial')
            .then(res => {
                console.log(res)
                this.setState({
                    current : {temp: res.data.main.temp, icon:res.data.weather[0].icon, wind:res.data.wind.speed, feels_like:res.data.main.feels_like, weather:res.data.weather[0].main}
                })
                console.log(this.state.current)
            })
    }
    handleChange = (e) =>{
        this.setState({
            tempContent:e.target.value
        })
    }

    handleSubmit = (e) =>{
        e.preventDefault()
        this.callApi(this.state.tempContent)
        this.props.updateCity(this.state.tempContent)
        // this.props.history.push(`/${this.state.tempContent}`)
        
            // this.setState({
            //         content: this.state.tempContent
            // })
        
    }

    render() {     
        const {days} = this.state;
        console.log(this.props);
        var i=0;
        const dayList = [];
        var j=0;
        var tempMin = 100;
        var tempMax = -100;
        for(i;i<days.length;i++){
            if(days[i].main.temp_min<tempMin)
                tempMin = days[i].main.temp_min;
            if(days[i].main.temp_max>tempMax)
                tempMax = days[i].main.temp_max;
            if(i===6 || i===14 || i===22 || i===30 || i===38)
            {
                dayList[j]= {dt_txt: days[i].dt_txt, temp_min: tempMin, temp_max: tempMax, icon: days[i].weather[0].icon};
                j++;
                tempMin = 100;
                tempMax = -100;
            }          
        }
        console.log(dayList);
        // console.log(this.returnDay(new Date(days.list[0])));
        const dayInformation = dayList.length ? (
            dayList.map(day =>{
                return (
                    
                    <div className="day" key={day.dt_txt}>
                        <Link to={{ pathname: `/${moment(day.dt_txt).format('dddd')}`, state: {city:this.props.city, date:day.dt_txt}, props:{updateCity: this.updateCity} }}>
                            <h3>{moment(day.dt_txt).format('ddd')}</h3>
                            <p>{day.temp_max}&deg; F <span style={{color:"rgb(199, 35, 35)"}}>&#8593;</span> </p>
                            <p>{day.temp_min}&deg; F <span style={{color:"black"}}>&#8595;</span> </p>
                            <img src={"http://openweathermap.org/img/wn/"+day.icon+"@2x.png"} />
                         </Link>
                    </div>
                   
                )
            })
        ) : (
            <div className="center">No posts yet</div>
        );

        
        console.log("In render:", this.state.content);
        return (
            <div className="container">
            <br/>
                <form className="col s12" onSubmit={this.handleSubmit}>
                    <div className="row">
                        <div className="input-field col s4 offset-s4">     
                            <input type="text" className="validate" onChange={this.handleChange}></input>
                            <label htmlFor="city" className="active" style={{
                                fontSize: "20px",
                                color: "rgb(199, 35, 35)",
                                textAlign: "center"
                            }}>ENTER A CITY</label>
                            {/* <div className="container" style={{textAlign: "right"}}>C&deg; |  F&deg;</div> */}
                        </div>
                    </div>
                </form>
                {
                    this.props.city &&
                    <div className="row">
                    <div className="col-md-4 col-md-offset-4">
                        <div className="weather">
                            <div className="current">
                                <div className="info">
                                    <div>&nbsp;</div>
                                    <div className="city">{this.props.city}</div>
                                    <div className="temp">{this.state.current.temp}&deg; <small>F</small><br/>
                                    <span className="feels"><small><small>Feels like:</small></small>{this.state.current.feels_like}&deg; <small>F</small></span>
                                    </div>
                                    <div className="wind"><small><small>Wind:</small></small> {this.state.current.wind} miles/hour</div>
                                    <div>&nbsp;</div>
                                </div>
                                <div className="icon">
                                    {/* {this.checkWeather(this.state.current.weather)} */}
                                    {/* <p><FontAwesomeIcon icon={faSun} size="2x" color="yellow"/></p> */}
                                     <img src={"http://openweathermap.org/img/wn/"+this.state.current.icon+"@2x.png"}/>
                                </div>
                            </div>
                            <div className="future">
                                {dayInformation}
                            </div>
                        </div>
                    </div>
                </div>}
            </div>
        )
    }
}
const mapStateToProps = (state) =>{
    return{
        city: state.city
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        updateCity: (city) => { dispatch({type: 'UPDATE_CITY', city: city}) }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(WeatherDay)