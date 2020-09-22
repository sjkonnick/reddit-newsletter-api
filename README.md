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

## Examples

### Creating a user

When creating a user, the following fields can be set:

* username: string
* email: string
* favoriteSubreddits: string[]
* newsletterEnabled: boolean
* newsletterSendOutTime: number

`POST /api/users`

Body: 

`{
 	"user": {
 		"username": "sjkonnick",
 		"email": "sjkonnick@gmail.com",
 		"favoriteSubreddits": ["funny", "dankmemes", "technology"],
 		"isNewsletterEnabled": true,
 		"newsletterSendOutTime": 1600816551327
 	}
}`

Response:

`{
     "user": {
         "email": "sjkonnick@gmail.com",
         "username": "sjkonnick",
         "favoriteSubreddits": [
             "funny",
             "dankmemes",
             "technology"
         ],
         "isNewsletterEnabled": true,
         "newsletterSendOutTime": 1600816551327
     }
 }`

### Updating a user

`PUT /api/users`

Body: 

`{
 	"user": {
 		"username": "sjkonnick",
 		"email": "sjkonnick@gmail.com",
 		"favoriteSubreddits": ["funny", "dankmemes", "technology"],
 		"isNewsletterEnabled": true,
 		"newsletterSendOutTime": 1600816551327
 	}
}`

Response:

`{
     "user": {
         "email": "sjkonnick@gmail.com",
         "username": "sjkonnick",
         "favoriteSubreddits": [
             "funny",
             "dankmemes",
             "technology"
         ],
         "isNewsletterEnabled": true,
         "newsletterSendOutTime": 1600816551327
     }
 }`
 
 ### Retrieving the email payload
 
 After creating a user, that email can then be used as part of the /users endpoint to retrieve the Reddit newsletter email payload:
 
 `GET /api/users/{email}`
 
 Response: 
 
 `
 {
     "favoriteSubreddits": [
         {
             "subreddit": "funny",
             "url": "https://www.reddit.com/r/funny/top",
             "topPosts": [
                 {
                     "image": "https://a.thumbs.redditmedia.com/tJdT6B0145lScfvsJ183XLIHZGWQ0B3CEtLkhUAzmy8.jpg",
                     "upVotes": 126934,
                     "title": "My solution to a socially distanced Halloween"
                 },
                 {
                     "image": "https://b.thumbs.redditmedia.com/dwOSLZWp73PBSRVcjICItVkTqmO1EzrETReB2HeHDkc.jpg",
                     "upVotes": 81233,
                     "title": "My sister got married over the weekend, so we recreated this gem from our childhood."
                 },
                 {
                     "image": "https://b.thumbs.redditmedia.com/Y-6irPfX6MtOiEpGvBDzn5kv40LmlVoT3AFvyCH97cY.jpg",
                     "upVotes": 77524,
                     "title": "Pure Gold"
                 }
             ]
         },
         {
             "subreddit": "dankmemes",
             "url": "https://www.reddit.com/r/dankmemes/top",
             "topPosts": [
                 {
                     "image": "https://b.thumbs.redditmedia.com/VZRNtN4ORIYWymog-sXXBuwq-hTJnKdYcSPdTFHq12E.jpg",
                     "upVotes": 113476,
                     "title": "All of that stress just to be ejected. Part 3 of mashing up the art by u/Neytirixx"
                 },
                 {
                     "image": "https://b.thumbs.redditmedia.com/jXk_5G4K03o1ReoWQ6FJS0wqAbk5myotsz4QPWUPXOw.jpg",
                     "upVotes": 86987,
                     "title": "My first High Effort OC. Hope you like it"
                 },
                 {
                     "image": "https://b.thumbs.redditmedia.com/HYqIE-3bZjZ9joR4NDVfp1xvk21Om2xnQ7Aiwa3ZMmk.jpg",
                     "upVotes": 84025,
                     "title": "No cap"
                 }
             ]
         },
         {
             "subreddit": "technology",
             "url": "https://www.reddit.com/r/technology/top",
             "topPosts": [
                 {
                     "image": "https://b.thumbs.redditmedia.com/57NprFzny0rsvwcDLlFKkEwJrwXZB6Ke0ONHMuHPrtY.jpg",
                     "upVotes": 26210,
                     "title": "Shell reportedly to slash oil and gas production costs to focus more on renewables"
                 },
                 {
                     "image": "https://b.thumbs.redditmedia.com/HkSzMNkgR710mjdMsruGuOVJ-G4MzmIdwgYBx7A85GQ.jpg",
                     "upVotes": 24031,
                     "title": "Ex-content moderator sues YouTube, claims job led to PTSD symptoms and depression The worker watched videos that included beheadings, shootings and child abuse, according to the lawsuit."
                 },
                 {
                     "image": "https://b.thumbs.redditmedia.com/MNLJ7V74DRsmHUYNiov5WT04jEF-FZbPybYfLu_dlVE.jpg",
                     "upVotes": 1505,
                     "title": "Federal Agencies Tapped Protesters’ Phones in Portland - Homeland Security has not yet come clean to the public about the full extent of its intelligence operations in Portland."
                 }
             ]
         }
     ]
 }
 `