const mongoose = require("mongoose");


mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser : true
    // useCreateIndex: true,
    // useFindAndModify : false
})




// const chores = new Task({
//     description: "         Walk the dogs       "
//     // completed: true
// })
// chores.save().then((result) => {
//     console.log(result);
// }).catch((error) => {
//     console.log(error);
// })   