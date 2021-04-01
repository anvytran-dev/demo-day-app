//ADD EVENT LISTENERS ON THE 'ADD DATES/TIME SLOTS' BUTTONS. After the button is clicked, it directs the user to the page where the selected event's time slots are. 

var addTimeSlot = document.querySelectorAll('.buttonAddSlotsPage');

Array.from(addTimeSlot).forEach(function(element) {
    console.log(addTimeSlot)

    element.addEventListener('click', function() {

        const eventId = this.parentNode.parentNode.getAttribute('data-eventId')

        window.location.href="/addTimeSlots?id=" + eventId
    })
}
);

var editIcon = document.getElementsByClassName("fa-edit");
var trashIcon = document.getElementsByClassName("fa-trash");

//PUBLISH SIGN UP SHEET

var buttonPublishSignUpSheet = document.querySelector('.hi') 

console.log(buttonPublishSignUpSheet)

buttonPublishSignUpSheet.addEventListener('click', getPublicCreateSignUp)

function getPublicCreateSignUp() {

    const eventId = this.getAttribute('data-eventId')
    window.location.href="/publicSignUpSheet?id=" + eventId

}

//SIGN UP AS A VOLUNTEER

var signUpButton = document.querySelectorAll('.buttonSignUp')

Array.from(signUpButton).forEach(function(element) {
    console.log(element)
    element.addEventListener('click', signUpVolunteerSlot)

    function signUpVolunteerSlot() {

        const eventId = this.getAttribute('data-eventId')
        const slotId = this.getAttribute('data-slotId')

        window.location.href="/signUpForSlot?eventId=" + eventId + "?slotId=" + slotId
    }
})