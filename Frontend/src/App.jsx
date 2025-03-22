import React, { Component } from 'react';
import axios from 'axios';



export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      drivers:[]
      
    };
  }

  componentDidMount(){
    this.retrieveDrivers();
  }
//corrected code for the get driver option
  retrieveDrivers(){
    axios.get('http://localhost:4000/api/driver/')
      .then(res => {
        console.log("API Response:", res.data); // Debugging
  
        if(res.data.success){  // Fix: "sucess" → "success"
          this.setState({
            drivers: res.data.posts
          }, () => {
            console.log("Updated State:", this.state.drivers); // Debugging
          });
        } else {
          console.log("No drivers found.");
        }
      })
      .catch(error => {
        console.error("Fetch Error:", error);
      });
  }
  
/*
retrieveDrivers(){
  axios.get('http://localhost:4000/api/driver/').then(res=>{
    if(res.data.sucess){
      this.setState({
        drivers:res.data.posts
      });

      console.log(this.state.drivers)

    }

     });

    }*/


  render(){
    return(
      <div >
        {this.state.drivers.map(drivers=>(

          <div>
        <h1>HElloo</h1>
             <p>{drivers.DriverName}</p>
             <p>{drivers.DriverAdd}</p>
          
          </div>
        
        ))}


      </div>
    )
  }

}