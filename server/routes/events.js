// const express = require("express");
// const router = new express.Router();
// const event = require('../model/event');

// // event crud

// router.post("/events",async (req,res,next)=>{
//     const events = new event(req.body);
//     try {
//         const savedevent = await event.save();
//         res.status(201).send(savedevent);
//     } catch (e) {
//         res.status(404).send(e);   
//     }
// });

// router.get("/events",async (req,res,next)=>{
//     try {
//         const events = await event.find({});
//         res.send(events);
//     } catch (e) {
//         res.status(500).send(e);
//     }    
// });


// router.get("/events/:id",async (req,res,next)=>{
//     const eventId = req.params.id;
//     try {
//         const event = await event.findById(eventId);
//         if (!event) return res.status(404).send("event not found!");
//         res.send(event);
//     } catch (e) {
//         res.status(500).send(e);
//     }    
// });

// router.patch("/events/:id",async (req,res,next)=>{
//     const eventId = req.params.id;
//     try {
//         const event = await event.findByIdAndUpdate(eventId,req.body,{
//             new:true,
//             runValidators:true
//         });
//         if (!event) return res.status(404).send("event not found!");
//         res.send(event);
//     } catch (e) {
//         res.status(500).send(e);
//     } 
// });

// router.delete("/events/:id",async (req,res,next)=>{
//     const eventId = req.params.id;
//     try {
//         const event = await event.findByIdAndDelete(eventId);
//         if (!event) return res.status(404).send("event not found!");
//         res.send(event);
//     } catch (e) {
//         res.status(500).send(e);
//     } 
// });


// module.exports = router;