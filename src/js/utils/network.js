var es6promise = require('promise');
var promise = es6promise.Promise;

function jsonParse(value) {
    if (typeof value === 'string') {
        return JSON.parse(value);
    }
    return value;
}

function _errorHandle(error){
    throw error;
}

function _errorUnhandle(error){
    throw error;
}

module.exports={
    /**
     * options
     * @param   url      
     * @param   data     
     * @param   success 
     * @param   err     
     * @param   promise           
     */
    ajax: function(options){
        options.error = options.error || _errorUnhandle;
        if(!!options.promise){
            return new promise(function(resolve,reject){
                $.ajax({
                    url: options.url,
                    data: options.data,
                    success: function(data){
                        resolve(data);                        
                    },
                    error: function(error){
                        reject(error);
                    },
                    type: options.type||'get'
                })
            })
            .then(jsonParse)
            .then(options.success)
            ['catch'](_errorHandle)
            ['catch'](options.error)
        }else{
            $.ajax({
                url: options.url,
                data: options.data,
                success: options.success,
                error: options.error,
                type: options.type||'get'
            })
        }
    }
}