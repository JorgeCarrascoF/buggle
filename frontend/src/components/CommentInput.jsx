import { useMutation, useQueryClient } from "@tanstack/react-query";
import Button from "./Button";
import UserIconSmall from "./UserIconSmall";
import { createComment } from "../queries/createComment";
import { useState } from "react";
import checkUrl from "../queries/checkUrl";
import { useToast } from "../hooks/useToast";

const CommentInput = ({ logId, inactive = false }) => {
  let userData = JSON.parse(localStorage.getItem("userData"));
  const [comment, setComment] = useState("");
  const [success, setSuccess] = useState(false);

  const queryClient = useQueryClient();

  const { showToast } = useToast();

  const mutation = useMutation({
    mutationFn: ({ logId, comment }) => {
      return createComment(logId, comment);
    },
    onSuccess: () => {
      setComment("");
      setSuccess(true);
      queryClient.invalidateQueries(["comments", logId]);
    },
    onError: (error) => {
      console.error("Error al crear el comentario", error);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const urlRegex =
      /\b((https?:\/\/)?(www\.)?[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})(\/\S*)?\b/g;

    const urls = comment.match(urlRegex) || [];

    if (urls.length > 0) {
      let urlsValid = true;
      for (let url of urls) {
        const response = await checkUrl(url);

        if (!response.isValid) {
          urlsValid = false;
        }
      }
      if (!urlsValid) {
        showToast("Your comments include broken links", "error");
        return;
      }
    }

    if (comment.trim() === "") return;

    mutation.mutate({ logId, comment });
  };


  return (
    <form className="items-center text-left  flex">
      <UserIconSmall name={userData?.fullName} />
      <div className="flex w-full ml-4 items-center bg-[#ededed] px- py-[1px] rounded-lg">
        <input
          type="text"
          value={comment}
          minLength={50}
          disabled={inactive}
          maxLength={5000}
          onChange={(e) => {
            setComment(e.target.value);
            setSuccess(false);
          }}
          placeholder="Enter comment"
          className=" flex-1 px-3 py-3 rounded-xl bg-[#ededed]"
        />
        <div className="w-fit mr-1">
          <Button
            type="submit"
            onClick={handleSubmit}
            active
            disabled={mutation.isPending || !comment.trim() || inactive}
          >
            {success && !comment ? "Comment added" : "Send"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default CommentInput;
