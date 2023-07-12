const asyncHandler = require('express-async-handler');
const sql = require("mssql/msnodesqlv8");
const jwt = require('jsonwebtoken');
const handler = require("../middleware/errorMiddleware.js");
const responses = require('../responses');


const config = {
    database: 'Recipes',//<= name of the database in sql
    server: 'DESKTOP-8HBAVK7', //<=name of your desktop device
    driver: 'msnodesqlv8',//<= stays the same
    options: {
        trustedConnection: true
    }
};
const TOKEN_KEY = process.env.TOKEN_KEY;
const editRecipe = asyncHandler(async (req, res) => {
    const token = req.headers['r-a-token'];
    let userId, isValid = false;
    jwt.verify(token, TOKEN_KEY, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        if (Date.now() / 1000 > decoded.exp) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        isValid = true;
        userId = decoded.userId;
    });
    if (!isValid) return;
    const title = req.body.title, description = req.body.description;
    const ingredients = req.body.ingredients.substring(0, req.body.ingredients.length - 1).split(","), cuisineId = req.body.cuisineId;
    const cookTime = req.body.cookTime, servings = req.body.servings;
    const steps = req.body.steps.split(","), prepTime = req.body.preparationTime;
    const tags = req.body.tags.split(",");
    for (let i = 0; i < ingredients.length; i++)
        ingredients[i] = ingredients[i].split("-");
    sql.connect(config, (err) => {
        if (err) {
            res.status(500).json({ message: "An error occurred on our part." })
            return;
        }
        const request = new sql.Request();
        const recipeId = req.params.id;
        request.input('recipeId', sql.VarChar, recipeId);
        request.input('title', sql.VarChar, title);
        request.input('description', sql.VarChar, description);
        request.input('servings', sql.Int, servings);
        request.input('cookTime', sql.Int, cookTime);
        request.input('preparationTime', sql.Int, prepTime);
        request.input('cuisineId', sql.Int, cuisineId);
        request.input('userId', sql.Int, userId);
        if (req.file !== undefined)
            request.input('imageUrl', sql.VarChar, `http://localhost:5000/images/${req.file.filename}`);
        let QUERY = `BEGIN TRANSACTION
                        BEGIN TRY
                         DECLARE @CanEdit BIT;
                         
                         SET @CanEdit = CASE WHEN (SELECT COUNT(*)
                                                   FROM Recipes
                                                   WHERE RecipeId = @recipeId AND ChefId = @userId) = 1 THEN 1 ELSE 0 END;
                         IF(@CanEdit = 1)
                         BEGIN 
                           DELETE FROM RecipeTags
                           WHERE RecipeId = @recipeId;

                           DELETE FROM RecipeIngredients
                           WHERE RecipeId = @recipeId;

                           DELETE FROM Steps
                           WHERE RecipeId = @recipeId;

                           UPDATE Recipes
                           SET Title = @title, Description = @description, CookTime = @cookTime, Servings = @servings, CuisineId = @cuisineId${req.file !== undefined ? ", ImageUrl = @imageUrl" : ""}
                           WHERE RecipeId = @recipeId;`;


        let i = 0;
        for (const ingredient of ingredients) {
            request.input('ingredient' + i, sql.Int, ingredient[0]);
            request.input('amount' + i, sql.Int, ingredient[1]);
            request.input('unit' + i, sql.VarChar, ingredient[2]);
            QUERY += `INSERT INTO RecipeIngredients(RecipeId, IngredientId, Amount, Unit)
                           VALUES (@recipeId, @ingredient${i}, @amount${i}, @unit${i});`
            i++;
        }
        i = 1;
        for (const step of steps) {
            request.input('step' + i, sql.VarChar, step);
            QUERY += `INSERT INTO Steps (RecipeId, StepNumber, StepDescription)
                           VALUES (@recipeId, ${i}, @step${i});`
            i++;
        }
        i = 0;
        for (const tagId of tags) {
            request.input('tag' + i, sql.Int, tagId);
            QUERY += `INSERT INTO RecipeTags(TagId, RecipeId) VALUES (@tag${i}, @recipeId);`;
            i++;
        }
        QUERY += `END
                 END TRY
                 BEGIN CATCH
                   THROW;
                   ROLLBACK;
                 END CATCH;
                COMMIT;`
        request.query(QUERY, (err, result) => {
            if (err) {
                res.status(500).json({ message: "An error occurred on our part." });
                console.log(err);
                return;
            }
            if (result.rowsAffected === 0) {
                res.status(404).json({ message: "Could not find resource." });
                return;
            }
            res.status(200).json({ message: "Recipe deleted successfully." });
            return;
        })
    })
});
const deleteRecipe = asyncHandler(async (req, res) => {
    const token = req.headers['r-a-token'];
    let userId, isValid = false, role;
    jwt.verify(token, TOKEN_KEY, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        if (Date.now() / 1000 > decoded.exp) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        isValid = true;
        role = decoded.role;
        userId = decoded.userId;
    });
    if (!isValid) return;
    sql.connect(config, (err) => {
        if (err) {
            res.status(500).json({ message: "An error occurred on our part." })
            return;
        }
        const request = new sql.Request();
        const recipeId = req.params.id;
        request.input('recipeId', sql.Int, recipeId);
        request.input('userId', sql.Int, userId);
        request.input('role', sql.VarChar, role);
        const QUERY = `BEGIN TRANSACTION
                        BEGIN TRY
                         DECLARE @CanDelete BIT;
                        
                         SET @CanDelete = CASE WHEN (SELECT COUNT(*)
                                                     FROM Recipes r
                                                     WHERE r.RecipeId = @recipeId AND r.ChefId = @userId OR @role = 'admin') >= 1 THEN 1 ELSE 0 END;
                         IF(@CanDelete = 1)
                         BEGIN          
                            DELETE FROM Recipes
                            WHERE RecipeId = @recipeId;
                         END
                        END TRY
                        BEGIN CATCH
                          THROW;
                          ROLLBACK;
                        END CATCH;
                       COMMIT;`
        request.query(QUERY, (err, result) => {
            if (err) {
                res.status(500).json({ message: "An error occurred on our part." });
                console.log(err);
                return;
            }
            if (result.rowsAffected === 0) {
                res.status(404).json({ message: "Could not find resource." });
                return;
            }
            res.status(204).json({ message: "Recipe deleted successfully." });
            return;
        })
    })
});
const addRecipe = asyncHandler(async (req, res) => {
    const token = req.headers['r-a-token'];
    let chefId, isValid = false;
    jwt.verify(token, TOKEN_KEY, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        if (Date.now() / 1000 > decoded.exp) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        if (decoded.role != 'chef') {
            res.status(403).json({ message: "Not authorized to add a recipe." });
            return;
        }
        chefId = decoded.userId;
        isValid = true;
    });
    if (!isValid) return;
    /*req.body.ingredients = {
        (int)ingredientId: [(int)amount, (string)unitId]

        ** reminder that unitIds are "KG", "GR" etc**
    }*/
    /*req.body.steps = [step1, step2, step3 ...]*/
    const title = req.body.title, description = req.body.description;
    const ingredients = req.body.ingredients.substring(0, req.body.ingredients.length - 1).split(","), cuisineId = req.body.cuisineId;
    const cookTime = req.body.cookTime, servings = req.body.servings;
    const steps = req.body.steps.split(","), prepTime = req.body.preparationTime;
    const tags = req.body.tags.split(",");

    for (let i = 0; i < ingredients.length; i++)
        ingredients[i] = ingredients[i].split("-");

    if (title === undefined || description === undefined || ingredients === undefined
        || cookTime === undefined || servings === undefined || steps === undefined || prepTime === undefined || cuisineId === undefined) {
        res.status(400).json({ message: "Not all required information was provided." });
        return;
    }
    if (!Array.isArray(steps)) {
        res.status(400).json({ message: "Information is not in the expected format." });
        return;
    }

    if (Object.keys(ingredients).length === 0 || title.length > 100 || description.length > 500 || cookTime < 0 || servings <= 0 || prepTime < 0) {
        res.status(400).json({ message: "Information was in the expected format, but values were invalid." });
        return;
    }
    sql.connect(config, (err) => {
        if (err) {
            res.status(500).json({ message: err });
            return;
        }
        const request = new sql.Request();
        console.log(req.body);
        request.input('title', sql.VarChar, title);
        request.input('description', sql.VarChar, description);
        request.input('cookTime', sql.Int, cookTime);
        request.input('servings', sql.Int, servings);
        request.input('preparationTime', sql.Int, prepTime);
        request.input('cuisineId', sql.Int, cuisineId);
        request.input('chefId', sql.Int, chefId);
        if (req.file !== undefined) request.input('imageUrl', sql.VarChar, `http://localhost:5000/images/${req.file.filename}`);

        let QUERY = `BEGIN TRANSACTION;
                      BEGIN TRY
                        DECLARE @CountChef INT;
                
                        SELECT @CountChef = COUNT(*)
                        FROM Chef
                        WHERE ChefId = @chefId;

                        IF(@CountChef = 1)
                         BEGIN
                          DECLARE @ChefUsername VARCHAR(50);
                          SELECT @ChefUsername = Username
                          FROM Users
                          WHERE UserId = @chefId;

                          DECLARE @CurrentRecipeId INT;
                
                          INSERT INTO Recipes(Title, Description, CookTime, Servings, PreparationTime, ${req.file !== undefined ? "ImageUrl, " : ","} CreatedAt, CuisineId, ChefId)
                          VALUES (@title, @description, @cookTime, @servings, @preparationTime, @imageUrl ,GETDATE(), @cuisineId, @chefId);

                          INSERT INTO Notifications(UserId, Content, ReceivedAt)
                          SELECT UserId, CONCAT(@ChefUsername, ' just posted a new recipe!'), GETDATE()
                          FROM ChefFavorites 
                          WHERE ChefId = @chefId;

                          SELECT @CurrentRecipeId = MAX(RecipeId)
                          FROM Recipes;`;
        let i = 0;
        for (const ingredient of ingredients) {
            request.input('ingredient' + i, sql.Int, ingredient[0]);
            request.input('amount' + i, sql.Int, ingredient[1]);
            request.input('unit' + i, sql.VarChar, ingredient[2]);
            QUERY += `INSERT INTO RecipeIngredients(RecipeId, IngredientId, Amount, Unit)
            VALUES (@CurrentRecipeId, @ingredient${i}, @amount${i}, @unit${i});`
            i++;
        }
        i = 1;
        for (const step of steps) {
            request.input('step' + i, sql.VarChar, step);
            QUERY += `INSERT INTO Steps (RecipeId, StepNumber, StepDescription)
            VALUES (@CurrentRecipeId, ${i}, @step${i});`
            i++;
        }
        i = 0;
        for (const tagId of tags) {
            request.input('tag' + i, sql.Int, tagId);
            QUERY += `INSERT INTO RecipeTags(TagId, RecipeId) VALUES (@tag${i}, @CurrentRecipeId);`;
            i++;
        }
        QUERY += `        END;
                         END TRY
                         BEGIN CATCH
                           THROW;
                           ROLLBACK;
                         END CATCH;
                        COMMIT;`
        request.query(QUERY, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).json({ message: err });
                return;
            }
            if (result.rowsAffected === 0) {
                res.status(401).json({ message: "Invalid information." })
                return;
            }
            res.status(201).json({ message: "Recipe was successfully added." });
            return;
        });
    });
});

const getRecipes = asyncHandler(async (req, res, next) => {
    const { page, pageSize, search, sortBy, sortOrder } = req.query;
    const token = req.headers['r-a-token'];
    let chefId = null, isValid = false;
    jwt.verify(token, TOKEN_KEY, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: "Token is invalid." });
            return;
        }
        if (decoded.exp < Date.now() / 1000) {
            res.status(401).json({ message: "Token is expired." });
            return;
        }
        chefId = decoded.userId;
        isValid = true;
    });
    if (!isValid) return;
    try {
        if (sortOrder.toUpperCase() != 'ASC' && sortOrder.toUpperCase() != 'DESC') {
            res.status(401).json({ message: "Sort order parameter is not valid, it should be 'DESC', or 'ASC'" });
            return;
        }
    } catch (error) {
        console.log(error);
    }
    const mappings = {
        proteins: { field: `ProteinsInGramsPerBase`, name: 'Proteins', key: 'nutritients' },
        calories: { field: `CaloriesPerBase`, name: 'Calories', key: 'nutritients' },
        carbs: { field: `CarbsInGramsPerBase`, name: 'Carbs', key: 'nutritients' },
        fats: { field: `FatsInGramsPerBase`, name: 'Fats', key: 'nutritients' },
        title: { key: 'title' },
        cookTime: { key: 'cookTime' },
        prepTime: { key: 'prepTime' },
        rating: { key: 'rating' },
        views: { key: 'views' }
    }
    const order = sortOrder === undefined ? "" : sortOrder;
    const sortingQueries = {
        nutritients: {
            select: `, (SELECT SUM(ri.Amount*i.${mappings[sortBy].field}*u.ValueInStandardUnit) 
                           FROM RecipeIngredients ri
                             JOIN Ingredients i 
                             ON i.IngredientId = ri.IngredientId
                               JOIN Units u
                               ON u.Unit = ri.Unit
                           WHERE ri.RecipeId = r.RecipeId) AS ${mappings[sortBy].name}`,
            orderBy: `${mappings[sortBy].name} ${order}`
        },
        title: { select: ``, orderBy: `Title ${order}` },
        cookTime: { select: ``, orderBy: `CookTime ${order}` },
        prepTime: { select: ``, orderBy: `PreparationTime ${order}` },
        rating: { select: ``, orderBy: `Rating ${order}` },
        views: { select: ``, orderBy: `Views ${order}` }
    }
    sql.connect(config, (err) => {
        if (err) {
            res.status(500).json({ message: "An error occurred on our part." });
            console.log(err);
            return;
        }
        const request = new sql.Request();
        request.input('offset', sql.Int, (page - 1) * pageSize);
        request.input('rows', sql.Int, pageSize);
        request.input('substring', sql.VarChar, search);
        console.log((page - 1) * pageSize + ", " + pageSize);
        const QUERY = `SELECT u.Username, u.ProfilePicture AS ChefImage, r.* ${sortingQueries[mappings[sortBy].key].select}
                       FROM Recipes r
                         JOIN Users u
                         ON u.UserId = r.ChefId
                       WHERE Title LIKE CONCAT('%', @substring,'%')
                       ORDER BY ${sortingQueries[mappings[sortBy].key].orderBy}
                       OFFSET @offset ROWS
                       FETCH NEXT @rows ROWS ONLY;
                       
                       SELECT CEILING(COUNT(*)/CAST(@rows AS FLOAT)) AS TotalPages
                       FROM Recipes r
                       WHERE Title LIKE CONCAT('%', @substring,'%');`;
        console.log(QUERY);
        request.query(QUERY, (err, result) => {
            if (err) {
                res.status(500).json({ message: "An error occurred on our part." });
                console.log(err);
                return;
            }
            if (result.recordset.length === 0) {
                res.status(400).json({ message: "Could not get recipes." });
                return;
            }
            console.log(result.recordsets[0].length);
            res.status(200).json({ message: "Successfully fetched resource", response: result.recordsets });
            return;
        });
    });
});

const getRecipePost = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const token = req.headers['r-a-token'];
    console.log("here1");
    let userId = null, isValid = false, role = null;
    jwt.verify(token, TOKEN_KEY, (err, decoded) => {
        if (err) {
            responses.tokenNoPermission(res);
            return;
        }
        if (Date.now() / 1000 > decoded.exp) {
            responses.tokenExpired(res);
            return;
        }
        role = decoded.role;
        userId = decoded.userId;
        isValid = true;
    });
    if (!isValid) return;
    console.log("here2");
    if (id === undefined) {
        // res.status(401).json({ message: "Not all required information was provided." });
        responses.inputsNotProvided(res);
        return;
    }
    if (isNaN(Number(id))) {
        // res.status(401).json({ message: "Information is not in the expected format." });
        responses.invalidDataType(res);
        return;
    }
    if (id < 0) {
        // res.status(401).json({ message: "Information was in the expected format, but values were invalid." });
        responses.inputsInvalid(res);
        return;
    }
    sql.connect(config, (err) => {
        if (err) {
            res.status(500).json({ message: "A mistake happened on our part." });
            // res.status(500).json({ message: "A mistake happened on our part." });
            responses.serverError(res);
            return;
        }
        const request = new sql.Request();
        request.input('recipeId', sql.Int, id);
        request.input('userId', sql.Int, userId);
        request.input('role', sql.VarChar, role);
        const QUERY = `BEGIN TRANSACTION;
                          BEGIN TRY
                             DECLARE @LikesCount INT;
                             DECLARE @Proteins INT;
                             DECLARE @Calories INT;
                             DECLARE @Carbs INT;
                             DECLARE @Fats INT;
                             DECLARE @AlreadyLiked BIT;
                             DECLARE @ViewedToday BIT;
                             DECLARE @CanView BIT;
                             DECLARE @CooldownExists INT;
                             SELECT @CooldownExists = COUNT(*)
                             FROM ViewCooldowns 
                             WHERE UserId = @userId AND @recipeId = RecipeId;
                             SET @CanView = CASE WHEN (@CooldownExists = 0 OR 
                                                       (SELECT COUNT(*)
                                                       FROM ViewCooldowns 
                                                       WHERE UserId = @userId AND @recipeId = RecipeId AND DATEDIFF_BIG(MILLISECOND, GETDATE(), CooldownUntil) < 0) = 1 ) THEN 1 ELSE 0 END;

                             SET @AlreadyLiked = CASE WHEN (SELECT COUNT(*) FROM Likes WHERE RecipeId = @recipeId AND UserId = @userId) = 1 THEN 1 ELSE 0 END;
                             SET @ViewedToday = CASE WHEN (SELECT COUNT(*) FROM RecipeViews WHERE RecipeId = @recipeId AND ViewedAt = CONVERT(DATE, GETDATE())) = 1 THEN 1 ELSE 0 END;
                             IF(@CanView = 1)
                             BEGIN
                              IF(@ViewedToday = 1)
                               BEGIN 
                                UPDATE RecipeViews
                                SET Views = Views + 1
                                WHERE RecipeId = @recipeId AND ViewedAt = CONVERT(DATE, GETDATE());
                               END
                              ELSE
                               BEGIN
                                INSERT INTO RecipeViews(RecipeId, ViewedAt, Views) VALUES (@recipeId, CONVERT(DATE, GETDATE()), 1);
                               END
                              UPDATE Recipes 
                              SET Views = Views + 1
                              WHERE RecipeId = @recipeId;

                              IF(@CooldownExists = 1)
                              BEGIN 
                                UPDATE ViewCooldowns
                                SET CooldownUntil = DATEADD(MINUTE, 5, GETDATE())
                                WHERE UserId = @userId AND @recipeId = RecipeId;
                              END
                              ELSE
                              BEGIN 
                               INSERT INTO ViewCooldowns (UserId, RecipeId, CooldownUntil) VALUES (@userId, @recipeId, DATEADD(MINUTE, 5, GETDATE()));
                              END
                             END
                             SELECT @Proteins = SUM(ri.Amount*i.ProteinsInGramsPerBase*u.ValueInStandardUnit),
                                    @Calories = SUM(ri.Amount*i.CaloriesPerBase*u.ValueInStandardUnit),
                                    @Carbs = SUM(ri.Amount*i.CarbsInGramsPerBase*u.ValueInStandardUnit),
                                    @Fats = SUM(ri.Amount*i.FatsInGramsPerBase*u.ValueInStandardUnit)
                             FROM RecipeIngredients ri
                                JOIN Ingredients i
                                ON i.IngredientId = ri.IngredientId
                                  JOIN Units u 
                                  ON u.Unit = ri.Unit
                             WHERE ri.RecipeId = @recipeId

                             SELECT @LikesCount = COUNT(*)
                             FROM Likes
                             WHERE RecipeId = @recipeId;

                             SELECT r.Title, r.Description,r.ImageUrl, r.Rating, r.Views,r.CreatedAt, c.Name, u.Username, @LikesCount AS Likes, @AlreadyLiked AS AlreadyLiked,
                             @Proteins AS Proteins, @Calories AS Calories, @Carbs AS Carbs, @Fats AS Fats, r.PreparationTime, r.CookTime, r.RecipeId
                             FROM Recipes r
                               JOIN Users u 
                               ON u.UserId = r.ChefId
                                 JOIN Cuisine c
                                 ON c.CuisineId = r.CuisineId
                             WHERE RecipeId = @recipeId;
                             
                             SELECT Content, Username, Likes, CommentId, Edited, CanEdit, AlreadyLiked,
                             CASE
                                 WHEN diff < 60 THEN CAST(diff AS VARCHAR(10))+ 's'
                                 WHEN diff < 3600 THEN CAST(CAST(diff/60 AS INT) AS VARCHAR(10))+ 'm'
                                 WHEN diff < 86400 THEN CAST(CAST(diff/3600 AS INT) AS VARCHAR(10))+ 'h'
                                 WHEN diff < 604800 THEN CAST(CAST(diff/86400 AS INT) AS VARCHAR(10))+ 'd'
                                 ELSE CAST(CAST(diff/604800 AS INT) AS VARCHAR(10))+'w'
                             END AS TimeDifference
                             FROM(SELECT c.Content, u.Username, c.Likes, DATEDIFF_BIG(SECOND, c.CreatedAt, GETDATE()) AS diff, c.CommentId, c.Edited,
                              (SELECT COUNT(*) FROM Comments WHERE (CommentId = c.CommentId AND c.UserId = @userId) OR (@role = 'admin' AND CommentId = c.CommentId)) AS CanEdit,
                              (SELECT COUNT(*) FROM CommentLikes WHERE UserId = @userId AND CommentId = c.CommentId) AS AlreadyLiked 
                             FROM Comments c
                                JOIN Users u
                                ON u.UserId = c.UserId
                             WHERE RecipeId = @recipeId) AS subquery;

                             SELECT i.Name, ri.Amount, u.UnitName
                             FROM RecipeIngredients ri
                               JOIN Ingredients i
                               ON i.IngredientId = ri.IngredientId
                                 JOIN Units u
                                 ON u.Unit = ri.Unit
                             WHERE ri.RecipeId = @recipeId

                             SELECT StepDescription
                             FROM Steps
                             WHERE RecipeId = @recipeId
                             ORDER BY StepNumber

                             SELECT t.Name
                             FROM RecipeTags rt
                               JOIN Tags t
                               ON t.TagId = rt.TagId
                             WHERE rt.RecipeId = @recipeId
                          END TRY
                          BEGIN CATCH
                            THROW;
                            ROLLBACK;
                          END CATCH;
                        COMMIT;`;
        request.query(QUERY, (err, result) => {
            if (err) {
                console.log(err);
                // res.status(500).json({ message: "An error happened on our part." })
                responses.serverError(res);
                return;
            }
            responses.resourceFetched(res, result.recordsets);
            return;
        })
    })
});
const getRecipe = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const token = req.headers['r-a-token'];
    console.log("here1");
    let userId = null, isValid = false, role = null;
    jwt.verify(token, TOKEN_KEY, (err, decoded) => {
        if (err) {
            responses.tokenNoPermission(res);
            return;
        }
        if (Date.now() / 1000 > decoded.exp) {
            responses.tokenExpired(res);
            return;
        }
        role = decoded.role;
        userId = decoded.userId;
        isValid = true;
    });
    if (!isValid) return;
    console.log("here2222");
    if (id === undefined) {
        // res.status(401).json({ message: "Not all required information was provided." });
        responses.inputsNotProvided(res);
        return;
    }
    if (isNaN(Number(id))) {
        // res.status(401).json({ message: "Information is not in the expected format." });
        responses.invalidDataType(res);
        return;
    }
    if (id < 0) {
        // res.status(401).json({ message: "Information was in the expected format, but values were invalid." });
        responses.inputsInvalid(res);
        return;
    }
    sql.connect(config, (err) => {
        if (err) {
            res.status(500).json({ message: "A mistake happened on our part." });
            // res.status(500).json({ message: "A mistake happened on our part." });
            responses.serverError(res);
            return;
        }
        const request = new sql.Request();
        request.input('recipeId', sql.Int, id);
        request.input('userId', sql.Int, userId);
        request.input('role', sql.VarChar, role);
        const QUERY = `BEGIN TRANSACTION;
                          BEGIN TRY
                             SELECT * 
                             FROM Recipes
                             WHERE RecipeId = @recipeId;

                             SELECT * 
                             FROM RecipeIngredients
                             WHERE RecipeId = @recipeId;

                             SELECT t.TagId, t.Name
                             FROM RecipeTags rt
                               JOIN Tags t
                               ON t.TagId = rt.TagId
                             WHERE RecipeId = @recipeId;

                             SELECT * 
                             FROM Steps
                             WHERE RecipeId = @recipeId
                             ORDER BY StepNumber DESC;
                          END TRY
                          BEGIN CATCH
                            THROW;
                            ROLLBACK;
                          END CATCH;
                        COMMIT;`;
        request.query(QUERY, (err, result) => {
            if (err) {
                console.log(err);
                // res.status(500).json({ message: "An error happened on our part." })
                responses.serverError(res);
                return;
            }
            responses.resourceFetched(res, result.recordsets);
            return;
        })
    })
});
const getTrending = asyncHandler(async (req, res, next) => {
    const token = req.headers['r-a-token'];
    let isValid = false, userId = null;
    const page = req.headers['page'], rows = req.headers['rows'];
    jwt.verify(token, TOKEN_KEY, (err, decoded) => {
        if (err) {
            responses.tokenNoPermission(res);
            return;
        }
        if (Date.now() / 1000 > decoded.exp) {
            responses.tokenExpired(res);
            return;
        }
        userId = decoded.userId;
        isValid = true;
    });
    if (!isValid) return;

    sql.connect(config, (err) => {
        if (err) {
            res.status(500).json({ message: "A mistake happened on our part." });
            // res.status(500).json({ message: "A mistake happened on our part." });
            responses.serverError(res);
            return;
        }
        const request = new sql.Request();
        request.input('userId', sql.Int, userId);
        request.input('offset', sql.Int, (page - 1) * rows);
        request.input('rows', sql.Int, rows);
        const QUERY = `SELECT r.Title, r.CookTime, (SELECT COUNT(*) 
                                                    FROM Saved
                                                    WHERE RecipeId = r.RecipeId AND UserId = @userId) AS IsSaved
                       ,r.RecipeId, r.PreparationTime, r.ImageUrl, r.Rating, r.Description, COALESCE(r.Views, 0) AS Views, c.Name AS Cuisine, u.Username, u.ProfilePicture AS ChefImage, r.ChefId
                       FROM Recipes r
                        LEFT JOIN RecipeViews rv
                        ON rv.RecipeId = r.RecipeId AND rv.ViewedAt = CONVERT(DATE, GETDATE())
                         JOIN Cuisine c
                         ON c.CuisineId = r.CuisineId
                           JOIN Users u
                           ON u.UserId = r.ChefId
                       ORDER BY COALESCE(rv.Views, 0) DESC
                       OFFSET @offset ROWS
                       FETCH NEXT @rows ROWS ONLY;`;

        request.query(QUERY, (err, result) => {
            if (err) {
                console.log(err);
                // res.status(500).json({ message: "An error happened on our part." })
                responses.serverError(res);
                return;
            }
            // res.status(200).json({ message: "Recipe fetched successfully.", response: result.recordsets });
            responses.resourceFetched(res, result.recordset);
            return;
        })
    })
});
const getSaved = asyncHandler(async (req, res, next) => {
    const token = req.headers['r-a-token'];
    let isValid = false, userId;
    const page = req.headers['page'], rows = req.headers['rows'];
    jwt.verify(token, TOKEN_KEY, (err, decoded) => {
        if (err) {
            responses.tokenNoPermission(res);
            return;
        }
        if (Date.now() / 1000 > decoded.exp) {
            responses.tokenExpired(res);
            return;
        }
        isValid = true;
        userId = decoded.userId;
    });
    if (!isValid) return;

    sql.connect(config, (err) => {
        if (err) {
            res.status(500).json({ message: "A mistake happened on our part." });
            // res.status(500).json({ message: "A mistake happened on our part." });
            responses.serverError(res);
            return;
        }
        const request = new sql.Request();
        const profileId = req.params.id;
        request.input('offset', sql.Int, (page - 1) * rows);
        request.input('rows', sql.Int, rows);
        request.input('userId', sql.Int, profileId);
        request.input('viewerId', sql.Int, userId);
        console.log(profileId + ".........................");
        const QUERY = `SELECT r.Title, r.CookTime, (SELECT COUNT(*) FROM Saved WHERE RecipeId = r.RecipeId AND UserId = @viewerId ) AS IsSaved, r.RecipeId, r.PreparationTime,
                       r.ImageUrl, r.Rating, r.Description, r.Views, c.Name AS Cuisine, u.Username, u.ProfilePicture AS ChefImage
                       FROM Saved s
                        JOIN Recipes r
                        ON s.RecipeId = r.RecipeId 
                         JOIN Cuisine c
                         ON c.CuisineId = r.CuisineId
                           JOIN Users u 
                           ON u.UserId = r.ChefId
                       WHERE s.UserId = @userId
                       ORDER BY s.SavedAt DESC
                       OFFSET @offset ROWS
                       FETCH NEXT @rows ROWS ONLY;`;

        request.query(QUERY, (err, result) => {
            if (err) {
                console.log(err);
                // res.status(500).json({ message: "An error happened on our part." })
                responses.serverError(res);
                return;
            }
            // res.status(200).json({ message: "Recipe fetched successfully.", response: result.recordsets });
            responses.resourceFetched(res, result.recordset);
            return;
        })
    })
});
const unsaveRecipe = asyncHandler(async (req, res) => {
    const token = req.headers['r-a-token'];
    let userId = null, isValid = false;
    jwt.verify(token, TOKEN_KEY, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        if (Date.now() / 1000 > decoded.exp) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        isValid = true;
        userId = decoded.userId;
    });
    if (!isValid) return;
    const recipeId = req.params.id;
    sql.connect(config, (err) => {
        if (err) {
            handler(err, req, res, "");
            return;
        }
        const request = new sql.Request();
        request.input('userId', sql.Int, userId);
        request.input('recipeId', sql.Int, recipeId);
        const QUERY = `BEGIN TRANSACTION
                         BEGIN TRY
                           DECLARE @Count INT;
                           SELECT @Count = COUNT(*)
                           FROM Saved 
                           WHERE UserId = @userId AND RecipeId = @recipeID
                           
                           IF(@Count = 1)
                           BEGIN 
                             DELETE FROM Saved
                             WHERE RecipeId = @recipeId AND UserId = @userId
                           END
                         END TRY
                         BEGIN CATCH
                           THROW;
                           ROLLBACK;
                         END CATCH;
                       COMMIT;`;

        request.query(QUERY, (err, result) => {
            if (err) {
                res.status(500).json({ message: "An error occurred on our part." });
                console.log(err);
                return;
            }
            if (result.rowsAffected <= 0) {
                res.status(400).json({ message: "Could not unsave the recipe." });
                console.log(result.rowsAffected);
                return;
            }
            res.status(204).json({ message: "Recipe created successfully." });
            return;
        })
    })
});
const saveRecipe = asyncHandler(async (req, res) => {
    const token = req.headers['r-a-token'];
    let userId = null, isValid = false;
    jwt.verify(token, TOKEN_KEY, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        if (Date.now() / 1000 > decoded.exp) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        isValid = true;
        userId = decoded.userId;
    });
    if (!isValid) return;
    const recipeId = req.params.id;
    sql.connect(config, (err) => {
        if (err) {
            handler(err, req, res, "");
            return;
        }
        const request = new sql.Request();
        request.input('userId', sql.Int, userId);
        request.input('recipeId', sql.Int, recipeId);
        const QUERY = `BEGIN TRANSACTION
                         BEGIN TRY
                           DECLARE @Count INT;
                           SELECT @Count = COUNT(*) 
                           FROM Saved 
                           WHERE UserId = @userId AND RecipeId = @recipeID
                           
                           IF(@Count = 0)
                           BEGIN 
                             INSERT INTO Saved(UserId, RecipeId, SavedAt) VALUES(@userId, @recipeId, GETDATE());
                           END
                         END TRY
                         BEGIN CATCH
                           THROW;
                           ROLLBACK;
                         END CATCH;
                       COMMIT;`;

        request.query(QUERY, (err, result) => {
            if (err) {
                res.status(500).json({ message: "An error occurred on our part." });
                console.log(err);
                return;
            }
            if (result.rowsAffected <= 0) {
                res.status(400).json({ message: "Could not save the recipe." });
                console.log(result.rowsAffected);
                return;
            }
            res.status(201).json({ message: "Recipe created successfully." });
            return;
        })
    })
});
const getFavorites = asyncHandler(async (req, res) => {
    const token = req.params.auth;
    let userId = null, isValid = false;
    jwt.verify(token, TOKEN_KEY, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        if (Date.now() / 1000 > decoded.exp) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        isValid = true;
        userId = decoded.userId;
    });
    if (!isValid) return;
    const recipeId = req.params.id;
    sql.connect(config, (err) => {
        if (err) {
            handler(err, req, res, "");
            return;
        }
        const request = new sql.Request();
        request.input('userId', sql.Int, userId);

        const QUERY = `SELECT r.*
                       FROM Favorites f
                         JOIN Recipes r
                         ON r.RecipeId = f.RecipeId
                       WHERE f.UserId = @userId;`;

        request.query(QUERY, (err, result) => {
            if (err) {
                handler(err, req, res, "");
                return;
            }
            res.status(200).json({ message: "Recipe fetched successfully.", response: result.recordset });
            return;
        })
    })
});
const filterRecipes = asyncHandler(async (req, res) => {
    const token = req.params.auth;
    let isValid = false;
    jwt.verify(token, TOKEN_KEY, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        if (Date.now() / 1000 > decoded.exp) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        isValid = true;
    });
    if (!isValid) return;
    const { query, morePopular, lessPopular, cuisine, rating, before, after } = req.params;
    sql.connect(config, (err) => {
        if (err) {
            handler(err, req, res, "");
            return;
        }
        const conditions = {
            morePopular: `Views > @morePopular`,
            lessPopular: `Views < @lessPopular`,
            query: `Title LIKE '%'+@query+'%' OR Description LIKE '%'+@query+'%`,
            cuisine: `CuisineId = @cuisineId`,
            rating: `Rating > @rating`,
            before: `CreatedAt < @before`,
            after: `CreatedAt > @after`
        };
        const request = new sql.Request();
        if (query != undefined) request.input('query', sql.VarChar, query);
        if (morePopular != undefined) request.input('morePopular', sql.Int, morePopular);
        if (lessPopular != undefined) request.input('lessPopular', sql.Int, lessPopular);
        if (cuisine != undefined) request.input('cuisineId', sql.Int, cuisine);
        if (rating != undefined) request.input('rating', sql.Int, rating);
        if (before != undefined) request.input('before', sql.Date, before);
        if (after != undefined) request.input('after', sql.Date, after);

        let QUERY = `SELECT *
                       FROM Recipes
                       WHERE `;
        for (const prop in req.params)
            if (prop in conditions) QUERY += `${conditions[prop]} AND `;

        QUERY = QUERY.slice(0, QUERY.length - 4);

        request.query(QUERY, (err, result) => {
            if (err) {
                handler(err, req, res, "");
                return;
            }
            res.status(200).json({ message: "Recipe fetched successfully.", response: result.recordset });
            return;
        })
    })
});

const updateRecipe = asyncHandler(async (req, res) => {
    const token = req.params.auth;
    let userId = null, isValid = false;
    jwt.verify(token, tokenKey, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        if (Date.now() / 1000 > decoded.exp) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        isValid = true;
        userId = decoded.userId;
    });
    if (!isValid) return;
    const recipeId = req.params.id;
    const { title, description, ingredients, steps, cuisineId, image } = req.body;
    const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    sql.connect(config, (err) => {
        if (err) {
            handler(err, req, res, "");
            return;
        }
        const request = new sql.Request();
        request.input('recipeId', sql.Int, recipeId);
        request.input('title', sql.VarChar, title);
        request.input('description', sql.VarChar, description);
        request.input('ingredients', sql.VarChar, ingredients);
        request.input('steps', sql.VarChar, steps);
        request.input('cuisineId', sql.Int, cuisineId);
        request.input('image', sql.VarChar, image);
        request.input('date', sql.DateTime, date);
        request.input('userId', sql.Int, userId);

        const QUERY = `UPDATE Recipes
                          SET Title = @title,
                                Description = @description,
                                Ingredients = @ingredients,
                                Steps = @steps,
                                CuisineId = @cuisineId,
                                Image = @image,
                                UpdatedAt = @date,
                                UpdatedBy = @userId
                            WHERE RecipeId = @recipeId;`

        request.query(QUERY, (err, result) => {
            if (err) {
                handler(err, req, res, "");
                return;
            }
            if (result.rowsAffected[0] == 0) {
                res.status(404).json({ message: "Recipe not found." });
                return;
            }
            res.status(200).json({ message: "Recipe updated successfully." });
            return;
        })
    })
});

const getRecipesByChef = asyncHandler(async (req, res) => {
    const token = req.headers['r-a-token'];
    const rows = req.headers['rows'], page = req.headers['page'];
    let isValid = false, userId = null;
    jwt.verify(token, TOKEN_KEY, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        if (Date.now() / 1000 > decoded.exp) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        userId = decoded.userId;
        isValid = true;
    });
    if (!isValid) return;
    const chefId = req.params.id;
    sql.connect(config, (err) => {
        if (err) {
            handler(err, req, res, "");
            return;
        }
        const request = new sql.Request();

        request.input('chefId', sql.Int, chefId);
        request.input('offset', sql.Int, (page - 1) * rows);
        request.input('rows', sql.Int, rows);
        request.input('userId', sql.Int, userId);
        const QUERY = `SELECT r.Title, r.CookTime, (SELECT COUNT(*) FROM Saved WHERE RecipeId = r.RecipeId AND UserId = @userId), r.RecipeId, r.PreparationTime,
                       r.ImageUrl, r.Rating, r.Description, r.Views, c.Name AS Cuisine, u.Username, u.ProfilePicture AS ChefImage, r.ChefId
                       FROM Recipes r
                          JOIN Cuisine c
                          ON c.CuisineId = r.CuisineId
                            JOIN Users u 
                            ON u.UserId = r.ChefId
                       WHERE r.ChefId = @chefId
                       ORDER BY r.CreatedAt DESC
                       OFFSET @offset ROWS
                       FETCH NEXT @rows ROWS ONLY;`
        request.query(QUERY, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).json({ message: "An error occurred on our part." })
                return;
            }
            res.status(200).json({ message: "Recipes fetched successfully.", response: result.recordset });
            return;
        })
    })
});

const likeRecipe = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const token = req.headers['r-a-token'];
    let userId = null, isValid = false, username = null;
    jwt.verify(token, TOKEN_KEY, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: "Not authorized to view recipes." });
            return;
        }
        if (Date.now() / 1000 > decoded.exp) {
            res.status(401).json({ message: "Token is expired." });
            return;
        }
        userId = decoded.userId;
        username = decoded.username;
        isValid = true;
    });
    if (!isValid) return;
    if (id === undefined) {
        res.status(401).json({ message: "Not all required information was provided." });
        return;
    }
    if (isNaN(Number(id))) {
        res.status(401).json({ message: "Information is not in the expected format." });
        return;
    }
    if (id < 0) {
        res.status(401).json({ message: "Information was in the expected format, but values were invalid." });
        return;
    }
    sql.connect(config, (err) => {
        if (err) {
            res.status(500).json({ message: "A mistake happened on our part." });
            return;
        }
        const request = new sql.Request();
        request.input('recipeId', sql.Int, id);
        request.input('userId', sql.Int, userId);
        request.input('username', sql.VarChar, username);
        const QUERY = `BEGIN TRANSACTION;
                          BEGIN TRY
                             DECLARE @RecipePoster INT;
                             SELECT @RecipePoster = ChefId
                             FROM Recipes
                             WHERE RecipeId = @recipeId;

                             INSERT INTO Likes(UserId, RecipeId, CreatedAt) VALUES(@userId, @recipeId, GETDATE());
                             IF(@RecipePoster <> @userId)
                             BEGIN
                               INSERT INTO Notifications(UserId, Content, ReceivedAt)
                               VALUES (@RecipePoster, CONCAT(@username, ' just liked your recipe!'), GETDATE());
                             END
                          END TRY
                          BEGIN CATCH
                            THROW;
                            ROLLBACK;
                          END CATCH;
                        COMMIT;`
        request.query(QUERY, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).json({ message: "An error happened on our part." })
                return;
            }
            res.status(201).json({ message: "Recipe fetched successfully." });
            return;
        })
    })
});
const unlikeRecipe = asyncHandler(async (req, res, next) => {
    const { id } = req.params;
    const token = req.headers['r-a-token'];
    let userId = null, isValid = false;
    jwt.verify(token, TOKEN_KEY, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: "Not authorized to view recipes." });
            return;
        }
        if (Date.now() / 1000 > decoded.exp) {
            res.status(401).json({ message: "Token is expired." });
            return;
        }
        userId = decoded.userId;
        isValid = true;
    });
    if (!isValid) return;
    if (id === undefined) {
        res.status(401).json({ message: "Not all required information was provided." });
        return;
    }
    if (isNaN(Number(id))) {
        res.status(401).json({ message: "Information is not in the expected format." });
        return;
    }
    if (id < 0) {
        res.status(401).json({ message: "Information was in the expected format, but values were invalid." });
        return;
    }
    sql.connect(config, (err) => {
        if (err) {
            res.status(500).json({ message: "A mistake happened on our part." });
            return;
        }
        const request = new sql.Request();
        request.input('recipeId', sql.Int, id);
        request.input('userId', sql.Int, userId);
        const QUERY = `BEGIN TRANSACTION;
                          BEGIN TRY
                             DECLARE @Count INT;

                             SELECT @Count = COUNT(*)
                             FROM Likes 
                             WHERE RecipeId = @recipeId AND UserId = @userId
                             IF(@Count = 1)
                             BEGIN
                              DELETE FROM Likes WHERE UserId = @userId AND RecipeId = @recipeId;
                             END
                          END TRY
                          BEGIN CATCH
                            THROW;
                            ROLLBACK;
                          END CATCH;
                        COMMIT;`
        request.query(QUERY, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).json({ message: "An error happened on our part." })
                return;
            }
            res.status(204).json({ message: "Recipe deleted successfully." });
            return;
        })
    })
});

const getPopularRecipes = asyncHandler(async (req, res, next) => {
    const { page, pageSize } = req.query;
    const token = req.headers['r-a-token'];
    let userId = null, isValid = false;

    jwt.verify(token, TOKEN_KEY, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: "Not authorized to view recipes." });
            return;
        }
        if (Date.now() / 1000 > decoded.exp) {
            res.status(401).json({ message: "Token is expired." });
            return;
        }
        userId = decoded.userId;
        isValid = true;
    });
    if (!isValid) return;
    if (page === undefined || pageSize === undefined) {
        res.status(401).json({ message: "Not all required information was provided." });
        return;
    }
    if (isNaN(Number(page)) || isNaN(Number(pageSize))) {
        res.status(401).json({ message: "Information is not in the expected format." });
        return;
    }
    if (page < 0 || pageSize <= 0) {
        res.status(401).json({ message: "Information was in the expected format, but values were invalid." });
        return;
    }
    sql.connect(config, (err) => {
        if (err) {
            res.status(500).json({ message: "A mistake happened on our part." });
            return;
        }
        const request = new sql.Request();
        request.input('page', sql.Int, page);
        request.input('pageSize', sql.Int, pageSize);
        const QUERY = `SELECT *
                          FROM Recipes
                            ORDER BY Views DESC
                            OFFSET @page * @pageSize ROWS FETCH NEXT @pageSize ROWS ONLY;`
        request.query(QUERY, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).json({ message: "An error happened on our part." })
                return;
            }
            res.status(200).json({ message: "Recipes fetched successfully.", response: result.recordset });
            return;
        })
    })
});

const getRecentRecipes = asyncHandler(async (req, res, next) => {
    const { page, pageSize } = req.query;
    const token = req.headers['r-a-token'];
    let userId = null, isValid = false;

    jwt.verify(token, TOKEN_KEY, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: "Not authorized to view recipes." });
            return;
        }
        if (Date.now() / 1000 > decoded.exp) {
            res.status(401).json({ message: "Token is expired." });
            return;
        }
        userId = decoded.userId;
        isValid = true;
    });
    if (!isValid) return;

    if (page === undefined || pageSize === undefined) {
        res.status(401).json({ message: "Not all required information was provided." });
        return;
    }
    if (isNaN(Number(page)) || isNaN(Number(pageSize))) {
        res.status(401).json({ message: "Information is not in the expected format." });
        return;
    }
    if (page < 0 || pageSize <= 0) {
        res.status(401).json({ message: "Information was in the expected format, but values were invalid." });
        return;
    }
    sql.connect(config, (err) => {
        if (err) {
            res.status(500).json({ message: "A mistake happened on our part." });
            return;
        }
        const request = new sql.Request();
        request.input('page', sql.Int, page);
        request.input('pageSize', sql.Int, pageSize);
        const QUERY = `SELECT *
                            FROM Recipes
                            ORDER BY CreatedAt DESC
                            OFFSET @page * @pageSize ROWS FETCH NEXT @pageSize ROWS ONLY;`
        request.query(QUERY, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).json({ message: "An error happened on our part." })
                return;
            }
            res.status(200).json({ message: "Recipes fetched successfully.", response: result.recordset });
            return;
        })
    })
});

const getMostLikedRecipes = asyncHandler(async (req, res, next) => {
    const { page, pageSize } = req.query;
    const token = req.headers['r-a-token'];
    let userId = null, isValid = false;

    jwt.verify(token, TOKEN_KEY, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: "Not authorized to view recipes." });
            return;
        }
        if (Date.now() / 1000 > decoded.exp) {
            res.status(401).json({ message: "Token is expired." });
            return;
        }
        userId = decoded.userId;
        isValid = true;
    });
    if (!isValid) return;

    if (page === undefined || pageSize === undefined) {
        res.status(401).json({ message: "Not all required information was provided." });
        return;
    }
    if (isNaN(Number(page)) || isNaN(Number(pageSize))) {
        res.status(401).json({ message: "Information is not in the expected format." });
        return;
    }
    if (page < 0 || pageSize <= 0) {
        res.status(401).json({ message: "Information was in the expected format, but values were invalid." });
        return;
    }

    sql.connect(config, (err) => {
        if (err) {
            res.status(500).json({ message: "A mistake happened on our part." });
            return;
        }
        const request = new sql.Request();
        request.input('page', sql.Int, page);
        request.input('pageSize', sql.Int, pageSize);
        const QUERY = `SELECT *
                            FROM Recipes
                            ORDER BY Likes DESC
                            OFFSET @page * @pageSize ROWS FETCH NEXT @pageSize ROWS ONLY;`
        request.query(QUERY, (err, result) => {
            if (err) {
                console.log(err);
                res.status(500).json({ message: "An error happened on our part." })
                return;
            }
            res.status(200).json({ message: "Recipes fetched successfully.", response: result.recordset });
            return;
        })
    })
});

const randomRecipes = asyncHandler(async (req, res, next) => {
    sql.connect(config, (err) => {
        if (err) {
            res.status(500).json({ message: "An error occurred on our part." });
            console.log(err);
            return;
        }
        const request = new sql.Request();
        const QUERY = `SELECT TOP(1) r.RecipeId
                       FROM Recipes r
                       ORDER BY NEWID();`;
        request.query(QUERY, (err, result) => {
            if (err) {
                res.status(500).json({ message: "An error occurred on our part." });
                return;
            }
            console.log("--------")
            console.log(result.recordset);
            console.log("--------")
            res.status(200).json({ message: "Successfully fetched resource", response: result.recordset });
            return;
        });
    });
});

module.exports = {
    deleteRecipe,
    addRecipe,
    getRecipe,
    getRecipes,
    getFavorites,
    filterRecipes,
    updateRecipe,
    getRecipesByChef,
    getPopularRecipes,
    getRecentRecipes,
    getMostLikedRecipes,
    likeRecipe,
    unlikeRecipe,
    getTrending,
    saveRecipe,
    unsaveRecipe,
    getSaved,
    editRecipe,
    getRecipePost,
    randomRecipes
}
