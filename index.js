import express from "express";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from "uuid";

const port = 3000;
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));

let myBlogs = [];

app.get("/", (req, res) => {
    res.render("index.ejs", {
        myBlogs,
        blogToEdit: null   // 👈 ADD THIS LINE
    });
});

app.get("/blog/:id", (req, res) => {
    const blog = myBlogs.find(b => b.id === req.params.id);
    if (!blog) return res.redirect("/");

    res.render("blog.ejs", { blog });
});

app.get("/articles",(req,res)=>{
    res.render("articles.ejs");
});

app.post("/blog-action", (req, res) => {
    const { action, title, content, blogId } = req.body;

    // ---------- POST ----------
    if (action === "post") {
        if (!title || !content) return res.redirect("/");

        myBlogs.push({
            id: uuidv4(),
            title,
            content
        });

        return res.redirect("/");
    }

    // ---------- EDIT (LOAD CONTENT IF TITLE EXISTS) ----------
    if (action === "edit") {

        // CASE 1: user entered ONLY title → load blog
        if (title && !content) {
            const blog = myBlogs.find(b => b.title === title);
            if (!blog) return res.redirect("/");

            return res.render("index.ejs", {
                myBlogs,
                blogToEdit: blog
            });
        }

        // CASE 2: user edited content → save
        if (blogId && content) {
            const blog = myBlogs.find(b => b.id === blogId);
            if (!blog) return res.redirect("/");

            blog.title = title;
            blog.content = content;

            return res.redirect("/");
        }
    }

    // ---------- DELETE ----------
    if (action === "delete") {
        myBlogs = myBlogs.filter(b => b.id !== blogId);
        return res.redirect("/");
    }

    res.redirect("/");
});

app.listen(port,()=>{
    console.log(`listening on port ${port}`);
});