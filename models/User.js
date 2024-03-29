const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/connection');

class User extends Model {
    checkPassword(loginPw) {
        return bcrypt.compareSync(loginPw, this.password);
    }
}



User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
          email: {
    type: DataTypes.STRING, 
    allowNull: false
  },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            // validate: {
            //     len: [8],
            // },
        },
        date_joined: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW, 
        },
    },
    {
        hooks: {
            beforeCreate: async (newUserData) => {
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                return newUserData;
            },
            beforeUpdate: async (updatedUserData) => {
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                return updatedUserData;
            },
        },
        sequelize,
        timestamps: false, 
        freezeTableName: true,
        underscored: true,
        modelName: 'user', 
    }
);

User.associate = (models) => {
    User.hasMany(models.BlogPost, {
        foreignKey: 'authorId',
    });
    User.hasMany(models.Comment, {
        foreignKey: 'authorId',
    });

    // User.hasMany(models.Comment, {
    //     foreignKey: 'username',
    // });

};
module.exports =  User;
