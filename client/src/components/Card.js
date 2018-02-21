import React, { Component } from 'react';

class Card extends Component {
  render() {
    return (

      <div className={"col-xl-3 col-lg-3 col-md-3 col-sm-3 project wow animated animated4 fadeInLeft " + this.props.pictureClass}>
            <div className="project-hover">
              <h2>{this.props.title}</h2>

                <hr />
                {/*}<p>{this.props.paragraph}</p>*/}
                {this.props.children}
            </div>
        </div>
    );
  }
}

export default Card;
