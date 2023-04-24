export function POST(){
    return new Response(null, {
        headers: new Headers({
            'Set-Cookie': `token=; HttpOnly; Path=/; SameSite=Strict; expires=Thu, 01 Jan 1970 00:00:00 GMT`
        })
    })
}