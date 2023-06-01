USE master DROP DATABASE Recipes CREATE DATABASE Recipes USE Recipes CREATE TABLE Users (
    UserId INT IDENTITY(1, 1) PRIMARY KEY,
    Username VARCHAR(50) UNIQUE NOT NULL,
    Password VARCHAR(256) NOT NULL,
    Description TEXT DEFAULT 'Default description',
    ProfilePicture TEXT,
    Name VARCHAR(60),
    Email VARCHAR(200),
    Role VARCHAR(20) NOT NULL DEFAULT 'user',
    CreatedAt DATETIME NOT NULL
);

CREATE TABLE Following(
    UserId INT PRIMARY KEY,
    FollowingCount INT NOT NULL DEFAULT 0,
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE ON UPDATE CASCADE
) CREATE TABLE Chef(
    ChefId INT NOT NULL,
    PRIMARY KEY(ChefId),
    FOREIGN KEY (ChefId) REFERENCES Following(UserId) ON DELETE CASCADE ON UPDATE CASCADE,
    FollowersCount INT NOT NULL DEFAULT 0,
    AverageRating INT DEFAULT NULL,
    WorksAt VARCHAR(150),
    Experience FLOAT
);

INSERT INTO
    Users(Username, Password, CreatedAt)
VALUES
    ('dea', 'arlind', GETDATE());

INSERT INTO
    Users(Username, Password, CreatedAt)
VALUES
    ('rinesa', 'arlind', GETDATE());

INSERT INTO
    Users(Username, Password, CreatedAt)
VALUES
    ('rina', 'arlind', GETDATE());

INSERT INTO
    Users(Username, Password, CreatedAt)
VALUES
    ('erblin', 'arlind', GETDATE());

INSERT INTO
    Users(Username, Password, CreatedAt)
VALUES
    ('leart', 'arlind', GETDATE());

INSERT INTO
    Users(Username, Password, CreatedAt)
VALUES
    ('mehdi', 'arlind', GETDATE());

INSERT INTO
    Users(Username, Password, CreatedAt)
VALUES
    ('argjend', 'arlind', GETDATE());

INSERT INTO
    Users(Username, Password, CreatedAt)
VALUES
    ('ardian', 'arlind', GETDATE());

INSERT INTO
    Users (Username, Password, CreatedAt, Role)
VALUES
    ('fillonit', 'fillonit', GETDATE(), 'admin');

SELECT
    *
FROM
    Users
UPDATE
    Users
SET
    Role = 'chef'
WHERE
    Username = 'mehdi' CREATE TABLE Normal_User(
        UserId INT NOT NULL,
        PRIMARY KEY(UserId),
        FOREIGN KEY(UserId) REFERENCES Users(UserId) ON DELETE CASCADE ON UPDATE CASCADE
    );

CREATE TABLE Admin(
    AdminId INT NOT NULL,
    PRIMARY KEY(AdminId),
    FOREIGN KEY(AdminId) REFERENCES Users(UserId) ON DELETE CASCADE ON UPDATE CASCADE,
    DeletedCount INT NOT NULL DEFAULT 0,
    EditedCount INT NOT NULL DEFAULT 0
);

CREATE TABLE Cuisine (
    CuisineId INT IDENTITY(1, 1) PRIMARY KEY,
    Name VARCHAR(50) NOT NULL
);

INSERT INTO
    Cuisine(Name)
VALUES
    ('Italian');

INSERT INTO
    Cuisine(Name)
VALUES
    ('Spanish');

INSERT INTO
    Cuisine(Name)
VALUES
    ('Latino');

INSERT INTO
    Cuisine(Name)
VALUES
    ('Chinese');

INSERT INTO
    Cuisine(Name)
VALUES
    ('Japanese');

INSERT INTO
    Cuisine(Name)
VALUES
    ('Albanian');

INSERT INTO
    Cuisine(Name)
VALUES
    ('Swiss');

INSERT INTO
    Cuisine(Name)
VALUES
    ('France');

CREATE TABLE Recipes (
    RecipeId INT IDENTITY(1, 1) PRIMARY KEY,
    Title VARCHAR(100) NOT NULL,
    Description VARCHAR(500) NOT NULL,
    ImageUrl VARCHAR(400),
    PreparationTime INT NOT NULL,
    CookTime INT NOT NULL,
    Servings INT NOT NULL,
    ChefId INT NOT NULL,
    CreatedAt DATETIME NOT NULL,
    UpdatedAt DATETIME DEFAULT NULL,
    Views INT NOT NULL DEFAULT 0,
    Rating INT DEFAULT NULL,
    NumberOfRatings INT DEFAULT 0,
    CuisineId INT NOT NULL,
    AdminUpdatedAt DATETIME DEFAULT NULL,
    Edited BIT NOT NULL DEFAULT 0,
    FOREIGN KEY (ChefId) REFERENCES Chef(ChefId) ON DELETE CASCADE,
    FOREIGN KEY (CuisineId) REFERENCES Cuisine(CuisineId) ON DELETE CASCADE
);

CREATE TABLE UnitType(UnitType VARCHAR(20) PRIMARY KEY NOT NULL,);

INSERT INTO
    UnitType(UnitType)
VALUES
    ('Mass');

INSERT INTO
    UnitType(UnitType)
VALUES
    ('Volume');

INSERT INTO
    UnitType(UnitType)
VALUES
    ('Quantity');

CREATE TABLE Units(
    UnitType VARCHAR(20) NOT NULL,
    FOREIGN KEY (UnitType) REFERENCES UnitType(UnitType),
    Unit VARCHAR(20) PRIMARY KEY NOT NULL,
    UnitName VARCHAR(20) NOT NULL,
    ValueInStandardUnit FLOAT NOT NULL
);

INSERT INTO
    Units(UnitType, Unit, UnitName, ValueInStandardUnit)
VALUES
    ('Mass', 'KG', 'Kilogram', 10);

INSERT INTO
    Units(UnitType, Unit, UnitName, ValueInStandardUnit)
VALUES
    ('Mass', 'GR', 'Gram', 0.01);

INSERT INTO
    Units(UnitType, Unit, UnitName, ValueInStandardUnit)
VALUES
    ('Mass', 'MG', 'Miligram', 0.0001);

INSERT INTO
    Units(UnitType, Unit, UnitName, ValueInStandardUnit)
VALUES
    ('Mass', 'LB', 'Pound', 4.5359);

INSERT INTO
    Units(UnitType, Unit, UnitName, ValueInStandardUnit)
VALUES
    ('Mass', 'OZ', 'Ounce', 0.2835);

INSERT INTO
    Units(UnitType, Unit, UnitName, ValueInStandardUnit)
VALUES
    ('Volume', 'L', 'Liter', 1);

INSERT INTO
    Units(UnitType, Unit, UnitName, ValueInStandardUnit)
VALUES
    ('Volume', 'TBS', 'Tablespoon', 0.015);

INSERT INTO
    Units(UnitType, Unit, UnitName, ValueInStandardUnit)
VALUES
    ('Volume', 'ML', 'Mililiter', 0.001);

INSERT INTO
    Units(UnitType, Unit, UnitName, ValueInStandardUnit)
VALUES
    ('Volume', 'TAS', 'Teaspoon', 0.005);

INSERT INTO
    Units(UnitType, Unit, UnitName, ValueInStandardUnit)
VALUES
    ('Volume', 'Cup', 'Cup', 0.237);

CREATE TABLE Ingredients (
    IngredientId INT IDENTITY(1, 1) PRIMARY KEY,
    ProteinsInGramsPerBase FLOAT NOT NULL,
    CaloriesPerBase FLOAT NOT NULL,
    CarbsInGramsPerBase FLOAT NOT NULL,
    FatsInGramsPerBase FLOAT NOT NULL,
    UnitType VARCHAR(20),
    FOREIGN KEY (UnitType) REFERENCES UnitType(UnitType),
    Name VARCHAR(50) NOT NULL
);

INSERT INTO
    Ingredients(
        ProteinsInGramsPerBase,
        CaloriesPerBase,
        CarbsInGramsPerBase,
        FatsInGramsPerBase,
        UnitType,
        Name
    )
VALUES
    (28, 129, 17, 55, 'Mass', 'Spinach');

INSERT INTO
    Ingredients(
        ProteinsInGramsPerBase,
        CaloriesPerBase,
        CarbsInGramsPerBase,
        FatsInGramsPerBase,
        UnitType,
        Name
    )
VALUES
    (0, 8048, 0, 947, 'Volume', 'Oil');

INSERT INTO
    Ingredients(
        ProteinsInGramsPerBase,
        CaloriesPerBase,
        CarbsInGramsPerBase,
        FatsInGramsPerBase,
        UnitType,
        Name
    )
VALUES
    (10, 364, 76, 1, 'Mass', 'Flour');

INSERT INTO
    Ingredients(
        ProteinsInGramsPerBase,
        CaloriesPerBase,
        CarbsInGramsPerBase,
        FatsInGramsPerBase,
        UnitType,
        Name
    )
VALUES
    (28, 129, 17, 55, 'Mass', 'Spinach');

INSERT INTO
    Ingredients(
        ProteinsInGramsPerBase,
        CaloriesPerBase,
        CarbsInGramsPerBase,
        FatsInGramsPerBase,
        UnitType,
        Name
    )
VALUES
    (0, 8048, 0, 947, 'Volume', 'Oil');

INSERT INTO
    Ingredients(
        ProteinsInGramsPerBase,
        CaloriesPerBase,
        CarbsInGramsPerBase,
        FatsInGramsPerBase,
        UnitType,
        Name
    )
VALUES
    (10, 364, 76, 1, 'Mass', 'Flour');

SELECT
    *
FROM
    RecipeIngredients CREATE TABLE RecipeIngredients (
        RecipeId INT NOT NULL,
        IngredientId INT NOT NULL,
        Amount INT NOT NULL,
        Unit VARCHAR(20) NOT NULL,
        FOREIGN KEY (Unit) REFERENCES Units(Unit),
        PRIMARY KEY (RecipeId, IngredientId),
        FOREIGN KEY (RecipeId) REFERENCES Recipes(RecipeId) ON DELETE CASCADE,
        FOREIGN KEY (IngredientId) REFERENCES Ingredients(IngredientId)
    );

CREATE TABLE Comments (
    CommentId INT IDENTITY(1, 1) PRIMARY KEY,
    Content VARCHAR(500) NOT NULL,
    UserId INT NOT NULL,
    Likes INT NOT NULL DEFAULT 0,
    RecipeId INT NOT NULL,
    CreatedAt DATETIME NOT NULL,
    RepliedTo INT,
    Edited BIT NOT NULL DEFAULT 0,
    UpdatedAt DATETIME DEFAULT NULL,
    AdminUpdatedAt DATETIME DEFAULT NULL,
    FOREIGN KEY (RepliedTo) REFERENCES Comments(CommentId),
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE,
    FOREIGN KEY (RecipeId) REFERENCES Recipes(RecipeId)
);

SELECT
    *
FROM
    Comments CREATE TABLE Likes(
        LikeId INT IDENTITY(1, 1) PRIMARY KEY,
        UserId INT NOT NULL,
        RecipeId INT NOT NULL,
        CreatedAt DATETIME NOT NULL,
        FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE,
        FOREIGN KEY (RecipeId) REFERENCES Recipes(RecipeId)
    );

CREATE TABLE CommentLikes(
    LikeId INT IDENTITY(1, 1) PRIMARY KEY,
    UserId INT NOT NULL,
    CommentId INT NOT NULL,
    CreatedAt DATETIME NOT NULL,
    FOREIGN KEY (UserId) REFERENCES Users(UserId),
    FOREIGN KEY (CommentId) REFERENCES Comments(CommentId) ON DELETE CASCADE
) CREATE TABLE Ratings (
    RatingId INT IDENTITY(1, 1) PRIMARY KEY,
    Rating INT NOT NULL,
    UserId INT NOT NULL,
    RecipeId INT NOT NULL,
    CreatedAt DATETIME NOT NULL,
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE,
    FOREIGN KEY (RecipeId) REFERENCES Recipes(RecipeId)
);

CREATE TABLE Favorites (
    FavoriteId INT IDENTITY(1, 1) PRIMARY KEY,
    UserId INT NOT NULL,
    RecipeId INT NOT NULL,
    FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE,
    FOREIGN KEY (RecipeId) REFERENCES Recipes(RecipeId)
);

CREATE TABLE Notifications(
    NotificationId INT IDENTITY(1, 1) PRIMARY KEY,
    UserId INT NOT NULL,
    Content VARCHAR(100) NOT NULL,
    ReceivedAt DATE FOREIGN KEY (UserId) REFERENCES Users(UserId) ON DELETE CASCADE
);

CREATE TABLE Tags (
    TagId INT IDENTITY(1, 1) PRIMARY KEY,
    Name VARCHAR(50) NOT NULL
);

INSERT INTO
    Tags(Name)
VALUES
    ('Spicy');

INSERT INTO
    Tags(Name)
VALUES
    ('Salty');

INSERT INTO
    Tags(Name)
VALUES
    ('Sweet');

INSERT INTO
    Tags(Name)
VALUES
    ('Bitter-Sweet');

INSERT INTO
    Tags(Name)
VALUES
    ('Extra-Spicy');

INSERT INTO
    Tags(Name)
VALUES
    ('Extra-Sweet');

INSERT INTO
    Tags(Name)
VALUES
    ('Sour');

INSERT INTO
    Tags(Name)
VALUES
    ('Savory');

CREATE TABLE RecipeTags (
    RecipeId INT NOT NULL,
    TagId INT NOT NULL,
    PRIMARY KEY (RecipeId, TagId),
    FOREIGN KEY (RecipeId) REFERENCES Recipes(RecipeId) ON DELETE CASCADE,
    FOREIGN KEY (TagId) REFERENCES Tags(TagId) ON DELETE CASCADE
);

CREATE TABLE Steps(
    StepId INT IDENTITY(1, 1) PRIMARY KEY,
    RecipeId INT NOT NULL,
    StepNumber INT NOT NULL DEFAULT 1,
    StepDescription VARCHAR(400) NOT NULL,
    FOREIGN KEY(RecipeId) REFERENCES Recipes(RecipeId) ON DELETE CASCADE
);

CREATE TABLE Followers(
    PRIMARY KEY (FollowerId, FolloweeId),
    FollowerId INT NOT NULL,
    FolloweeId INT NOT NULL,
    FOREIGN KEY (FolloweeId) REFERENCES Chef(ChefId),
    FOREIGN KEY (FollowerId) REFERENCES Users(UserId) ON DELETE CASCADE
);

CREATE TABLE ChefApplications(
    UserId INT NOT NULL,
    PRIMARY KEY(UserId),
    FOREIGN KEY (UserId) REFERENCES Normal_User(UserId),
    ChefName VARCHAR(50),
    Description VARCHAR(50),
);

CREATE TABLE Contacts(
    UserId INT NOT NULL,
    Name VARCHAR(30) NOT NULL,
    Email VARCHAR(70) NOT NULL,
    Message VARCHAR(400) NOT NULL,
    ReceivedAt DATETIME NOT NULL,
    FOREIGN KEY (UserId) REFERENCES Following(UserId)
);

CREATE INDEX idx_CreatedAt ON Users(CreatedAt);

SELECT
    sp.name AS [Login Name],
    sp.type_desc AS [Server Role],
    su.name AS [Database User Name],
    sl.password_hash AS [Password Hash]
FROM
    sys.server_principals sp
    JOIN sys.sql_logins sl ON sp.sid = sl.sid
    JOIN sys.database_principals su ON sp.sid = su.sid
WHERE
    sp.type = 'S'
    AND su.type IN ('S', 'U')
SELECT
    @ @SERVERNAME AS [Server Name],
    @ @SERVICENAME AS [Instance Name]
SELECT
    SUM(
        ri.Amount * u.ValueInStandardUnit * i.CaloriesPerBase
    )
FROM
    Recipes r
    JOIN RecipeIngredients ri ON ri.RecipeId = r.RecipeId
    JOIN Ingredients i ON i.IngredientId = ri.IngredientId
    JOIN Units u ON u.Unit = ri.Unit
WHERE
    r.RecipeId = 42
SELECT
    *
FROM
    Recipes
SELECT
    *
FROM
    RecipeIngredients
SELECT
    *
FROM
    Steps
SELECT
    *
FROM
    RecipeTags
SELECT
    *
FROM
    Users
SELECT
    *
FROM
    Cuisine
DELETE FROM
    Recipes
DELETE FROM
    RecipeIngredients
DELETE FROM
    Steps
SELECT
    *
FROM
    CommentLikes
SELECT
    *
FROM
    Comments
SELECT
    @ @SERVERNAME AS [Server Name],
    @ @SERVICENAME AS [Instance Name]