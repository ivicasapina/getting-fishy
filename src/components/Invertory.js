import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AddFishForm from './AddFishForm';
import base from '../base';

class Invertory extends Component {
  state = {
    uid: null,
    owner: null
  }

  componentDidMount() {
    base.initializedApp.firebase_.auth().onAuthStateChanged((user) => {
      if (user) {
        this.authHandler({ user });
      }
    });
  }

  handleChange = (e, key) => {
    const fish = this.props.fishes[key];
    const updatedFish = {
      ...fish,
      [e.target.name]: e.target.value
    };
    this.props.updatedFish(key, updatedFish);
  }

  authenticate = (provider) => {
    let authProvider = null;
    if (provider === "github") {
      authProvider = new base.initializedApp.firebase_.auth.GithubAuthProvider();
    }
    else if (provider === "google") {
      authProvider = new base.initializedApp.firebase_.auth.GoogleAuthProvider();
    }
    else {
      authProvider = new base.initializedApp.firebase_.auth.FacebookAuthProvider();
    }

    base.initializedApp.firebase_.auth().signInWithPopup(authProvider)
      .then(this.authHandler)
      .catch();
  }

  authHandler = (res) => {
    const storeRef = base.initializedApp.firebase_.database().ref(this.props.storeId);
    // query the firebase once for the store data
    storeRef.once('value', (snapshot) => {
      const data = snapshot.val() || {};
      // claim it as our own if there is no owner allready
      if (!data.owner) {
        storeRef.set({
          owner: res.user.uid
        });
      }

      this.setState({
        uid: res.user.uid,
        owner: data.owner || res.user.uid
      })
    });
  }

  logout = () => {
    base.initializedApp.firebase_.auth().signOut();
    this.setState({ uid: null });
  }

  renderLogin = () => {
    return (
      <nav className="login">
        <h2>Invertory</h2>
        <p>Sign in to manage your store's invertory</p>
        <button className="github" onClick={() => this.authenticate('github')}>Log in with Github</button>
        <button className="google" onClick={() => this.authenticate('google')}>Log in with Google</button>
        <button className="facebook" onClick={() => this.authenticate('facebook')}>Log in with Facebook</button>
      </nav>
    );
  }

  renderInvertory = (key) => {
    const fish = this.props.fishes[key];
    return (
      <div className="fish-edit" key={key}>
        <input type="text" name="name" value={fish.name} placeholder="Fish Name"
          onChange={(e) => { this.handleChange(e, key) }} />
        <input type="text" name="price" value={fish.price} placeholder="Fish Price"
          onChange={(e) => { this.handleChange(e, key) }} />
        <select name="status" value={fish.status}
          onChange={(e) => { this.handleChange(e, key) }} >
          <option value="available">Fresh</option>
          <option value="unavailable">Sold Out!</option>
        </select>
        <textarea name="desc" value={fish.desc} placeholder="Fish Desc"
          onChange={(e) => { this.handleChange(e, key) }} ></textarea>
        <input type="text" name="image" value={fish.image} placeholder="Fish Image"
          onChange={(e) => { this.handleChange(e, key) }} />
        <button onClick={() => this.props.removeFish(key)}>Remove Fish</button>
      </div>
    )
  }

  render() {
    const logout = <button onClick={this.logout}>Log Out!</button>

    // check if they are no logged in at all
    if (!this.state.uid) {
      return <div>{this.renderLogin()}</div>
    }

    // check if they are the owner of the current store
    if (this.state.uid !== this.state.owner) {
      return (
        <div>
          <p>Sorry you aren't the owner of this store!</p>
          {logout}
        </div>
      )
    }

    return (
      <div>
        <h2>Invertory</h2>
        {logout}
        {Object.keys(this.props.fishes).map(this.renderInvertory)}
        <AddFishForm addFish={this.props.addFish} />
        <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
      </div>
    );
  }
};

Invertory.propTypes = {
  fishes: PropTypes.object.isRequired,
  storeId: PropTypes.string.isRequired,
  removeFish: PropTypes.func.isRequired,
  addFish: PropTypes.func.isRequired,
  updatedFish: PropTypes.func.isRequired,
  loadSamples: PropTypes.func.isRequired
}

export default Invertory;