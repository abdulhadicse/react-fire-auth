
import './App.css';
import img from './bg-01.jpg'
import { useState } from 'react';
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from './firebaseConfig';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}


function App() {


  const [userForm, setUserForm] = useState(false);

  const [googleUser, setGoogleUser] = useState ({
    isLoggedIn: false,
    GPhoto:'',
    GName: '',
    GEmail:'',
    GPassword:''
  })

  const [formUser, setFormUser] = useState ({
    GName: '',
    GEmail:'',
    GPassword:'',
    GError:'',
    GSuccess: ''
  })

  console.log(formUser);
  var Gprovider = new firebase.auth.GoogleAuthProvider();
  var Fprovider = new firebase.auth.FacebookAuthProvider();

  const handleGoogleAuth = () =>{
    firebase.auth().signInWithPopup(Gprovider).then(function(result) {
      
      var user = result.user;
      const userInfo = {
        isLoggedIn: true,
        GPhoto: user.photoURL,
        GName: user.displayName,
        GEmail: user.email,
      }
      setGoogleUser(userInfo);
     // console.log(userInfo);
     
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      var email = error.email;
      var credential = error.credential;
      
    });
  }

  const handleLogOut = () => {
    firebase.auth().signOut().then(function() {
      const userInfo = {
        isLoggedIn: false,
        GPhoto: '',
        GName: '',
        GEmail: ''
      }
      setGoogleUser(userInfo);
    })
    .catch(function(error) {
      
    });
  }

  const handleFacebookAuth = () =>{
    firebase.auth().signInWithPopup(Fprovider).then(function(result) { 
      const user = result.user;
      console.log(user);
      const userInfo = {
        isLoggedIn: true,
        GPhoto: user.photoURL,
        GName: user.displayName,
        GEmail: user.email
      }
      setGoogleUser(userInfo);
      
    }).catch(function(error) {
      
      var errorCode = error.code;
      var errorMessage = error.message;
      var email = error.email;
      var credential = error.credential;
      console.log(errorMessage, error.email);
    });
  }

  const formHandler = (event) => {
      const eName = event.target.name;
      const eValue = event.target.value;

      const newUser = {...formUser};
      newUser[eName] = eValue;

      setFormUser(newUser);

  }

  const handleSubmit = (event) => {

    if(formUser.GName && formUser.GEmail && formUser.GPassword){
      firebase.auth().createUserWithEmailAndPassword(formUser.GEmail, formUser.GPassword)
      .then ( res =>{
        const newUser = {...formUser};
        newUser.GError = '';
        newUser.GSuccess= true;
        setFormUser(newUser);
      })
      .catch(function(error) {        
        var errorMessage = error.message;
        const newUser = {...formUser};
        newUser.GError = errorMessage;
        newUser.GSuccess= false;
        setFormUser(newUser);
      });
    }

    if(formUser.GName === '' && formUser.GEmail && formUser.GPassword){
      firebase.auth().signInWithEmailAndPassword(formUser.GEmail, formUser.GPassword)
      .then((res)=>{
        const user = res.user;      
        const userInfo = {
        isLoggedIn: true,
        GEmail: user.email
      }
        setGoogleUser(userInfo);
      })
      .catch(function(error) {
        var errorMessage = error.message;
        const newUser = {...formUser};
        newUser.GError = errorMessage;
        newUser.GSuccess= false;
        setFormUser(newUser);
      });

    }
    event.preventDefault();
  }

  const handleAll = () =>{
    setUserForm(!userForm);
    const infoUser = {
      GName: '',
      GEmail:'',
      GPassword:'',
      GError:'',
      GSuccess: ''
    }
    setFormUser(infoUser);
  }
  
  return (
    <div className="App">
      <div className="container">
        <div className="row d-flex justify-content-around align-items-center">
          <div className="col-md-6">
            <img className="img-fluid" src={img} alt="" />
          </div>

          <div className="col-md-6">            

            {
              googleUser.isLoggedIn ?
              
              <div className="logOut">
                <h2>You Are logged in! </h2>
                <p><span>Your Photo: </span><img src={googleUser.GPhoto} alt=""/></p>
                <p><span>Your Name: </span>{googleUser.GName}</p>
                <p><span>Your Email: </span>{googleUser.GEmail}</p>

                <button onClick={handleLogOut} className="btn btn-success">Logout</button>           
              </div>

              :
            <div>
            <div>
              <h1 class="text-center mb-3">{userForm ?
                'Account Login' :
                'Create an Account'}</h1>

              <form action="#" onSubmit={handleSubmit}>
                { userForm ? 
                <div className="form-row">
                  <div className="col">
                    <input type="email" onChange={formHandler} name="GEmail" className="form-control" placeholder="Enter Your Email" required />
                  </div>
                  <div className="col">
                    <input type="password" onChange={formHandler} name="GPassword" className="form-control" placeholder="Password" required />
                  </div>
                </div>
                :
                <div className="form-row p-1">
                  <input type="text" onChange={formHandler} name="GName" className="form-control mb-2" placeholder="Username" required />
                  <input type="email" onChange={formHandler} name="GEmail" className="form-control mb-2" placeholder="Email" required />
                  <input type="password" onChange={formHandler} name="GPassword" className="form-control " placeholder="Password" required />
                </div>
                }
                <div>
                  <input type="submit" className="form-control btn-success mt-2" value= {userForm ?
                  'SIGN IN' :
                  'SIGN UP'} />
                </div>
              </form>
                
            </div>
            {
                  formUser.GSuccess ? <p className="text-success text-center" >User create account successfully</p> : <p className="text-warning text-center">{formUser.GError}</p>
            }
            <div className="d-flex justify-content-around align-items-center mt-5">
              <h6 className="text-success"><a onClick={handleAll} className="text-decoration-none" href="#">{userForm ?
                <span>SIGN UP</span> :
                <span>SIGN IN</span>}</a></h6>
                <h6><a onClick={handleFacebookAuth} className="text-decoration-none" href="#">Facebook</a></h6>
                <h6><a onClick={handleGoogleAuth} className="text-decoration-none" href="#">Google</a></h6>
                
            </div>
         </div>
            
          
        }


          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
