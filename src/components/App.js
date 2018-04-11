import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Header from './Header';
import Order from './Order';
import Invertory from './Invertory';
import Fish from './Fish';
import sampleFishes from '../sample-fishes';
import base from '../base';

class App extends Component {
  state = {
    fishes: {},
    order: {}
  }

  componentWillMount() {
    // this runs before <App> is rendered
    this.ref = base.syncState(`${this.props.match.params.storeId}/fishes`,//ovo je url: na firebase project/database/fishes 
      {
        context: this,  // sinkroniziramo ovu componentu i state koji navedemo => 'fishes'
        state: 'fishes' // sa firebase ...nesto/fishes
      });

    // check if there is any order in localStorage
    const localStorageRef = localStorage.getItem(`order-${this.props.match.params.storeId}`);

    if (localStorageRef) {
      // update our App component's order state
      this.setState({
        order: JSON.parse(localStorageRef)
      });
    }
  }

  componentWillUnmount() {
    base.removeBinding(this.ref);
  }

  componentWillUpdate(nextProps, nextState) {
    localStorage.setItem(`order-${this.props.match.params.storeId}`, JSON.stringify(nextState.order));
  }

  addFish = (fish) => {
    const fishes = { ...this.state.fishes };
    const timestamp = Date.now();
    fishes[`fish-${timestamp}`] = fish;
    this.setState({ fishes });
  }

  removeFish = (key) => {
    const fishes = { ...this.state.fishes };
    fishes[key] = null;       // ovako brisemo jer je sync sa firebase-om
    this.setState({ fishes });
  }

  updateFish = (key, updatedFish) => {
    const fishes = { ...this.state.fishes };
    fishes[key] = updatedFish;
    this.setState({ fishes });
  }

  loadSamples = () => {
    this.setState({
      fishes: sampleFishes
    });
  }

  addToOrder = (key) => {
    const order = { ...this.state.order }
    order[key] = order[key] + 1 || 1;
    this.setState({ order });
  }

  removeFromOrder = (key) => {
    const order = { ...this.state.order }
    delete order[key];
    this.setState({ order });
  }

  render() {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh sea food market" />
          <ul className="list-of-fishes">
            {
              Object.keys(this.state.fishes)
                .map(fish => <Fish key={fish} index={fish} details={this.state.fishes[fish]} addToOrder={this.addToOrder} />)
            }
          </ul>
        </div>
        <Order
          fishes={this.state.fishes}
          order={this.state.order}
          params={this.props.match.params}
          removeFromOrder={this.removeFromOrder} />
        <Invertory
          addFish={this.addFish}
          updatedFish={this.updateFish}
          removeFish={this.removeFish}
          loadSamples={this.loadSamples}
          fishes={this.state.fishes}
          storeId={this.props.match.params.storeId} />
      </div>
    );
  }
};

App.propTypes = {
  match: PropTypes.object.isRequired
}

export default App;