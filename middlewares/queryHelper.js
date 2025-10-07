// middlewares/queryHelper.js
export const queryHelper = (model, populateFields = []) => {
  return async (req, res, next) => {
    try {
      // Extract query params
      const {
        page = 1,
        limit = 2,
        sort,
        order = "asc",
        ...filters
      } = req.query;

      const pageNum = parseInt(page);
      const limitNum = parseInt(limit);

      // Validate sorting field
      const allowedSortFields = ["title", "releaseDate", "rating", "name"];
      if (sort && !allowedSortFields.includes(sort)) {
        return res.status(400).json({
          success: false,
          message: `Invalid sort field. Allowed fields: ${allowedSortFields.join(
            ", "
          )}`,
        });
      }

      // Build sorting option
      const sortOption = sort ? { [sort]: order === "desc" ? -1 : 1 } : {};

      // Build query object (using remaining filters)
      const queryObj = { ...filters };

      // Build DB query
      let dbQuery = model.find(queryObj).sort(sortOption);

      // Apply populate dynamically (with field selection)
      const populateOptions = {
        director: { path: "director", select: "name bio -_id" },
        actors: { path: "actors", select: "name -_id" },
        genre: { path: "genre", select: "name -_id" },
      };

      populateFields.forEach((field) => {
        const option = populateOptions[field];
        if (option) {
          dbQuery = dbQuery.populate(option);
        } else {
          // fallback to plain populate if not defined
          dbQuery = dbQuery.populate(field);
        }
      });

      // Pagination logic
      const totalDocs = await model.countDocuments(queryObj);
      const totalPages = Math.ceil(totalDocs / limitNum);

      const results = await dbQuery
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum);

      // 8️⃣ Pagination metadata URLs
      const queryParams = { ...req.query };
      delete queryParams.page;
      const queryString = new URLSearchParams(queryParams).toString();
      const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}${
        req.path
      }`;
      const buildPageUrl = (page) =>
        queryString
          ? `${baseUrl}?${queryString}&page=${page}`
          : `${baseUrl}?page=${page}`;

      const nextPage = pageNum < totalPages ? buildPageUrl(pageNum + 1) : null;
      const prevPage = pageNum > 1 ? buildPageUrl(pageNum - 1) : null;

      // 9️⃣ Send response
      res.json({
        success: true,
        currentPage: pageNum,
        totalPages,
        totalDocs,
        count: results.length,
        nextPage,
        prevPage,
        data: results,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  };
};
