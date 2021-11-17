const express = require("express");
const Task = require("../models/tasks");
const router = new express.Router();
const auth = require('../middleware/auth')


router.post("/tasks",auth, async (req, res) => {
    // const task = new Task(req.body);

    const task = new Task({
        ...req.body,
        owner : req.user._id
    })
    try {
     await task.save();
     res.status(201).send(task);
    } catch (e) {
     res.status(500).send(e);
    }
 })
 
//  GET /taasks?completed=true
 router.get('/tasks',auth, async (req, res) => {
     const query = req.query
     const match = {};
     const sort = {}
    if(query.completed) {
        match.completed = query.completed === 'true'
    }
    if(query.sortBy) {
        const parts = query.sortBy.split("_");
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }
     try{
         
        //  const tasks = await Task.find({owner : req.user._id});
        await req.user.populate({
            path : 'tasks',
            match, 
            options : {
                limit : parseInt(query.limit),
                skip : parseInt(query.skip),
                sort
            }
        })
         res.send(req.user.tasks);
     } catch (e) {
         res.status(500).send(e);
     }
 });
 
 router.get('/tasks/:id',auth, async (req, res) => {
     const _id = req.params.id;
     console.log(_id)
 
     try {
        const task = await Task.findOne({ _id , owner : req.user._id})
         if (!task) {
             return res.status(404).send("Task not found!")
         }
         res.send(task)
     } catch (e) {
         res.status(500).send(e);
     }
 });
 
 router.patch('/tasks/:id',auth, async(req, res) => {
     const _id= req.params.id;
     const data = req.body;
     validOptions= ['description', 'completed'];
     providedOptions = Object.keys(data);
     isValidOption = providedOptions.every((option) => validOptions.includes(option));
     if(!isValidOption) {
         return res.status(400).send("Invalid option")
     }
     try{
         const task = await Task.findOne({_id, owner : req.user._id});
         if (!task) {
             return res.status(404).send("Task not found");
         }
         providedOptions.forEach((option) => {
            task[option] = data[option];
        })
        await task.save();
         res.send(task)
     } catch (e) {
         res.status(500).send(e);
     }
     
 });
 
 router.delete("/tasks/:id", auth, async (req, res) => {
     const _id = req.params.id;
     const task = await Task.findOneAndDelete({_id, owner : req.user._id});
     try{
         if (!task) {
            return res.status(404).send("Task not found");
         }
         res.send(task)
     } catch (e) {
         res.status(500).send(e);
     }
 })

 module.exports = router;
