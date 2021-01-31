const Category = require('../models/Category');
const Bank = require('../models/Bank');
const fs = require('fs-extra');
const path = require('path');

module.exports = {
    viewDashboard: (req, res) => {
        res.render('admin/dashboard/view_dashboard.ejs', { title: 'Staycation | Dashboard' })
    },

    // CATEGORY
    viewCategory: async (req, res) => {
        try {
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = { message: alertMessage, status: alertStatus }
            const category = await Category.find();
            res.render('admin/category/view_category.ejs', { category, alert, title: 'Staycation | Category' })
        } catch (error) {
            res.redirect('/admin/category');
        }

    },

    addCategory: async (req, res) => {
        try {
            const { name } = req.body;
            await Category.create({ name });
            req.flash('alertMessage', 'Success Add Category');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/category');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/category');
        }
    },

    editCategory: async (req, res) => {
        try {
            const { id, name } = req.body;
            const category = await Category.findOne({ _id: id });
            category.name = name;
            await category.save();
            req.flash('alertMessage', 'Success Update Category');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/category')
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/category');
        }
    },

    deleteCategory: async (req, res) => {
        try {
            const { id } = req.params;
            const category = await Category.findOne({ _id: id });
            await category.remove();
            req.flash('alertMessage', 'Success Delete Category');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/category');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/category');
        }
    },

    // BANK
    viewBank: async (req, res) => {
        try {
            const bank = await Bank.find()
            const alertMessage = req.flash('alertMessage');
            const alertStatus = req.flash('alertStatus');
            const alert = { message: alertMessage, status: alertStatus }
            res.render(
                'admin/bank/view_bank.ejs',
                { title: 'Staycation | Bank', alert, bank }
            )
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/bank');
        }
    },

    addBank: async (req, res) => {
        try {
            const { name, nameBank, nomorRekening } = req.body;
            await Bank.create({
                name,
                nameBank,
                nomorRekening,
                imageUrl: `images/${req.file.filename}`
            });
            req.flash('alertMessage', 'Success Add Bank');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/bank');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/bank');
        }
    },

    editBank: async (req, res) => {
        try {
            const { id, nameBank, nomorRekening, name } = req.body;
            const bank = await Bank.findOne({ _id: id });
            if (req.file == undefined) {
                bank.name = name;
                bank.nomorRekening = nomorRekening;
                bank.nameBank = nameBank;
                await bank.save();
                req.flash('alertMessage', 'Success Update Bank');
                req.flash('alertStatus', 'success');
                res.redirect('/admin/bank');
            } else {
                await fs.unlink(path.join(`public/${bank.imageUrl}`));
                bank.name = name;
                bank.nomorRekening = nomorRekening;
                bank.nameBank = nameBank;
                bank.imageUrl = `images/${req.file.filename}`;
                await bank.save();
                req.flash('alertMessage', 'Success Update Bank');
                req.flash('alertStatus', 'success');
                res.redirect('/admin/bank');
            }
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/bank');
        }
    },

    deleteBank: async (req, res) => {
        try {
            const { id } = req.params;
            const bank = await Bank.findOne({ _id: id });
            await fs.unlink(path.join(`public/${bank.imageUrl}`));
            await bank.remove();
            req.flash('alertMessage', 'Success delete Bank');
            req.flash('alertStatus', 'success');
            res.redirect('/admin/bank');
        } catch (error) {
            req.flash('alertMessage', `${error.message}`);
            req.flash('alertStatus', 'danger');
            res.redirect('/admin/bank');
        }
    },

    viewItem: (req, res) => {
        res.render('admin/item/view_item.ejs', { title: 'Staycation | Item' })
    },

    viewBooking: (req, res) => {
        res.render('admin/booking/view_booking.ejs', { title: 'Staycation | Booking' })
    }
}