import { useState, useEffect, FormEvent } from "react";
import { Session } from "@supabase/supabase-js";
import { MantineProvider } from "@mantine/core";
import { Exercise, ExerciseCompletion, Unit } from "./types/exercise.types";
import { supabase } from "./supabase";
import User from "./types/user.types";
import Header from "./components/header/Header";
import Leaderboard from "./components/leaderboard/Leaderboard";
import ExerciseNode from "./components/path/ExerciseNode";
import PathHeader from "./components/path/PathHeader";
import "@mantine/core/styles.css";
import "./App.css";

const App = () => {
  const [session, setSession] = useState<Session | null>();
  const [streak, setStreak] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [units, setUnits] = useState<Unit | null>(null);
  const [signUp, setSignUp] = useState(true);
  const [firstEffectCompleted, setFirstEffectCompleted] = useState(false);
  const [completionData, setCompletionData] = useState<
    ExerciseCompletion[] | null
  >(null);

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
      const name: string = nameInput.value; // TODO put name into DB
      const email: string = emailInput.value;
      const password: string = passwordInput.value;

      // TODO perform validation

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
        console.log("Error while signing up user:", error);
        return;
      }
    }
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();

    const emailInput = document.getElementById("email") as HTMLInputElement;
    const passwordInput = document.getElementById(
      "password",
    ) as HTMLInputElement;

    if (emailInput && passwordInput) {
      const email: string = emailInput.value;
      const password: string = passwordInput.value;

      // TODO perform validation

      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        console.log("Error while signing in user:", error);
        return;
      }
    }
  }

  function toggleSignIn() {
    setSignUp(!signUp);
  }

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setFirstEffectCompleted(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setFirstEffectCompleted(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchExerciseData = async () => {
      try {
        const { data, error } = await supabase
          .from("exercise")
          .select()
          .returns<Exercise[]>();

        if (error) {
          console.log("ERROR WHILE QUERYING BACKEND");
        }

        const tempUnits: Unit = {} as Unit;
        data?.forEach((exercise) => {
          if (!tempUnits[exercise.unit]) {
            tempUnits[exercise.unit] = [];
          }
          tempUnits[exercise.unit].push(exercise);
        });
        setUnits(tempUnits);

        const { data: completionData, error: completionError } = await supabase
          .from("user_exercise_xref")
          .select()
          .eq("user_id", String(session?.user.id));

        if (completionError) {
          console.log("error in completion data");
        }

        setCompletionData(completionData as ExerciseCompletion[]);

        const { data: userData, error: userError } = await supabase
          .from("user")
          .select()
          .eq("id", String(session?.user.id))
          .returns<User[]>();

        if (userError) {
          console.log("error in querying users!", userError);
        }

        if (userData) {
          setStreak(userData[0].streak_current);
        }
      } catch (error: any) {
        setError(error);
      }
    };

    if (firstEffectCompleted) {
      fetchExerciseData();
    }
  }, [firstEffectCompleted, session]);

  useEffect(() => {
    const fetchData = async () => {
      if (units && completionData) {
        Object.keys(units).map((key) => {
          for (const exercise in units[key]) {
            for (const completedExercise of completionData) {
              if (
                units[key][exercise].id === completedExercise.exercise_id &&
                completedExercise.complete
              ) {
                units[key][exercise].completed = true;
              }
            }
          }
        });
      }
    };
    fetchData();
  }, [units, completionData]);

  if (!session) {
    if (signUp) {
      return (
        <>
          <h1 style={{ color: "black" }}>Sign Up</h1>
          <form onSubmit={handleSignUp}>
            <label style={{ color: "black" }} htmlFor="name">
              Name:
            </label>
            <input type="text" id="name" name="name" />
            <br />
            <br />
            <label style={{ color: "black" }} htmlFor="email">
              Email:
            </label>
            <input type="email" id="email" name="email" />
            <br />
            <br />
            <label style={{ color: "black" }} htmlFor="password">
              Password:
            </label>
            <input type="password" id="password" name="password" />
            <br />
            <br />
            {/* <label htmlFor="confirmPassword">Confirm Password:</label>
            <input type="password" id="confirmPassword" name="confirmPassword" /><br/><br/> */}
            <input type="submit" value="Submit" />
          </form>
          <p style={{ color: "black" }} onClick={toggleSignIn}>
            Already have an account? Sign in.
          </p>
        </>
      );
    } else {
      return (
        <>
          <h1 style={{ color: "black" }}>Login</h1>
          <form onSubmit={handleLogin}>
            <label style={{ color: "black" }} htmlFor="email">
              Email:
            </label>
            <input type="email" id="email" name="email" />
            <br />
            <br />
            <label style={{ color: "black" }} htmlFor="password">
              Password:
            </label>
            <input type="password" id="password" name="password" />
            <br />
            <br />
            <input type="submit" value="Submit" />
          </form>
          <p style={{ color: "black" }} onClick={toggleSignIn}>
            Don't have an account? Sign up.
          </p>
        </>
      );
    }
  } else {
    if (error) {
      return <p>An error occurred while trying to load exercise data!</p>;
    }

    return (
      <MantineProvider>
        <div className="app">
          <Header streak={streak} />
          <main>
            {units &&
              Object.keys(units)
                .sort()
                .map((key) => (
                  <>
                    <PathHeader key={key} name={key.replace("_", " ")} />
                    {units[key].map((exercise: Exercise, index: number) => (
                      <ExerciseNode
                        key={exercise.id}
                        exercise={exercise}
                        index={index}
                      />
                    ))}
                  </>
                ))}
          </main>
          <Leaderboard />
        </div>
      </MantineProvider>
    );
  }
};

export default App;
