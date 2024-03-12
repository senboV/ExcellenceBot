module.exports = (sequelize, DataTypes) => {
	return sequelize.define('excellencePosts', {
		guild_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
        message_id: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		embed_id: DataTypes.STRING
	}, {
		timestamps: false,
	});
};
