const packagesModel = require('../models/packagesModel');

exports.create = async (req, res) => {
  try {
    const packages = await packagesModel.create(req.body);
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
    const packages = await packagesModel.findOneAndUpdate(
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
    const packages = await packagesModel.findOneAndDelete({ _id });
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
    const packages = await packagesModel.find().populate(
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
    const packages = await packagesModel.findOne({ _id }).populate(
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