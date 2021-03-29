var thumbUp = document.getElementsByClassName("fa-edit");
var trash = document.getElementsByClassName("fa-trash");



Array.from(thumbUp).forEach(function(element) {
      element.addEventListener('click', function(){

        const noteId = this.parentNode.parentNode.parentNode.getAttribute('data-noteId')

        console.log('noteId' + noteId);

        window.location.href="/editNote?noteId=" + noteId

        
});

});

Array.from(trash).forEach(function(element) {
      element.addEventListener('click', function(){

        const noteId = this.parentNode.parentNode.parentNode.getAttribute('data-noteId')

        fetch('messages', {
          method: 'delete',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            '_id': noteId
          })
        }).then(function (response) {
          window.location.reload()
        })
      });
});
