import app from "./server";
import { PORT } from "./config/env";
import connectionToDB from "./database/mongoDb";


app.listen(PORT, () => {
    console.log(`App listening on PORT ${PORT}`);
    connectionToDB()

})