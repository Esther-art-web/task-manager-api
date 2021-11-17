
const {MongoClient, ObjectId} = require("mongodb");

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

MongoClient.connect(connectionURL, {useNewUrlParser: true},(error, client)  =>{
    if (error) {
        return console.log("Unable to connect to database");
    }
    const db = client.db(databaseName);

    // db.collection('users').findOne({_id :new ObjectId("616a01b130a8f901b38dfdae") },(error, user) => {
    //     if (error) {
    //        return console.log("Unable to fetch");
    //     }
    //     console.log(user);
    // })
    // db.collection('users').find({age: 20}).toArray((error, user) => {
    //     console.log(user);
    // })
    // db.collection('tasks').findOne({_id: new ObjectId("616a1081f8b470ebffc17d71")}, (error, task) => {
    //     console.log(task)
    // })
    // db.collection('tasks').find({completed: false}).toArray((error, task) => {
    //     if (error){
    //         return console.log(error)
    //     }
    //     console.log(task)
    // })


    //  db.collection("users").updateOne({_id: new ObjectId("616a00f73a8ee04ef3116c43")}, {
    //     // $set: {
    //     //     name : "Mike"
    //     // }
    //     $inc: {
    //         age : 1
    //     }
    // }).then((result) => {
    //     console.log(result);
    // }).catch((error) => {
    //     console.log(error);
    // })

    // db.collection("tasks").updateMany({completed: false},{
    //     $set: {
    //         completed: true
    //     }
    // }).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error);
    // });

    // db.collection("users").deleteMany({name: "Esther"}).then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })

    db.collection("tasks").deleteOne({description : "Check mails"}).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error);
    })
})