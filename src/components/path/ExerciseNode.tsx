import { FaCheck, FaStar } from "react-icons/fa";
import { Exercise } from "../../types/exercise.types";
import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";
import { supabase } from "../../supabase";
import { useEffect, useState } from "react";
import "./Path.css";

const completeExercise = async (exercise_id: number, user_id: string) => {
  const { error } = await supabase
    .from("user_exercise_xref")
    .update({ complete: true })
    .eq("user_id", user_id)
    .eq("exercise_id", exercise_id);

  if (error) {
    console.log("ERROR WHILE UPDATING BACKEND");
  }
};

const ExerciseNode = (props: { exercise: Exercise; index: number }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [completed, setCompleted] = useState(false);
  const baseMargin = 50;
  const marginLeft =
    (props.index % 6 <= 2 ? props.index % 6 : 6 - (props.index % 6)) *
      baseMargin +
    50;

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

      <button
        style={{
          marginLeft: `${marginLeft}px`,
        }}
        className={completed ? "completedNode" : "node"}
        id={props.exercise.name}
        onClick={open}
      >
        {completed ? (
          <FaCheck size={50} fill="white" />
        ) : (
          <FaStar size={50} fill="white" />
        )}
      </button>
    </>
  );
};

export default ExerciseNode;
