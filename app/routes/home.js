'use strict';

exports.index = (req, res)=>{
  res.render('home/index', {title: 'Target-Deck: Home'});
};

exports.about = (req, res)=>{
  res.render('home/about', {title: 'Target-Deck: About'});
};

exports.dash = (req, res)=>{
  res.render('home/dash', {title: 'Target-Deck: Dashboard'});
};
