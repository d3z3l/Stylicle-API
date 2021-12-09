const ordersModel = require('../models/ordersModel');
const usersModel = require('../models/usersModel');
const service_time_slotsModel = require('../models/service_time_slotsModel');
const order_detailsModel = require('../models/order_detailsModel');
const e_walletsModel = require('../models/e_walletsModel');
const transactionModel = require('../models/transactionModel');

const jwt = require('jsonwebtoken');
var moment = require('moment');
exports.create = async (req, res) => {
  const token = req.header('Authorization');
  try {
    const varified = jwt.verify(token, process.env.TOKEN_SECRET);
    user= await usersModel.findOne({_id:req.body.seller},{ password: 0,e_wallet:0,emploies:0,followers:0,orders:0,role_id:0}).populate({
      path:'package'
    });
    if (user.subscription==3) {
      const orders = await ordersModel.find({ seller: req.body.seller}).count();
      console.log(orders);  
      var date= new Date().getTime() / 1000
      if (orders>98 || (date<= user.subscription_date+2629743 && user.subscription_date!=0)) {
        const user = await usersModel.findOneAndUpdate(
          { _id:req.body.seller},
          {'status':'3'},
          { new: true , runValidators:true}
        );
      }
    }
    if (user.subscription==2) { 
      req.body.commission=user.package[0].price_2;
    }
    const orders = await ordersModel.create(req.body);
    const details = await order_detailsModel.updateMany(
      { _id:req.body.details },
      {"$set":{status:1}},
      { new: true , runValidators:true}
    );
    // const orders2 = await order_detailsModel.find({ _id:"60d5ac76cd77bb0b33776d1f" });
      
    res.status(200).json({
      status: 'success',
      data: {
        orders
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
exports.create_old = async (req, res) => {
  const token = req.header('Authorization');
  try {
    const varified = jwt.verify(token, process.env.TOKEN_SECRET);
    const orders = await ordersModel.create({
    "seller":req.body.seller,
    "customer":varified._id,
    "price":req.body.price,
    "qty":req.body.qty,
    "Payment_method":req.body.Payment_method,
    "date":req.body.date
    });
    let id_array=[]
    
    for (let index = 0; index < req.body.slots.length; index++) {
      const details= await order_detailsModel.create({
        'services':req.body.service[index],
        'time_slot':req.body.slots[index],
        'date':req.body.date,
        'seller':req.body.seller,
        'customer':varified._id,
        'services_val':req.body.service[index],
        'time_slot_val':req.body.slots[index],
      })
        id_array=[...id_array,details._id]
        var service_time_slots = await service_time_slotsModel.findOne({ _id: req.body.slots[index] });
        service_time_slots.orders.push(orders._id);
        service_time_slots.save();
    }
    orders.details.push({
      $each: id_array,
      $position: 0
    });
    orders.save();
    res.status(200).json({
      status: 'success',
      data: {
        orders
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
exports.create_reservation = async (req, res) => {
  const token = req.header('Authorization');
  try {
    const varified = jwt.verify(token, process.env.TOKEN_SECRET);
    
      const details= await order_detailsModel.create({
        'assignservices':req.body.service,
        'services':req.body.service,
        'time_slot':req.body.slots,
        'date':req.body.date,
        'seller':req.body.seller,
        'customer':varified._id,
        'services_val':req.body.service,
        'time_slot_val':req.body.slots,
        status:0
      })
       
    res.status(200).json({
      status: 'success',
      data: {
        details
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
exports.update = async (req, res) => {
  try {
    const _id = req.params.id;
    var orders = await ordersModel.findOneAndUpdate({ _id })
    const admin=await usersModel.findOne({role_id:"2"})
    const sender= await usersModel.findOne({_id:orders.seller})

    if (orders.Payment_method!=100) {
      seller_pay=-(orders.commission)
      admin_pay=orders.commission
     
      const transaction_admin = await transactionModel.create(
        {
          "amount":admin_pay,
          "date":unix_c_date,
          "sender":orders.seller,
          "receiver":admin._id,
          "method":"Cash"
        }
      );
      const transaction_user = await transactionModel.create(
        {
          "amount":seller_pay,
          "date":unix_c_date,
          "sender":orders.customer,
          "receiver":orders.seller,
          "method":"Cash"
        }
      );
      var admin_wallets = await e_walletsModel.findOneAndUpdate(
        { _id:admin.e_wallet[0] },
        {$inc : {'ballence' : admin_pay},$push: { transaction: transaction_admin._id },date:new Date().getTime() / 1000},
        { new: true , runValidators:true}
      );
      var receiver_wallets = await e_walletsModel.findOneAndUpdate(
        { _id:sender.e_wallet[0] },
        {$inc : {'ballence' : seller_pay},$pushAll: { transaction:[ transaction_admin._id,transaction_user._id ]},date:new Date().getTime() / 1000},
        { new: true , runValidators:true}
      );
      
    }
     orders = await ordersModel.findOneAndUpdate(
      { _id },
      req.body,
      { new: true , runValidators:true}
    );
    res.status(200).json({
      status: 'success',
      data: {
        orders
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
exports.cancel = async (req, res) => {
  try {
    const _id = req.params.id;
    const orders = await ordersModel.findOne({ _id });
    const sender= await usersModel.findOne({_id:orders.seller}).populate('package')
    const receiver= await usersModel.findOne({_id:orders.customer})
    const admin=await usersModel.findOne({role_id:"2"})
    var sender_wallet= await e_walletsModel.findOne({_id:sender.e_wallet[0]})

    admin_pay=0
    seller_pay=0
    buyer_pay=0
    var reseivable_price =0

      
    // unid_date=moment(moment().format('l')).valueOf()/1000 
    unix_c_date=moment().valueOf()/1000
    console.log(orders.date-unix_c_date  );
    message="cant cancel"
    if (orders.date-unix_c_date>7200 || orders.date-unix_c_date<300 ) {
      console.log("term_1");
      message="cancel successfully"
      orders.status='2'
      if (orders.Payment_method!=100) {
        seller_pay=-(orders.price-orders.commission)
        buyer_pay=orders.price
        admin_pay=-orders.commission
        if (sender_wallet.ballence+seller_pay<0) {
          admin_pay=-(orders.commission+((sender_wallet.ballence+seller_pay)*-1))
        }
        const transaction_admin = await transactionModel.create(
          {
            "amount":admin_pay,
            "date":unix_c_date,
            "sender":sender._id,
            "receiver":admin._id,
            "method":"wallet"
          }
        );
        const transaction_user = await transactionModel.create(
          {
            "amount":seller_pay,
            "date":unix_c_date,
            "sender":receiver._id,
            "receiver":sender._id,
            "method":"wallet"
          }
        );
        var admin_wallets = await e_walletsModel.findOneAndUpdate(
          { _id:admin.e_wallet[0] },
          {$inc : {'ballence' : admin_pay},$push: { transaction: transaction_admin._id },date:new Date().getTime() / 1000},
          { new: true , runValidators:true}
        );
        var receiver_wallets = await e_walletsModel.findOneAndUpdate(
          { _id:sender.e_wallet[0] },
          {$inc : {'ballence' : seller_pay},$pushAll: { transaction:[ transaction_admin._id,transaction_user._id ]},date:new Date().getTime() / 1000},
          { new: true , runValidators:true}
        );
        var sender_wallets = await e_walletsModel.findOneAndUpdate(
          {_id:receiver.e_wallet[0]},
          {$inc : {'ballence' : buyer_pay},$push: { transaction: transaction_user._id },date:new Date().getTime() / 1000},
          { new: true , runValidators:true}
        );
      }
      orders.save()
    } else {
      
    }
    res.status(200).json({
      status: 'success',
      data:message
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      let errors = {};
      Object.keys(error.errors).forEach(key => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).send(errors);
    }
    console.log(error);
    res.status(500).send(error);
  }
};
exports.delete = async (req, res) => {
  try {
    const _id = req.params.id;
    const orders = await ordersModel.findOne({ _id });
    console.log(''+orders.details);
    for (let index = 0; index < orders.details.length; index++) {
      console.log(orders.details[index]);
       await order_detailsModel.findOneAndDelete({_id:orders.details[index]})
    }
    orders.remove();
    res.status(200).json({
      status: 'success',
      data: {
        orders
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
exports.get = async (req, res) => {
  try {
    const _id = req.params.id;
    const orders = await ordersModel.findOne({ _id }).populate(
      {
        path : 'details',
        populate : {
          path : 'seller',
        }
      }
    );
    res.status(200).json({
      status: 'success',
      data: {
        orders
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
exports.get_allorders = async (req, res) => {
  try {
    const token = req.header('Authorization');
    const varified = jwt.verify(token, process.env.TOKEN_SECRET);
    user= await usersModel.findOne({_id:varified._id});
    console.log(varified._id)
    const role_id = user.role_id
    console.log(user.role_id=='0')
    console.log(user.role_id)
    var query = {};
    if (user.role_id=='0') {
      query["customer"] = varified._id
    }
    if (user.role_id=='1') {
      query["seller"] = varified._id
    }
    if (req.body._id) {
      query["_id"] = req.body._id
    }
    if (req.body.status) {
      query["status"] = req.body.status
    }
    console.log(query);
    const orders = await ordersModel.find(query).populate(
      {
        path : 'details',
        populate : [{
          path : 'seller',
          select: 'phone name email',
        },{
          path : ' customer',
          select: 'phone name email',
        },{
          path :'assignservices',
          populate:'services'
        },{
          path:'time_slot'
        }]
      }
    );
    res.status(200).json({
      status: 'success',
      data: {
        orders,
        role_id
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
exports.get_reservation = async (req, res) => {
  try {
    const token = req.header('Authorization');
    const varified = jwt.verify(token, process.env.TOKEN_SECRET);
    console.log('Exppppppppppppppp');
    console.log(new Date().valueOf()/1000);
    var exp_time=(new Date().valueOf()/1000)-300
    var exp =await order_detailsModel.deleteMany({status:0,date: { $lte: exp_time }})
    console.log(exp);
    const orders = await order_detailsModel.find({ customer:varified._id,status:0,seller:req.body.seller}).populate([
      {
        path : 'time_slot',
        populate : {
          path : 'assignservices',
          populate : {
            path : 'services',
          }
        }
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        orders
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
    res.status(500).send(error);
  }
};
