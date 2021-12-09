const subCategoriesModel = require('../models/subCategoriesModel');
const categoriesModel = require('../models/categoriesModel');
const { token } = require('morgan');

exports.create = async (req, res) => {
  try {
    var cat_id=req.body.categories
    
    const subCategories = await subCategoriesModel.create(req.body);
    var _id=subCategories._id;
    var caregory= await categoriesModel.findOne({_id:cat_id});
    caregory.subcategories.push(_id)
    caregory.save()
    res.status(200).json({
      status: 'success',
      data: {
        subCategories
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
    const subCategories = await subCategoriesModel.find().sort({_id: -1}).populate([
      {
        path : 'services'
      },
      {
        path : 'categories'
      }
    ]
    );
    res.status(200).json({
      status: 'success',
      data: {
        subCategories
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
exports.update = async (req, res) => {
  try {
    const _id = req.params.id;
    const subCategories = await subCategoriesModel.findOneAndUpdate(
      { _id },
      req.body,
      { new: true , runValidators:true}
    );
    res.status(200).json({
      status: 'success',
      data: {
        subCategories
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
    const token = req.header('Authorization');
    const _id = req.params.id;
    const subCategories = await subCategoriesModel.findOneAndDelete({ _id });
    console.log(subCategories);
    const categories = await categoriesModel.findOne({ _id:subCategories.categories });
    console.log(categories);
    console.log(categories.subcategories);
    categories.subcategories.pull(_id);
    categories.save();
    console.log(categories);
    res.status(200).json({
      status: 'success',
      data: {
        subCategories
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
    res.status(500).send('Something went wrong ${errors}');
  }
};
