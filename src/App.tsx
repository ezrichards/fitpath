import { useState, useEffect } from "react";
import { Session, createClient } from "@supabase/supabase-js";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { MantineProvider } from "@mantine/core";
import Header from "./components/header/Header";
import Leaderboard from "./components/leaderboard/Leaderboard";
import ExerciseNode from "./components/path/ExerciseNode";
import PathHeader from "./components/path/PathHeader";
import "@mantine/core/styles.css";
import "./App.css";
import { Database } from "./types/database.types";
import { Exercise, ExerciseCompletion, Unit } from "./types/exercise.types";

export const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_KEY as string,
);

export const completeExercise = async (
  exercise_id: number,
  user_id: string,
) => {
  console.log("updating exercise ", exercise_id, " for user ", user_id);
  const { data, error } = await supabase
    .from("user_exercise_xref")
    .update({ complete: true })
    .eq("user_id", user_id)
    .eq("exercise_id", exercise_id)
    .select();

  console.log(data)

  if (error) {
    console.log(error)
    console.log("ERROR WHILE UPDATING BACKEND");
  }

};

const App = () => {
  const [session, setSession] = useState<Session | null>();

  // const [exercises, setExercises] = useState<Exercise[] | null>([]);
  const [error, setError] = useState<string | null>(null);
  const [units, setUnits] = useState<Unit | null>(null);
  // const currentPath = "Abs";
  const [firstEffectCompleted, setFirstEffectCompleted] = useState(false);

  const [completionData, setCompletionData] = useState<
    ExerciseCompletion[] | null
  >(null);

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
        // setExercises(data);

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

        //=================
        const { data: completionData, error: completionError } = await supabase
          .from("user_exercise_xref")
          .select()
          .eq("user_id", String(session?.user.id));

        if (completionError) {
          console.log("error in completion data");
        }

        setCompletionData(completionData as ExerciseCompletion[]);
        // console.log(completionData)
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
          for (let exercise in units[key]) {
            for (let completedExercise of completionData) {
              if (
                units[key][exercise].id === completedExercise.exercise_id &&
                completedExercise.complete
              ) {
                // console.log("completed:", completionData[completedExercise])
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
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={[]}
      />
    );
  } else {
    if (error) {
      return <p>An error occurred while trying to load exercise data!</p>;
    }

    return (
      <MantineProvider>
        <div className="app">
          <Header streak={1} />
          <main>
            {units &&
              Object.keys(units).map((key) => (
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
          {/* <Leaderboard /> */}
        </div>
      </MantineProvider>
    );
  }
};

export default App;
