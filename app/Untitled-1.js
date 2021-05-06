//A request from a form is called a navigation request. 
//Fetch vs form 
//EVENT or REQUEST HANDLER
app.get('/addTimeSlots', isLoggedIn, function (req, res) {
    db.collection('signUpSheet').findOne({ _id: ObjectId(req.query.id) }, (err, eventDetails) => {

      db.collection('timeSlots').find({ eventId: req.query.id }).sort({date: 1}).toArray((error, slots) => {

        if (err) return console.log(err)
        console.log(slots)
//render vs send
        res.render('addTimeSlots.ejs', {
          user: req.user,
          eventDetails: eventDetails,
          timeSlots: slots,
          timeConverter: timeConverter
        })
      })
    })
  });

// -------

app.get('/publicSignUpSheetList', function (req, res) {

    const year = (new Date).getFullYear()
    
    
    const months = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];
  
    const currentMonthNum = (new Date).getMonth()
  
  
    let findSignUp = db.collection('signUpSheet').findOne({ _id: ObjectId(req.query.id) })
  
    let timeSlot = db.collection('timeSlots').find({ eventId: req.query.id }).sort({date: 1}).toArray()
  
    let guestSignUp = db.collection('userSignUp').find({}).toArray()
//Promise for eventual value .....then 
//3 async functions 
//Composition 
//Promise will be fulfilled when all 3 promises are fulfilled
    Promise.all([findSignUp, timeSlot, guestSignUp]).then((values) => {
  
      const [findSignUpResults, timeSlotResults, guestSignUpResults] = values;
  
      console.log(guestSignUpResults)
  
  
      res.render('publicSignUpSheetList.ejs', {
        signUpResults: findSignUpResults, //values[0]
        timeSlotResults: timeSlotResults,
        guestSignUpResults: guestSignUpResults,
        calendar: calendar(year),months,year,
        currentMonthNum: currentMonthNum,
        user: req.user,
        timeConverter, timeConverter
      })
    }).catch((error) => {
      console.log(error)
    });
  
  
  });