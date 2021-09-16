const router = require("express").Router();
const Workout = require("../models/Workout.js");

router.get('/api/workouts', ({ body }, res) =>{
    console.log('API GET /api/workouts')

    Workout.find({})
    .then(dbWorkout => {
        console.log('Get all workouts')

        dbWorkout.forEach(workout=> {
            var total = 0;
            workout.exercises.forEach(e => {
                total += e.duration;
            });
            workout.totalDuration = total;
        });
        res.json(dbWorkout)
    })
    .catch(err => {
        console.log('err loading API GET /api/workouts', dbWorkout)
        res.status(400).json(err)
    })

})

router.post('/api/workouts', ({ body }, res) => {
    console.log('API POST /api/workouts')

    Workout.create(body)
    .then(dbWorkout => {
        res.json(dbWorkout)
    })
    .catch(err => res.status(400).json(err))
});

router.put('/api/workouts/:id', ({ body, params }, res) => {
    console.log('API PUT /api/workouts/:id')
    console.log(params)
    console.log(body)
    // let id = params.id
    Workout.findOneAndUpdate(
        {  _id: params.id },
        { $push: { exercises: body } },
    
    {new: true, runValidators: true}
    )
    .then((dbWorkout) => {
        console.log(dbWorkout)
        res.json(dbWorkout);
    })
    .catch((err) => {
        res.json(err)
    });
});


router.get('/api/workouts/range', (req, res) =>{
    console.log('API GET /api/workouts/range')
    console.log(req.body)

    Workout.aggregate([
        { $addFields:{
            totalDuration: {$sum: req.body.totalDuration},
        }}
    ])
    .sort({_id: -1}).limit(7)
    .then((data) => {
        console.log('all workouts in ranga', data)
        res.json(data)
    })
    .catch(err => res.status(400).json(err))
})

router.delete('/api/workouts/:id', (req, res) =>{
    console.log('API DELETE /api/workouts/:id')

    Workout.findByIdAndDelete(req.params.id)
    .then(() => {
        console.log('deleted fields', params.id)
        return res.json(true)
    }).catch(err => res.status(400).json(err))
})

module.exports = router;
