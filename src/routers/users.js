
const express = require("express");
const router = new express.Router();
const User = require('../models/users');
const auth = require ('../middleware/auth');
const multer = require("multer");
const sharp = require("sharp");
const {sendWelcomeEmail, sendCancellationEmail} = require ('../emails/account')


router.post('/users', async (req, res) => {
    const user = new User(req.body);

    try {
        const token = await user.generateAuthToken();
        await user.save();
        sendWelcomeEmail(user.email, user.name);
        res.status(201).send({user, token});
        
    } catch (e) {
        res.status(400).send(e);
    }

})
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        console.log(user, token)
        res.send({user, token}); 
    } catch (e) {
        res.status(400).send("An error occured")
    }
});

router.post('/users/logout',auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token;
        })
        await req.user.save();
        res.send()
    } catch (e) {
        res.status(500).send();
    }
})

router.post('/users/logoutall',auth, async (req, res) => {
    try {
        const user = req.user;
        user.tokens = [];
        await user.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
})
const upload = multer({
    limits : {
        fileSize : 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error("Unsupported file format!"));
        }
        cb(undefined, true);
    }
})
router.post('/users/me/avatar', auth, upload.single('avatar'),async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer(); 
    req.user.avatar = buffer;
    await req.user.save();
    
    res.send("Successfully Uploaded")
}, (error, req, res, next) => {
    res.status(400).send({error : error.message});
});

router.get('/users/me',auth, async (req, res) => {
    res.send(req.user);
});

// You should not be a
// router.get('/users/:id', async (req, res) => {
//     const _id = req.params.id;
//     try {
//         const user = await User.findById(_id);
//         if (!user) {
//             return res.status(404).send("User not found!")
//         }
//         res.send(user);
//     } catch (e) {
//         res.status(500).send(e);
//     }
    // User.findById(_id).then((user) => {
    //     if(!user){
    //         return res.status(404).send("User not found");
    //     }
    //     res.send(user);
    // }).catch((e) => {
    //     res.status(500).send(e);
    // })
// } )

router.patch('/users/me',auth, async (req, res) => {
    const user = req.user;
    const userUpdate = req.body;
    const updates = Object.keys(userUpdate)
    const allowedUpdates = ['name', "email", 'password', 'age'];
    const isValidOption = updates.every((update) => allowedUpdates.includes(update));
    if (!isValidOption) {
        return res.status(400).send("Error : Invalid Operation");
    }
    try {
        updates.forEach((update) => {
            user[update] = req.body[update];
        })
        await user.save();
        res.send(user);
    } catch (e) {
        res.status(400).send(e);
    }
})

router.delete('/users/me',auth , async(req, res) => {
   
    try{
        await req.user.remove();
        sendCancellationEmail(req.user.email, req.user.name)
        res.send(req.user);
    } catch (e) {
        res.status(500).send("An error occured!");
    } 
});

router.delete('/users/me/avatar', auth, async(req, res) => {
    if (!req.user.avatar) {
        return res.status(400).send();
    }
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
})

router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || !user.avatar) {
            throw new Error();
        }

        res.set("content-Type", "image/png ")
        res.send(user.avatar)
    } catch (e) {
        req.status(404).send();
    }
})

module.exports = router;