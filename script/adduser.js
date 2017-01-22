// 此脚本用于新增duoshuo后台用户
var http = require('request');

var data = {
  'short_name'         : 'willow',     // 你的short_name，后台管理那里可以看到
  'secret'             : '2799541d053b6b08fe0ba278ca94091f',     // 密钥，后台管理那里可以看到
  'users[0][user_key]' : '1',    // 用户在站点的ID，就是后面需要设置的 data-author-key值，可以随意设置，这里默认为1吧
  'users[0][name]'     : '杨威',     // 显示的名字
  'users[0][email]'    : 'revolyw@yeah.net',     // 提醒的邮箱
  'users[0][role]'     : 'author'// 用户的类型，设置为作者
};

http.post({url:'http://api.duoshuo.com/users/import.json', form: data}, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log('Post data to Duoshuo success');
  }
  else{
    console.log('Post data to Duoshuo fail');
  }
});
