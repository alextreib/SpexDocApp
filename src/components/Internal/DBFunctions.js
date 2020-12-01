import Button from "components/CustomButtons/Button.js";
import LoginAlert from "components/LoginAlert/LoginAlert.js";
import MaterialTable from "material-table";
import React from "react";
import firebase from "components/Internal/Firebase.js";
import { getPublicKey } from "components/Internal/Extraction.js";
import { getUserID } from "components/Internal/Checks.js";

export const writeDBData = (docName, data) => {
  var user_id = getUserID();
  if (user_id == null) return false;

  firebase
    .firestore()
    .collection("userStorage")
    .doc("users")
    .collection(user_id)
    .doc(docName)
    .set({
      data: data, // Required because array cannot be pushed
    });
  return true;
};

export const readDBData = (docName, allowPublicKey) => {
  return new Promise((resolve, reject) => {
    var user_id;
    // todo: Maybe optimize user_id through overriding
    if (allowPublicKey && getPublicKey() != null) {
      // Get the publicKey as user_id
      user_id = getPublicKey();
    } else {
      user_id = getUserID();
      // Use usual path
      if (user_id == null) {
        console.log("Reading not possible");
        resolve(null);
      }
    }

    var docRef = firebase
      .firestore()
      .collection("userStorage")
      .doc("users")
      .collection(user_id)
      .doc(docName);

    docRef
      .get()
      .then((doc) => {
        if (doc.exists) {
          return doc.data();
        }
      })
      .then((doc_data) => {
        if (doc_data != null) resolve(doc_data["data"]);
        else resolve(null);
      });
  });
};

// todo: maybe include user?
export const uploadFile = ( fileToUpload) => {
  return new Promise((resolve, reject) => {
    // todo: enhance with fileinformation
    if (fileToUpload == null) {
      console.log("No file selected - Abort.");
      return false;
    }
    var fileName = fileToUpload.name;

    var storageRef = firebase.storage().ref();

    return storageRef
      .child(fileName)
      .put(fileToUpload)
      .then((snapshot) => {
        console.log("File uploaded");
        console.log(snapshot);
        snapshot.ref.getDownloadURL().then((downloadURL) => {
          if (downloadURL != null) resolve(downloadURL);
          else resolve(false);
        });
      });
  });
};

// Array operations
export const appendDBArray = (docName, arrayElement) => {
  return new Promise((resolve, reject) => {
    var user_id = getUserID();
    if (user_id == null) return false;

    const docRef = firebase
      .firestore()
      .collection("userStorage")
      .doc("users")
      .collection(user_id)
      .doc(docName);

      // todo: if non-existing -create
    docRef
      .update({
        data: firebase.firestore.FieldValue.arrayUnion(arrayElement),
      })
      .then((result) => {
        if (result != null) resolve(true);
        else resolve(false);
      });
  });
};

export const removeDBArray = (docName, arrayElement) => {
  return new Promise((resolve, reject) => {
    var user_id = getUserID();
    if (user_id == null) return false;

    const docRef = firebase
      .firestore()
      .collection("userStorage")
      .doc("users")
      .collection(user_id)
      .doc(docName);

    docRef
      .update({
        data: firebase.firestore.FieldValue.arrayRemove(arrayElement),
      })
      .then((result) => {
        if (result != null) resolve(true);
        else resolve(false);
      });
  });
};


export const deleteDoc = (docName) => {
  return new Promise((resolve, reject) => {
    var user_id = getUserID();
    if (user_id == null) return false;

    const docRef = firebase
      .firestore()
      .collection("userStorage")
      .doc("users")
      .collection(user_id)
      .doc(docName);

    docRef
      .delete()
      .then((result) => {
        if (result != null) resolve(true);
        else resolve(false);
      });
  });

}



// Not working


// Array operations
// key as {link: "https://"}
// Array is nested array, not 
// Array=[{element:1, link=https}, {element:2,link=https}]
export const substituteDBArrayElement = (docName, arrayElement,key) => {
  return new Promise(async (resolve, reject) => {
    var user_id = getUserID();
    if (user_id == null) return false;

    // Loading the whole document
    var old_doc=await readDBData(docName);

    // Search for key 
    console.log(old_doc)
    if(old_doc!=null) // Nothing to update
    {
      

    var new_doc=old_doc.map((medRecord) => {
      if(medRecord.link==key)
      {
        console.log("found element")
        medRecord=arrayElement;
      }
    });
  }
    console.log(old_doc)

    writeDBData(docName,old_doc);


    // // Updating element

    // // Override the complete array

    // const docRef = firebase
    //   .firestore()
    //   .collection("userStorage")
    //   .doc("users")
    //   .collection(user_id)
    //   .doc(docName);

    // docRef
    //   .update({
    //     data: firebase.firestore.FieldValue.arrayUnion(arrayElement),
    //   })
    //   .then((result) => {
    //     if (result != null) resolve(true);
    //     else resolve(false);
    //   });
  });
};





// Array access (previously)
  // loadDoc() {
  //   console.log("loadDoc");
  //   var defaultDatabase = firebase.firestore();

  //   var docRef = defaultDatabase.collection("userStorage").doc("docLinks");

  //   var user = firebase.auth().currentUser;
  //   if (user == null) {
  //     return;
  //   }
  //   var user_id = user.uid;

  //   var docLinks = [];

  //   docRef
  //     .get()
  //     .then(function (doc) {
  //       if (doc.exists) {
  //         for (const docLink of doc.data()[user_id]) {
  //           docLinks.push(docLink);
  //         }
  //         return docLinks;
  //       }
  //     })
  //     .then((docLinks) => {
  //       console.log(docLinks);
  //       this.setState({ showFiles: docLinks });
  //     });
  // }