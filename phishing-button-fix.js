(function(){
function wire(){
  try{
    var sender=document.getElementById('senderBtn');
    var link=document.getElementById('linkBtn');
    var attachment=document.getElementById('attachmentBtn');
    var context=document.getElementById('contextBtn');
    if(sender&&!sender.dataset.fixed){sender.dataset.fixed='1';sender.addEventListener('click',function(){tool('sender')});}
    if(link&&!link.dataset.fixed){link.dataset.fixed='1';link.addEventListener('click',function(){tool('link')});}
    if(attachment&&!attachment.dataset.fixed){attachment.dataset.fixed='1';attachment.addEventListener('click',function(){tool('attachment')});}
    if(context&&!context.dataset.fixed){context.dataset.fixed='1';context.addEventListener('click',function(){tool('context')});}
    document.querySelectorAll('.decision-btn').forEach(function(btn){
      if(btn.dataset.fixed)return;
      btn.dataset.fixed='1';
      btn.addEventListener('click',function(){decide(btn.dataset.choice)});
    });
  }catch(e){}
}
window.addEventListener('load',wire);
setTimeout(wire,300);
setTimeout(wire,1000);
})();