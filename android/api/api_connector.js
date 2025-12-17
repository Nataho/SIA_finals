async function get_users(){
    const data = await fetch("http://localhost:6767/api/users")
    const users = await data.json()

    return users
}

const wow = await get_users()
console.log(wow)