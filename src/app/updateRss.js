import uniqueId from 'lodash/uniqueId';
import getRss from './getRss';
import parsserRss from './parserRss';

const updateRss = (watchedState, refreshTiming) => {
  const { feeds, posts } = watchedState.data;

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
          });
        });

        const isNewPost = (newPost, OldPosts) => !OldPosts.some((old) => old.link === newPost.link);
        const resultPost = newPosts.filter((newPost) => isNewPost(newPost, feedPosts));
        watchedState.data.posts.unshift(...resultPost);
      })
      .catch((error) => {
        console.error(error);
      });
  });

  setTimeout(() => updateRss(watchedState, refreshTiming), refreshTiming);
};

export default updateRss;
