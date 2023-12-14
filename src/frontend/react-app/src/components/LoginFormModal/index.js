import React, { useState } from "react";
import { login } from "../../store/session";
import {useDispatch, useSelector} from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";
import {Redirect} from "react-router-dom";

function LoginFormModal() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  if (sessionUser) return <Redirect to="/profile"/>;
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await dispatch(login(username, password));

    if (data) {
      setErrors(data);
    } else {
      closeModal()
    }
  };

  return (
    <>
      <h1>Log In</h1>
      <form onSubmit={handleSubmit}>
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <label>
          Email
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Log In</button>
      </form>
    </>
  );
}

export default LoginFormModal;
