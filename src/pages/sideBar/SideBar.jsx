import React, { useState , createRef} from 'react';
import Image from '../../component/Image';

import "./SideBar.css"
import SideBarIcon from '../../component/SideBarIcon';
// Icon
import { IoHomeOutline , IoNotificationsSharp } from "react-icons/io5";


import { AiFillMessage } from "react-icons/ai";
import { RiLogoutBoxRLine } from "react-icons/ri";
import Icon from './../../component/Icon';
import { useNavigate,Link,useLocation } from 'react-router-dom';

import { getStorage, ref, uploadString , getDownloadURL } from "firebase/storage";
import { getAuth, signOut,updateProfile } from "firebase/auth";

import { ThreeCircles } from 'react-loader-spinner'

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';


import { useDispatch,useSelector } from 'react-redux';
import { activeUser } from '../../Slices/userSlice';
 

import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";



const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid transparent',
    boxShadow: 14,
    p: 4,
  };



  const SideBar = () => {
    
    /*Upload file fireBase*/
    const storage = getStorage();
    /*Upload file fireBase*/
   
    let dispatch = useDispatch();
    let data = useSelector((state) => state.user.value );
    console.log(data);

    let location = useLocation();
     
    /*  Icon Loadind  */

    const [loading, setLoading] = useState(false);

    const auth = getAuth();
    let navigate = useNavigate();

    /* First Modal Part Here */
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    /* First Modal Part Here */

    /* Second Modal Part Here */
    const [SecondModal, setSecondModal] = React.useState(false);
    const handleSecondModalOpen = () =>  setSecondModal(true);
    const handleSecondModalClose = () =>  setSecondModal(false);
    /* Second Modal Part Here */



     let handleLogout = () => {
        signOut(auth).then(() => {
             /* When logut click then local storage and activeUser null  */
             localStorage.removeItem("user");
             dispatch(activeUser(null));
             /* When logut click then local storage and activeUser null  */
             navigate('/login');
            }).catch((error) => {
            // An error happened.
            console.log(error); 
            });
     }
     
     /* =================================
              Crop item Start
     ================================== */

      /* Crop item Start  */
    const [image, setImage] = useState('');
    const cropperRef = createRef();
    /* Crop item End  */


    let handleImageUpload = (e) =>{

        let files = e.target.files;
      
        const reader = new FileReader();
        reader.readAsDataURL(files[0]); 
        reader.onload = () => {
          setImage(reader.result);
          console.log(reader);
          console.log(reader.result);
        };
      };

    
      const getCropData = () => {

        /*firebase 64 bit photo upload here */

        setLoading(true);

        const storageRef = ref(storage,`profile-${data.uid}`);

        console.log(cropperRef.current?.cropper.getCroppedCanvas().toDataURL());

        const message4 = cropperRef.current?.cropper.getCroppedCanvas().toDataURL();
        uploadString(storageRef, message4, 'data_url').then((snapshot) => {
         console.log('Uploaded a data_url string!');
         

         /*Create a downloable url */

         getDownloadURL(storageRef).then((downloadURL) => {
          console.log('File available at', downloadURL);

        /*Create a downloable url */

          /* Update  Profile Picture Update Here */
           
          updateProfile(auth.currentUser, {
             photoURL: downloadURL
          }).then(()=>{
            setSecondModal(false)
            setLoading(false)
            console.log('done');
            localStorage.setItem('user',JSON.stringify({...data, photoURL: downloadURL}));
            dispatch( activeUser({...data, photoURL: downloadURL}));
          })
           /* Update  Profile Picture Update Here */
        });
    
        
        });

        /*firebase 64 bit photo upload here */

      }
 
     
   /* =================================
              Crop item Start
      ================================== */


    return (
        <div className='MainBar'>

             {/* Logo Here */}     
             <Image imageName="SideBarLogo.png" className="sideLogo" />

             {/* Logo Here */}
             

             {/* Icon Here  */}
              <div className='Sideicon'>
             
              <Link to="/home" className={location.pathname == "/home" && "Live" } > <SideBarIcon  Iconname={<IoHomeOutline />}  Deatils="Dashboard" className="SideBarIcon"  /> </Link>
              
              <Link to="/home/message" className={location.pathname == "/home/message" && "Live" } > <SideBarIcon  Iconname={<AiFillMessage />}  Deatils="Messages" className="SideBarIcon"  /> </Link>

              <Link to="/home/Alert"  className={location.pathname == "/home/Alert" && "Live" } > <SideBarIcon  Iconname={<IoNotificationsSharp />}  Deatils="Notification" className="SideBarIcon"  /> </Link>

                
          
                {/* <SideBarIcon  Iconname={<IoMdSettings />}  Deatils="Settings" className="SideBarIcon"  /> 
                
                <SideBarIcon  Iconname={<IoNewspaperOutline />}  Deatils="News" className="SideBarIcon"  /> */}


              </div>
            
           
            {/* Icon Here  */}

            
            {/* Profile Icon with logout */}
          
            <div className='profile'>

               <div onClick={handleSecondModalOpen}>
                 <img src={data.photoURL} alt="" style={{ width: "80px", height: "80px" , borderRadius: "50%", marginTop: "15px", cursor: "pointer" , border: "1px solid black"}} />
                 <h4 style={{ textAlign: "center",color: "green" }}>{data.displayName}</h4>
               </div>
               <Icon Iconname={<RiLogoutBoxRLine />} className="profile-icon" onClick={handleOpen}/>
                
             </div>

            

            {/* This is Modal part */}
          <Modal  open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
            <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">Confirm Logout</Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>Change you made may not be saved</Typography>
        
          <div className='btn-log'>
           <button onClick={handleLogout} className='logout-button'>Confirm</button>
           <button onClick={()=>setOpen(false)} className='cancel-button' >Cancel</button>
          </div>
         
           </Box>
          </Modal>
          
         {/* Profile Icon  with logout */}

         <Modal open={SecondModal} onClose={handleSecondModalClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
           <Box sx={style}>
            {
              !loading &&
              <Typography id="modal-modal-title" variant="h6" component="h2">Profile Upload Here</Typography>
            }
           <Typography id="modal-modal-description" sx={{ mt: 2 }}>
               
          {/* This is Croper Part Start Here */}

          {/* upload picture */}

           {  !loading &&
              <input type="file"  onChange={handleImageUpload} />
           }

          {/* upload picture */}
        
         { image &&
          <>

          { !loading &&
             <Cropper
             ref={cropperRef}
             style={{ height: 300, width: "100%" }}
             zoomTo={0.5}
             initialAspectRatio={1}
             preview=".img-preview"
             src={image}
             viewMode={1}
             minCropBoxHeight={10}
             minCropBoxWidth={10}
             background={false}
             responsive={true}
             autoCropArea={1}
             checkOrientation={false} 
             guides={true}
           />
          }
         

         
        {/* This is Preview Part */}
         
          <div className="box" style={{ width: "50%", float: "left"   }}> 
             <h1 style={{marginLeft: "15px"}} >Preview</h1>  
             <div className="img-preview" style={{ width: "150px",  height: "150px" ,borderRadius: "50%"}}/>
             <button style={{ float: "left", padding: "10px" , marginTop: "10px" , marginLeft: "15px" , cursor: "pointer" }} onClick={getCropData}> Submit Image</button>
          </div>
         
       
  
         {/* This is Preview Part */}
        </>

         }
         <div className='three-circles'>
         { loading && 
           <ThreeCircles
           visible={true}
           height="200px"
           width="200px"
           color="#4fa94d"
           ariaLabel="three-circles-loading"
           wrapperStyle={{}}
           wrapperClass=""
           className="three-circles"
           />}
         </div>


          {/* This is Croper Part End Here */}
 
          </Typography>
        </Box>
         </Modal>
        


           
        </div>
    );
};

export default SideBar;