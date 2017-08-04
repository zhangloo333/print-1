/**
--index.js
--compoennt
	--imageCards.js
*/

/*index.js*/
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import ImageCard from './Component/ImageCard';

function cards(){
  return [
      {value: "*", id: 0, matched: false},
      {value: "*", id: 1, matched: false},
      {value: "$", id: 2, matched: false},
      {value: "$", id: 3, matched: false},
      {value: "%", id: 4, matched: false},
      {value: "%", id: 5, matched: false},
      {value: "^", id: 6, matched: false},
      {value: "^", id: 7, matched: false},
      {value: "*", id: 8, matched: false}
    ];
}


class Player extends Component {
  constructor(props){
    super(props);
    this.state = {
        cards: cards(),
        PlayerFlag: true,
        Point1: 0,
        Point2: 0,
        PreValue: null
    };
    this.checkCard = this.checkCard.bind(this);
    this.recordPreValue = this.recordPreValue.bind(this);
    this.reset = this.reset.bind(this);
  }

  recordPreValue(value) {
    if(!this.state.PreValue){
      this.setState({PreValue:value});
    }
  }
  checkCard(value){
    let {PreValue,cards,PlayerFlag,Point1,Point2} = this.state;

    if(PreValue && PreValue.value === value.value && PreValue.id !== value.id) {
      console.log("matched");
      cards[value.id] = {...value, matched:true};
      cards[PreValue.id] = {...value, matched:true};
      if(PlayerFlag){
        Point1++;
      }else {
        Point2++;
      }
      this.setState({
        cards:cards,
        PreValue:null,
        Point1,
        Point2
      });
    } else if(!PreValue){
      this.setState({PreValue:value});
    } else{
      this.setState({
        PreValue:null,
        PlayerFlag:!PlayerFlag
      })
    }


  }

  reset(){
    console.log('this is reset');
    this.setState({
        cards: cards(),
        PlayerFlag: true,
        Point1: 0,
        Point2: 0,
        PreValue: null
    });
  }

  render(){
    let imageSet = [];
    let allcards = this.state.cards;
    for(var ii = 0; ii < allcards.length; ii++){
      imageSet.push(
          <ImageCard
            key = {ii}
            info = {allcards[ii]}
            PreValue = {allcards.PreValue}
            checkCard = {this.checkCard}
          />
      )
    }
    return(
      <div className = "container">
        <div className = "row">
          <div className = "col-md-9">
              {imageSet}
          </div>
          <div className = "col-md-3">
          <div>
          <button className = {this.state.PlayerFlag ? 'player1' : 'player'}>player1</button>
            <p>the sroce is {this.state.Point1}</p>
          </div>
          <div>
            <button className = {!this.state.PlayerFlag ? 'player1' : 'player'}>player2</button>
            <p>the sroce is {this.state.Point2}</p>
          </div>
            <button onClick = {this.reset}>ResetGame</button>
          </div>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<Player/>, document.getElementById('app'));

//src/component/ImageCard.js

import React, {Component} from 'react';
import _ from 'lodash';

export default class ImageCard extends Component {
  constructor(props) {
    super(props);
    this.eventClick = this.eventClick.bind(this);
  }

  eventClick(e){
    this.props.checkCard(this.props.info);
  }

   render() {
     return(
       <div className = "card col-md-4" >
        <div className = "card-block" onClick = {this.eventClick}>
          <image className = "card-img-top" src = {""} />
          <div>
            {
              this.props.info.matched ?
              <p>this is value of cards: {this.props.info.value}</p>
              :
              <p>""</p>
            }
          </div>
        </div>
       </div>
     )
   }
}