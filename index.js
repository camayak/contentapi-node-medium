"use strict"
const CamayakContentAPI = require('camayak-contentapi');
const CamayakMedium     = require('./lib/camayak_medium');

const api_key       = process.env.CAMAYAK_API_KEY;
const shared_secret = process.env.CAMAYAK_SHARED_SECRET;
const medium_key    = process.env.MEDIUM_API_KEY;
const port          = process.env.PORT || 5000;

// Proposed usage of a Camayak-contentapi sdk
let camayak = new CamayakContentAPI({
    api_key: api_key,
    shared_secret: shared_secret,
    publish: function(webhook, content) {
        let handler = new CamayakMedium(medium_key);
        handler.publish(content, function(error, response){
            if (error) {
                return webhook.fail(error);
            };
            return webhook.succeed({
                published_id: response.published_id,
                published_url: response.published_url
            });
        });
    },
    update: function(webhook, content) {
        let handler = new CamayakMedium(medium_key);
        handler.update(content, function(error, response){
            if (error) {
                return webhook.fail(error);
            };
            return webhook.succeed({
                published_id: response.published_id,
                published_url: response.published_url
            });
        });
    },
    retract: function(webhook, content) {
        // Retract Post using content.published_id
        //
        let handler = new CamayakMedium(medium_key);
        handler.retract(content, function(error, response){
            if (error) {
                return webhook.fail(error);
            };
            return webhook.succeed({
                published_id: response.published_id,
                published_url: response.published_url
            });
        })
    },
    error: function(error, webhook) {
        // Handle unexpected errors in the Camayak service
        webhook.fail(error);
    }
});

// Start listening for webhooks
camayak.start();