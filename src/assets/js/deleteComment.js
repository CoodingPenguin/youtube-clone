import axios from "axios";

const commentNumber = document.getElementById("jsCommentNumber");
const deleteCommentBtn = document.getElementById("jsDeleteComment");

const decreaseNumber = () => {
  commentNumber.innerHTML = parseInt(commentNumber.innerHTML, 10) - 1;
};

const deleteComment = async comment => {
  const link = comment.querySelector("a").getAttribute("href");
  const response = await axios({
    url: link,
    method: "GET"
  });
  if (response.status === 200) {
    comment.remove();
    decreaseNumber();
  }
};

const handleDelete = event => {
  event.preventDefault();
  const targetComment = event.path[2];
  deleteComment(targetComment);
};

function init() {
  deleteCommentBtn.addEventListener("click", handleDelete);
}

if (deleteCommentBtn) {
  init();
}
