const Util = require('./Util');
const usersTable = Util.getTableName('users');
const axios = require('axios');

/**
 * @module User
 */
module.exports = {
  /** Create user */
  async create(event) {
    const body = JSON.parse(event.body);

    if (!body.user) {
      return Util.envelop('User must be specified.', 422);
    }
    const newUser = body.user;
    if (!newUser.username) {
      return Util.envelop('Username must be specified.', 422);
    }
    if (!newUser.email) {
      return Util.envelop('Email must be specified.', 422);
    }
    // Verify username is not taken
    const userWithThisUsername = await getUserByUsername(newUser.username);
    if (userWithThisUsername.Item) {
      return Util.envelop(`Username already taken: [${newUser.username}]`, 422);
    }

    // Verify email is not taken
    const userWithThisEmail = await getUserByEmail(newUser.email);
    if (userWithThisEmail.Count !== 0) {
      return Util.envelop(`Email already taken: [${newUser.email}]`, 422);
    }

    const item = {
      username: newUser.username,
      email: newUser.email,
      favoriteSubreddits: newUser.favoriteSubreddits,
      isNewsletterEnabled: newUser.isNewsletterEnabled,
      newsletterSendOutTime: newUser.newsletterSendOutTime,
    };
    clean(item);

    await Util.DocumentClient.put({
      TableName: usersTable,
      Item: item,
    }).promise();

    const user = {
      email: newUser.email,
      username: newUser.username,
      favoriteSubreddits: newUser.favoriteSubreddits,
      isNewsletterEnabled: newUser.isNewsletterEnabled,
      newsletterSendOutTime: newUser.newsletterSendOutTime,
    };
    clean(user);

    return Util.envelop({
      user
    });
  },

  /** Update user */
  async update(event) {
    const body = JSON.parse(event.body);
    const user = body.user;

    if (!user) {
      return Util.envelop('User must be specified.', 422);
    }

    const updatedUser = {};
    if (user.username) {
      updatedUser.email = user.email;
    }
    if (user.email) {
      updatedUser.email = user.email;
    }
    if (user.favoriteSubreddits && !!user.favoriteSubreddits.length) {
      updatedUser.favoriteSubreddits = user.favoriteSubreddits;
    }
    if (user.isNewsletterEnabled) {
      updatedUser.isNewsletterEnabled = user.isNewsletterEnabled;
    }
    if (user.newsletterSendOutTime) {
      updatedUser.newsletterSendOutTime = user.newsletterSendOutTime;
    }

    await Util.DocumentClient.put({
      TableName: usersTable,
      Item: updatedUser,
    }).promise();

    return Util.envelop({
      user: updatedUser,
    });
  },

  /** Get email payload by email */
  async getEmailPayload(event) {
    const email = event.pathParameters.email;
    const user = (await getUserByEmail(email)).Items[0];

    if (user.favoriteSubreddits && !!user.favoriteSubreddits.length) {
      const reshapedRedditResponses = [];
      const promises = [];
      for (let i = 0; i < user.favoriteSubreddits.length; i++) {
        promises.push(axios.get(`https://www.reddit.com/r/${user.favoriteSubreddits[i]}/top/.json?limit=3&t=day`));
      }
      const redditResponseArray = await axios.all(promises);
      redditResponseArray.forEach(redditResponse => {
        const topThree = redditResponse.data.data.children;
        const reshapedPosts = [];
        topThree.forEach(topPost => {
          reshapedPosts.push({
            image: topPost.data.thumbnail,
            upVotes: topPost.data.ups,
            title: topPost.data.title,
          });
        });
        reshapedRedditResponses.push({
          subreddit: topThree[0].data.subreddit,
          url: `https://www.reddit.com/r/${topThree[0].data.subreddit}/top`,
          topPosts: reshapedPosts
        });
      });

      return Util.envelop({ favoriteSubreddits: reshapedRedditResponses });
    } else {
      return Util.envelop('User must have favorite subreddits', 422);
    }
  }
};

function getUserByEmail(aEmail) {
  return Util.DocumentClient.query({
    TableName: usersTable,
    IndexName: 'email',
    KeyConditionExpression: 'email = :email',
    ExpressionAttributeValues: {
      ':email': aEmail,
    },
    Select: 'ALL_ATTRIBUTES',
  }).promise();
}

function getUserByUsername(aUsername) {
  return Util.DocumentClient.get({
    TableName: usersTable,
    Key: {
      username: aUsername,
    },
  }).promise();
}

function clean(obj) {
  for (const propName in obj) {
    if (obj[propName] === null || obj[propName] === undefined) {
      delete obj[propName];
    }
  }
}
