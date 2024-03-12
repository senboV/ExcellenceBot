module.exports = (sequelize, DataTypes) => {
	return sequelize.define('settings', {
		name: {
			type: DataTypes.STRING,
			primaryKey: true,
			allowNull: false,
		},
		value: DataTypes.STRING
	}, {
		timestamps: false,
	});
};