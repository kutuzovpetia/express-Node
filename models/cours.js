// const uuid = require('uuid');
// const fs = require('fs');
// const path = require("path");
//
// class Course {
//
//     constructor(title, price, img) {
//         this.title = title;
//         this.price = price;
//         this.img = img;
//         this.id = uuid.v4();
//
//         this.coursObj = {
//             id: this.id,
//             title: this.title,
//             price: this.price,
//             img: this.img
//         }
//     }
//
//    static async update(course){
//         const courses = await Course.getAll();
//
//         const idx = courses.findIndex(c => c.id === course.id);
//         courses[idx] = course;
//
//        return new Promise((resolve, reject)=>{
//            fs.writeFile(path.join(__dirname, '../data', 'courses.json'),
//                JSON.stringify(courses),
//                (err)=>{
//                    if(err){
//                        reject(err)
//                    }else {
//                        console.log('Переписано!!!');
//                        resolve();
//                    }
//                });
//        })
//     }
//
//     async save(){
//         const courses = await Course.getAll();
//         courses.push(this.coursObj);
//
//         return new Promise((resolve, reject)=>{
//             fs.writeFile(path.join(__dirname, '../data', 'courses.json'),
//                 JSON.stringify(courses),
//                 (err)=>{
//                     if(err){
//                         reject(err)
//                     }else {
//                         console.log('Записано!!!');
//                         resolve();
//                     }
//                 });
//         })
//     }
//
//     static getAll(){
//         return new Promise((resolve, reject)=>{
//             fs.readFile(path.join(__dirname, '../data', 'courses.json'),
//                 'utf-8',
//                 (err, data)=>{
//                     if(err) {
//                         reject(err)
//                     }else {
//                         resolve(JSON.parse(data))
//                     }
//                 })
//         })
//     }
//
//     static async getById(id){
//        const courses = await Course.getAll();
//        return courses.find(c => c.id === id);
//     }
//
//
// }
//
// module.exports = Course;

const {Schema, model} = require('mongoose');
const course = new Schema({
    title : {
        type: String,
        required: true // обезательное поле!
    },
    price: {
        type: Number,
        required: true
    },
    img: {
        type: String,
        required: true
    },
    userId:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

course.method('toClient', function (){
    const course = this.toObject();

    course.id = course._id;
    delete course._id;

    return course
})

module.exports = model('Course', course);