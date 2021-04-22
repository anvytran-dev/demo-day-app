function convertTime(time) {
    
    return new Date(`2020-01-01T${time}:00`).toLocaleString('en-US', {hour: 'numeric', minute:'numeric', hour12: true} )

}
module.exports = convertTime;