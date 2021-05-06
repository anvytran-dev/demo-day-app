const { toArray } = require('lodash');
const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);

const nodemailer = require("nodemailer");

const calendar = require("../config/calendar-config.js");

const timeConverter = require("../config/time-helper.js")

module.exports = function (app, passport, db) {

  // normal routes ===============================================================

  // show the home page (will also have our login links)
  app.get('/', function (req, res) {
    res.render('index.ejs');
  });

  // PROFILE SECTION =========================
  app.get('/profile', isLoggedIn, function (req, res) {
    res.render('profile.ejs', {

      user: req.user

    })
  });


  // LOGOUT ==============================
  app.get('/logout', function (req, res) {
    console.log('blue')
    req.logout();
    res.redirect('/');
  });

  // message board routes ===============================================================

  //GET 'createSignUpSheet' PAGE

  app.get('/createSignUpSheet', isLoggedIn, function (req, res) {
    db.collection('messages').find({ email: req.user.local.email }).toArray((err, result) => {
      if (err) return console.log(err)
      res.render('createSignUpSheet.ejs', {
        user: req.user,
        messages: result,
        date: req.query.date,
        total: req.query.total
      })
    })
  });

  //GET 'addTimeSlots' PAGE
  //Research .findOne for efficiency + make it clear that we are looking for just one. 
  //Add 'isLoggedIn' as middleware when project is ready

  app.get('/addTimeSlots', isLoggedIn, function (req, res) {
    db.collection('signUpSheet').findOne({ _id: ObjectId(req.query.id) }, (err, eventDetails) => {

      db.collection('timeSlots').find({ eventId: req.query.id }).sort({date: 1}).toArray((error, slots) => {

        if (err) return console.log(err)
        console.log(slots)
        res.render('addTimeSlots.ejs', {
          user: req.user,
          eventDetails: eventDetails,
          timeSlots: slots,
          timeConverter: timeConverter
        })
      })
    })
  });

  //GET 'viewCreatedEvents' PAGE

  app.get('/viewCreatedEvents', isLoggedIn, function (req, res) {
    const year = req.query.year || 2020;
    const months = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];

    db.collection('signUpSheet').find({ email: req.user.local.email }).toArray((err, result) => {
      if (err) return console.log(err)
      res.render('viewCreatedEvents.ejs', {
        user: req.user,
        signUpSheet: result,
        calendar: calendar(year), months, year

      })
    })
  });




  //GET 'publicSignUpSheet'


app.get('/publicSignUpSheet', function (req, res) {

    const year = (new Date).getFullYear()
    
    
    const months = ["January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"];

    const currentMonthNum = (new Date).getMonth()


    let findSignUp = db.collection('signUpSheet').findOne({ _id: ObjectId(req.query.id) })

    let timeSlot = db.collection('timeSlots').find({ eventId: req.query.id }).toArray()

    let guestSignUp = db.collection('userSignUp').find({}).toArray()

    Promise.all([findSignUp, timeSlot, guestSignUp]).then((values) => {

      const [findSignUpResults, timeSlotResults, guestSignUpResults] = values;

      console.log(guestSignUpResults)


      res.render('publicSignUpSheet.ejs', {
        signUpResults: findSignUpResults,
        timeSlotResults: timeSlotResults,
        guestSignUpResults: guestSignUpResults,
        calendar: calendar(year),months,year,
        currentMonthNum: currentMonthNum,
        user: req.user,
        timeConverter: timeConverter
      })
    }).catch((error) => {
      console.log(error)
    });


  });

  //GET 'publicSignUpSheetList'


app.get('/publicSignUpSheetList', function (req, res) {

  const year = (new Date).getFullYear()
  
  
  const months = ["January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December"];

  const currentMonthNum = (new Date).getMonth()


  let findSignUp = db.collection('signUpSheet').findOne({ _id: ObjectId(req.query.id) })

  let timeSlot = db.collection('timeSlots').find({ eventId: req.query.id }).sort({date: 1}).toArray()

  let guestSignUp = db.collection('userSignUp').find({}).toArray()

  Promise.all([findSignUp, timeSlot, guestSignUp]).then((values) => {

    const [findSignUpResults, timeSlotResults, guestSignUpResults] = values;

    console.log(guestSignUpResults)


    res.render('publicSignUpSheetList.ejs', {
      signUpResults: findSignUpResults,
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


// GET VIEW PUBLISHED SIGN UP SHEETS page

app.get('/viewPublishedSheets', function (req, res) {

  db.collection('signUpSheet').find({email: req.user.local.email}).toArray((err, result) => {
    console.log('published')
    console.log(result)

    if (err) return console.log(err)
      res.render('publishedSheets.ejs', {
        user: req.user,
        publishedSheet: result,

      })

  }) 
})

//Get 'viewVolunteering.ejs' page

  app.get('/viewVolunteering', function (req, res) {

    db.collection('userSignUp').find({ email: req.user.local.email }).toArray((err, result) => {
      if (err) return console.log(err)
      res.render('viewVolunteering.ejs', {
        user: req.user,
        volunteeringSlots: result,
        timeConverter, timeConverter

      })
    })


  })

  //GET CREATED EVENTS INFO IN MONGODB 

  app.post('/editCreatedEvents', function (req, res) {
    console.log(req)
    console.log({ _id: ObjectId(req.body.eventId) })
    db.collection('signUpSheet').find({ _id: ObjectId(req.body.eventId) }).toArray((err, result) => {

      if (err) return res.send(err)
      res.send(result)
    })
  });

  //GET TIME SLOT INFO IN MONGODB 

  app.post('/getTimeSlotDetails', function (req, res) {
    console.log(req)
    console.log({ _id: ObjectId(req.body._id) })
    db.collection('timeSlots').find({ _id: ObjectId(req.body._id) }).toArray((err, result) => {
      console.log('RESULTS')
      console.log(result)
      if (err) return res.send(err)
      res.send(result)
    })
  });

    //GET TIME SLOT BY DATE INFO IN MONGODB 

    app.post('/getTimeSlotsByDate', function (req, res) {
      console.log(req)
      console.log({ _id: ObjectId(req.body._id) })

      db.collection('timeSlots').find({
        "eventId" : {"$in" : [ req.body.eventId]},
        "date" : { "$in" : [req.body.date]}
      })
      
      .toArray((err, result) => {
        console.log('RESULTS')
        console.log(result)
        if (err) return res.send(err)
        res.send(result)
      })
    });

    

  //GET RECURRING TIME SLOT INFO IN MONGODB 

  app.post('/getRecurTimeSlotDetails', function (req, res) {
    console.log(req)
    console.log({ _id: ObjectId(req.body._id) })
    db.collection('addRecurringSlots').find({ _id: ObjectId(req.body._id) }).toArray((err, result) => {
      console.log('RESULTS')
      console.log(result)
      if (err) return res.send(err)
      res.send(result)
    })
  });
  //GET EMAIL PAGE

  app.get('/emailVolunteers', function (req, res) {

    let findVolunteers = db.collection('userSignUp').aggregate([
      { $match: { eventId: req.query.eventId } },
      { $project: { email: 1 } }
    ]).toArray()

    Promise.all([findVolunteers]).then((values) => {

      let [findVolunteersResults] = values;
      console.log(findVolunteersResults)

      res.render('emailVolunteers.ejs', {

        user: req.user,
        volunteers: findVolunteersResults
      })

    }).catch((error) => {
      console.log(error)
    })


  });
  //Get 'viewVolunteering.ejs' page

  app.get('/viewVolunteering', function (req, res) {

    db.collection('userSignUp').find({ email: req.user.local.email }).toArray((err, result) => {
      if (err) return console.log(err)
      res.render('viewVolunteering.ejs', {
        user: req.user,
        volunteeringSlots: result,

      })
    })


  })

  //GET CREATED EVENTS INFO IN MONGODB 

  app.post('/editCreatedEvents', function (req, res) {
    console.log(req)
    console.log({ _id: ObjectId(req.body.eventId) })
    db.collection('signUpSheet').find({ _id: ObjectId(req.body.eventId) }).toArray((err, result) => {

      if (err) return res.send(err)
      res.send(result)
    })
  });

  //GET TIME SLOT INFO IN MONGODB 

  app.post('/getTimeSlotDetails', function (req, res) {
    console.log(req)
    console.log({ _id: ObjectId(req.body._id) })
    db.collection('timeSlots').find({ _id: ObjectId(req.body._id) }).toArray((err, result) => {
      console.log('RESULTS')
      console.log(result)
      if (err) return res.send(err)
      res.send(result)
    })
  });

  //GET RECURRING TIME SLOT INFO IN MONGODB 

  app.post('/getRecurTimeSlotDetails', function (req, res) {
    console.log(req)
    console.log({ _id: ObjectId(req.body._id) })
    db.collection('addRecurringSlots').find({ _id: ObjectId(req.body._id) }).toArray((err, result) => {
      console.log('RESULTS')
      console.log(result)
      if (err) return res.send(err)
      res.send(result)
    })
  });
  //GET EMAIL PAGE

  app.get('/emailVolunteers', function (req, res) {

    let findVolunteers = db.collection('userSignUp').aggregate([
      { $match: { eventId: req.query.eventId } },
      { $project: { email: 1 } }
    ]).toArray()

    Promise.all([findVolunteers]).then((values) => {

      let [findVolunteersResults] = values;
      console.log(findVolunteersResults)

      res.render('emailVolunteers.ejs', {

        user: req.user,
        volunteers: findVolunteersResults
      })

    }).catch((error) => {
      console.log(error)
    })


  });

  //GET EDIT RECURRING SLOTS PAGE

  app.get('/editRecurringTimeSlots', function getEditRecurringSlotsPage(req, res) {

    db.collection('addRecurringSlots').find({ eventId: req.query.id }).toArray((err, results) => {

      if (err) return console.log(err)
      res.render('viewEditRecurringSlotsPage.ejs', {
        recurringSlots: results,
        user: req.user,
        timeConverter: timeConverter
      })
    })

  })


  //POST REQUESTS

  //CREATE A SIGN UP SHEET
  app.post('/createSignUpSheet', isLoggedIn,

    function (req, res) {
      db.collection('messages').find({ email: req.user.local.email }).toArray((err, result) => {
        if (err) return console.log(err)
        res.render('createSignUpSheet.ejs', {
          user: req.user,
          messages: result,
          date: undefined,
          total: undefined
        })
      })

    }
  )

  //SAVE INITIAL SIGN UP DETAILS TO DATABASE

  var ObjectId = require('mongodb').ObjectId;

  app.post('/filledOutSignUpSheet', (req, res) => {
    db.collection('signUpSheet').save(

      {
        name: req.body.name,
        phone: req.body.phone,
        eventTitle: req.body.eventTitle,
        eventStartDate: req.body.startDate,
        eventEndDate: req.body.endDate,
        eventDescription: req.body.eventDescription,
        email: req.user.local.email

      },


      (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        console.log(result)
        res.redirect('/addTimeSlots?' + 'id=' + ObjectId(result.ops[0]._id))

      })
  })

  //SAVE TIME SLOT TO MONGODB

  app.post('/saveTimeSlots', (req, res) => {
    db.collection('timeSlots').save(

      {
        name: req.body.eventName,
        recurringName: null,
        date: req.body.date,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        activityDescription: req.body.activityDescription,
        numberVolunteersNeeded: req.body.numberVolunteersNeeded,
        eventId: req.query.id,
        recurringId: null,
        email: req.user.local.email
      },


      (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        console.log(result)
        res.redirect('/addTimeSlots?' + 'id=' + ObjectId(result.ops[0].eventId))

      })
  })

  //SAVE GUEST SIGN UP

  app.post('/guestSignUp', (req, res) => {
    console.log('PINK')
    console.log(req)
    db.collection('userSignUp').save(

      {
        name: req.body.guestName,
        email: req.body.guestEmail,
        phone: req.body.guestTel,
        eventName: req.body.eventNameFilled,
        slotDate: req.body.slotDateFilled,
        startTime: req.body.startTimeFilled,
        endTime: req.body.endTimeFilled,
        activityDes: req.body.actDesFilled,
        eventId: req.body.guestEventId,
        slotId: ObjectId(req.body.guestSlotId),
        recurringId: req.body.recurringId

      },


      (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        console.log(result)
        res.redirect('/publicSignUpSheetList?' + 'id=' + req.body.guestEventId)

      })
  })



  app.delete('/messages', (req, res) => {
    db.collection('messages').findOneAndDelete({ _id: ObjectId(req.body._id) }, (err, result) => {
      if (err) return res.send(500, err)
      res.send('Message deleted!')
    })
  })





//SAVE RECURRING TIMESLOTS TO DATABASE

  app.post('/addRecurringSlots', (req, res, next) => {

//After, the creator fills out the form to create a recurring time slot, that data is saved to the database using the save method.

    db.collection('addRecurringSlots').save(


      { eventName: req.body.eventNameRecurring,
        recurringName: req.body.recurringSlotName,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        recurringDay: req.body.recurringDay,
        startTimeRecurring: req.body.startTimeRecurring,
        endTimeRecurring: req.body.endTimeRecurring,
        numberVolunteersNeededRecurring: req.body.numberVolunteersNeededRecurring,
        activityDescription: req.body.activityDescriptionRecurring,
        eventId: req.query.id,
        email: req.user.local.email
      },

      (err, result) => {
        if (err) {
          next(err)
          return
        }

//Now, it is time to find all the dates that are part of the recurrance.
//The creator has provided the date range when they submitted the form so we know the starting date and ending date.

        const startDate = moment(req.body.startDate)//Ex. May 1
        const endDate = moment(req.body.endDate)//Ex. May 31

//We create an array to store all the dates in our recurrance.

        let recurringDatesArray = []

//We create an array to store all the documents we will save to MongoDB. 

        let documentsToLoad = []

//We know what week day they would like the activity to recur on it. //ex. recurringDay === 'monday'
//We need to find all the mondays in provided date range. In this case, it would be all the Mondays in May.
//We find the first date in our recurrance by finding the closest Monday to our start date. 
        let slot = moment(startDate).isoWeekday(req.body.recurringDay); // current date we are working with: 5/3/2021


 
//Edge case: When we do this, we could run into a problem in which the closest Monday is not in our date range. To address this potential case, we can create a conditional where if the closest Monday is before the start date, then we simply add 7 days to it --which will result in the first monday in our recurrance. 

        if (slot.isBefore(startDate) === true) {
          slot.add(7, 'days')
        }
//Store the date into our array. 

        recurringDatesArray.push(slot.format("YYYY-MM-DD")) //[5/3/2021]

//Add another 7 days 

        slot.add(7, 'days') //current date that we are working with:  5/10/2021

//While the current date is before the end date, we will push the current date to the array, then add 7 days.

        while (slot.isBefore(endDate)) {

          recurringDatesArray.push(slot.format("YYYY-MM-DD"))
          slot.add(7, 'days')
        }

//The loop will finish running once we have all the dates in the recurrance and the those dates are pushed to our recurringDatesArray. 

//Next, we will operate on each date by using a forEach loop. For each date, we want it to be associated with the other data that the creator provided us such as the start/end time of the activity, the activity description, and number of volunteers. We are doing this because for each date we will add a document to the collection in our database. We will use this collection to render the time slots on the client-side. 

//Then, we push these new objects that we have created to an array named 'documentsToLoad.'

        recurringDatesArray.forEach(date => documentsToLoad.push(

          {
            eventName: req.body.eventNameRecurring,
            recurringName: req.body.recurringSlotName,
            date: date,
            startTime: req.body.startTimeRecurring,
            endTime: req.body.endTimeRecurring,
            activityDescription: req.body.activityDescriptionRecurring,
            numberVolunteersNeeded: req.body.numberVolunteersNeededRecurring,
            eventId: req.query.id,
            recurringId: ObjectId(result.ops[0]._id),
            email: req.user.local.email
          }
        ))

//We insert the objects in the array to a collection in our database. In the database, it will be saved as documents. 

        db.collection('timeSlots').insertMany(documentsToLoad, (error) => {

          if (error) {
            next(error)
            return
          }
//Finally, we redirect the page so that it will refresh and our EJS file can render our updated content. 

          res.redirect('/addTimeSlots?' + 'id=' + ObjectId(result.ops[0].eventId))
        })


      })
  })




  //EDIT + SAVE EVENT DETAILS

  app.post('/editEventDetails', (req, res) => {
    db.collection('signUpSheet').updateOne({ _id: ObjectId(req.body.editEventId) }, {
      $set: {

        name: req.body.editDisplayName,
        phone: req.body.editDisplayTel,
        eventTitle: req.body.editEventTitle,
        eventStartDate: req.body.editStartDate,
        eventEndDate: req.body.editEndDate,
        eventDescription: req.body.editEventDescription,
        email: req.user.local.email

      }
    }, function (err, result) {
      if (err) {
        console.log('no')
        console.log(err);
      } else {
        console.log("Post Updated successfully");
        res.redirect('/viewCreatedEvents')
      }
    });

  });



  //EDIT + SAVE TIME SLOT DETAILS

  app.post('/editTimeSlot', (req, res) => {
    console.log('TTT')
    console.log(req)
    db.collection('timeSlots').updateOne({ _id: ObjectId(req.body.editObjIdSingle) }, {
      $set: {

        date: req.body.editDateSingle,
        startTime: req.body.editStartTimeSingle,
        endTime: req.body.editEndTimeSingle,
        activityDescription: req.body.editEventDescriptionSingle,
        numberVolunteersNeeded: req.body.editNumVolunteersNeededSingle,
        eventId: req.body.editEventIdSingle,
        recurringId: req.body.editRecurringIdSingle,
        email: req.user.local.email
      }
    }, function (err, result) {
      if (err) {
        console.log('no')
        console.log(err);
      } else {
        console.log("Post Updated successfully");
        res.redirect('/addTimeSlots?' + 'id=' + ObjectId(req.body.editEventIdSingle))
      }
    });

  });

  //EDIT + SAVE RECURRING TIME SLOT DETAILS

  app.post('/editRecurringSlots', (req, res, next) => {

    db.collection('addRecurringSlots').findOneAndDelete({ _id: ObjectId(req.body.editRecurringId) })

    db.collection('timeSlots').deleteMany({ recurringId: ObjectId(req.body.editRecurringId) })

    console.log('PUMPKIN')
    console.log(req.body.editEventIdRecur)
    db.collection('addRecurringSlots').save(


      {
        _id: ObjectId(req.body.editRecurringId),
        eventName: req.body.editEventNameRecur,
        recurringName: req.body.editRecurringSlotName,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        recurringDay: req.body.recurringDay,
        startTimeRecurring: req.body.startTimeRecurring,
        endTimeRecurring: req.body.endTimeRecurring,
        numberVolunteersNeededRecurring: req.body.numberVolunteersNeededRecurring,
        activityDescription: req.body.activityDescriptionRecurring,
        eventId: req.body.editEventIdRecur,
        email: req.user.local.email
      },

      (err, result) => {
        if (err) {
          console.log('DIDNT SAVE')
          next(err)
          return
        }
        const startDate = moment(req.body.startDate)
        const endDate = moment(req.body.endDate)
        let recurringDatesArray = []
        let documentsToLoad = []

        let slot = moment(startDate).isoWeekday(req.body.recurringDay);//ex. recurringDay === 'monday'

        if (slot.isBefore(startDate) === true) {
          slot.add(7, 'days')
        }

        recurringDatesArray.push(slot.format("YYYY-MM-DD"))

        console.log(slot)
        slot.add(7, 'days')

        while (slot.isBefore(endDate)) {

          recurringDatesArray.push(slot.format("YYYY-MM-DD"))
          slot.add(7, 'days')
        }
        console.log('HELLO')
        console.log(recurringDatesArray)

        recurringDatesArray.forEach(date => documentsToLoad.push(

          {
            date: date,
            startTime: req.body.startTimeRecurring,
            endTime: req.body.endTimeRecurring,
            activityDescription: req.body.activityDescriptionRecurring,
            numberVolunteersNeeded: req.body.numberVolunteersNeededRecurring,
            eventId: req.body.editEventIdRecur,
            recurringId: ObjectId(req.body.editRecurringId),
            email: req.user.local.email
          }
        ))



        db.collection('timeSlots').insertMany(documentsToLoad, (error) => {

          if (error) {
            next(error)
            return
          }

          console.log('saved to database')
          res.redirect('/editRecurringTimeSlots?' + 'id=' + ObjectId(req.body.editEventIdRecur))
        })
      
      })



  });

  //SEND EMAILS

  app.post('/sendEmail', function (req, res) {

    console.log(req.body)

    async function main() {

      // create reusable transporter object using the default SMTP transport
      const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
          user: 'eliane.heidenreich45@ethereal.email',
          pass: '6FTSjnbkgs5kCUz1Ue'
        }
      });

      console.log((req.body.email))
      let singleEmailArray = []

      if(typeof req.body.email === "string") {
        singleEmailArray.push(req.body.email)

        console.log(singleEmailArray)

        req.body.email = singleEmailArray
        console.log('oran')
        console.log(req.body.email)
      }

      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: `"${req.body.name}" <${req.body.serSendEmail}>`, // sender address
        to: req.body.email, // list of receivers
        subject: "Hello ✔", // Subject line
        text: req.body.message, // plain text body
        // html: "<b>Hello world?</b>", // html body
      });

      console.log("Message sent: %s", info.messageId);
      // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

      // Preview only available when sending through an Ethereal account
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
      // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    }

    main().catch(console.error);

    res.redirect('/viewCreatedEvents')


  })




  //DELETE EVENT 

  app.delete('/deleteEvent', (req, res) => {
    db.collection('signUpSheet').findOneAndDelete({ _id: ObjectId(req.body._id) }, (err, result) => {
      if (err) return res.send(500, err)
      res.send('Message deleted!')
    })
  })

  //DELETE SINGLE TIME SLOT

  app.delete('/deleteTimeSlot', (req, res) => {
    db.collection('timeSlots').findOneAndDelete({ _id: ObjectId(req.body._id) }, (err, result) => {
      if (err) return res.send(500, err)
      res.send('Message deleted!')
    })
  })

   //DELETE RECURRING TIME SLOTS

   app.delete('/deleteRecurringSlot', (req, res) => {

    db.collection('addRecurringSlots').findOneAndDelete({ _id: ObjectId(req.body.recurringId) })

    db.collection('timeSlots').deleteMany({ recurringId: ObjectId(req.body.recurringId) }, (err, result) => {
      if (err) return res.send(500, err)
      res.send('Message deleted!')
    })
  })

  //DELETE/CANCEL VOLUNTEER SIGN UP

  app.delete('/deleteCancelSignUp', (req, res) => {
    db.collection('userSignUp').findOneAndDelete({ slotId: ObjectId(req.body.slotId) }, (err, result) => {
      if (err) return res.send(500, err)
      res.send('Message deleted!')
    })
  })





  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get('/login', function (req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // app.post('/loginSignUp', passport.authenticate('local-login', {
  //   successRedirect: '/publicSignUpSheet?id=' req.query.id, // redirect to the secure profile section
  //   failureRedirect: '/login', // redirect back to the signup page if there is an error
  //   failureFlash: true // allow flash messages
  // }));

  app.post('/loginSignUp',
    passport.authenticate('local-login'),
    function (req, res) {
      console.log(req)
      // If this function gets called, authentication was successful.
      // `req.user` contains the authenticated user.
      res.redirect('/publicSignUpSheet?id=' + req.body.eventIdPublic);
    });

  // SIGNUP =================================
  // show the signup form
  app.get('/signup', function (req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages



  })
  );




  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get('/unlink/local', isLoggedIn, function (req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      res.redirect('/profile');
    });
  });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}




