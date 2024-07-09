module.exports = (sequelize, DataTypes) => {
  const msgreplies = sequelize.define(
    'msgreplies',
    {
      user: {
        type: DataTypes.TEXT,
        defaultValue: '{}',
      },
      mentionedUser: {
        type: DataTypes.TEXT,
        defaultValue: '{}',
      },
      reply: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      filesUrl: {
        type: DataTypes.TEXT,
        defaultValue: '{}',
      },
      likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      disLikes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
    },
    { timestamps: true }
  );

  msgreplies.associate = (models) => {
    msgreplies.belongsTo(models.discussions);
  };

  return msgreplies;
};
