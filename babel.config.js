module.exports = {
    "env": {
        "test": {
            // required for jest to load d3-flame-graph which uses ES6 syntax
            "plugins": ["@babel/plugin-transform-modules-commonjs"]
        }
    }
};
