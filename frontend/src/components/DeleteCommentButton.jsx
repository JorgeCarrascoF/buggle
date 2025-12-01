import Icon from "@mdi/react";
import { mdiDelete } from "@mdi/js";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import deleteComment from "../queries/deleteComment";
import { ClipLoader } from "react-spinners";
import { useState } from "react";
import Button from "./Button";
import Modal from "./Modal";
import { useToast } from "../hooks/useToast";

const DeleteCommentButton = ({ logId, commentId }) => {
  const [deleting, setDeleting] = useState(false);
  const [showingModal, setShowingModal] = useState(false);

  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const mutation = useMutation({
    mutationFn: (id) => deleteComment(id),
    onSuccess: () => {
      showToast("The message has been deleted successfully", "success");
      queryClient.invalidateQueries(["comments", logId]);
      setDeleting(false);
    },
    onError: (error) => {
      console.error("Error deleting comment:", error);
    },
  });

  const handleDelete = () => {
    setShowingModal(true);
  };

  const confirmDelete = () => {
    setDeleting(true);
    setShowingModal(false);
    mutation.mutate(commentId);
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={handleDelete}
        className="hover:text-gray-700 hover:cursor-pointer h-full flex items-center"
        title="Delete comment"
      >
        {deleting ? (
          <ClipLoader size={15} />
        ) : (
          <Icon path={mdiDelete} size={1} />
        )}
      </button>
      <Modal isOpen={showingModal} onClose={() => setShowingModal(false)}>
        <div className="flex flex-col rounded-md p-6 2xl:w-[400px]">
          <div className="w-full flex justify-center">
            <WarningAmberRoundedIcon
              className="text-yellow-500 mb-2"
              fontSize="large"
            />
          </div>
          <h2 className="text-2xl text-black font-semibold mb-4 text-center">
            Are you sure you want to delete this message?
          </h2>
          <span className="text-[#737373] mb-4 text-center">
            Deleted messages will no longer be accessible in the system
          </span>
          <div className="flex justify-center w-full gap-2">
            <div className="w-[145px]">
              <Button onClick={() => setShowingModal(false)} variant="tertiary">
                Cancel
              </Button>
            </div>
            <div className="w-[145px]">
              <Button
                className="px-3 py-1 rounded-md bg-red-600 text-white hover:bg-red-700"
                onClick={confirmDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DeleteCommentButton;
