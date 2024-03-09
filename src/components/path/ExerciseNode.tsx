import { FaStar } from "react-icons/fa";
import './Path.css'
import Exercise from "../../types/Exercise";

const ExerciseNode = (props: {exercise: Exercise}) => {
    return (
        <div className="node">
            <FaStar size={50} fill='white' />
        </div>
    )
}

export default ExerciseNode
