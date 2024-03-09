import { MantineProvider } from '@mantine/core';
import Header from './components/header/Header';
import Leaderboard from './components/leaderboard/Leaderboard';
// import ExerciseModal from './components/modal/ExerciseModal';
import '@mantine/core/styles.css';
import './App.css';
import ExerciseNode from './components/path/ExerciseNode';
import PathHeader from './components/path/PathHeader';

export default function App() {
  // TODO retrieve these from backend
  let currentPath = "Abs";
  let exercises = [
    {
      id: 1,
      name: "Bicycles",
      completed: true
    },
    {
      id: 2,
      name: "Flutter Kicks",
      completed: false
    },
    {
      id: 3,
      name: "Plank",
      completed: false
    },
    {
      id: 4,
      name: "Russian Twists",
      completed: false
    },
    // { id: 555, name: "sdsjkdkjsa", completed: false },
    // { id: 55, name: "sdsjkdkjsa", completed: false },
    // { id: 6426455, name: "sdsjkdkjsa", completed: false },
    // { id: 553155, name: "sdsjkdkjsa", completed: false },
    // { id: 55334155, name: "sdsjkdkjsa", completed: false },
    // { id: 555135, name: "sdsjkdkjsa", completed: false },
    // { id: 5531415, name: "sdsjkdkjsa", completed: false },
    // { id: 55135, name: "sdsjkdkjsa", completed: false },
  ]

  return (
    <MantineProvider>
      <div className="app">
        <Header />
        <main>
          {/* <ExerciseModal></ExerciseModal> */}

          <PathHeader name={currentPath} />

          {exercises.map((exercise, index) => (
            <ExerciseNode exercise={exercise} index={index} />
          ))}
        </main>
        
        <Leaderboard />
      </div>
    </MantineProvider> 
  );
}
