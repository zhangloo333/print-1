/*
--src
	--reducers
		--index.js
		--reducer_posts.js
	--components
		--app.js
		--greet.js
		--main_page.js
		--post_edit.js
		--post_new.js
	--actions
		--index.js
	--index.js
	--reoutes.js
*/


/* index.js*/

import "babel-polyfill";
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers';
import routes from './routes';
import {Router, browserHistory} from 'react-router';
import thunk from 'redux-thunk';
import promise from 'redux-promise';

const createStoreWithMiddleware = applyMiddleware(
promise
)(createStore);

ReactDOM.render(
  <Provider store={createStoreWithMiddleware(reducers)}>
    <Router history={browserHistory} routes={routes}/>
  </Provider>
, document.querySelector('#bloger'));

/* routes.js*/
import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/app';
import Greating from './components/greet';
import MainPage from './components/main_page';
import PostsNew from './components/posts_new';
import EditPosts from './components/post_edit';

export default(
  <Route path = "/app" component = {App} >
    <IndexRoute component={MainPage} />
    <Route path="/app/posts/new" component={PostsNew} />
    <Route path="/app/:id" component={EditPosts} />
  </Route>
);

/*reducers*/
// reducer/index.js

import { combineReducers } from 'redux';
import PostsReducer from './reducer_posts';
import { reducer as formReducer} from 'redux-form';

const rootReducer = combineReducers({
  posts: PostsReducer,
  form: formReducer
});

export default rootReducer;

/*src/reducers/reducer_posts.js*/

import {FETCH_POSTS,FETCH_POST,DELETE_POST,DELETE_ALLPOST,EDIT_POST} from '../actions/index';
import _ from 'lodash';

const INITIAL_STATE ={all: [], post: null};

export default function(state = INITIAL_STATE, action) {
  switch(action.type) {
    case FETCH_POST:
      return {...state, post:action.payload.data.post}
    case FETCH_POSTS:
      return {...state, all:action.payload.data.blog.posts};
    case DELETE_POST:
        // console.log('***',state);
        // console.log('###',action);
        // let allstate = _.remove(state.all,function(e){ return e.id === action.payload});
        // console.log(allstate);
        // let newsate = {...state, all:allstate};
        // console.log('this is new',newsate);
        // return newsate;
        return {...state, all:action.payload.data.blog.posts};
    case EDIT_POST:
        return {...state, all:action.payload.data.blog.posts};
    case DELETE_ALLPOST:
        return INITIAL_STATE;
    default:
      return state;
  }
}

/* components */

// src/components/app.js


import React, { Component } from 'react';

export default class App extends Component {
  render() {
    return (
          <div>
              {this.props.children}
          </div>
    );
  }
}

// src/components/greet.js
import React, {Component} from 'react';
import { connect } from 'react-redux';


export default class Greating extends Component{
  render() {
    return <div>hey there</div>
  }
}

// src/components/main_page.js
import React, {Component,PropTypes} from 'react';
import { connect } from 'react-redux';
import {Link} from 'react-router';
import { bindActionCreators } from 'redux';
import {fetchPosts,deletePost,deleteAllPost} from '../actions/index';


class MainPage extends Component {
  constructor(props) {
    super();
  }
  static contextTypes = {
    router: PropTypes.object
  }
  componentWillMount() {
    this.props.fetchPosts();
    console.log('this is from main component');
    console.log(this.props.posts);
  }

  renderHistory() {
      return this.props.posts.map((post) => {
        let date = post.timestamp.substring(8,10) + post.timestamp.substring(3,8) + post.timestamp.substring(23,29);
        return(
          <li className ='list-group-item' key={post.id}>
            <Link to={`app/${post.id}`}>
              <span> {date} - </span>
              <strong>{post.title}</strong>
            </Link>
          </li>
        )
      });
  }

  renderContent() {
    return this.props.posts.map((post) => {
      let date = post.timestamp.substring(8,10) + post.timestamp.substring(3,8) + post.timestamp.substring(23,29);
      return(
        <li className ='list-group-item' key={`${post.id}1`}>
          <div>
            <h5>Post: {post.title} <span className='pull-right'>{date}</span></h5>
            <p>{post.text}</p>
            <p>ID: {post.id}</p>
          </div>
          <div className = "button">
            <Link to={`app/${post.id}`} className="btn btn-primary" >
                Edit the post
            </Link>
            <button className="btn btn-danger "
                    onClick={this.onDeleteClick.bind(this,post.id)}>
              DELETE
            </button>
          </div>
        </li>
      )
    });
  }

  onDeleteClick(id){
    this.props.deletePost(id).then(() => {
      this.context.router.push('/app/posts/new');
      this.context.router.push('/app');
    });

}

  onDeleteAllClick(){
    this.props.deleteAllPost().then(() => {
      // this.context.router.push('/app/posts/new');
      this.context.router.push('/app');
  })
};

  render() {
    return (
      <div className = 'row index'>
        <div className = 'col-sm-offset-1 col-md-3'>
              <div className = 'row'>
                <div className = 'col-md-9'>
                    <h4>Past Posts</h4>
                  <ul className='list-group'>
                   {this.renderHistory()}
                  </ul>
                  <Link to="app/posts/new" className="btn btn-primary" >
                      Add a post
                  </Link>
                  <button className="btn btn-danger "
                          onClick={this.onDeleteAllClick.bind(this)}>
                    Delete All
                  </button>
                </div>
              </div>
        </div>

        <div className = 'col-md-7'>
            <h3>Bloger Pannel / All my Bloger</h3>
            <ul className='list-group posts'>
                {this.renderContent()}
            </ul>
        </div>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {posts: state.posts.all};
}

export default connect(mapStateToProps,{fetchPosts,deletePost,deleteAllPost})(MainPage);

//src/components/post_edit.js
import React, {Component, PropTypes} from 'react';
import {reduxForm} from 'redux-form';
import {createPost,fetchPosts,fetchPost,deletePost,editPost} from '../actions/index';
import { bindActionCreators } from 'redux';
import {Link} from 'react-router';


class EditPosts extends Component {
  static contextTypes = {
      router: PropTypes.object
  }
  componentWillMount(){
    this.props.fetchPost(this.props.params.id);
  }

  onSubmit(props,id) {
      this.props.editPost(props,this.props.post.id).then(()=>{
        this.context.router.push('/app');
      })
  }


  render() {
    const {fields:{title,text}, post,handleSubmit} = this.props;

    console.log('this from render');
    console.log(this.props.post);
    if(!this.props.post) {
      return <div>Loading....</div>
    }

    return(
      <div className="container-fluid">
        <div className='row'>
          <div className='col-md-offset-3 col-md-6'>
            <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
                <h3>Edit for this post</h3>
                <div>
                      <label>Title</label>
                      <input type="text" className="form-control" value={post.title} {...title}/>
                      <div className="text-help">
                          { title.touched ? title.error : ""}
                      </div>
                </div>

                <div className = {`form-group ${text.touched && text.invalid? 'has-danger' : ''}`}>
                      <label>Content</label>
                      <textarea rows="10" type="text" value={post.text}className="form-control"
                      placeholder = { text.touched ? text.error : ""}
                      {...text}/>
                </div>

                <button type ="submit" className="btn btn-primary">Submit</button>
                <Link to ="/app" className="btn btn-danger">Cancel</Link>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

function validate(values) {
  const errors = {};
  if(!values.title) {
    errors.title = 'Enter a username';
  }
  if(!values.text) {
    errors.text = 'Enter a text';
  }
  return errors;
}

function mapStateToProps(state) {
  return {post: state.posts.post};
}


export default reduxForm({
    form: 'EditForm',
    fields:['title','text'],
    validate
},mapStateToProps,{createPost,fetchPosts,fetchPost,deletePost,editPost})(EditPosts);

//src/components/posts_new.js
import React, {Component,PropTypes} from 'react';
import {reduxForm} from 'redux-form';
import { createPost } from '../actions/index';
import {Link} from 'react-router';


class PostsShow extends Component {
    static contextTypes = {
      router: PropTypes.object
    }

  onSubmit(props) {
    console.log(props);
    this.props.createPost(props)
    .then(() => {
        this.context.router.push('/app');
    });
  }

  render() {
    const {fields:{title,text}, handleSubmit} = this.props;
    return(
      <div className="container-fluid">
        <div className='row'>
          <div className='col-md-offset-3 col-md-6'>
            <form onSubmit={handleSubmit(this.onSubmit.bind(this))}>
              <h3>Create A New Post</h3>

              <div className = { `form-group ${title.touched && title.invalid? 'has-danger' : ''}`}>
                  <label>Title</label>
                  <input type="text" className="form-control" placeholder = { title.touched ? title.error : ""} {...title}/>
                  <div className="text-help">
                    { title.touched ? title.error : ""}
                  </div>
              </div>

              <div className = {`form-group ${text.touched && text.invalid? 'has-danger' : ''}`}>
                  <label>Content</label>
                  <textarea rows="10" type="text" className="form-control"
                  placeholder = { text.touched ? text.error : ""}
                  {...text}/>
             </div>

             <button type ="submit" className="btn btn-primary">Submit</button>
             <Link to ="/app" className="btn btn-danger">Cancel</Link>

            </form>
          </div>
        </div>
      </div>
  )}
}

function validate(values) {
  const errors = {};
  if(!values.title) {
    errors.title = 'Enter a username';
  }
  if(!values.text) {
    errors.text = 'Enter a text';
  }
  return errors;
}

export default reduxForm({
    form: 'PostsNewForm',
    fields:['title','text'],
    validate
},null,{createPost})(PostsShow);

/*action*/

// action

import axios from 'axios';
import qs from 'qs';

export const FETCH_POSTS = 'FETCH_POSTS';
export const CREATE_POST = 'CREATE_POST';
export const FETCH_POST = 'FETCH_POST';
export const DELETE_POST = 'DELETE_POST';
export const DELETE_ALLPOST = 'DELETE_ALLPOST';
export const EDIT_POST = 'EDIT_POST';


const ROOT_URL = 'http://localhost:8080/Blog/api';

//fetchSinglePost
export function fetchPost(id) {
  const request = axios.get(ROOT_URL+'/'+id);
  console.log(request);
  return {
    type:FETCH_POST,
    payload: request
  }
}

// fetchAllPosts
export function fetchPosts() {
  const request = axios.get(ROOT_URL);
  console.log('this is from action');
  console.log(request);
  return {
      type: FETCH_POSTS,
      payload: request
  }
}

// Posts a New Posts
const instance = axios.create({
    headers:{'Content-Type':'application/x-www-form-urlencoded'}
});
export function createPost(props){
  console.log(props);

  const request = instance.post(ROOT_URL,qs.stringify(props));
  return {
    type:CREATE_POST,
    payload: request
  };
}

// Delete on post
export function deletePost(id){
  axios.delete(`${ROOT_URL}/${id}`);
  const request = axios.get(ROOT_URL);
  return {
    type: DELETE_POST,
    payload: request
  }
}

export function editPost(props,id){
  const request = axios.delete(`${ROOT_URL}/${id}`).then(()=>{
    instance.post(ROOT_URL,qs.stringify(props))
  }).then(()=>axios.get(ROOT_URL));
  return {
    type:EDIT_POST,
    payload: request
  };
}

//Delete all Posts
export function deleteAllPost() {
  const request = axios.delete(ROOT_URL);
  return {
    type: DELETE_ALLPOST,
    payload: request
  }
}

