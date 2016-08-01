Salmon = Salmon || {};
Salmon.Global = Salmon.Global || {};

Salmon.Global.ErrorMessage = (function(message) {
  // console.log(message); 

  if (!message) return;
  if (typeof message !== "string") return;
  if (message === "") return;

  if (!Adoro.Dialogue) {
    alert(message);
  } else {
    var // $dialogue = $(document.createElement("div")).addClass("ajaxError"),
      $container = $(document.createElement("div")).addClass("ajaxErrorContainer"),
      $message = $(document.createElement("p")).html(message);
    /* ,
			$ok = $(document.createElement("div")).addClass("ok").append("<a href='#close'>OK</a>"); */

    /*
    $ok.bind("click", function() {
    	Adoro.Dialogue.hideDialogue();
    	return false;
    });
    */

    // $dialogue.append($container.append($message).append($ok));
    $container.append($message);

    // Adoro.Dialogue.setHtml($dialogue.get(0));
    Adoro.Dialogue.setHtml($container.get(0));
    Adoro.Dialogue.showDialogue();
  }
});
