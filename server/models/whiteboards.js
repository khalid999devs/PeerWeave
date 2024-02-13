module.exports = (sequelize, DataTypes) => {
  const whiteboards = sequelize.define(
    'whiteboards',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      desc: {
        type: DataTypes.TEXT,
      },
      settings: {
        type: DataTypes.TEXT,
        defaultValue: '{}',
      },
      fileURL: {
        type: DataTypes.STRING,
      },
      subFilesURL: {
        type: DataTypes.TEXT,
        defaultValue: '[]',
      },
    },
    { timestamps: true }
  );

  whiteboards.associate = (models) => {
    whiteboards.belongsTo(models.spaces);
  };
  return whiteboards;
};
