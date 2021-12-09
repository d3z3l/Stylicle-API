const servicesModel = require('../models/servicesModel');
const subcategoriesModel = require('../models/subCategoriesModel');
const { token } = require('morgan');

exports.create = async (req, res) => {
  try {
    var cat_id=req.body.subcategories
    const services = await servicesModel.create(req.body);
    var _id=services._id;
    var subcategorie= await subcategoriesModel.findOne({_id:cat_id});
    console.log(subcategorie);
    subcategorie.services.push(_id)
    subcategorie.save()
    res.status(200).json({
      status: 'success',
      data: {
        services
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
    const services = await servicesModel.find().populate([
      {
        path : 'subcategories'
      }
    ]
    );
    res.status(200).json({
      status: 'success',
      data: {
        services
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
exports.get_search = async (req, res) => {
  try {
     var data =req.params.id
    const services = await servicesModel.find({title: { $regex:data, $options: 'i'} })
    res.status(200).json({
      status: 'success',
      data: {
        services
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
    const services = await servicesModel.findOneAndUpdate(
      { _id },
      req.body,
      { new: true , runValidators:true}
    );
    res.status(200).json({
      status: 'success',
      data: {
        services
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
exports.Popular_Services = async (req, res) => {
  try {
    const services = await servicesModel.find({popular:'1'});
    res.status(200).json({
      status: 'success',
        data: {
          services
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
    const categories = await categoriesModel.findOne({ _id:subCategories.categories });
    categories.subCategories.pull(_id);
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
