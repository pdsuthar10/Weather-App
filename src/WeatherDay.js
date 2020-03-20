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
            tempContent: '',
            unit: "F",
            toggle: false,
            speed: "miles/hour"
        }

    }

    handleOnClick = (e) =>{
        if(this.props.toggle){
            this.callApi(this.props.city,"imperial")
            this.props.updateUnit(false)
        }else{
            this.callApi(this.props.city,"metric")
            this.props.updateUnit(true)
        }
    }

    callApi(city,unit){

        axios.get('https://api.openweathermap.org/data/2.5/forecast?q='+city+'&appid=57808ae0e0093dd410d6cf81f988f653&units='+unit)
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
                    current: {temp: '0', icon:'01d', wind:'0', feels_like:'0'}
                })

            })
        
        axios.get('https://api.openweathermap.org/data/2.5/weather?q='+city+'&appid=57808ae0e0093dd410d6cf81f988f653&units='+unit)
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
                    current: {temp: '0', icon:'01d', wind:'0', feels_like:'0'}
                    
                })

            })
    }


    componentDidMount(){
        
        const city = this.props.city;
        console.log(this.props);
        const unit = (this.props.unit === "F")? "imperial": "metric";
        axios.get('http://api.openweathermap.org/data/2.5/forecast?q='+city+'&appid=57808ae0e0093dd410d6cf81f988f653&units='+unit)
            .then(res => {
                console.log(res)
                this.setState({
                    days: res.data.list
                })
            })
        
        axios.get('http://api.openweathermap.org/data/2.5/weather?q='+city+'&appid=57808ae0e0093dd410d6cf81f988f653&units='+unit)
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
        this.callApi(this.state.tempContent, (this.props.unit === "F")? "imperial":"metric")
        this.props.updateCity(this.state.tempContent)
        this.props.updateUnit(this.props.toggle)
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
       
        const dayInformation = dayList.length ? (
            dayList.map(day =>{
                return (
                    
                    <div className="day" key={day.dt_txt}>
                        <Link to={{ pathname: `/${moment(day.dt_txt).format('dddd')}`, state: {city:this.props.city, date:day.dt_txt, unit:this.props.unit}, props:{updateCity: this.updateCity} }}>
                            <h3>{moment(day.dt_txt).format('ddd')}</h3>
                            <p>{Math.floor(day.temp_max)}&deg; {this.props.unit} <span style={{color:"rgb(199, 35, 35)"}}>&#8593;</span> </p>
                            <p>{Math.floor(day.temp_min)}&deg; {this.props.unit} <span style={{color:"black"}}>&#8595;</span> </p>
                            <img src={"http://openweathermap.org/img/wn/"+day.icon+"@2x.png"} />
                         </Link>
                    </div>
                   
                )
            })
        ) : (
            <div className="center">No posts yet</div>
        );

        
        
        return (
            // <div className="valign-wrapper" style={{width:"100%",height:"100%",position:"absolute"}}>
            //     <div className="valign" style={{width:"100%"}}>
                    <div className="container">
                    <br/>
                        <form className="col s12" onSubmit={this.handleSubmit}>
                            <div className="row">
                                <div className="input-field col s4 offset-s4">     
                                    <input type="text" className="validate" onChange={this.handleChange}></input>
                                    <label htmlFor="city" className="active" style={{
                                        fontSize: "15px",
                                        color: "rgb(199, 35, 35)",
                                        textAlign: "center"
                                    }}>ENTER A CITY</label>
                                </div>
                            </div>
                        </form>
                        
                            
                            <div className="row">
                            <div className="col-md-4 col-md-offset-4">
                                <div className="weather">
                                    <div className="current">
                                        <div className="info">
                                            <div>&nbsp;</div>
                                            <div className="city">{this.props.city}</div>
                                            <div className="temp" onClick={this.handleOnClick} style={{cursor:"pointer", width:"200px"}}>{Math.floor(this.state.current.temp)}&deg; <small>{this.props.unit}</small><br/>
                                            <span className="feels"><small><small>Feels like:</small></small>{Math.floor(this.state.current.feels_like)}&deg; <small>{this.props.unit}</small></span>
                                            </div>
                                            <div className="wind"><small><small>Wind:</small></small> {Math.floor(this.state.current.wind)} {this.props.speed}</div>
                                            <div>&nbsp;</div>
                                        </div>
                                        <div className="icon">
                                            <img src={"http://openweathermap.org/img/wn/"+this.state.current.icon+"@2x.png"}/>
                                        </div>
                                    </div>
                                
                                    <div className="future">
                                        {dayInformation}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            //         </div>
            // </div>
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

const mapDispatchToProps = (dispatch) => {
    return {
        updateCity: (city) => { dispatch({type: 'UPDATE_CITY', city: city}) },
        updateUnit: (toggle) => { dispatch({type: 'UPDATE_UNIT', toggle: toggle}) },
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(WeatherDay)