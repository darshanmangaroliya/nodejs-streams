const http = require("http")
const fs = require("node:fs/promises")

const server = http.createServer(async(req,res)=>{
    const file = await fs.open("test.txt","r")
    const stream = file.createReadStream({highWaterMark:1024})
    res.write("come from server")

    stream.pipe(res)
    stream.on("end",()=>{

        res.end()
    })
}
)

server.listen(3000)