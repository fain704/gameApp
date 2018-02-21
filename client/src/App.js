import React, { Component } from 'react';
import NavBar from './components/NavBar.js';
import Carousel from './components/Carousel.js';
import Card from './components/Card.js';
import Footer from './components/Footer.js';
import Signup from './components/Signup.js';
//import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <NavBar />
        <Carousel />

          <div className="container-fluid">
          <div className="title-arch">WELCOME TO REVERIE /ˈREV(Ə)RĒ <p>
A STATE OF BEING PLEASANTLY LOST IN ONE'S THOUGHTS</p>
          </div>
        <Card pictureClass=""  paragraph="test" title="BARBARIAN">
            <hr/>
            <p>Cruel Wicked and Inhuman</p>
             <br/>
             <p>Attack: 7/10</p>
             <p>Hit Points: 3/10</p>
             <p>Speed: 6/10</p>
             <p>Range: 6/10</p>
        </Card>
        <Card pictureClass="project-2"  title="PALADIN" >
          <hr/>
           <p>Champion of a Cause.</p>
           <br/>
           <p>Attack: 6/10</p>
           <p>Hit Points: 6/10</p>
           <p>Speed: 4/10</p>
           <p>Range: 2/10</p>
        </Card>
        <Card pictureClass="project-3"  title="MAGE" >
          <hr />
          <p>Magician or Learned Person.</p>
          <br/>
          <p>Attack: 7/10</p>
          <p>Hit Points: 3/10</p>
          <p>Speed: 6/10</p>
          <p>Range: 6/10</p>
          </Card>
        <Card pictureClass="project-4"  title="ROGUE" >
          <hr/>
          <p>Wise & Skilled Archer.</p>
          <br/>
          <p>Attack: 5/10</p>
          <p>Hit Points: 4/10</p>
          <p>Speed: 6/10</p>
          <p>Range: 10/10</p>
          </Card>
        <div className="clearfix"></div>
            </div>
            <br/>
              <Signup />

              <Footer />
{/* 	<p className="App-intro">
			To get started, edit <code>src/App.js</code> and save to reload.
		</p>*/}


      </div>
    );
  }
}

export default App;
