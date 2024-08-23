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
        const { data } = req.body;
        console.log("Payload:", data);
        
        const svixHeaders = req.headers;
        console.log("Headers:", svixHeaders);

        const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET_KEY);
        const evt = wh.verify(JSON.stringify(req.body), svixHeaders); // Verify the payload string

        // Destructure the data values
        const { id, ...attributes } = evt.data;

        // Destructure the type of data
        const eventType = evt.type;
        console.log("Event Type:", eventType);

        // Destructuring data from attributes
        const { email_addresses, first_name, last_name, image_url } = attributes;

        // Handle the webhooks
        if (eventType === "user.created") {
            console.log(`User ${id} was created.`);

            // Create user
            const user = new User({
                clerkUserId: id,
                fullName : `${first_name} ${last_name}`,
                email: email_addresses[0].email_address,
                avatar: image_url,
            });
            // save user
            await user.save();
            console.log("User saved to database");

        } else if (eventType === "user.updated") {
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
        }else if(eventType === "user.deleted"){
            console.log(`User ${id} was deleted`);

            // Delete user in database
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
