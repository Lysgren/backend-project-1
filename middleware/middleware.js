const Logger = (req, res, next) => {
  console.log(`Handling request for ${req.method} ${req.path}`)
  next()
}

module.exports = {
  Logger
}