import React, { Component } from 'react';
import logo from './logo.svg';
import firebase, { auth, provider } from './fire.js';
import './App.css';
import axios from 'axios';
import StripeCheckout from 'react-stripe-checkout';

var foodItem = "";
var foodItemsChecked = false;
var foodItemSnapshots = "";
var foodButtonList = [];

var selectedFoodItem = "";

class App extends Component {
  constructor() {
      super();
      
      this.state = {
          user: null,      		
          foodItemField: 'Please enter a food item',
          value: ""
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.login = this.login.bind(this); 
    this.logout = this.logout.bind(this); 
    this.handleChange = this.handleChange.bind(this);
  }

  onToken = (token) => {
    fetch('/sendmail', {
      method: 'POST',
      body: JSON.stringify(token),
    }).then(response => {
      response.json().then(data => {
        alert(`We are in business, ${data.email}`);
      });
    });

    console.log("email sent");
    this.removeFoodItem();
  }

  handleSubmit(event) {
    
    alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
    console.log("handlesub");
    const data = new FormData(event.target);
    fetch('/sendmail', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: {
        "first_name": "t"
      }
    });

    return false;
  }

  saveFoodItem(){
    firebase.database().ref('food-items/').push(foodItem);
  }

  createFoodItemList() {

    console.log("list created")

		//If maps haven't been cheked, get the list from Firebase to generate buttons
		if (!foodItemsChecked) {
			foodItemsChecked = true;

    		//Get the names of all of a user's maps, and add to a list. This will be used to generate links in the 'maps' section
      		var db = firebase.database();
      		var ref = db.ref('food-items/');
      		ref.orderByChild("food-items").on("child_added", function (snapshot) {
         			foodItemSnapshots+="|"+snapshot.val(); 
        	});

    }
    
    console.log(foodItemSnapshots);
    this.generateButtonList();
  }

  //Parse map data to generate a list of buttons to create	
	generateButtonList(){
    console.log("generating buttons");
		foodButtonList = foodItemSnapshots.split("|");
    foodButtonList.shift();
    console.log(foodButtonList);
	}

  //Update map name field with user input
  handleChange(event) {
    this.setState({ foodItemField: event.target.value });
    foodItem = event.target.value;
    console.log(event.target.value);
  }

  //Auth functions
  logout() {
    auth.signOut()
      .then(() => {
        this.setState({
          user: null
        });
      });
  }

  login() {
    auth.signInWithPopup(provider)
      .then((result) => {
        const user = result.user;
        console.log("user: " + user);
        this.setState({
          user
        });
      });
//fgfg
      //return false;
  }

  activatePayView(item){
    selectedFoodItem = item + "";
    var payPanel = document.getElementById('pay-view');
    payPanel.hidden = false;
  }

  removeFoodItem(){

    var food = null;

    var db = firebase.database();
    var ref = db.ref('food-items/');
    ref.orderByChild(selectedFoodItem).on("child_added", function (snapshot) {
        food = snapshot.key; 
        console.log(snapshot.key);
    });
    console.log("food" + food);
    firebase.database().ref('food-items/').child(food).remove();

  
    var payPanel = document.getElementById('pay-view');
    payPanel.hidden = true;

  }  
  
  //Render introduction overlay when web app starts
  render() {
    return (
      <div id="interctable" >
        <div id = "employees">
          <p>hello world</p>
        </div>

        <div id = "pay-view" className = "pay-view">
        <h2>{selectedFoodItem}</h2>
        <StripeCheckout
        token={this.onToken}
        stripeKey="pk_test_46rh9JVaHf6uNj9pvZaFSio8"
      />
      </div>
        <div id="intro">
        </div>
            {foodButtonList.map((item, index) => {
              return (
                <div className="box" key={index}>
                  <div>
                    <button onClick={() => this.activatePayView(item)}>{item/*.title*/}</button>
                  </div>
                </div>
              )
            })}
        <div>
              {this.state.user && !foodItemsChecked ? this.createFoodItemList(): false
              }
              </div>
        <div>
              {foodItemSnapshots==null ? false : this.generateButtonList()}
            </div><div>
    {this.state.user ?
              <button  className="save-map" onClick={this.saveFoodItem.bind(this)}>Save Food</button>
              :
              <button  className="save-map" onClick={this.login}>Sign In</button>
            }
          <img src={logo} className="App-logo" alt="logo" />
          
          <div className = "profile-details"  id="profile-details">
            {this.state.user ?
              <button onClick={this.logout}>Log Out</button>
              :
              <button onClick={this.login}>Ignore this button for now</button>
            }
            <input
            type="text"
            value={this.state.foodItemField}
            onChange={this.handleChange}
          />
            </div>
            </div>
            </div>
            );
  }
  //Check auth info
  componentDidMount() {
    auth.onAuthStateChanged((user) => {
        if (user) {
          this.setState({ user });
          var userID = user.uid;
        }
    });
/*
const script = document.createElement("script");
script.src="https://checkout.stripe.com/checkout.js" ;
script.className="stripe-button";
script.dataset.key="pk_test_46rh9JVaHf6uNj9pvZaFSio8";
script.dataset.amount="999";
script.dataset.name="Company Name";
script.dataset.description="Widget";
script.dataset.image="https://stripe.com/img/documentation/checkout/marketplace.png";
script.dataset.locale="auto";
script.dataset.zipCode="true"; // Note camelCase!
let form = document.getElementById('payment-form');
form.appendChild(script);*/

//this.refs.form.onSubmit = () => this.login();


var payPanel = document.getElementById('pay-view');
payPanel.hidden = true;
  }

  

}


export default App;