import React, { Component } from 'react';
import logo from './logo.svg';
import firebase, { auth, provider } from './fire.js';
import './App.css';

var foodItem = "";
var foodItemsChecked = false;
var foodItemSnapshots = "";
var foodButtonList = [];

class App extends Component {
  constructor() {
      super();
      
      this.state = {
          user: null,      		
      		foodItemField: 'Please enter a food item'
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.login = this.login.bind(this); 
    this.logout = this.logout.bind(this); 
    this.handleChange = this.handleChange.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const data = new FormData(event.target);
    
    fetch('/sendmail', {
      method: 'POST',
      body: data//,
      //timeout: 0
    });
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
  }

  removeFoodItem(item){

    var food = null;

    var db = firebase.database();
    var ref = db.ref('food-items/');
    ref.orderByChild(item).on("child_added", function (snapshot) {
        food = snapshot.key; 
        console.log(snapshot.key);
    });
    console.log("food" + food);
    firebase.database().ref('food-items/').child(food).remove();

  }  
  
  //Render introduction overlay when web app starts
  render() {
    return (
      <div id="interctable" >
        <form id = "payment-form" /*action= "/sendmail" method="POST"*/ onSubmit={this.handleSubmit}>
          <script
            src="https://checkout.stripe.com/checkout.js" class="stripe-button"
            data-key="KEY"
            data-amount="999"
            data-name="Company Name"
            data-description="Widget"
            data-image="/img/documentation/checkout/marketplace.png"
            data-locale="auto">
          </script>
        </form>
        <div id="intro">
        </div>
            {foodButtonList.map((item, index) => {
              return (
                <div className="box" key={index}>
                  <div>
                    <button onClick={() => this.removeFoodItem(item)}>{item/*.title*/}</button>
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
form.appendChild(script);
  }

  

}


export default App;