const express = require('express');

// database access using knex
const db = require('../data/db-config.js');

const router = express.Router();

router.get('/', async (req, res, next) => {
    try{
       // SELECT * FROM posts
       
       //query builder imported in db
       const posts= await db.select("*").from("posts")

       //compile our sql statement and send it off to db
       //knex is going to compile our sql statment and send it off to the db
       //db is gong to respond with a bunch of rows
       //knex is going to collect all those rows and its going to give them to us in the posts variable
        //now send it back
        res.json(posts)
    }
    catch(err){
        next(err)

    }

});

router.get('/:id', async(req, res, next) => {
    //SELECT * FROM messages WHERE id = ?
    try{
        const posts= await db //destructure const [posts] = await.db
        .select("*")  
        .from("posts")
        .where("id", req.params.id)
        .limit(1) //just to be safe

        //send it back to the response
        res.json(posts[0])

    }catch(err){
        next(err)
    }

});

router.post('/', async(req, res, next) => {
    //insert into messages {ttitle, contents} VALUES (?,?)

    try{
        const [id] = await db
        //database will automatically generate an id

        //its a good idea to specifically insert each value in the body
        //user trying to hack data comment, or an id
        .insert({title:req.body.title, contents: req.body.contents})
        .into("posts")

        //we receive row id
        //print out the json of what you just posted
        const post = await db("posts").where("id", id).first() //.first => limit(1)
        res.status(201).json(post)
    }
    catch(err){
        next(err)
    }

});

router.put('/:id', async(req, res, next) => {
    // UPDATE posts SET title= ? AND Contents=?  where id
    try{
        await db("posts")
        .update({title:req.body.title, contents: req.body.contents})
        // .where("id", req.params.id)
    
        //now this will return just the newly created id
        // res.status(201).json(post)
    
    //*version2
        //use req.params.idd to make another select statement to respond with
        const post = await db("posts").where("id", req.params.id).first()
        
        res.status(201).json(post)
    
    }catch(err){
        next(err)
    }

});

router.delete('/:id', async (req, res, next) => {
    //DELETE from posts WHERE id=?
    try {
        await db("posts")
        .where("id", req.params.id)
        .del()

        const post = await db("posts").where("id", req.params.id).first()

        // if(post){
        //     res.status(204).json({message:"its deleted"}) 
        // }else{
        //     res.status(404).json({message:"Couldnt be delete"})
        // }
   
        //send a 204 back
        res.status(204).json({message: "successful delete"})
    }catch(err){
        next(err)
    }


});

module.exports = router;