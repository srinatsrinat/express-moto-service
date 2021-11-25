var BackendUrl = "localhost address/server address between these quotes"




function collectBookingData() {
    var a = document.getElementsByClassName("bookform")

   console.log(a[0][4].value)

  var book_data = {
    "v_no": a[0][0].value,
    "customer_name": a[0][1].value,
    "complaints" : a[0][2].value,
    "appointment_time": a[0][3].value,
    "contact_no": a[0][4].value
}

console.log(book_data)

a[0][0].value = ''
a[0][1].value = ''
a[0][2].value = ''
a[0][3].value =''
a[0][4].value = ''

    fetch(BackendUrl + '/bookservice' , {
      method: "POST",
      body: JSON.stringify(book_data),
      headers: {
         "Accept": "application/json",
        "Content-type": "application/json; charset=UTF-8",
      }   
    })
      .then((resp) => resp.text())
      .then((result) => {
        console.log(result)
    window.alert(result)   
      
      })
      .catch((err) => console.log(err));


  }

  function deleteBooking() {
    var b = document.getElementById("deleteBooked").value

   console.log(b)

  var data = {
    "v_no": b
}

document.getElementById("deleteBooked").value = ''

console.log(data)


    fetch(BackendUrl + '/deleteappointment' , {
      method: "DELETE",
      body: JSON.stringify(data),
      headers: {
         "Accept": "application/json",
        "Content-type": "application/json; charset=UTF-8",
      }   
    })
      .then((resp) => resp.text())
      .then((result) => {
        console.log(result)
    window.alert(result)   
      
      })
      .catch((err) => console.log(err));


  }


  function checkingStatus() {
    var hold = document.getElementById('v-pills-messages')
    
    hold.removeChild(hold.lastChild)

    var c = document.getElementById("statusCheck").value
    document.getElementById("statusCheck").value = ''
    
   console.log(c)

  var data = {
    "v_no": c
}

console.log(data)


    fetch(BackendUrl + '/getstatus' , {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
         "Accept": "application/json",
        "Content-type": "application/json; charset=UTF-8",
      }   
    })
      .then((resp) => resp.text())
      .then((result) => {
        console.log(result)

        if(result == 'No active bookings for the vehicle with our service centre'){
          var blo = document.createElement('div')
        blo.className = 'card status'

        var mes = document.createElement('p')
        mes.innerHTML = result
        blo.append(mes)

        document.getElementById('v-pills-messages').append(blo)

        }

        var res = JSON.parse(result)
        console.log(res[0].v_no)

       

        var blo = document.createElement('div')
        blo.className = 'card status'
       

        var vNo = document.createElement('p')
        vNo.innerHTML = `Motorcycle Registered Number : ${res[0].v_no} `
        blo.append(vNo)

        var cusName = document.createElement('p')
        cusName.innerHTML = `Customer Name : ${res[0].customer_name} `
        blo.append(cusName)


        var stat = document.createElement('p')
        stat.innerHTML = `Service Status : ${res[0].service_status} `
        blo.append(stat)

        var man = document.createElement('p')
        man.innerHTML = `Service Manager : ${res[0].service_manager} `
        blo.append(man)

        var mes = document.createElement('p')
        mes.innerHTML = `For any query, please contact 9999 9999 99 `
        blo.append(mes)

        document.getElementById('v-pills-messages').append(blo)

      })
      .catch((err) => console.log(err));
     

  }

  function checkingHistory() {

    var hold = document.getElementsByClassName('card history')
    while(hold.length > 0){
      hold[0].parentNode.removeChild(hold[0]);
  }

    var d = document.getElementById("historyCheck").value
    document.getElementById("historyCheck").value = ''


    

   console.log(d)

  var dataC = {
    "v_no": d
}

console.log(dataC)


    fetch(BackendUrl + '/gethistory' , {
      method: "POST",
      body: JSON.stringify(dataC),
      headers: {
         "Accept": "application/json",
        "Content-type": "application/json; charset=UTF-8",
      }   
    })
      .then((resp) => resp.text())
      .then((result) => {
        
          if(result == 'Vehicle has no history with our service centre'){
            var blo = document.createElement('div')
            blo.className = 'card history'
           
    
            var resu = document.createElement('p')
            resu.innerHTML = `${result} `
            blo.append(resu)

            document.getElementById('v-pills-settings').append(blo)

          }else{


        var res = JSON.parse(result)
        console.log(res)


        res.map(item=>{

      

          var blo = document.createElement('div')
          blo.className = 'card history'
         
  
          var vNo = document.createElement('p')
          vNo.innerHTML = `Motorcycle Registered Number : ${item.v_no} `
          blo.append(vNo)
  
          var cusName = document.createElement('p')
          cusName.innerHTML = `Customer Name : ${item.customer_name} `
          blo.append(cusName)

          var appTime = document.createElement('p')
          appTime.innerHTML = `Service Appointment Time : ${item.appointment_time} `
          blo.append(appTime)
  
  
          var stat = document.createElement('p')
          stat.innerHTML = `Service Status : ${item.service_status} `
          blo.append(stat)
  
          var man = document.createElement('p')
          man.innerHTML = `Service Manager : ${item.service_manager} `
          blo.append(man)
  
          var comp = document.createElement('p')
          comp.innerHTML = `Issues With Vehicle And Mechanic Comments (if any): Issue - ${item.complaints} `
          blo.append(comp)
          
          if(item.bill && item.deliveredOn){
          var bill = document.createElement('p')
          bill.innerHTML = `Final Bill: ${item.bill} `
          blo.append(bill)

          var delvDate = document.createElement('p')
          delvDate.innerHTML = `Vehicle Delivered On: ${item.deliveredOn} `
          blo.append(delvDate)
          }


          var mes = document.createElement('p')
          mes.innerHTML = `For any query, please contact 9999 9999 99. Customer contact details and breakup of bill (if any) won't be disclosed. `
          blo.append(mes)

        
          
  
          document.getElementById('v-pills-settings').append(blo)

        

        })
      }
      
      })
      .catch((err) => console.log(err));
     

  }
