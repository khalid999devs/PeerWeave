module.exports = (sequelize, DataTypes) => {
  const discussions = sequelize.define(
    'discussions',
    {
      owner: {
        type: DataTypes.TEXT,
        defaultValue: '{}',
      },
      text: {
        type: DataTypes.TEXT,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      time: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      replyTo: {
        type: DataTypes.TEXT,
        defaultValue: '{}',
      },
      mentions: {
        type: DataTypes.TEXT,
        defaultValue: '[]',
      },
      filesUrl: {
        type: DataTypes.TEXT,
        defaultValue: '[]',
      },
      parentsUrl: {
        type: DataTypes.TEXT,
        defaultValue: '[]',
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
