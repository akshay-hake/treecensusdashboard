import React, { useState } from 'react';
import Map from './map';
import CSVFileReader from './CSVReader';

const Login = () => {
  const [isMap, setIsMap] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  const handleLogin = () => {
    // Check if the entered credentials match the expected values
    console.log(username, password)
    if (username === 'venviro' && password === 'Admin@123') {
      setIsMap(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  return (
    <div>
      {isMap ? (
        <CSVFileReader />
      ) : (
        <div id="loginform">
          <FormHeader title="Login" />
          <Form
            setUsername={setUsername}
            setPassword={setPassword}
            handleLogin={handleLogin}
          />
          {loginError && <p className="error">Invalid username or password</p>}
        </div>
      )}
    </div>
  );
};

const FormHeader = (props) => <h2 id="headerTitle">{props.title}</h2>;

const Form = (props) => (
  <div>
    <div className='row'>
    <input
      description="Username"
      placeholder="Enter your username"
      type="text"
      onChange={(ev) => {
        props.setUsername(ev.target.value);
      }}
    />
    </div>
    <div className='row'>
    <input
      description="Password"
      placeholder="Enter your password"
      type="password"
      onChange={(ev) => {
        props.setPassword(ev.target.value);
      }}
    />
    </div>
    <FormButton title="Log in" handleLogin={props.handleLogin} />
  </div>
);

const FormButton = (props) => (
  <div id="button" className="row">
    <button onClick={props.handleLogin}>{props.title}</button>
  </div>
);

const FormInput = (props) => (
  <div className="row">
    <label>{props.description}</label>
    <input type={props.type} placeholder={props.placeholder} />
  </div>
);

export default Login;
