import Users from "../models/userModel.js"
import Folder from "../models/FolderModel.js"
import mongoose from "mongoose"


export const createSocailUser = async (userId, folderId, name, email, picture) => {
    const session = await mongoose.startSession()
    try {

        await session.withTransaction(async () => {

            await Folder.insertOne({
                _id: folderId,
                name: `root-${email}`,
                parentFolderId: null,
                userId
            }, {
                session
            })

            await Users.insertOne({
                _id: userId,
                name,
                email,
                picture,
                rootFolderId: folderId,
                trems: true
            }, {
                session
            })
        })
    } catch (error) {
        console.log(error);

    } finally {
        session.endSession()
    }
}

export const createUser = async (userId, folderId, name, email, password, trems, picture) => {
    const session = await mongoose.startSession()
    try {

        await session.withTransaction(async () => {

            await Folder.insertOne({
                _id: folderId,
                name: `root-${email}`,
                parentFolderId: null,
                userId
            }, {
                session
            })

            await Users.insertOne({
                _id: userId,
                name,
                email,
                picture,
                password,
                rootFolderId: folderId,
                trems: trems
            }, {
                session
            })
        })
    } catch (error) {
        console.log(error);

    } finally {
        session.endSession()
    }
}