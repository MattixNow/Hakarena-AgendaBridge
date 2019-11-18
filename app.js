require('dotenv').config()
// Google OAuth Configuration
var googleConfig = {
    clientID:
        process.env.gApiId,

    clientSecret:process.env.gApiSecret,
    calendarId: process.env.clientCalendarId,
    redirectURL: "http://localhost:2002/auth"
};

// Dependency setup
var dayjs = require("dayjs");

var express = require("express"),
    moment = require("moment");
var { google } = require("googleapis");

// Initialization
var app = express(),
    calendar = google.calendar("v3");
(oAuthClient = new google.auth.OAuth2(
    googleConfig.clientID,
    googleConfig.clientSecret,
    googleConfig.redirectURL
)),
    (authed = false);

function addEvent(timeRange) {
    console.log(timeRange);
    
}
app.use(express.json());
app.get("/", (req, res) => {

    console.log(req.query.data);

    var first = dayjs().format();
    var second = dayjs()
        .add(5, "minute")
        .format();
        
        
        
        if (!authed) {
            // Generate an OAuth URL and redirect there
            var url = oAuthClient.generateAuthUrl({
                access_type: "offline",
                scope: "https://www.googleapis.com/auth/calendar"
            });
            res.redirect(url);
        } else {
            var today = moment().format("YYYY-MM-DD") + "T";
            
            console.log('data :' +req.query.data)
        var ourData = JSON.parse(req.query.data);
            
            // Call google to fetch events for today on our calendar
            calendar.events.insert(
                {
                    calendarId: googleConfig.calendarId,
                    sendNotifications: true,
                    sendUpdates: "all",
                    supportsAttachments: true,
                resource: {
                    start: {
                        dateTime: first
                    },
                    end: {
                        dateTime: second
                    },
                    description: "Debug Google API",
                    gadget: {
                        display: "icon",
                        iconLink:
                            "https://imgplaceholder.com/420x320/cccccc/757575/glyphicon-fire",
                        link: "https://google.com/"
                    },
                    location: ourData.clubLocation,
                    creator: {
                        displayName: "TeamHakarena"
                    },

                    summary: `${ourData.whichSports} pour ${ourData.childName}`,

                    colorId: 7
                },
                auth: oAuthClient
            },
            function(err, events) {
                if (err) {
                    console.log("Error fetching events");
                    console.log(err);
                } else {
                    // Send our JSON response back to the browser
                    console.log("Successfully fetched events");
                    res.send(events);
                }
            }
        );
    }
 
});

// Return point for oAuth flow, should match googleConfig.redirectURL
app.get("/auth", function(req, res) {
    var code = req.param("code");

    if (code) {
        // Get an access token based on our OAuth code
        oAuthClient.getToken(code, function(err, tokens) {
            if (err) {
                console.log("Error authenticating");
                console.log(err);
            } else {
                console.log("Successfully authenticated");
                console.log(tokens);

                // Store our credentials and redirect back to our main page
                oAuthClient.setCredentials(tokens);
                authed = true;
                res.redirect("/");
            }
        });
    }
});

var server = app.listen(2002, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log(`Listening at http://${host}:${port}`);
});
