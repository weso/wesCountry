wesCountry.stateful.start({
  elements: [
    {
      name: "region",
      selector: "#select1",
      onChange: function() {
        console.log(this);
      }
    },
    {
      name: "element2",
      selector: "#select2",
      onChange: function() {
        console.log(this);
      }
    }
  ]
});
