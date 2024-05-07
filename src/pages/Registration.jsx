
// Import statements
import React, {useState} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword ,sendEmailVerification , GoogleAuthProvider  ,signInWithPopup, updateProfile } from "firebase/auth";

import { FaEye,FaEyeSlash } from "react-icons/fa6";
import { RotatingLines } from 'react-loader-spinner'
import {  toast } from 'react-toastify';

import Flex from './../component/Flex';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';

// Import Images
import Banner from '../assets/banner.jpg'
import ApplePic from '../assets/apple.png'
import GooglePic from '../assets/google.png'
import Logo from '../assets/logo.png'
import Image from '../component/Image';


const Registration = () => {

    // Initialize Firebase auth and navigate hook
    const auth = getAuth();
    let navigate = useNavigate();
    
    // State variables

    const [showPassword, setShowPassword] = useState(false);
    const [loading,setLoading] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const [formData, setFormData] = useState({ name: "", email: "", password: "" });
    const [formErrors,setFormErrors] = useState({ name: "", email: "", password: "" });


    // Handle form field changes
    let handleChange = (e) =>{
        console.log(e.target.name,e.target.value);
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setFormErrors({ ...formErrors, [name]: "" });
    }; 


    // Handle checkbox change
    const handleCheckboxChange = (e) => {
        //console.log(e.target.checked);
        setAgreedToTerms(e.target.checked);
    };
     

    // Handle form submission
    let handleSubmit = () => {

        let email_pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        //let result = pattern.test(text);
  
        // Form validation
        if(!formData.name){
            setFormErrors({...formErrors, name: "Please enter your name"})}
        else if(!formData.email){
            setFormErrors({...formErrors, email: "Please enter your email"})}
        else if(!email_pattern.test(formData.email)){
            setFormErrors({...formErrors, email: "Please use valid email"})}
        else if(!formData.password){
            setFormErrors({...formErrors, password: "Please enter your password"})}
        else if(formData.password.length < 6){
            setFormErrors({...formErrors, password: "Password must be greater than 6 word"})}
        else{
            setLoading(true);
           
            {/*Create user with email password*/} 

            createUserWithEmailAndPassword(auth, formData.email, formData.password)
              
             .then((userCredential) => {

                {/*Update Profile Name & Picture Start */}

                updateProfile(auth.currentUser, {
                    displayName: formData.name, photoURL: "https://firebasestorage.googleapis.com/v0/b/fancode-3cc57.appspot.com/o/avater%2Fdemo.jpg?alt=media&token=af850167-4d98-4086-b5c9-19e9cbc16763"
                  }).then(() => {
                    console.log(userCredential);
                    setFormErrors({name:'',email:'',password:'',})
                    setLoading(false);
                 
                    {/*Email Verification start*/} 
     
                    sendEmailVerification(auth.currentUser).then(() => {
                     toast.success('Registration Successful,Please check your email for verification', {
                         position: "bottom-right",
                         autoClose: 5000,
                         theme: "light",  
                         }); 
     
                     });
     
                    {/*Email Verification end */} 
                      navigate('/login'); 
                    
                  }).catch((error) => {                
                    setLoading(false);
                    console.log(error,"Update");
                  });
               
                {/*Update Profile Name & Picture  End */}
             
               })
              .catch((error) => {
                setLoading(false);
                console.log("not add");
                 const errorCode = error.code;
                 const errorMessage = error.message
                  console.log(error.message);
                  console.log(error.message);
                  console.log(error.message.includes("email-already-in-use"));
                  if(error.message.includes("email-already-in-use")){
                    setFormErrors({...formErrors, email: "Email already exists" });
                  }
                }); 
             }

            {/*Create user with email password*/}
                 
        }
  

        let handleGlogin = () => {
   
            const provider = new GoogleAuthProvider();
            signInWithPopup(auth, provider)
            .then((result) => {
                
               navigate('/login')
            }).catch((error) => {
                console.log(error.code);
            });  
        }


    return (
        <div> 
             <Flex>

                <div className='first-half'>

                     <div className="Registration_box">

                      <div className="shadow">

                             {/*  Logo Part Here  */}
                            <img src={Logo} alt="" />
                             {/*  Logo Part Here  */}
                            <h1 className="title">Get Registration  Now !!!</h1>

                             {/* Name  Part start */}
                           
                             <TextField 
                              id="outlined-basic" 
                              label="Enter your name"
                              variant="outlined" 
                              className='Input_box' 
                              name="name"
                              onChange={handleChange}
                              value={formData.name}
                              />


                              { formErrors.name &&
                                 <Alert severity="error" className='errorBox'>{formErrors.name}</Alert>
                              }


 
                              {/* Name  Part End */}
                              {/* Email  Part Start */}

                             <TextField 
                              id="outlined-basic" 
                              label="Enter your email"
                              variant="outlined"
                              className='Input_box'
                              name="email"
                              onChange={handleChange}
                              value={formData.email}
                              />
 

                              { formErrors.email &&
                                 <Alert  severity="error" className='errorBox'>{formErrors.email}</Alert> }

                              {/* Email  Part End */}
                              {/* Password  Part Start */}

                            <div className='eye'>
                               <TextField 
                                 id="outlined-basic hi" 
                                 label="Enter your password"
                                 variant="outlined"
                                 className='Input_box'
                                 name="password"
                                 value={formData.password}
                                 onChange={handleChange}
                                 type={ showPassword ? "text" : "password"}/>
                             </div>
                            
                            
                              {/* Showpassword Icon Part  start */}
                              {showPassword ? <FaEye onClick={() => setShowPassword(!showPassword)} className='eye-icon' /> :
                                <FaEyeSlash onClick={() => setShowPassword(!showPassword)} className='eye-icon' />}
               
                              {/*Showpassword Icon Part  start */}

                              
                              { formErrors.password &&
                                 <Alert  severity="error" className='errorBox'>{formErrors.password}
                                 </Alert>
                              }

                             {/* Password  Part End */}

                        <div>
                             {/* term and Condition Part Start */}
                             <label> <input  type="checkbox"  className='term_input' onChange={handleCheckboxChange} /> I agree to the term & polic </label> <br />
                             {/* term and Condition Part Start */}
                             {/*  submit Button Part Start */}
 
                              {
                               agreedToTerms ?  <button className="submit-button" onClick={handleSubmit}>Submit</button>  :
                               <button style={{background:"#ff4f00"}} className="submit-button" onClick={handleSubmit} disabled >Submit</button>
                              }
 
                              {/*  submit Button Part End */}

                             <br />
                              {/*  Loading Part Start */}
                           
                             <div className='load'>
                             {  loading &&
                                 <RotatingLines
                                 visible={true}
                                 height="50"
                                 width="50"
                                 color="grey"
                                 strokeWidth="5"
                                 animationDuration="4.75"
                               />
                             }
                             </div>
                              {/*  Loading Part End */}


                             <p className='subpart'> Alredy have an account?  <Link to="/login" > Login </Link> </p>
                

                              

                              {/* Click With Google & Apple  Start */}
 
                             <div className="line"> <span className='spanbar'></span> <h5>( OR )</h5> <span className='spanbar'></span>  </div>
            
                             <div className='auth'>

                              <div className='auth_flex' >
                                 <img src={GooglePic} alt=""  onClick={handleGlogin}  className='auth_pic'/>
                                  <p>Sign in with Google</p>
                              </div>

                              <div className='auth_flex' >
                                 <img src={ApplePic} alt=""    className='auth_pic'/>
                                  <p>Sign in with Apple</p>
                              </div>
                             
                             </div>
                             

                             {/* Click With Google & Apple  End */}

                        </div>
                      </div> 

                    </div>        
                </div>
                {/* second half */}
                <div className='second-half' >             
                    <img src={Banner} alt="" className='banner_img' />         
                </div>
             </Flex>
        </div>
    );
};

export default Registration; 