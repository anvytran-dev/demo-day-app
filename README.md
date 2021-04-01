# full-stack-app-money-tracker

This is a full-stack appliaction where the user can track their spending. They can detail what they purchased and how much it was. The user can edit the purchase notes that they have created. They can check how much they spent on a certain day. 

Link to Project: https://full-stack-spending-tracker.herokuapp.com/

![Project Image](/public/img/project.png)


### How It's Made:

This project uses EJS, CSS, and JavaScript on the front-end and Node.js + Express.js, and MongoDB on the back-end. 

The user fills out their purchase note and submits it. This submission is sent as a request to the server. The details of their purchase note is sent and stored to a database in MongoDB. Then, the server requests the data from the database, the data is sent as a response to the front-end so that the information can be rendered dyanmically through EJS. 


### Lesson Learned

I learned how to use CRUD functions to operate on stored data in MongoDB. Also, I learned how to use EJS, a simple templating language that allow us to generate HTML markup with Javascript.  
 

###

