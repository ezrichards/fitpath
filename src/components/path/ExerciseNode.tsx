import { FaCheck, FaStar } from "react-icons/fa";
import { Exercise } from "../../types/exercise.types";
import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";
import { supabase } from "../../supabase";
import { useEffect, useState } from "react";
import "./Path.css";

const completeExercise = async (exercise_id: number, user_id: string) => {
  const { data: redo, error: redoError } = await supabase
    .from("user_exercise_xref")
    .select()
    .eq("user_id", user_id)
    .eq("exercise_id", exercise_id)
    .returns<any>(); // hackish solution for now

  if (redoError) {
    console.log("Error while getting completion data:", redoError);
  }

  if (redo) {
    const { error } = await supabase
      .from("user_exercise_xref")
      .update({ complete: true, redo: redo[0].redo + 1 })
      .eq("user_id", user_id)
      .eq("exercise_id", exercise_id);

    if (error) {
      console.log("Error while completing exercise:", error);
    }
  }
};

const ExerciseNode = (props: { exercise: Exercise; index: number }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    setCompleted(props.exercise.completed);
  }, [props.exercise.completed]);

  const submitExercise = async () => {
    close();

    const session = await supabase.auth.getSession();
    if (session.data.session) {
      completeExercise(props.exercise.id, session?.data.session.user.id);
    }

    setCompleted(true);
    props.exercise.completed = true;
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        closeButtonProps={{
          size: 40,
        }}
      >
        <h1 className="modalHeader">{props.exercise.name}</h1>

        <img className="image" src={props.exercise.gif}></img>

        <p className="description">{props.exercise.description}</p>

        <p className="description">{props.exercise.recommendations}</p>

        <button className="modalButton" onClick={submitExercise}>
          Done
        </button>
      </Modal>

      <div
        className={`nodeDescription ${completed ? "completedDescription" : ""}`}
        onClick={open}
      >
        <button
          className={`${completed ? "completedNode" : "node"} ${
            props.index % 2 === 0 ? "left" : "right"
          }`}
          id={props.exercise.name}
        >
          {completed ? (
            <FaCheck size={50} fill="white" />
          ) : (
            <FaStar size={50} fill="white" />
          )}
        </button>

        <div
          className={`descriptionParagraphs ${
            props.index % 2 === 0 ? "leftParagraph" : "rightParagraph"
          }`}
        >
          <p className="exerciseName">{props.exercise.name}</p>
          <p>{props.exercise.description}</p>
        </div>
      </div>
    </>
  );
};

export default ExerciseNode;
