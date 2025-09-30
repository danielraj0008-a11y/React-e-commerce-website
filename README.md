# E-Commerce Website

A Ecommerce Website made with React.js Framework.


## Demo

https://reactjs-ecommerce-app.vercel.app/

## Features

- Easy to integrate with Backend
- Fully Responsive


## Screenshots

![App Screenshot](https://i.ibb.co/fQ293tm/image.png)




Go to the project directory

```bash
  cd React_E-Commerce
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm start
```



## Tech Stack

* [React](https://reactjs.org/)
* [Redux](https://redux.js.org/)
* [Bootstrap](https://getbootstrap.com/)
* [Fake Store API](https://fakestoreapi.com/)

## Contributing

Contributions are always welcome!
Just raise an issue, we will discuss it.


The build failure is due to an error in the build script that is returning a non-zero exit code.

The specific error in the logs points to warnings being treated as errors due to the process.env.CI = true, with the build script returning a non-zero exit code 2. Additionally, there are ESLint errors in the codebase related to unused variables and unreachable code.

Solution
ESLint Errors:

Address the ESLint errors reported in the files mentioned in the logs:
src/components/Products.jsx: Resolve the 'Link' is defined but never used warning.
src/redux/reducer/handleCart.js: Fix the Unreachable code warnings on lines 16, 25, and 29.
Build Script Error:

Check the npm run build script defined in the netlify.toml configuration or package.json.
Correct any issues in the build script that are causing it to return a non-zero exit code.
Ensure the build script runs without errors and exits with a zero status code.
Warnings as Errors:

If treating warnings as errors is intentional due to process.env.CI = true, address all warnings to allow a successful build.
If treating warnings as errors is not desired, update the build configuration or scripts to not treat warnings as errors.
External Dependencies:

Ensure any external packages or files used in the project are included in the package.json or committed to the repository to prevent dependency-related build failures.
By addressing these steps, the build should complete successfully without errors.



