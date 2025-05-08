// Check what routes are registered in your application
const express = require('express');
const app = express();

// Import your auth routes
const authRoutes = require('./routes/auth');

// Register the routes to a mock app
app.use('/api/auth', authRoutes);

// Print out all registered routes
const printRoutes = (stack, basePath = '') => {
  stack.forEach(layer => {
    if (layer.route) {
      // This is a route
      const methods = Object.keys(layer.route.methods)
        .filter(method => layer.route.methods[method])
        .join(', ').toUpperCase();
      console.log(`${methods} ${basePath}${layer.route.path}`);
    } else if (layer.name === 'router' && layer.handle.stack) {
      // This is a router
      const newBase = basePath + (layer.regexp.toString().indexOf('^\\/') !== -1 
        ? layer.regexp.toString().replace(/^\^\\\//, '/').replace(/\\\/\?\(\?\=\\\/\|\$\).*$/, '')
        : '');
      printRoutes(layer.handle.stack, newBase);
    }
  });
};

printRoutes(app._router.stack);

console.log('\nChecking if faculty-login route exists...');
const facultyLoginRoute = app._router.stack
  .filter(layer => layer.name === 'router')
  .flatMap(layer => layer.handle.stack)
  .find(layer => 
    layer.route && 
    layer.route.path === '/faculty-login' && 
    layer.route.methods.post
  );

console.log('Faculty login route found:', !!facultyLoginRoute);