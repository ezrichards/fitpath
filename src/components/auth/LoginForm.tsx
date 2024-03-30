import { useState, FormEvent } from "react";
import "./Auth.css";
import { supabase } from "../../supabase";

const SignInForm = (props: { toggleSignIn: () => void }) => {
  const [authError, setAuthError] = useState(false);
  const [authErrorMessage, setAuthErrorMessage] = useState("");

  async function handleLogin(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    const emailInput = document.getElementById("email") as HTMLInputElement;
    const passwordInput = document.getElementById(
      "password",
    ) as HTMLInputElement;

    if (emailInput && passwordInput) {
      const email: string = emailInput.value;
      const password: string = passwordInput.value;

      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        setAuthError(true);
        setAuthErrorMessage("Incorrect username or password!");
        return;
      }
    } else {
      setAuthError(true);
      setAuthErrorMessage("Please fill in all of the fields!");
    }
  }

  return (
    <div className="authContainer">
      <h1>Login</h1>
      <p className="subHeader">Welcome to back to Fitpath!</p>

      {authError && 
        <div className="errorContainer">
          <p>{authErrorMessage}</p>
        </div>
      }
      
      <form onSubmit={handleLogin}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="jane@example.com"
        />
        <br />
        <label htmlFor="password">Password:</label>
        <input type="password" id="password" name="password" />
        <br />
        <button className="submitButton" type="submit">
          Login
        </button>
      </form>
      <p className="toggle" onClick={props.toggleSignIn}>
        Don't have an account? Sign up.
      </p>
    </div>
  );
};

export default SignInForm;
