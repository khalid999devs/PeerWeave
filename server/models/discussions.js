module.exports = (sequelize, DataTypes) => {
  const discussions = sequelize.define(
    'discussions',
    {
      user: {
        type: DataTypes.TEXT,
        defaultValue: '{}',
      },
      question: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      filesUrl: {
        type: DataTypes.TEXT,
        defaultValue: '[]',
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

  discussions.associate = (models) => {
    discussions.belongsTo(models.spaces);
    discussions.hasMany(models.msgreplies, {
      foriegnKey: 'discussionId',
      onDelete: 'CASCADE',
    });
  };

  return discussions;
};
