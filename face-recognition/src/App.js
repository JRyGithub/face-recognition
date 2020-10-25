import React, { Component } from 'react';
import Navigation from './Components/Navigation/Navigation';
import Logo from './Components/Logo/Logo';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm';
import Rank from './Components/Rank/Rank';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import SignIn from './Components/SignIn/SignIn';
import Register from './Components/Register/Register';
//import particlesOptions from './Components/ParticleComponent/ParticlesOptions';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import './App.css';

//import { render } from '@testing-library/react';

const app = new Clarifai.App({
  apiKey:'d4181550d4e742cb822545fe949818f3'
});

const particlesOptions = {
  "particles": {
    "number": {
      "value": 100,
      "density": {
        "enable": true,
        "value_area": 800
      }
    },
    "color": {
      "value": "#C0C0C0"
    },
    "opacity": {
      "value": 0.5,
      "random": false,
      "anim": {
        "enable": false,
        "speed": 1,
        "opacity_min": 0.1,
        "sync": false
      }
    },
    "size": {
      "value": 3,
      "random": true,
      "anim": {
        "enable": false,
        "speed": 40,
        "size_min": 0.1,
        "sync": false
      }
    },
    "line_linked": {
      "enable": true,
      "distance": 150,
      "color": "#C0C0C0",
      "opacity": 0.4,
      "width": 1
    },
    "move": {
      "enable": true,
      "speed": 6,
      "direction": "none",
      "random": false,
      "straight": false,
      "out_mode": "out",
      "bounce": false,
      "attract": {
        "enable": false,
        "rotateX": 600,
        "rotateY": 1200
      }
    }
  },
  "interactivity": {
    "detect_on": "window",
    "events": {
      "onhover": {
        "enable": true,
        "mode": "grab"
      },
      "onclick": {
        "enable": true,
        "mode": "push",
      },
      "resize": true
    },
    "modes": {
      "grab": {
        "distance": 400,
        "line_linked": {
          "opacity": 1
        }
      }
    }
  },
  "retina_detect": true
}

class App extends Component {
  constructor(){
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin'
    }
  }

  calculateFaceLocation = (data) => {
    const clarifyFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return{
      leftCol: clarifyFace.left_col * width,
      topRow: clarifyFace.top_row * height,
      rightCol: width - (clarifyFace.right_col * width),
      bottomRow: height - (clarifyFace.bottom_row *height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box});
  }
  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input})
    app.models.predict(
        Clarifai.FACE_DETECT_MODEL,
        this.state.input)
      .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err => console.log(err));
  }
  onRouteChange =(route) =>{
    this.setState({route: route});
  }
  render(){
      return (
        <div className="App">
          <Particles className='particles' params={particlesOptions}/>
          <Navigation onRouteChange = {this.onRouteChange}/>
          { 
            this.state.route === 'home' ?
            <div> 
                <Logo/> 
                <Rank/>
                <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
                <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
              </div>
              : 
              (
                this.state.route === 'signin' ?   
                <SignIn onRouteChange= {this.onRouteChange}/> 
                :
                <Register onRouteChange = {this.onRouteChange} />
              )                
          }
        </div>
      );
  }
}

export default App;
