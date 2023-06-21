const express = require("express");
const mailchimp = require("@mailchimp/mailchimp_marketing");
require("dotenv").config();

const app = express();

app.use(express.static(__dirname + "/public"));  //This sets the root path to our css file... In our html file, we just need to use relative path, in the sense that we are stating our route from the "public" directory. This is the way to serve static file in node.
app.use(express.static(__dirname + "/node_modules/bootstrap/dist"))  //This sets the root path to our bootstrap css and js file in our node_modules... In our html file, we just need to use relative path, in the sense that we are stating our route from the "node_modules/bootstrap/dist" directory. This is the way to serve static file in node.

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("/signup", (req, res) => {
    res.sendFile(__dirname + "/signup.html")
})

async function addSubscriber(fName, lName, email){
    const response = await mailchimp.lists.addListMember(process.env.LIST_ID, { // process.env.LIST_ID tells the browser to  access the .env file and use the LIST_ID value there.
        email_address: email,
        status: "pending",
        merge_fields: {
            FNAME: fName,
            LNAME: lName,
        }
    });
    console.log("Subsriber added!", response);
};

app.post("/signup", (req, res) => {
    const { fName, lName, email } = req.body;
    addSubscriber(fName,lName, email)
    .then(() => {
        res.sendFile(__dirname + "/success.html")
    })
    .catch((error) => {
        console.error("Error Subscribing", error)
        res.status(500).sendFile(__dirname + "/failed.html")
    });
});

mailchimp.setConfig({
    apiKey: process.env.API_KEY, // This line of code accesses the .env file and uses the API_KEY value there.
    server: process.env.SERVER // This line of code accesses the .env file and uses the SERVER value there.
})








PORT = 8080;
app.listen(PORT, () =>{
    console.log(`Server is running on https://localhost:${PORT}`);
});