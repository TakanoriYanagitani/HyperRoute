(() => {

  const requestAsync = (url, method, data) => new Promise(requestConsumer => {
    const request = new XMLHttpRequest();
    request.open(method || "GET", url, true);
    request.addEventListener("readystatechange", () => {
      const {
        readyState,
        status,
      } = request || {};
      if(4 != readyState) return;
      if(200 != status) return;
      requestConsumer(request);
    }, false);
    request.send(data);
  });
  
  const getTextAsync = url => requestAsync(url)
    .then(request => {
      const { responseText } = request || {};
      return responseText;
    })
  ;
  
  const iterateAsync = (iterator, consumerAsync) => new Promise(iterated => {
    if(! iterator)      return iterated();
    if(! iterator.next) return iterated();
    if(! consumerAsync) return iterated();
    const loop = {
      const next = iterator.next();
      if(! next)    return iterated();
      if(next.done) return iterated();
      consumerAsync(next.value).then(loop);
    };
    loop();
  });
  
  iterateAsync(
    [
      "https://unpkg.com/react@16/umd/react.development.js",
      "https://unpkg.com/react-dom@16/umd/react-dom.development.js",
      "https://unpkg.com/babel-standalone@6.15.0/babel.min.js",
    ],
    url => new Promise(iterated => {
      const cached = localStorage.getItem(url);
      new Promise(sourceConsumer => {
        if(cached) return sourceConsumer(cached);
        getTextAsync(url).then(sourceConsumer);
      })
      .then(source => {
        localStorage.setItem(url, source || "");
        (new Function(source || ""))();
        iterated();
      });
    })
  ).then(loaded => {
    alert(window.React);
  });
  

  
})()
;
