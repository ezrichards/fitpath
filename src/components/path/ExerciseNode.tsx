import { FaStar } from "react-icons/fa";
import "./Path.css";
import Exercise from "../../types/Exercise";
import { useDisclosure } from "@mantine/hooks";
import { Modal } from "@mantine/core";

const ExerciseNode = (props: { exercise: Exercise; index: number }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const baseMargin = 50;
  const marginLeft =
    (props.index % 6 <= 2 ? props.index % 6 : 6 - (props.index % 6)) *
      baseMargin +
    50;

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

        <img
          className="image"
          src={
            "https://uxftterxgsflxsabwhaw.supabase.co/storage/v1/object/public/gifs/" +
            props.exercise.id +
            ".gif"
          }
        ></img>

        <p className="description">{props.exercise.description}</p>

        <p className="description">{props.exercise.recommendations}</p>

        <button className="modalButton" onClick={close}>
          Done
        </button>
      </Modal>

      <button
        style={{
          marginLeft: `${marginLeft}px`,
        }}
        className="node"
        id={props.exercise.name}
        onClick={open}
      >
        <FaStar size={50} fill="white" />
      </button>
    </>
  );
};

export default ExerciseNode;
