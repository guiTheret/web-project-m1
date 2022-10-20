const express = require('express')
const router = express.Router()
var mysql = require('mysql');
var connection = require('../db');

router.get('/available/:idCleaner/:year/:month', (req, res) => {
    console.log("get ?")
    const string = "SELECT cleanersSchedule.* FROM cleanersSchedule JOIN users ON cleanersSchedule.idCleaner = users.id WHERE users.id = ? AND cleanersSchedule.year = ? AND cleanersSchedule.month = ?;"
    const inserts = [parseInt(req.params.idCleaner), req.params.year, req.params.month];
    const sql = mysql.format(string, inserts);
    console.log(sql);
    connection.query(sql, async (error, results) => {
        if (error) throw error;
        res.status(200).json({ data: results })
    })
})

router.get('/seeAllCleaners/', (req, res) => {
    connection.query(`SELECT * FROM cleaners `, async (error, results) => {
        if (error) throw error;
        if (results.length == 0) {
            return res.status(409).json({ message: 'Aucun cleaner existant' })
        } else {
            res.send(results)
            console.log(results)//this 
            return results
        }
    })
})

router.post('/addNewCleaner/', (req, res) => {

    var Regex = '/^[^a-zA-Z]*$/';
    const idCleaner = req.body.idCleaner;
    const email = req.body.email;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;

    if (email.length == 0) { // vérifier présence'@'
        return res.status(409).json({ message: 'Il manque un email' })
    }

    if (mailValidation(email) == false) { // vérifier présence'@'
        return res.status(409).json({ message: 'Le format ne correspond pas a un email' })
    }


    if (firstName.length == 0) { // vérifier que ce ne soient que des lettres
        return res.status(409).json({ message: 'Il manque un prénom' })
    }

    if (lastName.length == 0) { // vérifier que ce ne soient que des lettres
        return res.status(409).json({ message: 'Il manque un nom' })
    }

    connection.query(`INSERT INTO cleaners (idCleaner,email,firstName, lastName) VALUES(?,?,?,?)`, [idCleaner, email, firstName, lastName], async (err, results, fields) => {
        if (err) return res.status(409).json({ message: 'Cleaner already existing' })
        return res.status(200).json({ message: 'Cleaner added' })
    })

})

router.get('/updateCleanerInfo/', (req, res) => {
    connection.query(`SELECT * FROM cleaners `, async (error, results) => {
        if (error) throw error;
        if (results.length == 0) {
            return res.status(409).json({ message: 'Aucun cleaner existant' })
        } else {
            res.send(results)
            console.log(results)//this 
            return results
        }
    })
})

router.get('/deleteCleaner/', (req, res) => {
    connection.query(`SELECT * FROM cleaners `, async (error, results) => {
        if (error) throw error;
        if (results.length == 0) {
            return res.status(409).json({ message: 'Aucun cleaner existant' })
        } else {
            res.send(results)
            console.log(results)//this 
            return results
        }
    })
})

const mailValidation = (mail) => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(mail) === false) {

        return false;
    }
    return true;
}

module.exports = router