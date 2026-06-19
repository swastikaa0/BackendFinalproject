import app,{PORT, DUMMY } from "./src/app";
//IMPORTING SAME VARIABLE 
import { PORT as API_PORT } from "./src/configs/constant";
import { connectToMongoDB } from "./src/database/mongodb";

connectToMongoDB();

app.listen(
    PORT,  // start backend in this PORT
    () => {
        console.log(`Server: http://localhost:${API_PORT}`); // backtick
    }
);
