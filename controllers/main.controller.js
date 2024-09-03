// Controller index function to render the index page
const index = (req, res) => {
  // Render the 'index' view with an empty object as data
  res.render('index', {});
};

// Export the index function to be used in main modules
module.exports = { index };