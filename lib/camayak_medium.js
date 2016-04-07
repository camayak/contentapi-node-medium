"use strict";

const medium    = require('medium-sdk');

class CamayakMedium {
    constructor(api_key) {
        this.api_key = api_key;
        // Since we use an Integration Token instead
        //  of oAuth login, we just enter dummy values
        //  for the oAuth client options. 
        this.client = new medium.MediumClient({
          clientId: 'YOUR_CLIENT_ID',
          clientSecret: 'YOUR_CLIENT_SECRET'
        });
        // Then set the access token directly.
        this.client.setAccessToken(this.api_key);
    }
    // Publish an assignment
    publish(content, cb) {
        var client = this.client;
        client.getUser(function (error, user) {
            if (error) {
                return cb(error);
            }
            client.createPost({
          userId: user.id,
          title: content.heading,
          contentFormat: medium.PostContentFormat.HTML,
          content: content.content,
          publishStatus: medium.PostPublishStatus.PUBLIC
        }, function (error, post) {
            if (error) {
                return cb(error);
            }
                return cb(null, {published_id: post.id, published_url: post.url});
        })
        })
    }
    // Medium has no update capability
    update(content, cb) {
        // Just publish the edit as a new post on Medium
        return this.publish(content, cb);
    }
    // Medium has no update capability
    retract(content, cb) {
        return cb(null, {published_id: content.published_id, published_url: content.published_url});
    }
}

module.exports = CamayakMedium;