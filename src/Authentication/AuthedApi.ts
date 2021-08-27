
export default (app)=>{
    app.get('/get_user', async (req, res)=>{
        res.send(req.user)
    })
}