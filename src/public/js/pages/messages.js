/**
      .                              .o8                     oooo
   .o8                             "888                     `888
 .o888oo oooo d8b oooo  oooo   .oooo888   .ooooo.   .oooo.o  888  oooo
   888   `888""8P `888  `888  d88' `888  d88' `88b d88(  "8  888 .8P'
   888    888      888   888  888   888  888ooo888 `"Y88b.   888888.
   888 .  888      888   888  888   888  888    .o o.  )88b  888 `88b.
   "888" d888b     `V88V"V8P' `Y8bod88P" `Y8bod8P' 8""888P' o888o o888o
 ========================================================================
 Created:    02/10/2015
 Author:     Chris Brame

 **/

define('pages/messages', [
    'jquery',
    'modules/helpers',
    'modules/socket',
    'history'

], function($, helpers, socketClient) {
    var ui = socketClient.ui;
    var messagesPage = {};
    var refreshInterval = null;

    messagesPage.init = function() {
        $(document).ready(function() {
            messagesPage.findActive();
            var messageItem = $('ul.message-items > li:not(.message-folder)');

            messageItem.click(function(e) {
                var target = e.target;
                if (target.tagName.toLowerCase() == 'label' || $(target).is(":checkbox")) return true;

                var self = $(this);
                if (self.hasClass('active')) {
                    return true;
                }

                var id = self.attr('data-messageid');

                messagesPage.loadMessage(id, function(data) {
                    var pageContent = $('.page-content').filter(':first');
                    var page = $(data).find('.page-content').filter(':first').html();

                    messagesPage.clearActive();
                    self.addClass('active');

                    pageContent.html(page);

                    ui.setMessageRead(id);
                });
            });

            var messageItems = $('ul.message-items');
            if (messageItems.length > 0) {
                messagesPage.startRefresh();
            }
        });
    };

    messagesPage.loadMessage = function(id, callback) {
        var rootUrl = History.getRootUrl();
        var msgUrl = rootUrl + 'messages/' + id;
        $.ajax({
            url:        msgUrl,
            type:       'GET',
            success:    function(data) {
                            callback(data);
            },
            error:      function(error) {
                            throw new Error(error);
            }
        });
    };

    messagesPage.clearActive = function() {
        $('ul.message-items > li.active').each(function() {
            var self = $(this);
            self.removeClass('active');
        });
    };

    messagesPage.findActive = function() {
        var path = location.pathname.split('/')[1];
        if (path.toLowerCase() !== 'messages') return;
        var mId = location.pathname.split('/')[2];
        if (!mId) return true;

        var item = $('ul.message-items > li[data-messageId=' + mId + ']');
        if (item) {
            item.addClass('active');
        }
    };

    messagesPage.startRefresh = function() {
        //Refresh Current Folder
        var folder = $('#__folder').html();
        if (refreshInterval) {
            clearInterval(refreshInterval);
        }

        refreshInterval = setInterval(function() {
            if (folder.length < 1) folder = 0;
            ui.sendUpdateMessageFolder(folder);
        }, 5000);
    };

    messagesPage.stopRefresh = function() {
        if (refreshInterval) {
            clearInterval(refreshInterval);
        }
    };

    return messagesPage;
});