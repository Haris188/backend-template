
export default (app)=>{
    app.get('/working', (req, res)=>{
        res.status(200).send('yes')
    })
}