const e_walletsModel = require('../models/e_walletsModel');
const transactionModel = require('../models/transactionModel');
const usersModel = require('../models/usersModel');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const bcrypt = require('bcryptjs');
const { token } = require('morgan');
var moment = require('moment');

exports.create_old = async (req, res) => {
  const token = req.header('Authorization');
  try {
    const varified = jwt.verify(token, process.env.TOKEN_SECRET);
    const transaction = await transactionModel.create(req.body);

    const sender= await usersModel.findOne({_id:req.body.sender})
    const receiver= await usersModel.findOne({_id:req.body.receiver}).populate('package')
    var wallet=await e_walletsModel.findOne({_id:receiver.e_wallet[0]})
    console.log(receiver.e_wallet[0]);
      var reseivable_price=req.body.amount
    if (receiver.subscription==2) { 
      if (wallet.ballence>=receiver.package[0].price_2) {
        const admin=await usersModel.findOne({role_id:"2"})
        reseivable_price-=receiver.package[0].price_2;
        var admin_wallets = await e_walletsModel.findOneAndUpdate(
          { _id:admin.e_wallet[0] },
          {$inc : {'ballence' : receiver.package[0].price_2},$push: { transaction: transaction._id }},
          { new: true , runValidators:true}
        );
      }
       
    }

    if (req.body.method=="wallet") {
      console.log('');
      
      // var sender_wallets = await e_walletsModel.findOne({ _id: user._id });
      var sender_wallets = await e_walletsModel.findOneAndUpdate(
        {_id:sender.e_wallet[0]},
        {$inc : {'ballence' : -req.body.amount},$push: { transaction: transaction._id }},
        { new: true , runValidators:true}
      );

      var receiver_wallets = await e_walletsModel.findOneAndUpdate(
        { _id:receiver.e_wallet[0] },
        {$inc : {'ballence' : reseivable_price},$push: { transaction: transaction._id }},
        { new: true , runValidators:true}
      );

    }else if (req.body.method=="Cash")
    { 

    } else {
      var receiver_wallets = await e_walletsModel.findOneAndUpdate(
        { _id:receiver.e_wallet[0]},
        {$inc : {'ballence' : reseivable_price},$push: { transaction: transaction._id }},
        { new: true , runValidators:true}
      );
    }

    res.status(200).json({
      status: true,
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
exports.create = async (req, res) => {
  const token = req.header('Authorization');
  try {
    const varified = jwt.verify(token, process.env.TOKEN_SECRET);

    const sender= await usersModel.findOne({_id:req.body.sender})
    const receiver= await usersModel.findOne({_id:req.body.receiver}).populate('package')
    const admin=await usersModel.findOne({role_id:"2"})
    var seller_wallet=await e_walletsModel.findOne({_id:receiver.e_wallet[0]})
    var paid_price=req.body.amount
    var seller_payment=req.body.amount
    var admin_payment=0
    var seller_due_payment=0
    unix_c_date=moment().valueOf()/1000
    admin_pay=0
    seller_pay=0
    buyer_pay=0
    if (receiver.subscription==2) { 
        admin_payment+=receiver.package[0].price_2;
        seller_payment-=receiver.package[0].price_2;
    }
    if (seller_wallet.ballence<0) { 
        seller_due_payment=seller_wallet.ballence;
    }

    if (req.body.method=="wallet" || req.body.method=="card" ) {
      buyer_pay=paid_price
      if (seller_due_payment==0) {
        admin_pay=admin_payment
        seller_pay=seller_payment
      } else {


        if (seller_due_payment*-1<seller_payment) {
          var seller_var=seller_payment
          var admin_var=admin_payment+(seller_due_payment*-1)
          admin_pay=admin_var
          seller_pay=seller_var

        } else {
          var seller_var=seller_payment
          var admin_var=admin_payment+seller_payment
          admin_pay=admin_var
          seller_pay=seller_var
        }
        
      }
      const transaction_admin = await transactionModel.create(
        {
          "amount":admin_pay,
          "date":unix_c_date,
          "sender":receiver._id,
          "receiver":admin._id,
          "method":"wallet"
        }
      );
      const transaction_user = await transactionModel.create(
        {
          "amount":seller_pay,
          "date":unix_c_date,
          "sender":sender._id,
          "receiver":receiver._id,
          "method":"wallet"
        }
      );
      var admin_wallets = await e_walletsModel.findOneAndUpdate(
        { _id:admin.e_wallet[0] },
        {$inc : {'ballence' : admin_pay},$push: { transaction: transaction_admin._id },date:new Date().getTime() / 1000},
        { new: true , runValidators:true}
      );
      var receiver_wallets = await e_walletsModel.findOneAndUpdate(
        { _id:receiver.e_wallet[0] },
        {$inc : {'ballence' : seller_pay},$pushAll: { transaction:[ transaction_admin._id,transaction_user._id ]},date:new Date().getTime() / 1000},
        { new: true , runValidators:true}
      );
      if (req.body.method=="wallet") {
        var sender_wallets = await e_walletsModel.findOneAndUpdate(
          {_id:sender.e_wallet[0]},
          {$inc : {'ballence' : -buyer_pay},$push: { transaction: transaction_user._id },date:new Date().getTime() / 1000},
          { new: true , runValidators:true}
        );
      }
      
    }else if (req.body.method=="Cash")
    { 
      // if (receiver_wallet.ballence-admin_payment>=0) {
      //   admin_pay=admin_payment
      //     // var admin_wallets = await e_walletsModel.findOneAndUpdate(
      //     //   { _id:admin.e_wallet[0] },
      //     //   {$inc : {'ballence' : admin_payment},$push: { transaction: transaction._id }},
      //     //   { new: true , runValidators:true}
      //     // );
      // } else if (receiver_wallet.ballence>0)  {
      //   admin_pay=receiver_wallet.ballence

      //   // var admin_wallets = await e_walletsModel.findOneAndUpdate(
      //   //   { _id:admin.e_wallet[0] },
      //   //   {$inc : {'ballence' : receiver_wallet.ballence},$push: { transaction: transaction._id }},
      //   //   { new: true , runValidators:true}
      //   // );
      //   seller_pay=-admin_payment
      //   // var receiver_wallets = await e_walletsModel.findOneAndUpdate(
      //   //   { _id:receiver.e_wallet[0] },
      //   //   {$inc : {'ballence' : -admin_payment},$push: { transaction: transaction._id }},
      //   //   { new: true , runValidators:true}
      //   // );
        
      // } else {
      //   seller_pay=-admin_payment

      //   // var receiver_wallets = await e_walletsModel.findOneAndUpdate(
      //   //   { _id:receiver.e_wallet[0] },
      //   //   {$inc : {'ballence' : -admin_payment},$push: { transaction: transaction._id }},
      //   //   { new: true , runValidators:true}
      //   // );
      // }

    }
    
      console.log(33333222221111);
      console.log(admin_pay);
      console.log(seller_pay);
      console.log(buyer_pay);
      console.log(33333222221111);
    res.status(200).json({
      status: true,
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
exports.create_admin = async (req, res) => {
  const token = req.header('Authorization');
  try {
    const varified = jwt.verify(token, process.env.TOKEN_SECRET);
    const transaction = await transactionModel.create(req.body);

    const sender= await usersModel.findOne({_id:req.body.sender})
    const receiver= await usersModel.findOne({role_id:"2"})
    
    console.log(req.body.method);

    if (req.body.method=="wallet") {
      console.log('');
      
      // var sender_wallets = await e_walletsModel.findOne({ _id: user._id });
      var sender_wallets = await e_walletsModel.findOneAndUpdate(
        {_id:sender.e_wallet[0]},
        {$inc : {'ballence' : -req.body.amount},$push: { transaction: transaction._id }},
        { new: true , runValidators:true}
      );

      var receiver_wallets = await e_walletsModel.findOneAndUpdate(
        { _id:receiver.e_wallet[0] },
        {$inc : {'ballence' : req.body.amount},$push: { transaction: transaction._id }},
        { new: true , runValidators:true}
      );
      console.log('33333333333333333333');

    }else if (req.body.method=="Cash") 
    { 

    }else {
      var receiver_wallets = await e_walletsModel.findOneAndUpdate(
        { _id:receiver.e_wallet[0]},
        {$inc : {'ballence' : req.body.amount},$push: { transaction: transaction._id }},
        { new: true , runValidators:true}
      );
      console.log('4444444444444444444444');
    }

    res.status(200).json({
      status: true,
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
exports.create_cash_admin = async (req, res) => {
  const token = req.header('Authorization');
  try {
    const varified = jwt.verify(token, process.env.TOKEN_SECRET);
    const transaction = await transactionModel.create(req.body);

    const sender= await usersModel.findOne({_id:req.body.sender})
    const receiver= await usersModel.findOne({_id:req.body.receiver}).populate('package')
    
    console.log(req.body.method);
      // var sender_wallets = await e_walletsModel.findOne({ _id: user._id });
      var sender_wallets = await e_walletsModel.findOneAndUpdate(
        {_id:sender.e_wallet[0]},
        {$inc : {'ballence' : req.body.amount},$push: { transaction: transaction._id }},
        { new: true , runValidators:true}
      );

        console.log(receiver);
      if (receiver.subscription==2) {
        var receiver_wallets = await e_walletsModel.findOneAndUpdate(
          { _id:receiver.e_wallet[0] },
          {$inc : {'due_ballence' : receiver.package[0].price_2},$push: { transaction: transaction._id }},
          { new: true , runValidators:true}
        );
      }
    

    res.status(200).json({
      status: true,
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
    const transaction = await transactionModel.findOneAndUpdate(
      { _id },
      req.body,
      { new: true , runValidators:true}
    );
    res.status(200).json({
      status: 'success',
      data: {
        transaction
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
exports.get_by_users = async (req, res) => {
  try {
    const _id = req.params.id;
    const user= await usersModel.findOne({_id})
    var query = {};
    if (user.role_id=='0') {
      query["sender"] = _id
    }else{
      query["receiver"] = _id
    }
    const transaction = await transactionModel.find(query).populate([
      {
        path : 'sender',
        select: 'name'
      },
      {
        path : 'receiver',
        select: 'name' 
      }
    ]);
    res.status(200).json({
      status: 'success',
      data: {
        transaction
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
