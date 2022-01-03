import React, { useState, useEffect } from "react";
import userDefaultPic from "../userDefaultPic.png";
import Camera from "../components/svg/Camera";
import { auth, storage, db } from "../firebase";
import { ref, getDownloadURL, uploadBytes, deleteObject } from "firebase/storage";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import Delete from "../components/svg/Delete";
import { useHistory } from "react-router-dom";


const Profile = () => {
  const [image, setImage] = useState("");
  const [user, setUser] = useState("");
  const history = useHistory("");

  useEffect(() => {
    getDoc(doc(db, "users", auth.currentUser.uid)).then((docSnap) => {
      if(docSnap.exists){
        setUser(docSnap.data());
      }
    })


    if (image) {
      const uploadImg = async () => {
        const imgRef = ref(
          storage,
          `avatar/${new Date().getTime()}.${image.name}`
        );
        try{
          if(user.avatarPath){
            await deleteObject(ref(storage, user.avatarPath));
          }

          const snap = await uploadBytes(imgRef, image);
          const url = await getDownloadURL(ref(storage, snap.ref.fullPath));
        
          await updateDoc(doc(db, "users", auth.currentUser.uid),{
            avatar: url,
            avatarPath: snap.ref.fullPath,
          });
  
        setImage("");      
        }catch(err) {
            console.log(err.message);
        }
          
      };
      uploadImg();
    }
  }, [image]);

  const deleteImageHandler = async () => {
    try{
        const cnfrm = window.confirm("Delete avatar?");
        if(cnfrm){
          await deleteObject(ref(storage, user.avatarPath));

          await updateDoc(doc(db,"users", auth.currentUser.uid),{
            avatar:'',
            avatarPath:'',
          });
          history.replace("/");
        }
    }catch(err){
        console.log(err.message);
    }
  }

  return user ? (
    <section>
      <div className="profile_container">
        <div className="img_container">
          <img src={user.avatar || userDefaultPic} alt="avatar" />
          <div className="overlay">
            <div>
              <label htmlFor="photo">
                <Camera />
              </label>
              {user.avatar ? <Delete deleteImage={deleteImageHandler}/> : null}
              <input
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                id="photo"
                onChange={(e) => {
                  setImage(e.target.files[0]);
                }}
              />
            </div>
          </div>
        </div>
        <div className="text_container">
          <h3>{user.name}</h3>
          <p>{user.email}</p>
          <hr />
          <small>joined on: {user.createdAt.toDate().toDateString()}</small>
        </div>
      </div>
    </section>
  ) : null;
};

export default Profile;
