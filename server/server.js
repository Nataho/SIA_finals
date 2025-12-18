const mysql = require('mysql2')
const express = require('express')

console.clear()

const port = 6767
const server = express()
// parse JSON and URL-encoded request bodies
server.use(express.json())
server.use(express.urlencoded({ extended: true }))
const database = mysql.createConnection({
    host: "localhost",
    port: "1122",
    user: "root",
    password: "1234",
    database: "SmartHomeDevices"
})

server.listen(port, () => {
    console.log("hosting on port", port)
})

database.connect((error) => {
    if (error) throw error
    console.log("Database connected")
})

// ---------- GET ----------

//get all users
server.get("/api/users", (req,res) => {
    const query = `SELECT * FROM users`
    database.query(query, (error,result) => {
        if (error) res.json(error.message)
        res.json(result)
    })
})

// get specific user
server.get("/api/users/:id", (req,res) => {
    const {id} = req.params

    const query = `SELECT * FROM users WHERE id = ?`
    database.query(query, [id], (error,result) => {
        if (error) res.json(error.message)

        if (result.length === 0){
            return res.status(404).json({message: "user not found"})
        }
        res.json(result)
    })
})

//get all devices
server.get("/api/devices", (req,res) => {

    const query = `SELECT * FROM devices`
    database.query(query, (error,result) => {
        if (error) res.json(error.message)
        res.json(result)
    })
})

// get specific device
server.get("/api/devices/:id", (req,res) => {
    const {id} = req.params

    const query = `SELECT * FROM devices WHERE id = ?`
    database.query(query, [id], (error,result) => {
        if (error) res.json(error.message)
        
            if (result.length === 0){
                return res.status(404).json({message: "device not found"})
            }

        res.json(result)
    })
})

//get the devices of a specific user
server.get("/api/users/:id/devices", (req,res) => {
    const {id} = req.params
    
    const query = `SELECT * FROM devices WHERE user_id = ?`
    database.query(query, [id], (error,result) => {
        if (error) res.json(error.message)
        res.json(result)
    })
})

server.get("/api/devices/:type", (req,res) => {
    const {type} = req.params
    
    const query = `SELECT * FROM devices WHERE device_type = ?`
    database.query(query, [type], (error, result) => {
        if (error) res.json(error.message)
        res.json(result)
    })
})

//much better than nesting
server.get("/api/logs", (req, res) => {
    const { device } = req.query;

    // show only logs table
    // stitch up both values of tables
    const query = `
        SELECT logs.* FROM logs 
        JOIN devices ON logs.device_id = devices.id 
        WHERE devices.device_name = ?
    `;

    database.query(query, [device], (error, result) => {
        if (error) return res.status(500).json({error: error.message});
        res.json(result);
    });
});

// ---------- POST ----------

//add new device
server.post("/api/devices", (req, res) => {
    console.log(req.body)

    //check if everything is available
    const { user_id, device_name, device_type } = req.body || {}
    if (user_id == null || !device_name || !device_type) {
        return res.status(400).json({ message: "Missing required fields: user_id, device_name, device_type" })
    }

    const check_query = "SELECT * FROM devices WHERE user_id = ? AND device_name = ?"
    database.query(check_query, [user_id, device_name], (check_error, check_result) => {
        if (check_error) {
            return res.status(500).json({ error: check_error.message })
        }

        if (check_result.length > 0) { //check duplicate
            return res.status(409).json({ message: "Device name already exists for this user." })
        }

        const insert_query = "INSERT INTO devices (user_id, device_name, device_type) VALUES (?,?,?)"
        database.query(insert_query, [user_id, device_name, device_type], (insert_error, insert_result) => {
            if (insert_error) {
                return res.status(500).json({ error: insert_error.message })
            }
            
            res.status(201).json({ 
                message: "Device created successfully", 
                deviceId: insert_result.insertId 
            })
        })
    })
})

server.post("/api/users", (req, res) => {
    console.log(req.body)

    //check if everything is available
    const { username, password_hash } = req.body || {}
    if (!username || !password_hash) {
        return res.status(400).json({ message: "Missing required fields: username,password_hash" })
    }

    const check_query = "SELECT * FROM users WHERE username = ? AND password_hash = ?"
    database.query(check_query, [username, password_hash], (check_error, check_result) => {
        if (check_error) {
            return res.status(500).json({ error: check_error.message })
        }

        if (check_result.length > 0) { //check duplicate
            return res.status(409).json({ message: "This user has already created an account" })
        }
        const insert_query = "INSERT INTO users (username, password_hash) VALUES (?,?)"
        database.query(insert_query, [username,password_hash], (insert_error,insert_result) => {
            if (insert_error) {
                return res.status(500).json({error : insert_error.message})
            }

            res.status(201).json({
                message: "User Created Sucessfully",
                username: username
            })
        })
    })
})

//add logs
server.post("/api/logs", (req, res) => {
    console.log(req.body)

    //check if everything is available
    const { device_id, action } = req.body || {}
    if (device_id == null || !action) {
        return res.status(400).json({ message: "Missing required fields: device_id, action" })
    }

    const insert_query = "INSERT INTO logs (device_id, action) VALUES (?,?)"
    database.query(insert_query, [device_id, action], (insert_error,insert_result) => {
        if (insert_error) {
            return res.status(500).json({error : insert_error.message})
        }

        res.status(201).json({
            message: "Log Created Sucessfully"
        })
    })
})

// ---------- PUT ----------
server.put("/api/users/:id", (req, res) => {
    console.log(req.body)
    const {id} = req.params

    const {username, password_hash} = req.body || {}
    if (!username || !password_hash) {
        return res.status(400).json({ message: "Missing required fields: username, password_hash" })
    }

    const check_query = "SELECT * FROM users WHERE id = ?"
    database.query(check_query, [id], (check_error, check_result) => {
        if (check_error) {
            return res.status(500).json({ error: check_error.message })
        }

        if (check_result.length === 0) { //check exsistence
            return res.status(404).json({ message: "account not found" })
        }

        const insert_query = "UPDATE users SET username = ?, password_hash = ? WHERE id = ?"
        database.query(insert_query, [username, password_hash, id], (insert_error,insert_result) => {
            if (insert_error) {
                return res.status(500).json({error : insert_error.message})
            }

            res.status(201).json({
                message: "User Updated Sucessfully",
                username: username
            })
        })
    })
})

server.put("/api/devices/:id", (req, res) => {
    console.log(req.body)
    const {id} = req.params

    const {device_name, device_type} = req.body || {}
    if (!device_name || !device_type) {
        return res.status(400).json({ message: "Missing required fields: device_name, device_type" })
    }

    const check_query = "SELECT * FROM devices WHERE id = ?"
    database.query(check_query, [id], (check_error, check_result) => {
        if (check_error) {
            return res.status(500).json({ error: check_error.message })
        }

        if (check_result.length === 0) { //check exsistence
            return res.status(404).json({ message: "device not found" })
        }

        const insert_query = "UPDATE devices SET device_name = ?, device_type = ? WHERE id = ?"
        database.query(insert_query, [device_name, device_type, id], (insert_error,insert_result) => {
            if (insert_error) {
                return res.status(500).json({error : insert_error.message})
            }

            res.status(201).json({
                message: "Device Updated Sucessfully",
                device_name: device_name
            })
        })
    })
})

// ---------- DELETE ----------
server.delete("/api/devices/:id", (req,res) => {
    const {id} = req.params

    const logs_query = `DELETE FROM logs WHERE device_id = ?`
    database.query(logs_query, [id], (logs_error, logs_result) =>{
        if (logs_error) res.status(500).json({error: logs_error.message})

        const query = `DELETE FROM devices WHERE id = ?`
        database.query(query, [id], (error, result) => {
            if (error) res.status(500).json({error: error.message})
    
            res.status(201).json({
                message:"device sucessfully deleted",
                device_id: id
            })
        })
    })
})