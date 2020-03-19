import React, {Component} from 'react';
import './App.css';
import WeatherDay from './WeatherDay'
import Search from './Search'
import Hourly from './Hourly'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

class App extends Component {
  render(){
    return (
      <BrowserRouter>
        <div className="App">
            {/* <Search /> */}
            <Route exact path="/" component={WeatherDay} />
            {/* <Switch> */}
            {/* <Route exact path="/:city" render={(props)=>{
              return(
                 <WeatherDay {...props} />
              )   
            }}/> */}
            {/* <Route exact path="/:city" component={WeatherDay} /> */}
            <Route path="/hourly" component={Hourly} />
            {/* </Switch> */}
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
