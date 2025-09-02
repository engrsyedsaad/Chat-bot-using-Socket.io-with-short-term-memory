require("dotenv").config()

const app =require("./src/app")

const generateResponse = require("./src/service/ai.service")

const { createServer } = require("http");
const { Server } = require("socket.io");


const httpServer = createServer(app);
const io = new Server(httpServer, { 
   cors: {  
      origin: "http://localhost:5173",
    
   }
 });

const shortMemory =[]

io.on("connection", (socket) => {
   console.log("New client connected");
   socket.on("disconnect", () => {
      console.log("Client disconnected");
   });

    socket.on("ai-message", async(data)=>{
      console.log("Message from client:", data);

         shortMemory.push({
            role:"user",
            parts:[{text:data}]
         });

    const response = await generateResponse(shortMemory);
    console.log("Response from AI:", response);

     shortMemory.push({
        role:"model",
        parts:[{text:response}]
     });

    socket.emit("ai-response",response)

        

    })
  // ...
});

httpServer.listen(3000,()=>{
    console.log("server is running on port 3000")
});