const ip = "localhost"
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

const wow = await add_user("sheena","iterumi")
console.log(wow)