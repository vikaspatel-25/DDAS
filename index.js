const express = require('express');
const cors = require('cors');
const Router = require('./routes/routes.index')
const {watchMan,downloadsDir} = require("./services/fileWatcherService")

//setup express server
const PORT = 8003;
const app = express();

//middlewares
app.use(express.json());
app.use(cors());

//routes
app.use("/",Router)

//services
watchMan()

app.listen(PORT,()=>{console.log(`Server started at Port ${PORT}`)})
