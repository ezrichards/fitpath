import { FormEvent, useState } from "react";
import { supabase } from "../../supabase";
import "./Auth.css";

const SignUpForm = (props: { toggleSignIn: () => void }) => {
  const [authError, setAuthError] = useState(false);
  const [authErrorMessage, setAuthErrorMessage] = useState("");

  async function handleSignUp(
    event: FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    const nameInput = document.getElementById("name") as HTMLInputElement;
    const emailInput = document.getElementById("email") as HTMLInputElement;
    const passwordInput = document.getElementById(
      "password",
    ) as HTMLInputElement;

    if (emailInput && passwordInput && nameInput) {
      const name: string = nameInput.value;
      const email: string = emailInput.value;
      const password: string = passwordInput.value;

      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      });

      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (data.user) {
        const { error: updateError } = await supabase
          .from("user")
          .update({ name: name })
          .eq("id", data.user.id);

        if (updateError) {
          console.log("Error while updating user name:", updateError);
        }
      }

      if (error || signInError) {
        setAuthError(true);
        setAuthErrorMessage("Please fill in all of the fields!");
        return;
      }
    } else {
      setAuthError(true);
      setAuthErrorMessage("Please fill in all of the fields!");
    }
  }

  return (
    <div className="authContainer">
      <h1 style={{ color: "black" }}>Sign Up</h1>
      <p className="subHeader">
        Welcome to Fitpath! Please create an account so we can track your
        progress.
      </p>

      {authError && (
        <div className="errorContainer">
          <p>{authErrorMessage}</p>
        </div>
      )}

      <form onSubmit={handleSignUp}>
        <label style={{ color: "black" }} htmlFor="name">
          Name:
        </label>
        <input type="text" id="name" name="name" placeholder="Jane Doe" />
        <br />
        <label style={{ color: "black" }} htmlFor="email">
          Email:
        </label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="jane@example.com"
        />
        <br />
        <label style={{ color: "black" }} htmlFor="password">
          Password:
        </label>
        <input type="password" id="password" name="password" />
        <br />
        <button className="submitButton" type="submit">
          Sign Up
        </button>
      </form>
      <p className="toggle" onClick={props.toggleSignIn}>
        Already have an account? Sign in.
      </p>
    </div>
  );
};

export default SignUpForm;
