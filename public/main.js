var editIcon = document.getElementsByClassName("fa-edit");
var trashIcon = document.getElementsByClassName("fa-trash");

//ADD EVENT LISTENERS ON THE 'ADD DATES/TIME SLOTS' BUTTONS. After the button is clicked, it directs the user to the page where the selected event's time slots are. 

var addTimeSlot = document.querySelectorAll('.buttonAddSlotsPage');

Array.from(addTimeSlot).forEach(function (element) {
    console.log(addTimeSlot)

    element.addEventListener('click', function () {

        const eventId = this.parentNode.parentNode.getAttribute('data-eventId')

        window.location.href = "/addTimeSlots?id=" + eventId
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

        console.log(eventId, slotId, recurringId)

        document.getElementsByName('guestEventId')[0].value = eventId

        document.getElementsByName('guestSlotId')[0].value = slotId

        document.getElementsByName('guestRecurringId')[0].value = recurringId

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

