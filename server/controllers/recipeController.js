const asyncHandler = require('express-async-handler');
const sql = require("mssql/msnodesqlv8");
const jwt = require('jsonwebtoken');
const handler = require("../middleware/errorMiddleware.js");


const config = {
    database: 'Recipes',//<= name of the database in sql
    server: 'DESKTOP-8HBAVK7', //<=name of your desktop device
    driver: 'msnodesqlv8',//<= stays the same
    options: {
        trustedConnection: true
    }
};
const TOKEN_KEY = process.env.TOKEN_KEY;

const deleteRecipe = asyncHandler(async (req, res) => {
    const token = req.body.auth;
    let userId, isAdmin;
    jwt.verify(token, TOKEN_KEY, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
        if (Date.now() / 1000 > decoded.exp) {
            res.status(401).json({ message: "Token is invalid" });
            return;
        }
    });
    userId = token.userId;
    isAdmin = token.role == "admin";
    sql.connect(config, (err) => {
        if (err) {
            handler(err, req, res, "");
            return;
        }
        const request = new sql.Request();
        const recipeId = req.body.recipeId;
        const commentIdQuery = `SELECT CommentId FROM Comments WHERE RecipeId = ${recipeId}`;
        let commentIds = [];
        request.query(commentIdQuery, (err, result) => {
            if (err) {
                handler(err, req, res, "");
                return;
            }
            if (result.recordset.length === 0) return; //this just means that there are no comments so no need to include them;
            for (const element of result.recordset)
                commentIds.push(element.CommentId);
        });
        const getQuery = `SELECT ChefId FROM Recipes WHERE RecipeId = ${recipeId}`

        let deleteQuery = `
        BEGIN TRANSACTION
        DELETE FROM Recipes WHERE RecipeId = ${recipeId};
        DELETE FROM Comments WHERE RecipeId = ${recipeId};
        `;
        if (commentIds.length !== 0) queries += `DELETE FROM CommentLikes WHERE CommentId IN (${commentIds.join(", ")})`;
        queries += `COMMIT`;
        // const deleteQuery = queries;
        // const queries = [`BEGIN TRANSACTION`];
        // queries.push(`DELETE FROM Recipes WHERE RecipeId = ${recipeId}`);
        // queries.push(`DELETE FROM Comments WHERE RecipeId = ${recipeId}`);
        // if (commentIds.length !== 0) queries.push(`DELETE FROM CommentLikes WHERE CommentId IN (${commentIds.join(", ")})`);
        // queries.push(`COMMIT`);
        // const deleteQuery = queries.join("; ") + ";";

        if (isAdmin) {
            request.query(deleteQuery, (err, result) => {
                if (err) {
                    handler(err, req, res, "");
                    return;
                }
                if (result.rowsAffected === 0) {
                    res.status(204).json({ message: "Could not find resource." });
                    return;
                }
                res.status(204).json({ message: "Recipe deleted successfully." });
                return;
            });
        }
        let recipePoster = null;
        request.query(getQuery, (err, result) => {
            if (err) {
                handler(err, req, res, "");
                return;
            }
            if (result.recordset.length === 0) {
                res.status(404).json({ message: "Could not find resource." });
                return;
            }
            recipePoster = result.recordset[0].ChefId;
        });
        if (recipePoster != userId) {
            res.status(403).json({ message: "Unauthorized request, access denied." });
            return;
        }
        request.query(deleteQuery, (err, result) => {
            if (err) {
                handler(err, req, res, "");
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
    if (req.file === undefined) {
        res.status(401).json({ message: "Image was not provided." });
        return;
    }
    const title = req.body.title, description = req.body.description;
    const ingredients = req.body.ingredients.substring(0, req.body.ingredients.length - 1).split(","), cuisineId = req.body.cuisineId;;
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
        request.input('title', sql.VarChar, title);
        request.input('description', sql.VarChar, description);
        request.input('cookTime', sql.Int, cookTime);
        request.input('servings', sql.Int, servings);
        request.input('preparationTime', sql.Int, prepTime);
        request.input('cuisineId', sql.Int, cuisineId);
        request.input('chefId', sql.Int, chefId);
        request.input('imageUrl', sql.VarChar, `localhost:5000/images/${req.file.filename}`);

        let QUERY = `BEGIN TRANSACTION;
                      BEGIN TRY
                        DECLARE @CountChef INT;

                        SELECT @CountChef = COUNT(*)
                        FROM Chef
                        WHERE ChefId = @chefId;

                        IF(@CountChef = 1)
                         BEGIN
                          DECLARE @CurrentRecipeId INT;
                
                          INSERT INTO Recipes(Title, Description, CookTime, Servings, PreparationTime, ImageUrl, CreatedAt, CuisineId, ChefId)
                          VALUES (@title, @description, @cookTime, @servings, @preparationTime, @imageUrl ,GETDATE(), @cuisineId, @chefId);
                          
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
            console.log("Rows affected: " + result.rowsAffected);
            res.status(201).json({ message: "Recipe was successfully added." });
            return;
        });
    });
});

const getRecipes = asyncHandler(async (req, res, next) => {
    const { page, pageSize, cuisineId, title, ingredients, sortBy, sortOrder } = req.query;
    const { userId } = req.params;
    const token = req.headers.authorization.split(" ")[1];
    let chefId = null;
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: "Not authorized to view recipes." });
            return;
        }
        chefId = token.userId;
    });
    if (page === undefined || pageSize === undefined || cuisineId === undefined || title === undefined || ingredients === undefined || sortBy === undefined || sortOrder === undefined) {
        res.status(400).json({ message: "Not all required information was provided." });
        return;
    }
    if (typeof page != 'number' || typeof pageSize != 'number' || typeof cuisineId != 'number' || typeof title != 'string' || typeof ingredients != 'object' || typeof sortBy != 'string' || typeof sortOrder != 'string') {
        res.status(400).json({ message: "Information is not in the expected format." });
        return;
    }
    if (page < 0 || pageSize <= 0 || cuisineId < 0 || title.length > 100 || Object.keys(ingredients).length === 0 || (sortBy != 'title' && sortBy != 'createdAt') || (sortOrder != 'asc' && sortOrder != 'desc')) {
        res.status(400).json({ message: "Information was in the expected format, but values were invalid." });
        return;
    }
    sql.connect(config, (err) => {
        if (err) {
            handler(err, req, res, "");
            return;
        }
        const request = new sql.Request();
        const queries = [];
        const queryList = `
        SELECT * FROM Recipes WHERE ChefId = ${chefId} AND CuisineId = ${cuisineId} AND Title LIKE '%${title}%' ORDER BY ${sortBy} ${sortOrder} OFFSET ${page * pageSize} ROWS FETCH NEXT ${pageSize} ROWS ONLY;
        SELECT COUNT(*) AS Total FROM Recipes WHERE ChefId = ${chefId} AND CuisineId = ${cuisineId} AND Title LIKE '%${title}%';
        `;
        queries.push(queryList);
        request.query(queryList, (err, result) => {
            if (err) {
                handler(err, req, res, "");
                return;
            }
            if (result.recordset.length === 0) {
                handler(err, req, res, "");
                return;
            }
            const recipes = result.recordset[0];
            const total = result.recordset[1];
            res.status(200).json({ recipes, total });
            return;
        });
    });
});

const getRecipe = asyncHandler(async (req, res, next) => {
    const { recipeId } = req.params;
    const token = req.headers.authorization.split(" ")[1];
    let chefId = null;
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            res.status(401).json({ message: "Not authorized to view recipes." });
            return;
        }
        chefId = token.userId;
    });
    if (recipeId === undefined) {
        res.status(400).json({ message: "Not all required information was provided." });
        return;
    }
    if (typeof recipeId != 'number') {
        res.status(400).json({ message: "Information is not in the expected format." });
        return;
    }
    if (recipeId < 0) {
        res.status(400).json({ message: "Information was in the expected format, but values were invalid." });
        return;
    }
    sql.connect(config, (err) => {
        if (err) {
            handler(err, req, res, "");
            return;
        }
        const request = new sql.Request();
        request.input('recipeId', sql.Int, recipeId);
        request.input('userId', sql.Int, userId);
        const d = new Date();
        const date = d.toISOString().slice(0, 10);
        const QUERY = `BEGIN TRANSACTION;
                          BEGIN TRY
                            DECLARE @Count INT;
                        
                            SELECT @Count = COUNT(*)
                            FROM Favorites
                            WHERE RecipeId = @recipeId AND UserId = @userId

                            IF(@Count = 0)
                             BEGIN 
                              INSERT INTO Favorites (UserId, RecipeId) VALUES (@userId, @recipeId);
                              
                              DECLARE @RecipeChef INT;
                              DECLARE @RecipeName VARCHAR;

                              SELECT @RecipeChef = ChefId, @RecipeName = Title
                              FROM Recipes
                              WHERE RecipeId = @recipeId;

                              INSERT INTO Notifications (UserId, Content, ReceivedAt) VALUES (@chefId, 'Someone just added '+@RecipeName+' to their favorites!','${date}');

                              DECLARE @NotificationCount INT;

                              SELECT @NotificationCount = COUNT(*)
                              FROM Notifications
                              WHERE UserId = @followee;
                              IF(@NotificationCount >= 20)
                              BEGIN 
                                DECLARE @EarliestNotification INT;
                                DECLARE @EarliestDate DATE;
   
                                SELECT @EarliestDate = MIN(ReceivedAt)
                                FROM Notifications;
                                
                                SELECT @EarliestNotification = NotificationId
                                FROM Notifications
                                WHERE ReceivedAt = @EarliestDate;
   
                                DELETE FROM Notifications
                                WHERE NotificationId = @EarliestNotification
                              END
                             END
                          END TRY
                          BEGIN CATCH
                            THROW;
                            ROLLBACK;
                          END CATCH;
                        COMMIT;`
        request.query(QUERY, (err, result) => {
            if (err) {
                handler(err, req, res, "");
                return;
            }
            res.status(201).json({ message: "Recipe added successfully." });
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

module.exports = {
    deleteRecipe,
    addRecipe,
    getRecipe,
    getRecipes,
    getFavorites,
    filterRecipes,
    updateRecipe    
}
