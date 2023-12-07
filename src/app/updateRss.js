import getRss from './getRss';

const updateRss = (state, i18next, watchedPosts) => {
  const { feeds, posts } = state.data;
  feeds.forEach((feed) => {
    const feedPosts = posts.filter((post) => post.feedId === feed.id);
    getRss(feed.link, i18next).then((rss) => {
      const newPosts = [];
      rss.items.forEach((item) => {
        newPosts.push({
          id: posts.length + newPosts.length + 1,
          feedId: feed.id,
          ...item,
        });
      });

      const resultPost = newPosts.filter((newPost) => !feedPosts.some((feedPost) => feedPost.link === newPost.link));

      watchedPosts.data.posts = [...resultPost, ...state.data.posts];
    }).catch((error) => console.error(error));
  });
  setTimeout(() => updateRss(state, i18next, watchedPosts), 5000);
};

export default updateRss;
