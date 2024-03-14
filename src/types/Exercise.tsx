export interface Exercise {
  id: number;
  name: string;
  completed: boolean;
  description: string;
  recommendations: string;
  gif: string;
  unit: string;
}

export interface Unit {
  name: string;
  exercises: Exercise[];
  [key: string]: any;
}
