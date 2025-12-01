const sortComments = (comments) => {
  return comments.sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;

    return new Date(b.create_at) - new Date(a.create_at);
  });
};

export default sortComments;