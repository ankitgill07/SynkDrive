import mongoose from "mongoose";


export async function connetDB() {
    try {
        await mongoose.connect(process.env.DATABASE_URL)
    } catch (error) {
        process.exit(1)
    }
}


process.on("SIGALRM" , async() => {
await mongoose.disconnect()
process.exit(0)
})