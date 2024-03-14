import { FaCheck, FaStar } from "react-icons/fa";
import "./Path.css";
import { Exercise } from "../../types/exercise.types";
import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";
import { completeExercise, supabase } from "../../App";

const ExerciseNode = (props: { exercise: Exercise; index: number }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const baseMargin = 50;
  const marginLeft =
    (props.index % 6 <= 2 ? props.index % 6 : 6 - (props.index % 6)) *
      baseMargin +
    50;

  const submitExercise = async () => {
    close();

    const session = await supabase.auth.getSession();
    if (session.data.session) {
      completeExercise(props.exercise.id, session?.data.session.user.id);
    }
    props.exercise.completed = true;
  };

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const { data, error } = await supabase
  //       .from("exercise")
  //       .select()
  //       .returns<Exercise[]>();
  //       // setExercises(data);

  //       if (error) {
  //         console.log("ERROR WHILE QUERYING BACKEND");
  //       }

  //     } catch (error: any) {
  //       setError(error);
  //     }
  //   };
  //   fetchData();
  // }, []);

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
        className={props.exercise.completed ? "completedNode" : "node"}
        id={props.exercise.name}
        onClick={open}
      >
        {props.exercise.completed ? (
          <FaCheck size={50} fill="white" />
        ) : (
          <FaStar size={50} fill="white" />
        )}
      </button>
    </>
  );
};

export default ExerciseNode;
