import User from "../models/userModel.mjs";
import generateToken from "../utils/generateToken.mjs";

export const registerUser = async (req,res)=>{
    try 
    {
        const {name,email,password,interestCategories} = req.body;

        // check if user exists
        const userExists = await User.findOne({email});
        if(userExists)
            return res.status(400).json({message:"User already exists! Please login!"});

        // create user 
        const userDetails = {
            name,
            email,
            password,
            interestCategories
        };
        const user = await User.create(userDetails);
        res.status(201).send({message:"User created successfully!",user:{
            id:user._id,
            name:user.name,
            email:user.email,
            interests: user.interestCategories,
            token:generateToken(user._id),
        }});
    }
    catch(err)
    {
        console.log({message:err.message});
        res.status(500).json({message:"Server error, Please try!"});
    }
};

export const loginUser = async (req, res) => {
    try 
    {
        const { email, password } = req.body;

        // Find user (don't forget to select the password field!)
        const user = await User.findOne({ email }).select("+password");

        // Check if user exists and password matches
        if (user && (await user.matchPassword(password))) 
        {
            res.status(200).json({
                message: "Login successful!",
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    interests: user.interestCategories,
                    token:generateToken(user._id),
                }
            });
        } 
        else 
        {
            // Why use 401? It's the standard for "Unauthorized"
            res.status(401).json({ message: "Invalid email or password" });
        }
    } 
    catch (err) 
    {
        res.status(500).json({ message: err.message });
    }
};