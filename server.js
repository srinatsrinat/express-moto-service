var express = require('express')
var app =  express()
var mongodb = require('mongodb')
var mongoClient = mongodb.MongoClient
var cors = require('cors')

app.use(cors())

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  })

app.use(express.json())

var dbUrl = 'you mongodb url between these quotes'

//api to book

app.post('/bookservice', async (req,res)=>{
    
    
    var client = await mongoClient.connect(dbUrl)
    var db = client.db('motos')
    var man = db.collection('managers')
    var bookingz = db.collection('bookings')
    var today = new Date() 
    var plusTwo = new Date()
    plusTwo.setDate(today.getDate()+2)
    var datess = new Date(req.body.appointment_time)
    var times = datess.toLocaleTimeString()

    var nameList = await db.collection('managers').find().toArray()
    var bookingsList = await db.collection('bookings').find({"v_no":req.body.v_no}).toArray()
    console.log(bookingsList)

    var id = ''
    var man_name = ''

    if(bookingsList.length!=0){
        res.send(`Service appointment already exists.`)
    }else{


    if(datess < today || datess > plusTwo){

         res.send( 'service not available on selected date.'         )       
    }else{
        var count = 0
        nameList.map(item=>{
            
            if(!item.availableTime.includes(times)){
                req.body['service_manager']= item.mname
                req.body['service_status']= 'booked'
                man_name = item.mname
                id = item._id
               
            }else{
                count++
            }
         
        })

        if(count==nameList.length)
        res.send( `All service managers are busy on requested date and time. Contact 9999 9999 99 in case of emergency.`                )
        else{
        var updated_bookings = await bookingz.insertOne(req.body)
        var updated_availTime = await man.updateOne({_id:id},{$push:{availableTime: times}})

        res.send(`Service Appointment Booked. Visit SS service center on ${datess.toLocaleDateString()} at ${times}. ${man_name} will be your service manager. For more details, call 9999 9999 99`        )
        }
    }

    }
    
    
})


app.delete('/deleteappointment', async (req,res)=>{

    var client = await mongoClient.connect(dbUrl)
    var db = client.db('motos')
    var man = db.collection('managers')
    var bookingz = db.collection('bookings')
    var cancelled = db.collection('closed')

    var add_this = await bookingz.findOne({"v_no":req.body.v_no})

    if(add_this!=null && add_this.service_status=='booked'){

    
    console.log(add_this)
    add_this.service_status ='cancelled'

    console.log(add_this)
    var thisisclosed = await cancelled.insertOne(add_this)
    var datez = new Date(add_this.appointment_time)
    var timez = datez.toLocaleTimeString()
    var man_times = await man.updateOne({"mname":add_this.service_manager}, {$pull:{'availableTime': timez}})
    console.log(man_times)

    var deleted_bookings = await bookingz.deleteOne({"v_no":req.body.v_no})



    res.send( `Booking has been cancelled.`    )
}else if(add_this!=null && add_this.service_status=='in service'){

res.send('Vehicle already in workshop, can not cancel booking now')

}else{
 
    res.send(`Nothing to cancel`    )
}


})


app.post('/gethistory', async (req,res)=>{

    var client = await mongoClient.connect(dbUrl)
    var db = client.db('motos')
    var cancelled = db.collection('closed')
  

    var get_this = await cancelled.find({"v_no":req.body.v_no}).toArray()

    if(get_this.length!=0){

    res.status(200).json(get_this)
    }else{
        res.send(`Vehicle has no history with our service centre`    )
}


})

app.post('/getstatus', async (req,res)=>{

    var client = await mongoClient.connect(dbUrl)
    var db = client.db('motos')
    var bookingz = db.collection('bookings')
  

    var get_this = await bookingz.find({"v_no":req.body.v_no}).toArray()

    if(get_this.length!=0){

    res.status(200).json(get_this)
    }else{
        res.send(`No active bookings for the vehicle with our service centre`    )
}


})


app.listen(process.env.PORT || 3000, ()=>{
    console.log('listening to 3000')
})