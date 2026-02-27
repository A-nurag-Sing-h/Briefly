import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
    name:
    {
        type:String,
        required:[true,"Please add a name!"]
    },
    email:
    {
        type:String,
        required:[true,"Please add an email!"],
        unique:true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please add a valid email"
        ]
    },
    password:
    {
        type:String,
        required:[true,"Please add a password!"],
        minlength:6,
        select:false
    },
    interestCategories: [
        {
            category: { type: String, required: true },
            points: { type: Number, default: 10 }
        }
    ],
    bookmarks: [
        {
            title: String,
            url: String,
            source: String,
            urlToImage: String,
            publishedAt: Date,
            savedAt: 
            {
                type: Date,
                default: Date.now
            }
        }
    ],
    role: 
    {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    }
},
{
    timestamps:true
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save",async function (){
    if(!this.isModified("password"))
        return;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
});

const User = mongoose.model("User",userSchema);

export default User;