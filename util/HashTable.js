function HashTable(obj)
{
    this.length = 0;
    var items = {};
    var keys = new SortedArray();
    
    
    for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
            items[p] = obj[p];
            this.length++;
        }
    }

    this.setItem = function(key, value)
    {
        var previous = undefined;
        
        if (keys.search(key) != -1) {
            previous = items[key];
        }
        else {
            this.length++;
        }
        
        items[key] = value;
        keys.uniqueInsert(key);
        
        return previous;
    }

    this.getItem = function(key) {
        return keys.search(key) != -1 ? items[key] : undefined;
    }

    this.hasItem = function(key)
    {
        return keys.search(key) != -1;
    }
   
    this.removeItem = function(key)
    {
        if (keys.search(key) != -1) {
            previous = items[key];
            this.length--;
            delete items[key];
            keys.remove(key);
            
            return previous;
        }
        else {
            return undefined;
        }
    }

    this.keys = function()
    {
        return keys;
    }

    this.values = function()
    {
        var values = [];
        var key;
        
        for (var i = 0; i < keys.getArray().length; i++) {
	        key = keys.getArray()[i];
            values.push(items[key]);
        }
        
        return values;
    }

    this.each = function(fn) {
        for (var k in keys) {
                fn(k, items[k]);
        }
    }

    this.clear = function()
    {
        items = {}
        keys = new SortedArray();
        this.length = 0;
    }
}