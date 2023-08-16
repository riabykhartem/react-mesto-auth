import React, { useState } from "react";
import Header from "../header/Header";

const Register = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('')

  function handleSubmit(evt){
    evt.preventDefault()
    props.onSubmit({email: email, password: password})
  }

  
  return (
    <>
      <Header>
        <p style={{ color: "white" }}>Войти</p>
      </Header>
      <form className="login-form" onSubmit={handleSubmit}>
        <h1 className="login-form_header">Регистрация</h1>
        <div className="login-form_input-container">
          <input
            value={email}
            onChange={(evt) => {
              setEmail(evt.target.value);
            }}
            type="text"
            className="form__input login-form_input"
            placeholder="Email"
          ></input>
          <input
            value={password}
            onChange={(evt) => {
                setPassword(evt.target.value)}
            }
            type="text"
            className="login-form_input"
            placeholder="Пароль"
          ></input>
          <button type="submit" className="login-form_submit-button">
            Зарегистрироваться
          </button>
          <span>Тут должен быть путь к логину</span>
        </div>
      </form>
    </>
  );
};
export default Register;
