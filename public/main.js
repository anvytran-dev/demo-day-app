//'viewCreatedEvents.ejs' EDIT BUTTON
var editIconViewCreated = document.getElementsByClassName('editViewCreated');
console.log(editIconViewCreated)

Array.from(editIconViewCreated).forEach(function (element) {
  console.log(element)
  element.addEventListener('click', function () {

    const eventId = this.getAttribute('data-eventId')

    console.log(eventId)

    fetch('editCreatedEvents', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        'eventId': eventId
      })
    })
      .then(response => {
        if (response.ok) return response.json()
      })
      .then(data => {
        console.log(data)
        // window.location.reload(true)

        document.querySelector('.inputDisplayName').value = data[0].name

        document.querySelector('.inputDisplayTel').value = data[0].phone

        document.querySelector('.inputDisplayEventTitle').value = data[0].eventTitle

        document.querySelector('.inputDisplayStartDate').value = data[0].eventStartDate

        document.querySelector('.inputDisplayEndDate').value = data[0].eventEndDate

        document.querySelector('.inputDisplayDescription').value = data[0].eventDescription

        document.querySelector('.inputDisplayEventId').value = data[0]._id

      })

    modal.style.display = "block"

  })
})


//'addTimeSlots.ejs' EDIT BUTTON
var editIconAddTimeSlots = document.getElementsByClassName('editAddTimeSlot');

console.log(editIconAddTimeSlots)

Array.from(editIconAddTimeSlots).forEach(function (element) {


  element.addEventListener('click', function () {
    console.log('hi')
    const objId = this.getAttribute('data-id')

    console.log(objId)

    fetch('getTimeSlotDetails', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        '_id': objId
      })
    })
      .then(response => {
        if (response.ok) return response.json()
      })
      .then(data => {
        console.log(data)
        // window.location.reload(true)
        document.querySelector('.inputEditDateSingle').value = data[0].date
        document.querySelector('.inputEditStartTimeSingle').value = data[0].startTime
        document.querySelector('.inputEditEndTimeSingle').value = data[0].endTime
        document.querySelector('.inputEditDescriptionSingle').value = data[0].activityDescription
        document.querySelector('.inputNumberVolunteersNeededSingle').value = data[0].numberVolunteersNeeded
        document.querySelector('.inputEditEventIdSingle').value = data[0].eventId
        document.querySelector('.inputEditRecurringIdSingle').value = data[0].recurringId
        document.querySelector('.inputEditObjIdSingle').value = data[0]._id

      })

    modal.style.display = "block"

  })
})


//'viewCreatedEvents.ejs' TRASH BUTTON
var trashIconViewCreatedEvents = document.getElementsByClassName("trashViewCreated");

Array.from(trashIconViewCreatedEvents).forEach(function (element) {
  console.log(element)
  element.addEventListener('click', function () {
    console.log(element)
    const eventId = this.getAttribute('data-eventId')
    console.log(eventId)

    fetch('deleteEvent', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        '_id': eventId
      })
    }).then(function (response) {
      window.location.reload()
    })
  });
});

//'addTimeSlots.ejs' TRASH BUTTON
var trashIconTimeSlot = document.getElementsByClassName("trashAddTimeSlot");
console.log(trashIconTimeSlot)

Array.from(trashIconTimeSlot).forEach(function (element) {
  console.log('HEOOO')
  console.log(element.getAttribute('data-idTrash'))
  element.addEventListener('click', function () {

    const objId = this.getAttribute('data-idTrash')
    console.log(objId)

    fetch('deleteTimeSlot', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        '_id': objId
      })
    }).then(function (response) {
      window.location.reload()
    })
  });
});

//GET RECURRING SLOTS PAGE

var getRecurringSlotsButton = document.getElementsByClassName('getRecurringTimeSlots')

Array.from(getRecurringSlotsButton).forEach(function (element) {

  element.addEventListener('click', () => {

    let eventIdRecurring = element.getAttribute('data-recurringEventId')

    window.location.href = "/editRecurringTimeSlots?id=" + eventIdRecurring


  })

})

//GET RECURRING SLOT MODAL BOX

var editRecurringSlot = document.getElementsByClassName('editRecurringSlot');

console.log(editRecurringSlot)

Array.from(editRecurringSlot).forEach(function (element) {


  element.addEventListener('click', function () {
    console.log('BOO')
    const objId = this.getAttribute('data-editRecurTimeSlot')
    let recurEventId = this.getAttribute('data-editEventIdRecur')

    console.log(objId)

    fetch('getRecurTimeSlotDetails', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        '_id': objId,
        'eventId': recurEventId
      })
    })
      .then(response => {
        if (response.ok) return response.json()
      })
      .then(data => {
        
        console.log(data)
        // window.location.reload(true)
        document.querySelector('.editRecurringSlotName').value = data[0].name
        document.querySelector('.editRecurringSlotStartDate').value = data[0].startDate
        document.querySelector('.editRecurringSlotEndDate').value = data[0].endDate
        document.querySelector('.recurringDay').value = data[0].recurringDay
        document.querySelector('.editRecurringSlotStartTime').value = data[0].startTimeRecurring
        document.querySelector('.editRecurringSlotEndTime').value = data[0].endTimeRecurring
        document.querySelector('.editRecurringSlotActDescription').value = data[0].activityDescription
        document.querySelector('.editRecurringSlotNumVolunteersNeeded').value = data[0].numberVolunteersNeededRecurring

        document.querySelector('.editEventIdRecur').value = data[0].eventId

        document.querySelector('.editRecurringId').value = data[0]._id

      })

    modal.style.display = "block"

  })
})

//ADD EVENT LISTENERS ON THE 'ADD DATES/TIME SLOTS' BUTTONS. After the button is clicked, it directs the user to the page where the selected event's time slots are. 

var addTimeSlot = document.querySelectorAll('.buttonAddSlotsPage');

Array.from(addTimeSlot).forEach(function (element) {
  console.log(addTimeSlot)

  element.addEventListener('click', function () {

    const eventIdAdd = this.getAttribute('data-eventId')

    window.location.href = "/addTimeSlots?id=" + eventIdAdd
  })
}
);



//PUBLISH SIGN UP SHEET

var buttonPublishSignUpSheet = document.querySelector('.hi')

console.log(buttonPublishSignUpSheet)

if (buttonPublishSignUpSheet !== null) {

  buttonPublishSignUpSheet.addEventListener('click', function getPublishSheet() {

    let eventId = this.getAttribute('data-eventId')
    window.location.href = "/publicSignUpSheet?id=" + eventId

  })

}

//SIGN UP AS A VOLUNTEER

let modalBtn = document.querySelectorAll('.buttonSignUp');

Array.from(modalBtn).forEach(function (element) {
  console.log(element)
  element.addEventListener('click', function () {

    const eventId = element.getAttribute('data-eventId')
    const slotId = element.getAttribute('data-slotId')
    const recurringId = element.getAttribute('data-recurringId')

    const eventNameInfo = element.getAttribute('data-eventNameInfo')

    const slotDate = element.getAttribute('data-slotDate')

    const startTime = element.getAttribute('data-startTime')

    const endTime = element.getAttribute('data-endTime')

    const actDes = element.getAttribute('data-activityDes')

    console.log(eventId, slotId, recurringId)

    document.getElementsByName('guestEventId')[0].value = eventId

    document.getElementsByName('guestSlotId')[0].value = slotId

    document.getElementsByName('guestRecurringId')[0].value = recurringId

    document.getElementsByName('guestRecurringId')[0].value = recurringId

    document.getElementsByName('eventNameFilled')[0].value = eventNameInfo

    document.getElementsByName('slotDateFilled')[0].value = slotDate

    document.getElementsByName('startTimeFilled')[0].value = startTime

    document.getElementsByName('endTimeFilled')[0].value = endTime

    document.getElementsByName('actDesFilled')[0].value = actDes

    modal.style.display = "block"



  })
})

let modal = document.querySelector(".modal")
let closeBtn = document.querySelector(".close-btn")

closeBtn.onclick = function () {
  modal.style.display = "none"
}
window.onclick = function (e) {
  if (e.target == modal) {
    modal.style.display = "none"
  }
}

//DELETE RECURRING SLOT

const trashRecurringSlot = document.getElementsByClassName('trashRecurringSlot')

Array.from(trashRecurringSlot).forEach(function (element) {
  element.addEventListener('click', function deleteRecurSlot() {

    let recuringSlotId = element.getAttribute('data-deleteRecurTimeSlot')

    fetch('deleteRecurringSlot', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'recurringId': recuringSlotId
      })
    }).then(function (response) {
      window.location.reload()
    })



  })
})

//CANCEL SIGN UP 

const cancelSignUpButton = document.getElementsByClassName('buttonCancelSignUp')

Array.from(cancelSignUpButton).forEach(function (element) {
  element.addEventListener('click', function deleteSignUp() {

    userSignUpSlot = element.getAttribute('data-slotSignUpId')

    fetch('deleteCancelSignUp', {
      method: 'delete',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'slotId': userSignUpSlot
      })
    }).then(function (response) {
      window.location.reload()
    })



  })
})

//DIRECT TO EMAIL PAGE

const buttonEmailPage = document.getElementsByClassName('buttonEmailVolunteers')

Array.from(buttonEmailPage).forEach(function (element) {

  element.addEventListener('click', function directEmail() {
    let eventIdEmail = this.getAttribute('data-eventIdEmail')

    window.location.href = "/emailVolunteers?eventId=" + eventIdEmail

  })

})


//LOGOUT BUTTON 

var buttonLogout = document.getElementsByClassName('buttonLogOut')
console.log(buttonLogout)

Array.from(buttonLogout).forEach(function (element) {

  console.log(element)
  element.addEventListener('click', function () {

    fetch('logout', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function (response) {
      window.location.reload()
    })
  });
});

//CALENDAR CLICK THROUGH BUTTONS

const buttonLeftArrow = document.getElementsByClassName('buttonLeftArrow')

const buttonRightArrow = document.getElementsByClassName('buttonRightArrow')

const months = ["January", "February", "March", "April", "May", "June", "July",
"August", "September", "October", "November", "December"];

Array.from(buttonLeftArrow).forEach(function(element) {


  element.addEventListener('click', function() {

  
    changeMonth(-1)



  })
})

Array.from(buttonRightArrow).forEach(function(element) {


  element.addEventListener('click', function() {

  
    changeMonth(1)



  })
})

function changeMonth(incrementMonth) {

  let monthElement = document.querySelector('.displayCurrentMonth')

  let currentMonthNumber = Number(monthElement.getAttribute('data-curMonth'))

  currentMonthNumber += incrementMonth

  currentMonthNumber = Math.max(0, Math.min(currentMonthNumber, 11))

  monthElement.setAttribute('data-curMonth', currentMonthNumber) 

  //update html text of current month

  monthElement.innerText = months[currentMonthNumber]

  //update current month number so the correct calendar appears

  let monthList = document.getElementsByClassName('month-container')

  Array.from(monthList).forEach((element) => {
    if(element.getAttribute('data-month') === currentMonthNumber.toString()) {

      element.classList.remove('hidden')
    } else {
      element.classList.add('hidden')
    }
  })

}

