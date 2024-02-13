module.exports = (sequelize, DataTypes) => {
  const spaces = sequelize.define(
    'spaces',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      desc: {
        type: DataTypes.TEXT,
      },
      stars: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      ownerInfo: {
        type: DataTypes.TEXT,
        defaultValue: '{}',
        allowNull: false,
      },
      settings: {
        type: DataTypes.TEXT,
        defaultValue: '{}',
      },
      info: {
        type: DataTypes.TEXT,
        defaultValue: '{}',
      },
    },
    { timestamps: true }
  );

  spaces.associate = (models) => {
    spaces.belongsTo(models.clients);
    spaces.hasMany(models.clientspaces, {
      foriegnKey: 'spaceId',
      onDelete: 'CASCADE',
    });
    spaces.hasMany(models.resources, {
      foriegnKey: 'spaceId',
      onDelete: 'CASCADE',
    });
    spaces.hasMany(models.discussions, {
      foriegnKey: 'spaceId',
      onDelete: 'CASCADE',
    });
    spaces.hasMany(models.planfolders, {
      foriegnKey: 'spaceId',
      onDelete: 'CASCADE',
    });
    spaces.hasMany(models.whiteboards, {
      foriegnKey: 'spaceId',
      onDelete: 'CASCADE',
    });
  };
  return spaces;
};
