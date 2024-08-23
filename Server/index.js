import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./db/index.js";
import { User } from "./models/User.model.js";
import morgan from "morgan";
import { Webhook } from 'svix';


const PORT = process.env.PORT || 5000;

const app = express();

// Middleware cors
app.use(
    cors({
        origin: process.env.CORS_ORIGIN,
    })
);
// Middleware
app.use(express.json());
app.use(morgan('tiny'));

app.get('/', (req,res)=>{
    res.send("Hello world")
})
// Real code
app.post("/api/webhook", async function (req, res) {
    try {
        // Destructure the payload from req.body
        const { type, data } = req.body;
        
        // If data contains id and attributes, destructure them
        const { id, ...attributes } = data || {};
        console.log("Attributes:", attributes); // Logging attributes for debugging

        const svixHeaders = req.headers;
        console.log("Headers:", svixHeaders);

        const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET_KEY);
        const evt = wh.verify(JSON.stringify(req.body), svixHeaders); // Verify the payload string

        console.log("Event Type:", type);

        // Destructuring data
        const { email_addresses, first_name, last_name, image_url } = attributes;

        if (type === "user.created") {
            console.log(`User ${id} was created.`);

            const user = new User({
                clerkUserId: id,
                fullName : `${first_name} ${last_name}`,
                email: email_addresses[0].email_address,
                avatar: image_url,
            });

            await user.save();
            console.log("User saved to database");

        } else if (type === "user.updated") {
            console.log(`User ${id} was updated.`);
            
            // Update user data in the database
            const updatedUser = {
                fullName : `${first_name} ${last_name}`,
                email: email_addresses[0].email_address,
                avatar: image_url,
            };

            await User.findOneAndUpdate({ clerkUserId: id }, updatedUser, {
                new: true,
            });

            console.log("User updated in the database");
        }else if(type === "user.deleted"){
            console.log(`User ${id} was deleted`);

            await User.deleteOne({clerkUserId : id});

            console.log("User deleted in the database");
        }
        
        res.status(200).json({
            success: true,
            message: "Webhook received",
        });
    } catch (err) {
        console.error("Error:", err.message);
        res.status(400).json({
            success: false,
            message: err.message,
        });
    }
});



// MonogDB Connection
connectDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log("Server is running on Port: " + PORT);
        });
    })
    .catch((error) => {
        console.log("MongoDB Connection Failed !!!", error);
    });
