const express = require('express');
const app = express();
const path = require('path')
var mysql = require('mysql');


var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "ansaf2001",
});

con.connect(function (err) {
    if (err)
        throw err;
    console.log("Connected!");
});



var bodyParser = require('body-parser');
const res = require('express/lib/response');
const req = require('express/lib/request');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3000, () => {
    console.log("Server is on!!")
})

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'))


app.use(express.static(path.join(__dirname, '/public')))


let usrname;
let pid;

app.get('/', (req, res) => {
    res.render('login')
})

app.post('/patient', (req, res) => {
    usrname = req.body.usrname;
    let psw = req.body.psw;

    con.query('SELECT * FROM test.login WHERE usrname = ?', [usrname], (err, rows, fields) => {
        if (!err) {
            if (rows.length === 0) {
                console.log("Wrong username")
                res.redirect('/');
            }
            else {
                pid = rows[0].P_Id;
                if (rows[0].password === psw) {
                    con.query('SELECT * FROM test.patient WHERE P_Id = ?', [pid], (err, rows, fields) => {
                        if (!err) {
                            const details = rows[0];
                            res.render('patient', { details });

                        }
                        else {
                            console.log(err);
                            res.send("An unexpexted error has occurred.Please login again")
                        }
                    })
                }
                else {
                    console.log("Wrong password");
                    res.redirect('/');
                }
            }
        }
        else {
            console.log(err);
            res.render(login);
        }
    })

})


app.get('/patient', (req, res) => {

    con.query('SELECT * FROM test.patient WHERE P_Id = ?', [pid], (err, rows, fields) => {
        if (!err) {
            const details = rows[0];
            res.render('patient', { details });

        }
        else {
            console.log(err);
            res.send("An unexpexted error has occurred.Please login again")
        }
    })
})


app.get('/medicines', (req, res) => {
    con.query('SELECT mname,qty,DoI,dname FROM ((test.patient_medicine INNER JOIN test.medicines ON patient_medicine.M_Id = medicines.M_Id) INNER JOIN test.doctor ON patient_medicine.D_Id = doctor.D_Id) WHERE P_Id = ?', [pid], (err, rows, fields) => {

        if (!err) {
            const meds = rows;
            res.render('medicines', { meds });

        }
        else {
            console.log(err);
            res.send("An unexpexted error has occurred.Please login again")
        }
    })
})






