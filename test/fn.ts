export function test(value: any) {

    const errors = []
    
    
    
    if (typeof value !== "object" || value === null || Array.isArray(value)) {
      errors.push({
        valuePath: `value`,
        msg: "Should be an object (non null and not an array).",
        type: "std/testRecord1",
      })
    }
   else {
      
        if (typeof value.first === "undefined" || value.first === null) {
          errors.push({
            valuePath: `value.first`,
            msg: "Is a required property.",
            type: "std/testRecord1",
          })
        }    
      


        if (typeof value.second === "undefined" || value.second === null) {
          errors.push({
            valuePath: `value.second`,
            msg: "Is a required property.",
            type: "std/testRecord1",
          })
        }    
      
      
    for (const key of Object.keys(value)) {
      if (!["first", "second", "third"].includes(key)) {
        errors.push({
          valuePath: `value`,
          msg: `Contains unrecognised property: ${key}.`,
          type: "std/testRecord1",
        })
      }
    }
  
      
      if (typeof value.first !== 'undefined') {
        
        
        if (!Array.isArray(value.first)) {
          errors.push({
            valuePath: `value.first`,
            msg: "Must be an array.",
            type: "std/testRecord1",
          })
        }
      


        for (let idx_value_first = 0; idx_value_first < value.first.length; idx_value_first++) {
          
    
    if (typeof value.first[idx_value_first] !== "number") {
      errors.push({
        valuePath: `value.first[${idx_value_first}]`,
        msg: "Should be a number.",
        type: "std/positiveInteger",
      })
    }
   else {
      
    if (!Number.isInteger(value.first[idx_value_first])) {
      errors.push({
        valuePath: `value.first[${idx_value_first}]`,
        msg: "Should be a whole number.",
        type: "std/positiveInteger",
      })        
    }
  
      
    if (value.first[idx_value_first] < 1) {
      errors.push({
        valuePath: `value.first[${idx_value_first}]`,
        msg: "Should be greater than or equal to 1.",
        type: "std/positiveInteger",
      })
    }
  
      
  if (value.first[idx_value_first] > 2147483647) {
    errors.push({
      valuePath: `value.first[${idx_value_first}]`,
      msg: "Should be less than or equal to 2147483647.",
      type: "std/positiveInteger",
    })
  }

    }
  
        }
      
      }
    


      if (typeof value.second !== 'undefined') {
        
        
    
    if (typeof value.second !== "string") {
      errors.push({
        valuePath: `value`,
        msg: "Should be a string.",
        type: "std/dateTimeUtc",
      })
    }
   else {
      
      if (value.second.length < 29) {
        errors.push({
          valuePath: `value`,
          msg: "Should have 29 or more characters.",
          type: "std/dateTimeUtc",
        })
      }     
    
      
    if (value.second.length > 29) {
      errors.push({
        valuePath: `value`,
        msg: "Should have 29 or less characters.",
        type: "std/dateTimeUtc",
      })
    }    
  
      
      if (!/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}[.][0-9]{3}[+][0-9]{2}:[0-9]{2}$/.test(value.second)) {
        errors.push({
          valuePath: `value`,
          msg: "Should match regex pattern ^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}[.][0-9]{3}[+][0-9]{2}:[0-9]{2}$.",
          type: "std/dateTimeUtc",
        })
      }      
    
    }
  
      }
    


      if (typeof value.third !== 'undefined') {
        
        if (value.third !== "333") {
          errors.push({
            valuePath: `value.third`,
            msg: "Must be constant value: 333.",
            type: "std/testRecord1",
          })
        }
      
        
    
    if (typeof value.third !== "string") {
      errors.push({
        valuePath: `value`,
        msg: "Should be a string.",
        type: "std/shortString",
      })
    }
   else {
      
      
    if (value.third.length > 20) {
      errors.push({
        valuePath: `value`,
        msg: "Should have 20 or less characters.",
        type: "std/shortString",
      })
    }    
  
      
    }
  
      }
    
    }
  

    return errors
  
}