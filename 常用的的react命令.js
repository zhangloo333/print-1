/**
*/
//src/1-怎么加载组件.js
import React, {Component} from 'react';
import ReactDOM from 'react-dom';

class MessageBox extends Component {

	alertMe() {
		alert('you click me');
	}

	render() {
		return (
			<div>
				<h1 onClick = {this.alertMe}>this is first test </h1>
			</div>
		)
	}
}

ReactDOM.render(<MessageBox/>, document.getElementById('app'),console.log("finish"));
//public/src/2-怎么加载子组件.js
import React, {Component} from 'react';
import ReactDOM from 'react-dom';

class MessageBox extends Component {

	alertMe() {
		alert('you click me');
	}

	render() {
		return (
			<div>
				<h1 onClick = {this.alertMe}>this is first test </h1>
				<Submessage/>
			</div>
		)
	}
}

class Submessage extends Component {
	render(){ 
		return(
			<div>
				<h3>this is Submessage</h3>
				<Footer/>
			</div>
		)
	}
}

class Footer extends Component {
	render() {
		return (
			<small>there is we are</small>
		)
	}
}

ReactDOM.render(<MessageBox/>, document.getElementById('app'),console.log("finish"));
//3-怎么loop有一个组件.js

import React, {Component} from 'react';
import ReactDOM from 'react-dom';

class MessageBox extends Component {

	alertMe() {
		alert('you click me');
	}

	render() {
		var Submessages = [];

		for(var ii = 0; ii < 10 ; ii++) {
			Submessages.push(<Submessage key = {"subtitle" + ii}/>)
		}

		return (
			<div>
				<h1 onClick = {this.alertMe}>this is first test </h1>
				{Submessages}
			</div>
		)
	}
}

class Submessage extends Component {
	render(){ 
		return(
			<div>
				<h3>this is Submessage</h3>
				<Footer/>
			</div>
		)
	}
}

class Footer extends Component {
	render() {
		return (
			<small>there is we are</small>
		)
	}
}

ReactDOM.render(<MessageBox/>, document.getElementById('app'),console.log("finish"));

//src/4-组件状态1.js
import React, {Component} from 'react';
import ReactDOM from 'react-dom';

class MessageBox extends Component {
	constructor(props) {
		super(props)
		this.state = {
			isVisible: true,
			titleMessage: 'this is state' 
		};
		this.alertMe = this.alertMe.bind(this);//必须进行绑定
	}

	alertMe() {
			if(this.state.isVisible){
				this.setState({ isVisible: false});
			} else{
				this.setState({ isVisible: true});
			}
			
		}

	render() {
		var styleOb ={
			color:this.state.isVisible ? 'red' : 'yellow'
		}

		return (
			<div style = {styleOb}>
				<h1 onClick = {this.alertMe}>{this.state.titleMessage}</h1>
				<Submessage/>
			</div>
		)
	}
}

ReactDOM.render(<MessageBox/>, document.getElementById('app'),console.log("finish"));
//src/5-组件状态2.js
import React, {Component} from 'react';
import ReactDOM from 'react-dom';

class ClickApp extends Component {
	constructor(props) {
		super(props);
		this.state = {
			clickCount : 0
		}
		this.onEvent = this.onEvent.bind(this);
		this.onClear = this.onClear.bind(this);
	}

	onEvent() {
		this.setState({clickCount: this.state.clickCount+1});
	}
	onClear(){
		this.setState({clickCount: 0})
	}

	render() {
		return(
			<div>
				<h2> clicl app</h2>
				<button onClick ={this.onEvent}>Click Me!</button>
				<button onClick ={this.onClear}>Clear</button>
				<p>this is click count {this.state.clickCount}</p>
			</div>
		)
	}
}

ReactDOM.render(<ClickApp/>, document.getElementById('app'),console.log("finish"));
//src/6-怎么声明默认的props和传入props.js
import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

class MessageBox extends Component {
	constructor(props) {
		super(props)
		this.state = {
			isVisible: true,
			// titleMessage: 'this is state',
			submessages: [
				'i can move',
				'the diverse move',
				'i do not want to talk, i need to go back to work....'
			] 
		};
		this.alertMe = this.alertMe.bind(this);//必须进行绑定
	}

	alertMe() {
			if(this.state.isVisible){
				this.setState({ isVisible: false});
			} else{
				this.setState({ isVisible: true});
			}
			
		}

	render() {
		var styleOb ={
			color:this.state.isVisible ? 'red' : 'yellow'
		}

		return (
			<div style = {styleOb}>
				{/*<h1 onClick = {this.alertMe}>{this.state.titleMessage}</h1>*/}
				<h1 onClick = {this.alertMe}>{this.props.title}</h1>
				<Submessage messages={this.state.submessages}/>
			</div>
		)
	}
}

class Submessage extends Component {
	constructor(props){
		super(props);

	}


	render() {
		var msgs = [];
		this.props.messages.forEach((msg,index) => {
			msgs.push(
				<p key={'keys' + index}>developers said: {msg}</p>
			)
		}) 

		return(
			<div>{msgs}</div>
		)
	}
}

Submessage.defaultProps = {
		messages:['this is defualt messages array']
};
Submessage.propTypes = {
		messages: PropTypes.array
};
var titlemessage = 'this is props title'

ReactDOM.render(<MessageBox title={titlemessage}/>, document.getElementById('app'),console.log("finish"));
//