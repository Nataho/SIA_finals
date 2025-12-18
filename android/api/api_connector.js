const ip = "10.147.17.203"
const port = "6767"
const api = `http://${ip}:${port}/api`

// ---------- GET ----------
async function get_users(){
    const data = await fetch(`${api}/users`)
    const users = await data.json()

    return users
}

async function get_user(user_id){
    const data = await fetch(`${api}/users/${user_id}`)
    const user = await data.json()
    return user
}

async function get_user_devices(user_id){
    const data = await fetch(`${api}/users/${user_id}/devices`)
    const devices = await data.json()
    return devices
}

async function get_devices(){
    const data = await fetch(`${api}/devices`)
    const devices = await data.json()
    return devices
}

async function get_device(device_id) {
    const data = await fetch(`${api}/devices/${device_id}`)
    const device = await data.json()
    return device
}

// ---------- POST ----------

async function add_user(username, password){
    try {
        const res = await fetch(`${api}/users`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                "username": username,
                "password_hash": password
             })
        })

        const payload = await res.json()
        console.log(payload)
        if (!res.ok) {
            // return with error on payload
            return { ok: false, status: res.status, error: payload }
        }

        console.log("User Created Sucessfully")
        return { ok: true, status: res.status, data: payload }
    } catch (err) {
        return { ok: false, status: 0, error: err.message }
    }
}

async function add_device(user_id, device_name, device_type) {
    try {
        const res = await fetch(`${api}/devices`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                "user_id": user_id,
                "device_name": device_name,
                "device_type": device_type
             })
        })

        const payload = await res.json()
        console.log(payload)
        if (!res.ok) {
            // return with error on payload
            return { ok: false, status: res.status, error: payload }
        }

        console.log("Device created Sucessfully")
        return { ok: true, status: res.status, data: payload }
    } catch (err) {
        return { ok: false, status: 0, error: err.message }
    }
}

async function add_log(device_id, action){
    try {
        const res = await fetch(`${api}/logs`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ 
                "device_id": device_id,
                "action": action
             })
        })

        const payload = await res.json()
        console.log(payload)
        if (!res.ok) {
            // return with error on payload
            return { ok: false, status: res.status, error: payload }
        }

        console.log("Device created Sucessfully")
        return { ok: true, status: res.status, data: payload }
    } catch (err) {
        return { ok: false, status: 0, error: err.message }
    }
}

//gets the user with 2 as ID
const wow = await get_user(2)
console.log(wow)