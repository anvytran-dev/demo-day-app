const { toArray } = require('lodash');

module.exports = function(app, passport, db) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
          res.render('profile.ejs', {

            user : req.user
            
      })
    });
    

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// message board routes ===============================================================

//GET 'createSignUpSheet' PAGE

    app.get('/createSignUpSheet', isLoggedIn, function(req, res) {
      db.collection('messages').find({email: req.user.local.email}).toArray((err, result) => {
        if (err) return console.log(err)
        res.render('createSignUpSheet.ejs', {
          user : req.user,
          messages: result,
          date: req.query.date,
          total: req.query.total
        })
      })
    });

//GET 'addTimeSlots' PAGE
//Research .findOne for efficiency + make it clear that we are looking for just one. 
//Add 'isLoggedIn' as middleware when project is ready

app.get('/addTimeSlots', isLoggedIn, function(req, res) {
  db.collection('signUpSheet').findOne({_id: ObjectId(req.query.id)}, (err, eventDetails) => {

    db.collection('timeSlots').find({eventId: req.query.id}).toArray((error, slots) => {
      if (err) return console.log(err)
      console.log(slots)
      res.render('addTimeSlots.ejs', {
        user : req.user,
        eventDetails: eventDetails,
        timeSlots: slots
      })
    })
  })
});

//GET 'viewCreatedEvents' PAGE

    app.get('/viewCreatedEvents', isLoggedIn, function(req, res) {
      db.collection('signUpSheet').find({email: req.user.local.email}).toArray((err, result) => {
        if (err) return console.log(err)
        res.render('viewCreatedEvents.ejs', {
          user : req.user,
          signUpSheet: result
        })
      })
    });

//GET 'publicSignUpSheet'


    app.get('/publicSignUpSheet', function(req, res) {

      let findSignUp = db.collection('signUpSheet').findOne({_id: ObjectId(req.query.id)}) 

      let timeSlot =  db.collection('timeSlots').find({eventId: req.query.id}).toArray()

      Promise.all([findSignUp, timeSlot]).then((values) => {

        const [findSignUpResults, timeSlotResults] = values;

        console.log('Hi')
        console.log(findSignUpResults)
        console.log(timeSlotResults)

        res.render('publicSignUpSheet.ejs', {
          signUpResults: findSignUpResults,
          timeSlotResults: timeSlotResults
        })
      }).catch((error) => {
        console.log(error)
      });


    });

//Get 'signUp' page

    app.get('/signUpForSlot', function (req, res) {
      
    })
 



//POST REQUESTS

//CREATE A SIGN UP SHEET
    app.post('/createSignUpSheet', isLoggedIn, 

    function(req, res) {
      db.collection('messages').find({email: req.user.local.email}).toArray((err, result) => {
        if (err) return console.log(err)
        res.render('createSignUpSheet.ejs', {
          user : req.user,
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
        res.redirect('/addTimeSlots?' +'id='+ObjectId(result.ops[0]._id))

      })
    })

    //SAVE TIME SLOT TO MONGODB

    app.post('/saveTimeSlots', (req, res) => {
      db.collection('timeSlots').save(

        {
        date: req.body.date,
        startTime: req.body.startTime,
        endTime: req.body.endTime,
        activityDescription: req.body.activityDescription,
        numberVolunteersNeeded: req.body.numberVolunteersNeeded,
        eventId: req.query.id,
        email: req.user.local.email
        }, 
        
        
        (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        console.log(result)
        res.redirect('/addTimeSlots?' +'id='+ObjectId(result.ops[0].eventId))

      })
    })


    app.delete('/messages', (req, res) => {
      db.collection('messages').findOneAndDelete({_id: ObjectId(req.body._id)}, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Message deleted!')
      })
    })



    app.post('/updateMessage',(req, res) => {
      db.collection('messages').update ({ _id: ObjectId(req.body.objectID) }, {$set: {

        date: new Date(req.body.date),
        itemBought: req.body.itemBought,
        amountSpent: Number(req.body.amountSpent)

      }
      }, function (err, result) {
          if (err) {
          console.log(err);
        } else {
          console.log("Post Updated successfully");
          res.redirect('/updateMessage')
      }
    });

  });








// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

//     app.get('/notes', isLoggedIn, 

//     function(req, res) {
//       db.collection('messages').find().toArray((err, result) => {
//         if (err) return console.log(err)
//         res.render('notes.ejs', {
//           user : req.user,
//           messages: result
//       })
//     })

//     }  
//   )

// };


};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}




