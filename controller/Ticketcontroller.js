// controller/Ticketcontroller.js
const asyncHandler = require('express-async-handler');
const User = require('../models/UserModels');
const Ticket = require('../models/TicketModel');

// @desc Get all user tickets (with optional query filters)
// @route GET /api/tickets
// @access Private
const getTickets = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) {
        res.status(401);
        throw new Error('User not found');
    }

    const { product, description, status } = req.query;
    const query = { user: req.user.id };

    if (product) query.product = product.toLowerCase();
    if (description) query.description = { $regex: description, $options: 'i' };
    if (status) query.status = status;

    const tickets = await Ticket.find(query);
    res.status(200).json(tickets);
});

// @desc Get single ticket
// @route GET /api/tickets/:id
// @access Private
const getTicket = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user.id);
    if (!user) {
        res.status(401);
        throw new Error('User not found');
    }

    const ticket = await Ticket.findOne({ _id: req.params.id, user: req.user.id });
    if (!ticket) {
        res.status(404);
        throw new Error('Ticket not found');
    }

    res.status(200).json(ticket);
});

// @desc Create ticket
// @route POST /api/tickets
// @access Private
const createTicket = asyncHandler(async (req, res) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        res.status(400);
        throw new Error('Request body is missing');
    }

    // Normalize keys: remove spaces and lowercase
    const body = {};
    for (let key in req.body) {
        body[key.trim().toLowerCase()] = typeof req.body[key] === 'string' ? req.body[key].trim() : req.body[key];
    }

    const { product, description } = body;

    if (!product || !description) {
        res.status(400);
        throw new Error('Both product and description are required');
    }

    const allowedProducts = ['iphone', 'macbook pro', 'hp elite', 'hp probook'];
    if (!allowedProducts.includes(product.toLowerCase())) {
        res.status(400);
        throw new Error(`Invalid product. Allowed values: ${allowedProducts.join(', ')}`);
    }

    const ticket = await Ticket.create({
        product: product.toLowerCase(),
        description,
        user: req.user.id,
        status: 'new',
    });

    res.status(201).json(ticket);
});

// @desc Update ticket
// @route PUT /api/tickets/:id
// @access Private
const updateTicket = asyncHandler(async (req, res) => {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
        res.status(404);
        throw new Error('Ticket not found');
    }

    if (ticket.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('Not authorized');
    }

    const updatedTicket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedTicket);
});

// @desc Delete ticket
// @route DELETE /api/tickets/:id
// @access Private
const deleteTicket = asyncHandler(async (req, res) => {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) {
        res.status(404);
        throw new Error('Ticket not found');
    }

    if (ticket.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('Not authorized');
    }

    await ticket.deleteOne();
    res.status(200).json({ message: 'Ticket deleted' });
});

module.exports = {
    getTickets,
    getTicket,
    createTicket,
    updateTicket,
    deleteTicket
};
