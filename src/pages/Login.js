import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase";
import { updateDoc, doc } from "firebase/firestore";
import { useHistory } from "react-router-dom";

const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
    error: null,
    loading: false,
  });

  const history = useHistory();
  const { email, password, error, loading } = data;

  const changeHandler = (event) => {
    event.preventDefault();
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    setData({ ...data, error: null, loading: true });
    if (!email || !password) {
      setData({ ...data, error: "All fields are required" });
    }
    try {
      const result = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateDoc(doc(db, "users", result.user.uid), {
        isOnline: true,
      });
      setData({
        email: "",
        password: "",
        error: null,
        loading: false,
      });
      history.replace("/"); //once registered , the user will be directed to homepage.
    } catch (err) {
      setData({ ...data, error: err.message, loading: false });
    }
  };

  return (
    <div>
      <section className="login_section">
        <h3>log into your account</h3>
        <form className="form" onSubmit={submitHandler}>
          <div className="input_container">
            <label htmlFor="email">
              <b>Email</b>
            </label>
            <input
              type="text"
              name="email"
              value={email}
              onChange={changeHandler}
            ></input>
          </div>

          <div className="input_container">
            <label htmlFor="password">
              <b>Password</b>
            </label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={changeHandler}
            ></input>
          </div>

          {error ? <p className="error">{error}</p> : null}

          <div className="btn_container" >
            <button className="btn" disabled={loading}>
              {loading ? "Logging in....." : "Log in"}
              </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default Login;
