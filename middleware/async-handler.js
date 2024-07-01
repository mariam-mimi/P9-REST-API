// Defines the asyncHandler to make it accessible everywhere
// Provides callback function asynchronously or passes a global error if needed
exports.asyncHandler = (cb) => {
    return async (req, res, next) => {
      try {
        await cb(req, res, next);
      } catch (error) {
        next(error);
      }
    }
}