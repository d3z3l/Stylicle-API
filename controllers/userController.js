const usersModel = require('../models/usersModel');
const categoriesModel = require('../models/categoriesModel');
const ordersModel = require('../models/ordersModel');
const groupsModel = require('../models/groupsModel');
const assignservicesModel = require('../models/assignservicesModel');
const e_walletsModel = require('../models/e_walletsModel');
const catchAsync = require('./../utils/catchAsync');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { token } = require('morgan');
const nodemailer = require('nodemailer');
const { populate } = require('../models/usersModel');

  
exports.login = async (req, res) => {
  try {
    const user = await usersModel.findOne({ email: req.body.email });
    console.log(user);
    if (user == null ) {
      res.status(401).json({
        status: 'Email not found',
      });
      return false;
    }
    const validation = await bcrypt.compare(req.body.password, user.password);
    if (!validation) {
      res.status(401).json({
        status: 'Email and Password is invalid',
      });
      return false;
    } else {

      const user = await usersModel.findOne({ email: req.body.email ,status:{ $ne: "2" }});
      console.log(user);
      if (user == null ) {
        res.status(401).json({
          status: 'Account is inactivated',
        });
        return false;
      }

      console.log(33333434);
      user2= await usersModel.findOne({_id:user._id}, { password: 0,e_wallet:0,emploies:0,followers:0,orders:0});
      var nav ='no'
      console.log(user2.package);
      console.log(user2.package.length);
      if ((user2.package==undefined || user2.package.length==0) && user2.role_id=='1') {
        nav='packages'
      }
      console.log(user2.package==undefined);
      res.status(200).json({
        status: 'success',
        nav: nav,
        data: {
          tokken: jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)
        }
      });
    }
  } catch (error) {
    res.status(500).json({
      status: 'Something went wrong',
    });
  }
};
exports.createUser = async (req, res) => {
  try {
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(req.body.password, salt);
    req.body.password = hash;
    // const e_wallets = await e_walletsModel.create({
    //   "ballence":0
    // });
    // req.body.e_wallet=e_wallets._id
    const newUser = await usersModel.create(req.body);
    const token=req.header('Authorization')
    if (token !=undefined && req.body.is_related==true) {
      const  varified = jwt.verify(token,process.env.TOKEN_SECRET);
      const _id = varified._id;
      
      var group =await groupsModel.findOne({ user: _id});
      console.log(group.length);
      console.log(group._id);
      if (group._id==undefined) {
         group= await groupsModel.create({user:_id});
      }
      console.log(group);
      var groupsModel2 = await groupsModel.findOneAndUpdate(
        { _id:group._id },
        {$push: { user: newUser._id }},
        { new: true , runValidators:true}
      );
      
    }
    res.status(200).json({
      status: 'success',
      data: {
        group
      }
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      let errors = {};

      Object.keys(error.errors).forEach(key => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).json({
        status: errors,
      });
      // return res.status(400).send(errors);
    }
    console.log(error);
    res.status(500).send(error);
  }
};
exports.forget_password = async (req, res) => {
  try {
    const user = await usersModel.findOne({ email: req.body.email });
    if (user.length === 0) {
      res.status(400).send('Email not found');
      return false;
    }
    let password = Math.random(100000000000000000).toString(36);
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password, salt);
    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'drcode111@gmail.com',
        pass: '1111aaaa@'
      }
    });
    var mailOptions = {
      from: 'drcode111@gmail.com',
      to: 'aunrizvi16@gmail.com',
      subject: 'Sending Email using Node.js',
      text: 'your password is ' + password
    };
    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.log(error);
      } else {
        const user = await usersModel.findOneAndUpdate(
          { email: req.body.email },
          { password: hash },
          { new: true }
        );
        console.log('Email sent: ' + info.response);
      }
    });

    res.status(200).json({
      status: 'success'
    });
  } catch (error) {
    res.status(500).send(error);
  }
};
exports.passwordUser = async (req, res) => {
  const token=req.header('Authorization')
  var  varified = jwt.verify(token,process.env.TOKEN_SECRET);
  var _id = varified._id;
  var user = await usersModel.findOne({ _id });
  console.log(444);
  console.log(req.body);
  validation = await bcrypt.compare(req.body.old_password, user.password);
  if (!validation) {
    res.status(401).json({status: false,message:'Error! Password do not match'});
  } else {
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(req.body.new_password, salt);
    var user = await usersModel.findOneAndUpdate(
      { _id },
      { password: hash },
      { new: true }
    );
    res.status(200).json({
      status: true,
      message:'Password Updated'
    });
  }
};
exports.updateUser_by_id = async (req, res) => {
  try {
    const token=req.header('Authorization')
    const  varified = jwt.verify(token,process.env.TOKEN_SECRET);
    const _id = req.params.id
    console.log(varified);
    const user = await usersModel.findOneAndUpdate(
      { _id },
      req.body,
      { new: true , runValidators:true}
    );
    res.status(200).json({
      status: 'success',
      data:user
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'error',
      message: 'Cant update something went wrong!'
    });
  }
  
};
exports.updateUser = async (req, res) => {
  try {
    const token=req.header('Authorization')
    const  varified = jwt.verify(token,process.env.TOKEN_SECRET);
    const _id = varified._id;
    console.log(varified);
    console.log(22223333444);
    console.log(req.body);
    const user = await usersModel.findOneAndUpdate(
      { _id },
      req.body,
      { new: true , runValidators:true}
    );
    res.status(200).json({
      status: 'success',
      data:user
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: 'error',
      message: 'Cant update something went wrong!'
    });
  }
  
};
exports.upload = async (req, res) => {
  // const user = await usersModel.find({});
  // // Tour.findOne({ _id: req.params.id })

  // if (!user) {
  //   return next(new AppError('No tour found with that ID', 404));
  // }
console.log(req.file);
console.log(req.body.text);
// console.log(req.image_name);
  res.status(200).json({
    status: req.image_name,
  });
};
exports.getUser = async (req, res) => {
  const token=req.header('Authorization')
  try {
    const  varified = jwt.verify(token,process.env.TOKEN_SECRET);
    user= await usersModel.findOne({_id:varified._id}).populate([
      {
        path : 'workinghours'
      },
      {
        path : 'reviews',
        populate:{
          path:'orders',
          populate:{
            path:'details',
            populate:[{
              path : ' customer',
              select: 'phone name email',
            },{
              path :'assignservices',
              select: 'services',
              populate:'services'
            }]
          }
        }
      },
      {
        path : 'emploies'
      },
      {
        path : 'e_wallet',
        populate:{
          path:'transaction'
        }
      },
      {
        path : 'assignservices',
        populate : {
          path : 'services',
        }
      }
    ]);
    if (user.subscription!=0) {
      
      var date= new Date().getTime() / 1000
      if (date>= user.subscription_date+2629743 && user.subscription_date!=0 ) {
        const user = await usersModel.findOneAndUpdate(
          { _id:varified._id},
          {'status':'3'},
          { new: true , runValidators:true}
        );
      }
      var user_wallet=await e_walletsModel.findOne({_id:user.e_wallet[0]})
      if (date>= user_wallet.date+2629743 && user_wallet.date!=0) { 
        const user = await usersModel.findOneAndUpdate(
          { _id:varified._id},
          {'status':'4'},
          { new: true , runValidators:true}
        );
      }

    }
    res.status(200).json({
      status: 'success',
      data: {
        user
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
exports.getUser_by_id = async (req, res) => {
  // const token=req.header('Authorization')
  try {
    // const  varified = jwt.verify(token,process.env.TOKEN_SECRET);
    user= await usersModel.findOne({_id:req.params.id}, { password: 0,e_wallet:0,emploies:0,followers:0,orders:0,package:0,role_id:0}).populate([
      {
        path : 'workinghours'
      },
      {
        path : 'newsfeedsPosts',
        options: {
          limit: 5,
        }
      },
      {
        path : 'reviews',
        populate:{
          path:'orders',
          populate:{
            path:'details',
            populate:[{
              path : ' customer',
              select: 'phone name email',
            },{
              path :'assignservices',
              select: 'services',
              // populate:'services',
              populate:{
                path:'subcategories'
              }
            }]
          }
        }
      },
      {
        path : 'emploies'
      },
      {
        path : 'assignservices',
        populate : {
          path : 'service_time_slot',
        },
        populate : {
          path : 'services',
        },
      }
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        user
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
exports.schedule = async (req, res) => {
  const token=req.header('Authorization')
  try {
    const  varified = jwt.verify(token,process.env.TOKEN_SECRET);
    user= await usersModel.findOne({_id:varified._id});

    if (user.role_id=='0') {
      schedule= await ordersModel.find({seller:varified._id}).populate({path:"details"});
    } else {
      schedule= await ordersModel.find({customer:varified._id}).populate({path:"details"});
    }

    res.status(200).json({
      status: 'success',
      data: {
        schedule
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
exports.getAllsellers = async (req, res) => {
  
  var services=[]
  var categories_services=[]
  assignservices=[]
  let categories=''
  if (req.query.service_id) {
    // const services = await servicesModel.findOne({_id:req.query.service_id});
    
    _assignservices = await assignservicesModel.find({services:req.query.service_id});

    _assignservices.forEach(element => {
      assignservices=[...assignservices,element.user]
    });
  }
  if (req.query.category_id) {
    categories = await categoriesModel.find({_id:req.query.category_id})
     .populate(
      {
        path : 'subcategories',
      }
    );
    categories.forEach(element => {
      element.subcategories.forEach(element2 => {
        categories_services=[...categories_services,...element2.services]
      });
    });
    _assignservices = await assignservicesModel.find({services:{$in:categories_services}} );;
    _assignservices.forEach(element => {
      assignservices=[...assignservices,element.user]
    });
  }
  try {
    // console.log(req.body.lat+0.1);
    // console.log(req.body.lat-0.1);
    var query = {};
    if (req.query.category_id || req.query.service_id ) {
      if( req.body.lat !=0 && req.body.lat !=undefined ) {
        query["role_id"] = '1';
        query["_id"] ={$in:assignservices};
        query["lat"] =  {$gte : req.body.lat-0.1, $lte : req.body.lat+0.1};
        query["lng"] = {$gte : req.body.lng-0.1, $lte : req.body.lng+0.1};
      }else {
        query["role_id"] = '1';
        query["_id"] ={$in:assignservices}
      }
    }
    else {
      console.log(4444444434234235324532454);
      if( req.body.lat !=0 && req.body.lat !=undefined ) {
        query["role_id"] = '1';
        query["lat"] = {$gte : req.body.lat-0.1, $lte : req.body.lat+0.1};
        query["lng"] = {$gte : req.body.lng-0.1, $lte : req.body.lng+0.1};
      }else {
        query["role_id"] = '1';
      }
    }
    console.log(query);
    console.log(req.body.lat);
    user= await usersModel.find(query, { password: 0,e_wallet:0,emploies:0,followers:0,orders:0,package:0 ,role_id:0 ,workinghours:0,newsfeedsPosts:0}).limit(4).skip(parseInt(req.query.page *4))
    .populate([
      {
        path : 'assignservices',
        options: {
          limit: 4
        },
        populate : {
          path : 'services',
        }
      }
      ,
      {
        path : 'reviews',
        populate:{
          path:'orders',
          populate:{
            path:'details',
            populate:[{
              path : ' customer',
              select: 'phone name email',
            },{
              path :'assignservices',
              select: 'services',
              populate:'services'
            }]
          }
        }
      }
    ]).where("status").eq('1');
    user_count= await usersModel.find(query).where("status").eq('1').count()
    console.log(user);
    res.status(200).json({
      status: 'success',
      data: {
        user,
        user_count
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
exports.getAllsellers_admin = async (req, res) => {
  try {
    // user= await usersModel.find({role_id:'1'}, { password: 0,e_wallet:0,emploies:0,followers:0,orders:0,package:0 ,role_id:0 ,workinghours:0,newsfeedsPosts:0,assignservices:0,reviews:0,services:0}).limit(4).skip(parseInt(req.query.page *4));
    user= await usersModel.find({role_id:'1'}).select('name image email phone status');
    user_count= await usersModel.find({role_id:'1'}).count()
    res.status(200).json({
      status: 'success',
      data: {
        user,
        user_count
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
exports.getAllbuyersAdmin = async (req, res) => {
  try {
    // user= await usersModel.find({role_id:'1'}, { password: 0,e_wallet:0,emploies:0,followers:0,orders:0,package:0 ,role_id:0 ,workinghours:0,newsfeedsPosts:0,assignservices:0,reviews:0,services:0}).limit(4).skip(parseInt(req.query.page *4));
    user= await usersModel.find({role_id:'0'}).select('name image email phone status');
    user_count= await usersModel.find({role_id:'0'}).count()
    res.status(200).json({
      status: 'success',
      data: {
        user,
        user_count
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
exports.groups = async (req, res) => {
  try {
    const token=req.header('Authorization')
    const  varified = jwt.verify(token,process.env.TOKEN_SECRET);
    const _id = varified._id;
    var group =await groupsModel.findOne({ user: _id}).populate('user',['business','_id'])
    res.status(200).json({
      status: 'success',
      data: {
        group
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
exports.groups_tocken = async (req, res) => {
  try {
    console.log(req.body.id);
    res.status(200).json({
      status: 'success',
      data: {
        tokken: jwt.sign({ _id: req.body.id }, process.env.TOKEN_SECRET)
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
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined!'
  });
};
