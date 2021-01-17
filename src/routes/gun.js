// // ./src/svelte-gun.js
// import Gun from "gun"

// Gun.chain.subscribe = function(publish) {
//   var gun = this
//   var at = gun._
//   var isMap = !!at && !!at.back && !!at.back.each

//   if (isMap) {
//     var store = new Map()
//     publish(Array.from(store))
//     gun = gun.on((data, _key, as) => {
//       var key = _key || ((data||{})._||{})['#'] || as.via.soul
//       if (data === null) {
//         store.delete(key)
//       } else {
//         store.set(key, data)
//       }
//       publish(Array.from(store))
//     })
//   } else {
//     gun = gun.on(data => publish(data))
//   }

//   return gun.off
// }
// export const gun = Gun('https://ivlivs.it/gun').get('giulio.malventi@gmail.com')
// export default Gun

// import Gun from "gun"
// export const gun = Gun('https://ivlivs.it/gun:8765').get('giulio.malventi@gmail.com')

// import Gun from "gun"
// const gun = Gun('https://ivlivs.it/gun').get('giulio.malventi@gmail.com')

// function customStore(ref, methods = {}) {
//   const store = {}
//   const subscribers = []

//   // Add a listener to GUN data
//   ref.on(function(data, key) {
//       /* If the ref._get matches the data key it means we are getting
//        * data from a call to gun.get(), and so we don't need the store
//        * to be an object with nested data. Otherwise we are getting data
//        * from a call to map() and should nest the data in an object
//        */
//       if (ref._.get === key) {
//         store = data
//       } else if (!data) {
//         /* This clause will not work as intended on null values / false / 0
//          * if you use such data consider subscribing to a parent node instead
//          * eg. gun.get("temperature") instead of gun.get("temperature").get("value").
//          * Or you can pass a validate() function (TODO: add example)
//          */
//         delete store[key]  
//       } else {
//          store[key] = data
//       }
//       // Tell each subscriber that data has been updated
//       for (let i = 0; i < subscribers.length; i += 1) {
//         subscribers[i](store)
//       }
//   })


//   function subscribe(subscriber) {
//     subscribers.push(subscriber)

//     // Publish initial value
//     subscriber(store)

//     // return cleanup function to be called on component dismount
//     return () => {
//       const index = subscribers.indexOf(subscriber)
//       if (index !== -1) {
//         subscribers.splice(index, 1)
//       }
//       if (!subscribers.length) {
//         ref.off()
//       }
//     }
//   }

//   return { ...methods, subscribe }
// }

// const counters_ref = gun.get("counters")
// export const counters = customStore(counters_ref.map(), {
//   add: value => counters_ref.set(value),
//   delete: key => counters_ref.get(key).put(null)
// })