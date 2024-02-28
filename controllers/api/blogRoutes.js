console.log("Executing blogRoutes.js");

const router = require('express').Router();
const { BlogPost, Comment } = require('../../models'); 
const withAuth = require('../../utils/auth'); 

router.get('/blogs/:id', async (req, res) => {
    try {
        console.log("GET /blogs/:id");
        
        const blogPostData = await BlogPost.findByPk(req.params.id, {
            include: [{
                model: Comment,
                attributes: ['id', 'comment_text', 'createdAt', 'authorId', 'upVotes', 'downVotes'],
                
            }],
        });

        if (blogPostData) {
            const blogPost = blogPostData.get({ plain: true });
            res.render('blogpost', {
                blogPost,
                loggedIn: req.session.logged_in 
            });
        } else {
            res.status(404).json({ message: 'No post found with this id' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

router.get('/blogs/edit/:id', withAuth, async (req, res) => {
    try {
        console.log("GET /blogs/edit/:id");
        
        const blogPostData = await BlogPost.findByPk(req.params.id);
        if (blogPostData) {
            const blogPost = blogPostData.get({ plain: true });
            res.render('editPost', {
                blogPost,
                loggedIn: req.session.logged_in
            });
        } else {
            res.status(404).json({ message: 'No post found with this id' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});


router.get('/blogs/new', withAuth, (req, res) => {
    console.log("GET /blogs/new");
    
    res.render('newPost', {
        loggedIn: req.session.logged_in
    });
});

router.post('/blogs', withAuth, async (req, res) => {
    try {
        console.log("POST /blogs");
        
        const newBlogPost = await BlogPost.create({
            ...req.body,
            userId: req.session.userId 
        });
        res.status(200).json(newBlogPost);
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});


router.delete('/blogs/:id', withAuth, async (req, res) => {
    try {
        console.log("DELETE /blogs/:id");
        
        const blogPostData = await BlogPost.destroy({
            where: {
                id: req.params.id,
                userId: req.session.userId 
            }
        });

        if (blogPostData) {
            res.status(200).json({ message: 'Post successfully deleted' });
        } else {
            res.status(404).json({ message: 'No post found with this id' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
});

router.put('/blogs/upvote/:id', withAuth, async (req, res) => {
    try {
        console.log("PUT /blogs/upvote/:id");
        
        const post = await BlogPost.findByPk(req.params.id);
        if (post) {
            post.upvotes += 1;
            await post.save();
            res.status(200).json(post);
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

router.put('/blogs/downvote/:id', withAuth, async (req, res) => {
    try {
        console.log("PUT /blogs/downvote/:id");
        
        const post = await BlogPost.findByPk(req.params.id);
        if (post) {
            post.downvotes += 1;
            await post.save();
            res.status(200).json(post);
        } else {
            res.status(404).json({ message: 'Post not found' });
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

router.use((req, res) => {
  res.send("<h1>Wrong Route!</h1>")
});


module.exports = router;
