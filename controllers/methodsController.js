const methodsModel = require('../models/methodsModel');

exports.create = async (req, res) => {
  try {
    const packages = await methodsModel.create(req.body);
    packages.save();
    res.status(200).json({
      status: 'success',
      data: {
        packages
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
    const packages = await methodsModel.findOneAndUpdate(
      { _id },
      req.body,
      { new: true , runValidators:true}
    );
    res.status(200).json({
      status: 'success',
      data: {
        packages
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
exports.delete = async (req, res) => {
  try {
    const _id = req.params.id;
    const packages = await methodsModel.findOneAndDelete({ _id });
    res.status(200).json({
      status: 'success',
      data: {
        packages
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
exports.getAll = async (req, res) => {
  try {
    const _id = req.params.id;
    const packages = await methodsModel.find().populate(
      {
        path : 'features',
       
      }
    );
    res.status(200).json({
      status: 'success',
      
      data: {
        packages
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
    const _id = req.params.id;
    const packages = await methodsModel.findOne({ _id }).populate(
      {
        path : 'features',
       
      }
    );
    res.status(200).json({
      status: 'success',
      
      data: {
        packages
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