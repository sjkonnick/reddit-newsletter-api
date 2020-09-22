# Reddit Newsletter API

Reddit Newsletter API is a serverless backend service that allows users to create and update the users table in DynamoDB and achieve the following:

* Creating and updating users
* Creating and updating a users favourite subreddits
* Setting the newsletter send out time for each user (default: 8am)
* Turning on and off the newsletter send out for a specific user
* Triggering the send of a newsletter to each respective users email at each users specified send out time

It can also be utilized to generate the email payload for the Reddit newsletter containing the top three posts

## Installation

Run the following command to install the node modules.

`npm install`

To start the server locally which connects to a local DynamoDB:

`npm start`

At this point, the service should be available at http://localhost:3000