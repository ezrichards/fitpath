export interface Exercise {
  id: number;
  name: string;
  completed: boolean;
  description: string;
  recommendations: string;
  gif: string;
  unit: string;
  equipment: number;
}

export interface Unit {
  name: string;
  exercises: Exercise[];
  [key: string]: any;
}

export interface ExerciseCompletion {
  user_id: string;
  complete: boolean;
  id: number;
  exercise_id: number;
}
