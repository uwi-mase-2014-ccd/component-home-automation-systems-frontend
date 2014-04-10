/*global define */


/**
 *
 * @author ahamidev@gmail.com (Aston Hamilton)
 */


(function() {
  'use strict';

  define([
           'classes/http/APIClient',
           'classes/Router',
           'classes/Utility'], function(APIClient, Router, Utility) {

    function getUsers(query, cb) {
      APIClient.get(
          Router.resolve('get_user_accounts'),
          {
            query: {
              limit: query.size, page: query.page, partial: query.partial
            }
          },
          function(err, data) {
            if (err) {
              cb({
                   message: 'The user accounts could not be retrieved.',
                   error: err
                 });
              return;
            }

            cb(undefined, {
              users: data.users,
              total: data.total
            });
          });
    }

    function getUser(query, cb) {
      APIClient.get(
          Router.resolve('get_user_account', { userId: query.userId }),
          {},
          function(err, data) {
            if (err) {
              cb({
                   message: 'The user account could not be retrieved.',
                   error: err
                 });
              return;
            }

            cb(undefined, {
              user: data.user
            });
          });
    }

    function getUserByUsername(query, cb) {
      APIClient.get(
          Router.resolve('get_user_account_by_username',
                         { username: query.username }),
          {},
          function(err, data) {
            if (err) {
              cb({
                   message: 'The user account could not be retrieved.',
                   error: err
                 });
              return;
            }

            cb(undefined, {
              user: data.user
            });
          });
    }

    function removeUser(query, cb) {
      APIClient.del(
          Router.resolve('remove_user_account', { userId: query.userId }),
          {},
          function(err, data) {
            if (err) {
              cb({
                   message: 'The user account could not be removed.',
                   error: err
                 });
              return;
            }

            cb(undefined, {
              userId: data.userId
            });
          });
    }

    function createUser(user, cb) {
      APIClient.post(Router.resolve('add_user_account'), {
        data: {
          name: user.name,
          username: user.username,
          groupId: user.groupId,
          primaryPassword: user.primaryPassword,
          primaryPassword2: user.primaryPassword2
        }
      }, function(err, data) {
        if (err) {
          cb({
               message: 'The user account could not be added.',
               error: err
             });
          return;
        }

        cb(undefined, {
          user: data.user
        });
      });
    }

    function updateUser(user, cb) {
      APIClient.put(
          Router.resolve('update_user_account', { userId: user.id }),
          {
            data: {
              name: user.name,
              username: user.username,
              groupId: user.groupId,
              primaryPassword: user.primaryPassword,
              primaryPassword2: user.primaryPassword2
            }
          }, function(err, data) {
            if (err) {
              cb({
                   message: 'The user account could not be updated.',
                   error: err
                 });
              return;
            }

            cb(undefined, data);
          });
    }

    function authenticateUser(user, cb) {
    
      APIClient.post(
          'http://localhost/~reneewhitelocke/login-component-dist2/login.php',
          {
          	data: {
          		username: user.username,
          		password: user.password
          	}
          },
          function(err, data) {
            if (err) {
              cb({
                   message: 'The user accounts could not be retrieved.',
                   error: err
                 });
              return;
            }

            cb(undefined, {
              users: data.users,
              total: data.total
            });
          });
    }

    return {
      getUsers: getUsers,
      getUser: getUser,
      getUserByUsername: getUserByUsername,
      removeUser: removeUser,
      createUser: createUser,
      updateUser: updateUser,

      authenticateUser: authenticateUser
    };

  });
}());
