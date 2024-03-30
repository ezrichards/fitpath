import { useState, useEffect } from "react";
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
import React from "react";
import SignUpForm from "./components/auth/SignUpForm";
import SignInForm from "./components/auth/LoginForm";

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
    if (!session) {
      return;
    }

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
      <>
        {signUp ? (
          <SignUpForm toggleSignIn={toggleSignIn} />
        ) : (
          <SignInForm toggleSignIn={toggleSignIn} />
        )}
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
                  <React.Fragment key={key}>
                    <PathHeader key={key} name={key.replace("_", " ")} />
                    {units[key].map((exercise: Exercise, index: number) => (
                      <ExerciseNode
                        key={exercise.id}
                        exercise={exercise}
                        index={index}
                      />
                    ))}
                  </React.Fragment>
                ))}
          </main>
          <Leaderboard />
        </div>
      </MantineProvider>
    );
  }
};

export default App;
