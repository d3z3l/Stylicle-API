const usersModel = require('../models/usersModel');
const service_time_slotsModel = require('../models/service_time_slotsModel');
const workinghoursModel = require('../models/workinghoursModel');
const assignservicesModel = require('../models/assignservicesModel');
const order_detailsModel = require('../models/order_detailsModel');
var debug = require('debug')('app')
var moment = require('moment');

var mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const bcrypt = require('bcryptjs');
const { token } = require('morgan');
exports.create = async (req, res) => {
  const token = req.header('Authorization');
  match1=[];
  
  try {
    a=0;
      const  varified = jwt.verify(token,process.env.TOKEN_SECRET);
      user= await usersModel.findOne({_id:varified._id}).populate([
        {
          path : 'workinghours',
          match: { off: {$ne: '1'} }
        },
        {
          path : 'assignservices',
        }
      ]);
      var assignservices= await assignservicesModel.findOne({_id:req.body.assignservices});
      
       console.log(user.workinghours);
      
      for (let i = 0; i < user.workinghours.length; i++) {
          array=[];
          const element = user.workinghours[i];
          
          day=element.day
          // console.log(day);
          s=element.starting_time
          e=element.end_time
          intervat=(element.end_time-element.starting_time)/60;
          if (element.day==2) {
            console.log();
          }
          await assignservicesModel.findOneAndUpdate(
              { _id:req.body.assignservices },
              {"service_time_slot":[]},
              { new: true , runValidators:true}
            );
          while (intervat>=assignservices.duration+assignservices.rest) {
            a=a+1;
            array=[...array,{'start_time':s,'end_time':s+(assignservices.duration+assignservices.rest)*60,"status":"0","day":day,"assignservices":assignservices._id}]
            intervat-=assignservices.duration+assignservices.rest
            s+=(assignservices.duration+assignservices.rest)*60
          }
          const service_time_slots= await service_time_slotsModel.create(array)
          // console.log(service_time_slots);
          const regex = /\d\w{10,}/gm;
          const str = JSON.stringify(service_time_slots);
          let m;
          while ((m = regex.exec(str)) !== null) {
              if (m.index === regex.lastIndex) {
                  regex.lastIndex++;
              }
              m.forEach((match, groupIndex) => {
                match1=[...match1,match]
              });
          }
          var assignservices2 = await assignservicesModel.findOne({ _id:req.body.assignservices }, (err, assignservices) => {
            assignservices.service_time_slot.push(...match1);
            assignservices.save(); 
          });
          console.log(a);
        }
        

      res.status(200).json({
            status: 'success',
            data: {
              'sd':'done'
            }
          });

  } catch (error) {
    console.log(error);
    if (error.name === 'ValidationError') {
      let errors = {};
      Object.keys(error.errors).forEach(key => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).send(errors);
    }
    res.status(500).send('Something went wrong');
  }
};
exports.create_manual = async (req, res) => {

  try {
    var assignservices_id=req.body.assignservices
    // delete req.body.assignservices_id
    const token = req.header('Authorization');
    const service_time_slots = await service_time_slotsModel.create(req.body);
    const varified = jwt.verify(token, process.env.TOKEN_SECRET);
    console.log(varified._id);
    var assignservices = await assignservicesModel.findOne({ _id: assignservices_id }, (err, assignservices) => {
      assignservices.service_time_slot.push(service_time_slots._id);
      assignservices.save();
    });
    assignservices = await assignservicesModel.findOne({ _id: assignservices_id });
    res.status(200).json({
      status: 'success',
      data: {
        assignservices
      }
    });
  } catch (error) {
    console.log(error);
    if (error.name === 'ValidationError') {
      let errors = {};
      Object.keys(error.errors).forEach(key => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).send(errors);
    }
    res.status(500).send('Something went wrong');
  }
};
exports.delete = async (req, res) => {
  try {
    // const _id = req.params.id;
    // const service_time_slots = await service_time_slotsModel.findOne({ _id });
    // const services = await servicesModel.find({ _id:{ $in : service_time_slots.services} });

    const _id = req.params.id;
    const service_time_slots = await service_time_slotsModel.findOneAndDelete({ _id });
    console.log(service_time_slots);
    // const varified = jwt.verify(token, process.env.TOKEN_SECRET);
    const assignservices = await assignservicesModel.findOne({ _id:service_time_slots.assignservices });
    assignservices.service_time_slot.pull(_id);
    assignservices.save();

    res.status(200).json({
      status: 'success',
      data: {
        service_time_slots
      }
    });
  } catch (error) {
    console.log(error);
    if (error.name === 'ValidationError') {
      let errors = {};
      Object.keys(error.errors).forEach(key => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).send(errors);
    }
    res.status(500).send(error);
  }
};
exports.update = async (req, res) => {
  try {
    const _id = req.params.id;
    const service_time_slots = await service_time_slotsModel.findOneAndUpdate(
      { _id },
      req.body,
      { new: true , runValidators:true}
    );
    res.status(200).json({
      status: 'success',
      data: {
        service_time_slots
      }
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      let errors = {};
      Object.keys(error.errors).forEach(key => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).send(errors);
    }
    res.status(500).send('Something went wrong');
  }
};
exports.get = async (req, res) => {
  try {
    const _id = req.body.id;
    // console.log(moment(req.body.date).day());
    // const service_time_slots = await assignservicesModel.findOne({_id}).populate([
    //   {
    //     path : 'service_time_slot',
    //     // match: {$where:'this.orders.length<4' },
    //     populate : {
    //       path : 'orders',
    //       match: { date: {$eq: '1622541889'} }
    //     }
    //   }
    // ]);
    


          // date should be dynamic
          // customer should be dynamic
          // services_val should be dynamic
          // count should be dynamic

    var assignservices= await assignservicesModel.findOne({_id:req.body.services_val});
    console.log(assignservices)
    orders=order_detailsModel.aggregate([
      {
        $match: { "date": { $eq: req.body.date }, },
        $match: { "customer": "60a38c29f1b5b618593e5a4f"},  
        $match: { "services_val": req.body.services_val},  
      },
      { 
        $group :
        {
          _id : "$time_slot_val",
          count: { $sum:assignservices.seats },
        }
      },
      {
        $match: { "count": { $lt: 2 }, },
      },
    ],
    async function(err, result) {
      if (err) {
        res.send(err);
      } else {
        var modifiedNames = result.map(function(convArray){
          return convArray._id;
        });
        service_time_slots= await service_time_slotsModel.find({_id:{$nin:modifiedNames},day:req.body.day,assignservices:req.body.services_val})
        res.json(service_time_slots);
      }
    }
  )
    // orders= await ordersModel.group({ _id: "$seller" });
    // orders= orders.group({ _id: "$department" });

    // res.status(200).json({
    //   status: 'success',
    //   data: {
    //     orders
    //   }
    // });
  } catch (error) {
    console.log(error);
    if (error.name === 'ValidationError') {
      let errors = {};
      Object.keys(error.errors).forEach(key => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).send(errors);
    }
    res.status(500).send('Something went wrong');
  }
};
