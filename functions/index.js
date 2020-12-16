/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
"use strict";

// [START all]
// [START import]
// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require("firebase-functions");

// The Firebase Admin SDK to access Cloud Firestore.
const admin = require("firebase-admin");
admin.initializeApp();
// [END import]

// [START addMessage]
// // Take the text parameter passed to this HTTP endpoint and insert it into
// // Cloud Firestore under the path /messages/:documentId/original
// // [START addMessageTrigger]
// exports.addMessage = functions.https.onRequest(async (req, res) => {
//   // [END addMessageTrigger]
//   // Grab the text parameter.
//   const original = req.query.text;
//   // [START adminSdkAdd]
//   // Push the new message into Cloud Firestore using the Firebase Admin SDK.
//   const writeResult = await admin
//     .firestore()
//     .collection("messages")
//     .add({ original: original });
//   // Send back a message that we've successfully written the message
//   res.json({ result: `Message with ID: ${writeResult.id} added.` });
//   // [END adminSdkAdd]
// });
// // [END addMessage]

// [START makeUppercase]
// Listens for new messages added to /messages/:documentId/original and creates an
// uppercase version of the message to /messages/:documentId/uppercase
// [START makeUppercaseTrigger]
// exports.makeUppercase = functions.firestore
//   .document("/messages/{documentId}")
//   .onCreate((snap, context) => {
//     // [END makeUppercaseTrigger]
//     // [START makeUppercaseBody]
//     // Grab the current value of what was written to Cloud Firestore.
//     const original = snap.data().original;

//     // Access the parameter `{documentId}` with `context.params`
//     functions.logger.log("Uppercasing", context.params.documentId, original);

//     const uppercase = original.toUpperCase();

//     // You must return a Promise when performing asynchronous tasks inside a Functions such as
//     // writing to Cloud Firestore.
//     // Setting an 'uppercase' field in Cloud Firestore document returns a Promise.
//     return snap.ref.set({ uppercase }, { merge: true });
//     // [END makeUppercaseBody]
//   });
// // [END makeUppercase]
// // [END all]

// [START makeUppercaseTrigger]
exports.sendNotificationRequest = functions.firestore
  .document("/requests/{requestUid}")
  .onCreate(async (snap, context) => {
    var requestUid = context.params.requestUid;

      const deviceToken ="eD6d-GayEtSNVTY5JrvWYE:APA91bHx0li5k9cnce5__As9KNis3dn1VskObxA0z1_vdLw26J8_uqXBBrFZMyu_tSQMlFMTQSECJQJVkMV10ZJMY0aPC6T9HPjrH0mPdfGxF2bE4m9-jwe1nXsdJ-HXabF_48lZWn9t"

    const payload = {
      notification: {
        title: "You have a new follower!",
        body: `Got a message from  ${requestUid}  is now following you.`,
      },
    };

    const response = await admin.messaging().sendToDevice(deviceToken, payload);

    // store into firestore.notifcation
  });
// [END makeUppercase]
// [END all]

// Send notification that user got notification
exports.sendNotification = functions.firestore
  .document("userStorage/users/{user_id}/Notifications")
  .onCreate( async (snap,context) => {
    var user_id = context.params.user_id;

    console.log("got new notification");
    console.log(user_id);

    // const userEmail = event.params.userEmail;
    // const notificationId = event.params.notificationId;
    var docName = "UserData";

    var docRef = admin.firestore
      .collection("userStorage")
      .doc("users")
      .collection(user_id)
      .doc(docName);


    return docRef.get().then((queryResult) => {
      const deviceToken = queryResult.data().deviceToken;
      console.log(deviceToken);

      deviceToken ="eD6d-GayEtSNVTY5JrvWYE:APA91bHx0li5k9cnce5__As9KNis3dn1VskObxA0z1_vdLw26J8_uqXBBrFZMyu_tSQMlFMTQSECJQJVkMV10ZJMY0aPC6T9HPjrH0mPdfGxF2bE4m9-jwe1nXsdJ-HXabF_48lZWn9t"

      // const notificationMessage = queryResult.data().notificationMessage;

      // const fromUser = admin.firestore().cllection("users").doc(senderUserEmail).get();
      // const toUser = admin.firestore().collection("users").doc(userEmail).get();

      // return Promise.all([fromUser, toUser]).then(result => {
      // const fromUserName = result[0].data().userName;
      // const toUserName = result[1].data().userName;
      // const tokenId = result[1].data().tokenId;

      const notificationContent = {
        notification: {
          title: "Neue Benachrichtigung",
          body: "Du hast eine neue Benachrichtung",
        },
      };

      return admin
        .messaging()
        .sendToDevice(deviceToken, notificationContent)
        .then((result) => {
          console.log("Notification sent!");

          //admin.firestore().collection("notifications").doc(userEmail).collection("userNotifications").doc(notificationId).delete();
        });
      // });
    });
  });

/**
 * Triggers when a user gets a new follower and sends a notification.
 *
 * Followers add a flag to `/followers/{followedUid}/{followerUid}`.
 * Users save their device notification tokens to `/users/{followedUid}/notificationTokens/{notificationToken}`.
 */
// exports.sendFollowerNotification = functions.firestore
//   .document("/requests/{requestUid}")
//   .onCreate(async (snap, context) => {
//     const requestUid = context.params.requestUid;
//     // const followedUid = context.params.followedUid;
//     // If un-follow we exit the function.
//     // if (!change.after.val()) {
//     //   return console.log('User ', requestUid, 'un-followed user', requestUid);
//     // }
//     console.log(
//       "We have a new follower UID:",
//       requestUid,
//       "for user:",
//       requestUid
//     );

//     // Get the list of device notification tokens.
//     // Extend to list
//     // const adminUid = "8X81AgrU6Sc3Z23OMsXw4zLNuno2";

//     const deviceToken =
//       "cemez7dto7BKRsFajs4hWj:APA91bHO5CyjkQQyeP6TlpZ0kJH62aZl0P9saDOYbm-JXLrkgJtbew0VXokT6d2WyFFFGGblLSUlMt0CmJMiwiaxzNYMBg8j1DviXDaC9MxddowGaQmsZTnA3MiUD6cBUDyM8z-9_OZe";

//     // const getDeviceTokensPromise = admin
//     //   .database()
//     //   .ref(`/userStorage/${adminUid}/notificationTokens`)
//     //   .once("value");

//     // console.log(getDeviceTokensPromise);

//     // Get the follower profile.
//     // const getFollowerProfilePromise = admin.auth().getUser(adminUid);

//     // The snapshot to the user's tokens.
//     // let tokensSnapshot;

//     // The array containing all the user's tokens.
//     // let tokens;

//     // const results = await Promise.all([getDeviceTokensPromise, getFollowerProfilePromise]);
//     // tokensSnapshot = results[0];
//     // const follower = results[1];

//     // console.log(tokensSnapshot)
//     // console.log(follower)

//     // Check if there are any device tokens.
//     // if (!tokensSnapshot.hasChildren()) {
//     //   return console.log("There are no notification tokens to send to.");
//     // }
//     // console.log('There are', tokensSnapshot.numChildren(), 'tokens to send notifications to.');
//     // console.log('Fetched follower profile', follower);

//     // Notification details.
//     const payload = {
//       notification: {
//         title: "You have a new follower!",
//         body: `Got a message from  ${requestUid}  is now following you.`,
//       },
//     };

//     // Listing all tokens as an array.
//     // tokens = Object.keys(tokensSnapshot.val());
//     // Send notifications to all tokens.
//     const response = await admin.messaging().sendToDevice(deviceToken, payload);
//     // For each message check if there was an error.
//     // const tokensToRemove = [];
//     // response.results.forEach((result, index) => {
//     //   const error = result.error;
//     //   if (error) {
//     //     console.error('Failure sending notification to', tokens[index], error);
//     //     // Cleanup the tokens who are not registered anymore.
//     //     if (error.code === 'messaging/invalid-registration-token' ||
//     //         error.code === 'messaging/registration-token-not-registered') {
//     //       tokensToRemove.push(tokensSnapshot.ref.child(tokens[index]).remove());
//     //     }
//     //   }
//     // });
//     // return Promise.all(tokensToRemove);
//   });
