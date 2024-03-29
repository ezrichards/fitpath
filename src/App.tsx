import { useState, useEffect, FormEvent } from "react";
import { Session } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
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
  const [firstEffectCompleted, setFirstEffectCompleted] = useState(false);
  const [completionData, setCompletionData] = useState<
    ExerciseCompletion[] | null
  >(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault(); // Prevents the default form submission
  
    // Retrieve form data
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    
    // Check if inputs are not null (optional)
    if (emailInput && passwordInput) {
      const email: string = emailInput.value;
      const password: string = passwordInput.value;
  
      // Perform any processing you need here, such as validation or sending data to a server
  
      // Example: Output the values to console
      console.log('Email:', email);
      console.log('Password:', password);
  
      // Optionally, you can redirect the user or perform other actions
    }
  }  

  async function signUpNewUser(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
      // options: {
      //   emailRedirectTo: 'https://example.com/welcome',
      // },
    })

    if(error) {
      console.log("error while signing up user")
    }

    console.log('user signed up:', data)
  }

  async function signInWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if(error) {
      console.log('error while signing in user')
    }

    console.log('user signed in: ', data)
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()

    if(error) {
      console.log('error while signing out user')
    }
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
    return (
      // <Auth
      //   supabaseClient={supabase}
      //   appearance={{ theme: ThemeSupa }}
      //   providers={[]}
      // />

      <>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email:</label>
          <input type="text" id="email" name="email" /><br/><br/>
          <label htmlFor="password">Password:</label>
          <input type="text" id="password" name="password" /><br/><br/>
          <input type="submit" value="Submit" />
        </form>
      </>
    );
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
