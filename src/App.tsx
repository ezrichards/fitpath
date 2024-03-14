import { useState, useEffect } from 'react'
import { Session, createClient } from '@supabase/supabase-js'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { MantineProvider } from "@mantine/core";
import Header from "./components/header/Header";
import Leaderboard from "./components/leaderboard/Leaderboard";
import ExerciseNode from "./components/path/ExerciseNode";
import PathHeader from "./components/path/PathHeader";
import "@mantine/core/styles.css";
import "./App.css";
import { Database } from './database.types';
import Exercise from './types/Exercise';

const supabase = createClient<Database>(import.meta.env.VITE_SUPABASE_URL as string, import.meta.env.VITE_SUPABASE_KEY as string)

const App = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [error, setError] = useState(null);
  const [units, setUnits] = useState({});

  // TODO doubling and organizing exercise nodes
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase.from('exercise').select().returns<Exercise>();
        setExercises(data);
        // console.log("returned:", data)
        
        const tempUnits: {name: string, exercises: [Exercise]} = {}

        data?.forEach(exercise => {
          if(!tempUnits[exercise.unit]) {
            tempUnits[exercise.unit] = []
          }
          tempUnits[exercise.unit].push(exercise);
        })
        setUnits(tempUnits);
        // console.log("TMP UNITS:", tempUnits)
      } catch (error) {
        setError(error);
      }
    };
    fetchData();
  }, []); 

  const currentPath = "Abs";

  const [session, setSession] = useState(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (!session) {
    return (<Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} providers={[]} />)
  }
  else {
    return (
      <MantineProvider>
        <div className="app">
          <Header />
          <main>
            {Object.keys(units).map(key => (
              <>
                <PathHeader key={key} name={key.replace("_", " ")} />
                {units[key]?.map((exercise: Exercise, index: number) => (
                  <ExerciseNode key={exercise.id} exercise={exercise} index={index} />
                ))}
              </>
            ))}
          </main>
          <Leaderboard />
        </div>
      </MantineProvider>
    );
  }
}

export default App
