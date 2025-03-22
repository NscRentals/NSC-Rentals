import React, { Component } from "react";
import axios from "axios";

export default class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      decorations: []
    };

  }

  componentDidMount() {
    this.retrieveDecorations();
  }


  retrieveDecorations() {
    axios.get("http://localhost:4000/api/deco/get")
      .then(res => {
        if (res.data.success) {
          this.setState({ 
            decorations: res.data.deco 
          });

          console.log(this.state.decorations);

        }
      })
      .catch(error => {
        console.error("Error fetching decorations:", error);
      });
  }

  render() {
    return (
      <div>
        {this.state.decorations.map(decorations => (
          <div>
            <p>{decorations.dId}</p>
            <p>{decorations.type}</p>
          </div>
        ))}
      </div>
    )
  }
}