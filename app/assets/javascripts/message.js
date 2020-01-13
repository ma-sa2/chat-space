$(function(){

  var buildHTML = function(message) {
    var html_common = `<div class="message" data-message-id=` + message.id + `>` +
                      `<div class="upper-message">` +
                        `<div class="upper-message__user-name">` +
                          message.user_name +
                        `</div>` +
                        `<div class="upper-message__date">` +
                          message.created_at +
                        `</div>` +
                      `</div>`

    var html_content = `<div class="lower-message">` +
                        `<p class="lower-message__content">` +
                          message.content +
                        `</p>`

    var html_image = `<img src="` + message.image + `" class="lower-message__image" >`

    if (message.content && message.image) {
      //data-idが反映されるようにしている
      var html = html_common +
                 html_content +
                 html_image +
                    `</div>` +
                  `</div>`
    } else if (message.content) {
      //同様に、data-idが反映されるようにしている
      var html = html_common +
                 html_content +
                    `</div>` +
                  `</div>`
    } else if (message.image) {
      //同様に、data-idが反映されるようにしている
      var html = html_common +
                    `<div class="lower-message">` +
                 html_image +
                    `</div>` +
                  `</div>`
    };
    return html;
  };
  $('#new_message').on('submit', function(e){
  e.preventDefault();
  var formData = new FormData(this);
  var url = $(this).attr('action')
  $.ajax({
    url: url,
    type: "POST",
    data: formData,
    dataType: 'json',
    processData: false,
    contentType: false
  })
    .done(function(data){
      var html = buildHTML(data);
      $('.messages').append(html);
      $('.messages').animate({ scrollTop: $('.messages')[0].scrollHeight});
      $('form')[0].reset();
      $('.form__submit').prop('disabled', false);
    })
    .fail(function() {
      alert("メッセージ送信に失敗しました");
    });
  })

  var reloadMessages = function() {
    last_message_id = $('.message:last').data("message-id");
    $.ajax({
      url: "api/messages",
      type: 'get',
      dataType: 'json',
      data: {id: last_message_id}
    })
    .done(function(messages) {
      if (messages.length !== 0) {
        var insertHTML = '';
        $.each(messages, function(i, message) {
          insertHTML += buildHTML(message)
        });
        $('.messages').append(insertHTML);
        $('.messages').animate({ scrollTop: $('.messages')[0].scrollHeight});
        $("#new_message")[0].reset();
        $(".form__submit").prop("disabled", false);
      }
    })
    .fail(function() {
    });
  };
  if (document.location.href.match(/\/groups\/\d+\/messages/)) {
    setInterval(reloadMessages, 7000);
  }
});