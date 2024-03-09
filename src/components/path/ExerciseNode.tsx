import { FaStar } from "react-icons/fa";
import './Path.css'
import Exercise from "../../types/Exercise";

const ExerciseNode = (props: {exercise: Exercise}) => {
    return (
        <button className="node" id={props.exercise.name}>
            <FaStar size={50} fill='white' />
        </button>
    )
}

export default ExerciseNode
