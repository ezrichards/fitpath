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
import { Exercise, Unit } from "./types/Exercise";

const supabase = createClient<Database>(
  import.meta.env.VITE_SUPABASE_URL as string,
  import.meta.env.VITE_SUPABASE_KEY as string,
);

const App = () => {
  const [session, setSession] = useState<Session | null>();
  // const [exercises, setExercises] = useState<Exercise[] | null>([]);
  const [error, setError] = useState<string | null>(null);
  const [units, setUnits] = useState<Unit | null>(null);
  // const currentPath = "Abs";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase
          .from("exercise")
          .select()
          .returns<Exercise[]>();
        // setExercises(data);

        if (error) {
          console.log("ERROR WHILE QUERYING BACKEND");
        }

        const tempUnits: Unit = {};
        data?.forEach((exercise) => {
          if (!tempUnits[exercise.unit]) {
            tempUnits[exercise.unit] = [];
          }
          tempUnits[exercise.unit].push(exercise);
        });
        setUnits(tempUnits);
      } catch (error: any) {
        setError(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

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
          <Header />
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
          <Leaderboard />
        </div>
      </MantineProvider>
    );
  }
};

export default App;
