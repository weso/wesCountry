var selection = document.getElementById('selection');

wesCountry.stateful.start({
  elements: [
    {
      name: "region",
      selector: "#select1",
      onChange: function() {
        console.log(this);
        selection.innerHTML = 'SELECT 1: ' + this.value;
      }
    },
    {
      name: "element2",
      selector: "#select2",
      onChange: function() {
        console.log(this);
        selection.innerHTML = 'SELECT 2: ' + this.value;
      }
    }
  ]
});
