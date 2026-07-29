
import { connectToMongoDBTest } from "../database/mongodb";
import mongoose from "mongoose";


beforeAll(async () => {
    await connectToMongoDBTest();
});

afterAll(async () => {
    await mongoose.connection.close();
});