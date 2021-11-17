const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Task = require('./tasks')

const userSchema = new mongoose.Schema( {
    name: {
        type: String, 
        required: true,
        trim: true
    },
    age: {
        type: Number,
        validate(value) {
            if (value < 0) {
                throw new Error ("Age must be a positive number");
            }
        },
        default: 0
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate(value){
           if(!validator.isEmail(value)) {
            throw new Error("You need to enter a valid email")
           } 
        },
        trim: true,
        lowercase: true
    },
    password: {
        type:String,
        required: true,
        trim: true,
        minLength: 7,
        validate(value){
            if (value.includes("password")){
                throw new Error("You cannot use the word 'password' in your password!")
            }
        }

    }, 
    tokens: [{
        token : {
            type: String,
            required: true
        }
    }],
    avatar : {
        type : Buffer
    }
}, {
    timestamps:true
})

userSchema.virtual("tasks", {
    ref : "Task",
    localField : '_id',
    foreignField : 'owner'
})

userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;
    return userObject;
}

userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const token= jwt.sign({_id: user._id.toString()}, "thisismynewcourse");
    user.tokens = user.tokens.concat({token})
    await user.save();
    return token;
}

userSchema.statics.findByCredentials = async(email, password) => {
    const user = await User.findOne({email});
    if (!user) {
        throw new Error("Unable to login");
    }
    const isMatch = await bcrypt.compare(password, user.password );

    if (!isMatch) {
        throw new Error ("Unable to Login");
    }
    return user
}


// hash password before saving
userSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8);
    }
    next();
})

// deletes users tasks when user is removed
userSchema.pre('remove', async function(next) {
    const user = this;
    await Task.deleteMany({owner : user._id});
    next()
})

const User = mongoose.model("User", userSchema);



module.exports = User;