const express = require('express')
const fs = require('fs')
const upload = require('express-fileupload')

const app = express()

app.use(upload())

app.get('/', function(req, res){
    res.sendFile(__dirname + "/index.html")
})

app.get('/download/:fileName', function(req, res){
    const file = `${__dirname}/uploads/${req.params.fileName}.mp4`;
    res.download(file); // Set disposition and send it.
  });

app.post('/', function(req, res){
    if(req.files) {
        const videoFile = req.files.videofile
        console.log(videoFile)

        videoFile.mv('./uploads/' + videoFile.name, function(err){
            if(err){
                res.send(err)
            } else {
                res.send("File Uploaded")
            }
        })
    }
})

app.get('/playvideo', function(req, res){
    const range = req.headers.range

    //Video Path
    const videoPath = "uploads/campaign.mp4"

    //Video Size
    const videoSize = fs.statSync(videoPath).size

    const chunkSize = 10 ** 6 //1MB

    //Calculating Starting Position usng regex
    const start = Number(range.replace(/\D/g, ""))

    const end = Math.min(start + chunkSize, videoSize - 1)

    const contentLength = end - start + 1

    //Set Headers for Playing Video
    
    const headers = {
        "Content-Range" : `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges" : "bytes",
        "Content-Length" : contentLength,
        "Content-Type" : "video/mp4"
    }

    res.writeHead(206, headers)

    const stream = fs.createReadStream(videoPath, {start, end})

    stream.pipe(res)
})



app.listen(3000, function() {
    console.log("Server running at port 3000")
})

