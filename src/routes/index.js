/*
      .                              .o8                     oooo
   .o8                             "888                     `888
 .o888oo oooo d8b oooo  oooo   .oooo888   .ooooo.   .oooo.o  888  oooo
   888   `888""8P `888  `888  d88' `888  d88' `88b d88(  "8  888 .8P'
   888    888      888   888  888   888  888ooo888 `"Y88b.   888888.
   888 .  888      888   888  888   888  888    .o o.  )88b  888 `88b.
   "888" d888b     `V88V"V8P' `Y8bod88P" `Y8bod8P' 8""888P' o888o o888o
 ========================================================================
 **/

var express     = require('express'),
    router      = express.Router(),
    controllers = require('../controllers/index.js'),
    path        = require('path'),
    winston     = require('winston'),
    packagejson = require('../../package.json');

function mainRoutes(router, middleware, controllers) {
    router.get('/', middleware.redirectToDashboardIfLoggedIn, middleware.cache(5*60), controllers.main.index);
    router.get('/install', function(req, res){ return res.redirect('/'); });
    router.get('/dashboard', middleware.redirectToLogin, middleware.loadCommonData, controllers.main.dashboard);

    router.get('/login', middleware.redirectToLogin);
    router.post('/login', controllers.main.loginPost);
    router.get('/l2auth', controllers.main.l2authget);
    router.post('/l2auth', controllers.main.l2AuthPost);
    router.get('/logout', controllers.main.logout);
    router.post('/forgotpass', controllers.main.forgotPass);
    router.get('/resetpassword/:hash', controllers.main.resetPass);

    router.get('/about', middleware.redirectToLogin, middleware.loadCommonData, controllers.main.about);

    router.get('/newissue', controllers.tickets.pubNewIssue);
    router.get('/signup', controllers.accounts.signup);

    //Tickets
    router.get('/tickets', middleware.redirectToLogin, middleware.loadCommonData, controllers.tickets.getActive, controllers.tickets.processor);
    router.get('/tickets/filter', middleware.redirectToLogin, middleware.loadCommonData, controllers.tickets.filter, controllers.tickets.processor);
    router.get('/tickets/active', middleware.redirectToLogin, middleware.loadCommonData, controllers.tickets.getActive, controllers.tickets.processor);
    router.get('/tickets/active/page/:page', middleware.redirectToLogin, middleware.loadCommonData, controllers.tickets.getActive, controllers.tickets.processor);
    router.get('/tickets/new', middleware.redirectToLogin, middleware.loadCommonData, controllers.tickets.getByStatus, controllers.tickets.processor);
    router.get('/tickets/new/page/:page', middleware.redirectToLogin, middleware.loadCommonData, controllers.tickets.getByStatus, controllers.tickets.processor);
    router.get('/tickets/open', middleware.redirectToLogin, middleware.loadCommonData, controllers.tickets.getByStatus, controllers.tickets.processor);
    router.get('/tickets/open/page/:page', middleware.redirectToLogin, middleware.loadCommonData, controllers.tickets.getByStatus, controllers.tickets.processor);
    router.get('/tickets/pending', middleware.redirectToLogin, middleware.loadCommonData, controllers.tickets.getByStatus, controllers.tickets.processor);
    router.get('/tickets/pending/page/:page', middleware.redirectToLogin, middleware.loadCommonData, controllers.tickets.getByStatus, controllers.tickets.processor);
    router.get('/tickets/closed', middleware.redirectToLogin, middleware.loadCommonData, controllers.tickets.getByStatus, controllers.tickets.processor);
    router.get('/tickets/closed/page/:page', middleware.redirectToLogin, middleware.loadCommonData, controllers.tickets.getByStatus, controllers.tickets.processor);
    router.get('/tickets/assigned', middleware.redirectToLogin, middleware.loadCommonData, controllers.tickets.getAssigned, controllers.tickets.processor);
    router.get('/tickets/assigned/page/:page', middleware.redirectToLogin, middleware.loadCommonData, controllers.tickets.getAssigned, controllers.tickets.processor);
    router.get('/tickets/print/:id', middleware.redirectToLogin, middleware.loadCommonData, controllers.tickets.print);
    router.get('/tickets/:id', middleware.redirectToLogin, middleware.loadCommonData, controllers.tickets.single);
    router.post('/tickets/postcomment', middleware.redirectToLogin, controllers.tickets.postcomment);
    router.post('/tickets/uploadattachment', middleware.redirectToLogin, controllers.tickets.uploadAttachment);

    //Messages
    router.get('/messages', middleware.redirectToLogin, middleware.loadCommonData, controllers.messages.get);
    router.get('/messages/startconversation', middleware.redirectToLogin, middleware.loadCommonData, function(req, res, next){ req.showNewConvo = true; next();}, controllers.messages.get);
    router.get('/messages/:convoid', middleware.redirectToLogin, middleware.loadCommonData, controllers.messages.getConversation);
    // router.get('/messages/inbox', middleware.redirectToLogin, middleware.loadCommonData, controllers.messages.get);
    // router.get('/messages/sentitems', middleware.redirectToLogin, middleware.loadCommonData, controllers.messages.getSentItems);
    // router.get('/messages/trash', middleware.redirectToLogin, middleware.loadCommonData, controllers.messages.getTrashItems);
    // router.get('/messages/:id', middleware.redirectToLogin, middleware.loadCommonData, controllers.messages.getById);

    //Calendar
    router.get('/calendar', middleware.redirectToLogin, middleware.loadCommonData, function(req, res){ res.redirect('/dashboard');});

    //Servers
    router.get('/servers', middleware.redirectToLogin, middleware.loadCommonData, controllers.servers.get);

    //Accounts
    router.get('/profile', middleware.redirectToLogin, middleware.loadCommonData, controllers.accounts.profile);
    router.get('/accounts', middleware.redirectToLogin, middleware.loadCommonData, controllers.accounts.get);
    //02/05/2017
    //Removed in 0.1.8 As its Old code before Revamp.
    // router.get('/accounts/create', middleware.redirectToLogin, middleware.loadCommonData, controllers.accounts.createAccount);
    // router.post('/accounts/create', middleware.redirectToLogin, controllers.accounts.postCreate);
    // router.post('/accounts/edit', middleware.redirectToLogin, controllers.accounts.postEdit);
    // router.get('/accounts/edit', middleware.redirectToLogin, function(req, res) { res.redirect('/accounts');});
    // router.get('/accounts/:username', middleware.redirectToLogin, middleware.loadCommonData, controllers.accounts.editAccount);
    router.post('/accounts/uploadimage', middleware.redirectToLogin, controllers.accounts.uploadImage);

    //Groups
    router.get('/groups', middleware.redirectToLogin, middleware.loadCommonData, controllers.groups.get);
    router.get('/groups/create', middleware.redirectToLogin, middleware.loadCommonData, controllers.groups.getCreate);
    router.get('/groups/:id', middleware.redirectToLogin, middleware.loadCommonData, controllers.groups.edit);

    //Reports
    router.get('/reports', middleware.redirectToLogin, middleware.loadCommonData, controllers.reports.overview);
    router.get('/reports/overview', middleware.redirectToLogin, middleware.loadCommonData, controllers.reports.overview);
    router.get('/reports/breakdown', middleware.redirectToLogin, middleware.loadCommonData, controllers.reports.breakdown);
    //router.get('/reports/active', middleware.redirectToLogin, middleware.loadCommonData, controllers.reports.overview);
    //router.get('/reports/inactive', middleware.redirectToLogin, middleware.loadCommonData, controllers.reports.overview);
    //router.get('/reports/completed', middleware.redirectToLogin, middleware.loadCommonData, controllers.reports.overview);

    //Invoices
    router.get('/invoices', middleware.redirectToLogin, middleware.loadCommonData, controllers.invoices.get);

    //Notices
    router.get('/notices', middleware.redirectToLogin, middleware.loadCommonData, controllers.notices.get);
    router.get('/notices/create', middleware.redirectToLogin, middleware.loadCommonData, controllers.notices.create);
    router.get('/notices/:id', middleware.redirectToLogin, middleware.loadCommonData, controllers.notices.edit);

    router.get('/settings', middleware.redirectToLogin, middleware.loadCommonData, controllers.settings.get);
    router.get('/settings/legal', middleware.redirectToLogin, middleware.loadCommonData, controllers.settings.legal);
    router.get('/settings/logs', middleware.redirectToLogin, middleware.loadCommonData, controllers.settings.logs);
    router.get('/settings/tags', middleware.redirectToLogin, middleware.loadCommonData, controllers.settings.tags);
    router.get('/settings/tags/:id', middleware.redirectToLogin, middleware.loadCommonData, controllers.settings.editTag);

    //Plugins
    router.get('/plugins', middleware.redirectToLogin, middleware.loadCommonData, controllers.plugins.get);

    //API
    router.get('/api', controllers.api.index);
    router.get('/api/v1/version', function(req, res) { return res.json({version: packagejson.version }); });
    router.post('/api/v1/login', controllers.api.login);
    router.get('/api/v1/logout', middleware.api, controllers.api.logout);
    router.post('/api/v1/devices/settoken', middleware.api, controllers.api.devices.setDeviceToken);

    router.get('/api/v1/tickets', middleware.api, controllers.api.tickets.get);
    router.get('/api/v1/tickets/search', middleware.api, controllers.api.tickets.search);
    router.post('/api/v1/tickets/create', middleware.api, controllers.api.tickets.create);
    router.get('/api/v1/tickets/types', middleware.api, controllers.api.tickets.getTypes);
    router.post('/api/v1/tickets/addtag', middleware.api, controllers.api.tickets.addTag);
    router.get('/api/v1/tickets/tags', middleware.api, controllers.api.tickets.getTags);
    router.put('/api/v1/tickets/tags/:id', middleware.api, controllers.api.tickets.updateTag);
    router.delete('/api/v1/tickets/tags/:id', middleware.api, controllers.api.tickets.deleteTag);
    router.get('/api/v1/tickets/count/tags', middleware.api, controllers.api.tickets.getTagCount);
    router.get('/api/v1/tickets/count/tags/:timespan', middleware.api, controllers.api.tickets.getTagCount);
    //Removed 4.12.2016 -- v0.1.7
    //router.get('/api/v1/tickets/count/year/:year', middleware.api, controllers.api.tickets.getYearData);
    //router.get('/api/v1/tickets/count/month', middleware.api, controllers.api.tickets.getMonthData);
    router.get('/api/v1/tickets/count/days', middleware.api, controllers.api.tickets.getTicketStats);
    router.get('/api/v1/tickets/count/days/:timespan', middleware.api, controllers.api.tickets.getTicketStats);
    router.get('/api/v1/tickets/count/topgroups', middleware.api, controllers.api.tickets.getTopTicketGroups);
    router.get('/api/v1/tickets/count/topgroups/:top', middleware.api, controllers.api.tickets.getTopTicketGroups);
    router.get('/api/v1/tickets/count/topgroups/:timespan/:top', middleware.api, controllers.api.tickets.getTopTicketGroups);
    router.get('/api/v1/tickets/stats', middleware.api, controllers.api.tickets.getTicketStats);
    router.get('/api/v1/tickets/stats/group/:group', middleware.api, controllers.api.tickets.getTicketStatsForGroup);
    router.get('/api/v1/tickets/stats/:timespan', middleware.api, controllers.api.tickets.getTicketStats);
    router.get('/api/v1/tickets/:uid', middleware.api, controllers.api.tickets.single);
    router.put('/api/v1/tickets/:id', middleware.api, controllers.api.tickets.update);
    router.delete('/api/v1/tickets/:id', middleware.api, controllers.api.tickets.delete);
    router.put('/api/v1/tickets/:id/subscribe', middleware.api, controllers.api.tickets.subscribe);
    router.post('/api/v1/tickets/addcomment', middleware.api, controllers.api.tickets.postComment);
    router.delete('/api/v1/tickets/:tid/attachments/remove/:aid', middleware.api, controllers.api.tickets.removeAttachment);

    router.get('/api/v1/groups', middleware.api, controllers.api.groups.get);
    router.get('/api/v1/groups/all', middleware.api, controllers.api.groups.getAll);
    router.post('/api/v1/groups/create', middleware.api, controllers.api.groups.create);
    router.get('/api/v1/groups/:id', middleware.api, controllers.api.groups.getSingleGroup);
    router.delete('/api/v1/groups/:id', middleware.api, controllers.api.groups.deleteGroup);
    router.put('/api/v1/groups/:id', middleware.api, controllers.api.groups.updateGroup);

    router.get('/api/v1/users', middleware.api, controllers.api.users.getWithLimit);
    router.post('/api/v1/users/create', middleware.api, controllers.api.users.create);
    router.get('/api/v1/users/notificationCount', middleware.api, controllers.api.users.notificationCount);
    router.get('/api/v1/users/getassignees', middleware.api, controllers.api.users.getAssingees);
    router.get('/api/v1/users/:username', middleware.api, controllers.api.users.single);
    router.put('/api/v1/users/:username', middleware.api, controllers.api.users.update);
    router.post('/api/v1/users/:username/uploadprofilepic', controllers.api.users.uploadProfilePic);
    router.put('/api/v1/users/:username/updatepreferences', middleware.api, controllers.api.users.updatePreferences);
    router.get('/api/v1/users/:username/enable', middleware.api, controllers.api.users.enableUser);
    router.delete('/api/v1/users/:username', middleware.api, controllers.api.users.deleteUser);
    router.post('/api/v1/users/:id/generateapikey', middleware.api, controllers.api.users.generateApiKey);
    router.post('/api/v1/users/:id/removeapikey', middleware.api, controllers.api.users.removeApiKey);
    router.post('/api/v1/users/:id/generatel2auth', middleware.api, controllers.api.users.generateL2Auth);
    router.post('/api/v1/users/:id/removel2auth', middleware.api, controllers.api.users.removeL2Auth);

    router.get('/api/v1/roles', middleware.api, controllers.api.roles.get);

    router.get('/api/v1/messages', middleware.api, controllers.api.messages.get);
    router.post('/api/v1/messages/conversation/start', middleware.api, controllers.api.messages.startConversation);
    router.get('/api/v1/messages/conversation/:id', middleware.api, controllers.api.messages.getMessagesForConversation);
    router.delete('/api/v1/messages/conversation/:id', middleware.api, controllers.api.messages.deleteConversation);
    router.get('/api/v1/messages/conversations', middleware.api, controllers.api.messages.getConversations);
    router.get('/api/v1/messages/conversations/recent', middleware.api, controllers.api.messages.getRecentConversations);
    router.post('/api/v1/messages/send', middleware.api, controllers.api.messages.send);

    router.post('/api/v1/notices/create', middleware.api, controllers.api.notices.create);
    router.get('/api/v1/notices/clearactive', middleware.api, controllers.api.notices.clearActive);
    router.put('/api/v1/notices/:id', middleware.api, controllers.api.notices.updateNotice);
    router.delete('/api/v1/notices/:id', middleware.api, controllers.api.notices.deleteNotice);

    router.put('/api/v1/settings', middleware.api, controllers.api.settings.updateSetting);
    router.post('/api/v1/settings/testmailer', middleware.api, controllers.api.settings.testMailer);

    router.post('/api/v1/public/users/checkemail', controllers.api.users.checkEmail);
    router.post('/api/v1/public/tickets/create', controllers.api.tickets.createPublicTicket);
    router.post('/api/v1/public/account/create', controllers.api.users.createPublicAccount);

    if (global.env === 'development') {
        router.get('/debug/message', function(req, res) {
            var mSchema = require('../models/chat/message');
            var Message = new mSchema({
                conversationId: '5836942a2d302233741073b1',
                body: 'Test Message',
                owner: req.user._id
            });

            Message.save(function(err) {
                if (err) return res.status(400).json({err: err});
                return res.json({success: true});
            })
        });

        router.get('/debug/sendmail', controllers.debug.sendmail);
        //router.get('/api/v1/import', middleware.api, controllers.api.import);
        router.get('/debug/cache/refresh', function (req, res) {
            var _ = require('underscore');

            var forkProcess = _.findWhere(global.forks, {name: 'cache'});
            forkProcess.fork.send({name: 'cache:refresh'});

            res.send('OK');
        });

        router.get('/debug/plugin', function (req, res) {
            return res.render('pluginTest');
        });
        router.post('/debug/uploadplugin', controllers.debug.uploadPlugin);

        router.get('/debug/devices/testiOS', middleware.api, controllers.api.devices.testApn);
        router.get('/debug/restart', function (req, res) {
            var pm2 = require('pm2');
            pm2.connect(function(err) {
                if (err) {
                    winston.error(err);
                    res.status(400).send(err);
                    return;
                }
                pm2.restart('trudesk', function(err) {
                    if (err) {
                        res.status(400).send(err);
                        return winston.error(err);
                    }

                    pm2.disconnect();
                    res.send('OK');
                });
            });
        });
    }
}

module.exports = function(app, middleware) {
    //Docs
    app.use('/docs', express.static(path.join(__dirname, '../../', 'docs')));
    app.use('/apidocs', express.static(path.join(__dirname, '../../', 'apidocs')));

    mainRoutes(router, middleware, controllers);
    app.use('/', router);

    app.use(handle404);
    app.use(handleErrors);

    //Load Plugin routes
    var dive = require('dive');
    var fs = require('fs');
    var pluginDir = path.join(__dirname, '../../plugins');
    if (!fs.existsSync(pluginDir)) fs.mkdirSync(pluginDir);
    dive(pluginDir, {directories: true, files: false, recursive: false}, function(err, dir) {
        if (err) throw err;
        var pluginRoutes = require(path.join(dir, '/routes'));
        pluginRoutes(router, middleware);
    });
};

function handleErrors(err, req, res) {
    var status = err.status || 500;
    res.status(status);

    if (status == 404) {
        winston.debug(err.message);
        res.render('404', {layout: false});
        return;
    }

    if (status == 503) {
        res.render('503', {layout: false});
        return;
    }

    winston.warn(err.stack);

    res.render('error', {
        message: err.message,
        error: err,
        layout: false
    });

}

function handle404(req, res, next) {
    var err = new Error('Not Found: ' + req.protocol + '://' + req.hostname + req.path);
    err.status = 404;

    next(err);
}
