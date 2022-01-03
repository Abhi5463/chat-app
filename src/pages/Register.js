import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { setDoc, doc, Timestamp } from "firebase/firestore";
import{ useHistory } from "react-router-dom";

const Register = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    error: null,
    loading: false,
  });

  const history = useHistory();
  const { name, email, password, error, loading } = data;

  const changeHandler = (event) => {
    event.preventDefault();
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setData({ ...data, error: null, loading: true });
    if (!name || !email || !password) {
      setData({ ...data, error: "All fields are required" });
    }
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
       console.log(result);
       await setDoc(doc(db, "users", result.user.uid), {
        uid: result.user.uid,
        name,
        email,
        createdAt: Timestamp.fromDate(new Date()),
        isOnline: true,
      });
      setData({
        name: "",
        email: "",
        password: "",
        error: null,
        loading: false,
      });
      history.replace("/");//once registered , the user will be directed to homepage.
    } catch (err) {
      setData({ ...data, error: err.message, loading: false });
    }
  };

  return (
    <div>
      <section>
        <h3>Create a new account</h3>
        <form className="form" onSubmit={submitHandler}>
          <div className="input_container">
            <label htmlFor="name"><b>Name</b></label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={changeHandler}
            ></input>
          </div>

          <div className="input_container">
            <label htmlFor="email"><b>Email</b></label>
            <input
              type="text"
              name="email"
              value={email}
              onChange={changeHandler}
            ></input>
          </div>

          <div className="input_container">
            <label htmlFor="password"><b>Password</b></label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={changeHandler}
            ></input>
          </div>

          {error ? <p className="error">{error}</p> : null}

          <div className="btn_container" disabled={loading}>
            <button className="btn">
              {loading ? "Is Registering....." : "Register"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Register;
