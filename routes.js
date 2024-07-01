"use strict";

const express = require("express");
const router = express.Router();
const User = require("./models").User;
const Course = require("./models").Course;
const { asyncHandler } = require("./middleware/async-handler");
const { authenticateUser } = require("./middleware/auth-user");

// USER GET route:  Returns the currently authenticated use using id, first name, last name, and email
router.get("/users", authenticateUser, asyncHandler(async (req, res) => {
      const user = req.currentUser;
      res.status(200).json({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        emailAddress: user.emailAddress,
      });
    })
  );

// USER POST route: Creates a user, sets the Location header to "/", and returns no content 
router.post('/users', asyncHandler(async (req, res) => {
    try {
    // password hashed in the user Sequelize model!
    await User.create(req.body);
    res.status(201).set('Location', `/`).end();
    } catch (err) {
    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
        const errors = err.errors.map(err => err.message);
        res.status(400).json({ errors });   
    } else {
        throw error;
    }
    }
}));

// COURSES GET route: Returns a list of courses (including the associated User object)
router.get("/courses", asyncHandler(async (req, res) => {
    const courses = await Course.findAll({
        attributes: {
        exclude: ["createdAt", "updatedAt"],
        },
        include: [
        {
            model: User,
            attributes: ["id", "firstName", "lastName", "emailAddress"],
        },
        ],
    });
    if (courses) {
        res.status(200).json(courses);
    } else {
        res.status(404).json({ message: "Courses not found" });
    }
    })
);

// COURSES GET route: Returns the course (including the associated User object with each course) for the provided course ID
router.get("/courses/:id", asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id, {
    attributes: {
        exclude: ["createdAt", "updatedAt"],
    },
    include: [
        {
        model: User,
        attributes: ["id", "firstName", "lastName", "emailAddress"],
        },
    ],
    });
    if (course) {
    res.status(200).json(course);
    } else {
    res.status(404).json({ message: "Course not found" });
    }
})
);

// COURSES POST route: Creates a course, sets the Location header to the URI for the course, and returns no content while authenticating user
router.post("/courses", authenticateUser, asyncHandler(async (req, res) => {
    try {
    const course = await Course.create(req.body);
    res.status(201).location(`/courses/${course.id}`).end();
    } catch (error) {
    if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
    ) {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
    } else {
        throw error;
    }
    }
})
);

// COURSES PUT route: Updates a course and returns no content, making sure to authenticate user
router.put("/courses/:id", authenticateUser, asyncHandler(async (req, res) => {
    try {
    const course = await Course.findByPk(req.params.id);
    if (course) {
        if (course.userId == req.currentUser.id) {
        await course.update(req.body);
        res.status(204).location(`/courses/${course.id}`).end();
        } else {
        res
            .status(403)
            .json({ message: "Access denied. You are not the course owner" });
        }
    } else {
        res.status(404).json({ message: "Course not found" });
    }
    } catch (error) {
    if (
        error.name === "SequelizeValidationError" ||
        error.name === "SequelizeUniqueConstraintError"
    ) {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
    } else {
        throw error;
    }
    }
})
);

// COURSES DELETE route: Deletes a course and returns no content, also must authenticates user
router.delete("/courses/:id", authenticateUser, asyncHandler(async (req, res) => {
    try {
    const course = await Course.findByPk(req.params.id);
    if (course) {
        if (course.userId == req.currentUser.id) {
        await course.destroy();
        res.status(204).end();
        } else {
        res
            .status(403)
            .json({ message: "Access denied. You are not the course owner" });
        }
    } else {
        res.status(404).json({ message: "Course not found" });
    }
    } catch (error) {
    console.log(error);
    }
})
);
  
module.exports = router;