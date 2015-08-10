var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Spot = mongoose.model('Spot');
var jwt = require('express-jwt');
var auth = jwt({
  secret: 'Hashbrowns',
  userProperty: 'payload'
});

router.param('spot', function(req, res, next, _id) {
  Spot.findOne({
    _id: _id
  }).exec(function(err, spt) {
    if (err) return next(err);
    req.spot = spt;
    next();
  });
});

router.get('/', function(req, res, next) {
  var query = Spot.find({
    'deleted': null
  }).populate('user', 'username')
  .sort({
    'created': -1
  }).limit(50);
  query.exec(function(err, spots) {
    if (err) return next(err);
    res.send(spots);
  });
});

router.get('/:spot', function(req, res, next) {

});

router.post('/', auth, function(req, res, next) {
  var spot = new Spot(req.body);
  spot.user = req.payload._id;
  spot.created = new Date();
  spot.deleted = null;
  spot.save(function(err, spot) {
    if (err) return next(err);
    res.send({
      _id: spot._id,
      created: spot.created
    });
  });
});

router.put('/', function(req, res, next) {

});

router.delete('/:spot', auth, function(req, res, next) {
  Spot.update({
    _id: req.spot._id,
    user: req.payload._id
  }, {
    deleted: new Date()
  }, function(err, numAffected) {
    if (err) return next(err);
    if(numAffected.nModified === 1) res.send();
    else res.status(400).send('You cannot do that.');
  });
});

router.use(function(err, req, res, next) {
  res.status(400).json(err);
});

module.exports = router;