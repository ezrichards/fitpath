import { FaStar } from "react-icons/fa";
import './Path.css'
import Exercise from "../../types/Exercise";

const ExerciseNode = (props: {exercise: Exercise, index: number}) => {
    const baseMargin = 50;
    const marginLeft = (props.index % 6 <= 2 ? props.index % 6 : 6 - (props.index % 6)) * baseMargin + 50; 
  
    return (
        <button style={{
            marginLeft: `${marginLeft}px`,

        }} className="node" id={props.exercise.name}>
            <FaStar size={50} fill='white' />
        </button>
    )
}

export default ExerciseNode
