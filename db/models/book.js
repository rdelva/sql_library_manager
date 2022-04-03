const Sequelize = require('sequelize');

module.exports = (sequelize) =>{
    class Book extends Sequelize.Model {}
    Movie.init({
        //Attribute object
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Please enter in a title for the book',
                },
                notEmpty:{
                    msg: 'Please enter in a title for the book',                    
                }
            }            
        },
        author: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Please enter in a title for the book',
                },
                notEmpty:{
                    msg: 'Please enter in a title for the book',                    
                }
            },
        },
        genre: {
            type: Sequelize.STRING,
        },
        year: {
            type: Sequelize.INTEGER,
        }
    }, {
        sequelize
    });
        
    return  Book;
};