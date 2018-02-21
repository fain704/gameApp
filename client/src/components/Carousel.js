import React, { Component } from 'react';

class Carousel extends Component {
  render() {
    return (
      <header>
            <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
              <ol className="carousel-indicators">
                <li data-target="#carouselExampleIndicators" data-slide-to="0" className="active"></li>
                <li data-target="#carouselExampleIndicators" data-slide-to="1" className=""></li>
                <li data-target="#carouselExampleIndicators" data-slide-to="2" className=""></li>
              </ol>
              <div className="carousel-inner" role="listbox">

                <div className="carousel-item active" style={ {"backgroundImage": "url('img/elf.jpg')"} }>
                  <div className="carousel-caption d-none d-md-block">
                  </div>
                </div>

                <div className="carousel-item" style= {{ "backgroundImage": "url('img/mage.jpg')"}}>
                  <div className="carousel-caption d-none d-md-block">
                  </div>
                </div>

                <div className="carousel-item" style={{ "backgroundImage": "url('img/oger.jpg')"}}>
                  <div className="carousel-caption d-none d-md-block">
                  </div>
                </div>
              </div>
              <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="sr-only">Previous</span>
              </a>
              <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="sr-only">Next</span>
              </a>
            </div>
          </header>
    );
  }
}

export default Carousel;
