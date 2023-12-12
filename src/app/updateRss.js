import uniqueId from 'lodash/uniqueId';
import getRss from './getRss';
import parsserRss from './parserRss';

const updateRss = (state, watchedState, handleLinksAndViewModal) => {
  const { feeds, posts } = state.data;

  feeds.forEach((feed) => {
    const feedPosts = posts.filter((post) => post.feedId === feed.id);

    getRss(feed.link)
      .then((rss) => parsserRss(rss))
      .then((data) => {
        const newPosts = [];
        data.items.forEach((item) => {
          newPosts.unshift({
            id: uniqueId(),
            feedId: feed.id,
            ...item,
            linkStatus: 'new',
          });
        });

        const isNewPost = (newPost, OldPosts) => !OldPosts.some((old) => old.link === newPost.link);
        const resultPost = newPosts.filter((newPost) => isNewPost(newPost, feedPosts));
        watchedState.data.posts.unshift(...resultPost);
      })
      .catch((error) => { throw error; })
      .finally(() => handleLinksAndViewModal(state, watchedState));
  });

  setTimeout(() => updateRss(state, watchedState, handleLinksAndViewModal), 5000);
};

export default updateRss;
