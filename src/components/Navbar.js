import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { db, auth } from "../firebase";
import { signOut } from "firebase/auth";
import { updateDoc, doc } from "firebase/firestore";
import { AuthContext } from "../context/auth";
import { useHistory } from "react-router-dom";

const Navbar = () => {
  const history= useHistory();
  const { user } = useContext(AuthContext);
  console.log(auth.currentUser);

 const signoutHandler = async () => {
    await updateDoc(doc(db, "users", auth.currentUser.uid) ,{
      isOnline: false,
    });
    await signOut(auth);
    history.replace("./login");
 };

  return (
    <nav>
      <h3>
        <Link to="/">Messanger</Link>
      </h3>

      <div>
        {user ? (
          <>
            <Link to="/Profile">Profile</Link>
            <button className="btn" onClick={signoutHandler}>Log Out</button>
          </>
        ) : (
          <>
         
            <Link to="/register">Register</Link>
            <Link to="/login">Log In</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
