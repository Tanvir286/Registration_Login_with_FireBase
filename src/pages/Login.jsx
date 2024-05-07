// Import statements
import React, {useState,useEffect} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getAuth,  signInWithEmailAndPassword } from "firebase/auth";

import { FaEye,FaEyeSlash } from "react-icons/fa6";
import { RotatingLines } from 'react-loader-spinner'
import {  toast } from 'react-toastify';

import Flex from './../component/Flex';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';

// Import Images
import Banner from '../assets/banner.jpg'
import Logo from '../assets/logo.png'

import { useDispatch, useSelector } from 'react-redux';
import { activeUser } from '../Slices/userSlice';



const Login = () => {

     // Initialize Firebase auth and navigate hook
     const auth = getAuth();
     let navigate = useNavigate();
     let dispatch = useDispatch();

     let data = useSelector((state) => state?.user?.value)


     // State variables
 
     const [showPassword, setShowPassword] = useState(false);
     const [loading,setLoading] = useState(false);

     const [formData, setFormData] = useState({  email: "", password: "" });
     const [formErrors,setFormErrors] = useState({  email: "", password: "" });
 
     
 
 
     // Handle form field changes
     let handleChange = (e) =>{
         // console.log(e.target.name,e.target.value);
         const { name, value } = e.target;
         setFormData({ ...formData, [name]: value });
         setFormErrors({ ...formErrors, [name]: "" });
     }; 
 
 
  
      
 
     // Handle form submission
     let handleSubmit = () => {
 
         let email_pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
         //let result = pattern.test(text);
   
         // Form validation
        
         if(!formData.email){
             setFormErrors({...formErrors, email: "Please enter your email"})}
         else if(!email_pattern.test(formData.email)){
             setFormErrors({...formErrors, email: "Please use valid email"})}
         else if(!formData.password){
             setFormErrors({...formErrors, password: "Please enter your password"})}
         else if(formData.password.length < 6){
             setFormErrors({...formErrors, password: "Password must be greater than 6 word"})}
         else{
             setLoading(true);
            
             {/*Login Part Start Here*/} 
 
             signInWithEmailAndPassword(auth, formData.email, formData.password)
               
              .then((userCredential) => {
                console.log(userCredential.user,"fff");
                console.log(userCredential.user.emailVerified);
                setFormErrors({name:'',email:'',password:'',});
                setLoading(false); 
                if(!userCredential.user.emailVerified){
                    toast.error('Please verify your email first', {
                        position: "bottom-right",
                        autoClose: 3000,
                        theme: "light",  
                        });  }
                else{
                    toast.success('Login Successful', {
                        position: "bottom-right",
                        autoClose: 3000,
                        theme: "light",  
                        });
                         /*  set data local Storage    */
                        localStorage.setItem('user',JSON.stringify(userCredential.user));
                        navigate('/home');
                        /*  set data activeUser with main value   */
                        dispatch( activeUser(userCredential.user)); }     
                
                })
               .catch((error) => {
                 setLoading(false);
                 console.log("not add");
                  const errorCode = error.code;
                  const errorMessage = error.message
                   console.log(error.message);
                   setFormData({email:'',password:'',});
                   if(error.message.includes("auth/invalid-credential")){
                    toast.error('wrong email or password', {
                        position: "top-right",
                        autoClose: 2000,
                        theme: "light",  
                        });
                   }
                  
                 }); 
                
              }
 
             {/*Login Part Start Here*/}
                  
         }
   
    /*  if  email  thake tahole home page Chole jabe  */
      
         useEffect(() => {     
            console.log(data,"ki");
            // redux default behavior hoilo  reload korle empty hoiya jai jar karone logout hoiya jai
            if(data?.email){
             navigate('/home')
            } 
         },[])

     /*  if  email  thake tahole home page Chole jabe  */

    return (
        <div> 
        <Flex>

           <div className='first-half'>
                <div className="Registration_box">
                    <div className='shadow'>

                        <img src={Logo} alt="" />
                      
                        <h1 className='title'>Login to your account !!</h1>

                
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
                            <Alert  severity="error" className='errorBox'>{formErrors.email}
                            </Alert>
                         }


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
                         {showPassword ? <FaEye onClick={() => setShowPassword(!showPassword)} className='eye-icon2' /> :
                           <FaEyeSlash onClick={() => setShowPassword(!showPassword)} className='eye-icon2' />}
          
                         {/*Showpassword Icon Part  start */}

                         
                         { formErrors.password &&
                            <Alert  severity="error" className='errorBox'>{formErrors.password}
                            </Alert>
                         }

                        {/* Password  Part End */}
                
                        {/* ForgotPassword  Part Start */}

                        <div className='forgot_pass'>
                            <Link to="/forgotpassword" > Forgot Password  </Link>
                           
                        </div>
 
                        {/* ForgotPassword  Part End */}

                    <div>

                         
                         </div>

                   <div>
                      
                        
                        
                        {/*  submit Button Part Start */}

                         
                         <button className="submit-button" onClick={handleSubmit}>Submit</button> 

                          
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
                        <p className='subpart'> Don't have an account?  <Link to="/" > Create account </Link>   </p>

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

export default Login;