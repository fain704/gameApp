import React, { Component } from 'react';

var styles = {
   color:'red',
   backgroundColor:'white',
   fontWeight:'bold',
   fontFamily: 'Amatic SC',
};

class Signup extends Component {
  render() {
    return (


      <div className="row mb-4">
        <div className="col-md-8">
          <h2 style={styles}>"TRY NOT TO GET YOURSELF KILLED"</h2>

        </div>
        <div className="col-md-4">
          <a className="btn btn-primary btn-lg btn-block" href="/game">Sign In | SIgn Up</a>
        </div>
      </div>

    );
  }
}

export default Signup;
