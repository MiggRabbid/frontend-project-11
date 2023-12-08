import getRss from './getRss';

const updateRss = (state, i18next, watchedPosts, handleLinksAndViewModal) => {
  const { feeds, posts } = state.data;
  feeds.forEach((feed) => {
    const feedPosts = posts.filter((post) => post.feedId === feed.id);
    getRss(feed.link, i18next).then((rss) => {
      const newPosts = [];
      rss.items.forEach((item) => {
        newPosts.unshift({
          id: posts.length + newPosts.length + 1,
          feedId: feed.id,
          ...item,
          linkStatus: 'new',

        });
      });

      const isNewPost = (newPost, OldPosts) => !OldPosts.some((feedPost) => feedPost.link === newPost.link);
      const resultPost = newPosts.filter((newPost) => isNewPost(newPost, feedPosts));

      watchedPosts.data.posts.unshift(...resultPost);
    }).catch((error) => console.error(error))
      .finally(() => handleLinksAndViewModal(state));
  });

  setTimeout(() => updateRss(state, i18next, watchedPosts, handleLinksAndViewModal), 5000);
};

export default updateRss;
