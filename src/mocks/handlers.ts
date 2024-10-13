import { DefaultBodyType, rest } from "msw";
import { Location, locations } from "./db";

interface LocationsResult {
  total_count: number;
  locations: Location[];
}

interface LocationsPathParams {
  page: string;
  location_name: string;
  robot_id: string;
  is_starred: string;
}

export const handlers = [
  rest.get<DefaultBodyType, LocationsPathParams, LocationsResult>(
    "/locations",
    (req, res, ctx) => {
      let filteredLocations = locations; // Reference the locations from db.ts

      const {
        page = "1",
        location_name = "",
        robot_id = "",
        is_starred = "", // Retrieve the 'is_starred' param
      } = req.params;

      // Apply filtering logic based on location name
      if (location_name) {
        filteredLocations = filteredLocations.filter((location: Location) =>
          location.name.toLowerCase().includes(location_name.toLowerCase())
        );
      }

      // Apply filtering logic based on robot id
      if (robot_id) {
        filteredLocations = filteredLocations.filter(
          (location: Location) => location.robot?.id === robot_id
        );
      }

      // Apply filtering logic for starred locations
      if (is_starred === "true") {
        const starredIds = JSON.parse(
          sessionStorage.getItem("starred_location_ids") || "[]"
        );
        filteredLocations = filteredLocations.filter((location) =>
          starredIds.includes(location.id)
        );
      }

      // Pagination logic
      const itemsPerPage = 6;
      const pageNum = parseInt(page);
      const paginatedLocations = filteredLocations.slice(
        (pageNum - 1) * itemsPerPage,
        pageNum * itemsPerPage
      );

      const result: LocationsResult = {
        total_count: filteredLocations.length,
        locations: paginatedLocations,
      };

      return res(ctx.status(200), ctx.json(result));
    }
  ),

  rest.get("/starred_location_ids", (req, res, ctx) => {
    const location_ids = JSON.parse(
      sessionStorage.getItem("starred_location_ids") || "[]"
    );

    return res(
      ctx.status(200),
      ctx.json({
        location_ids,
      })
    );
  }),

  rest.put("/starred_location_ids", (req, res, ctx) => {
    if (!req.body) {
      return res(
        ctx.status(500),
        ctx.json({ error_msg: "Encountered unexpected error" })
      );
    }

    sessionStorage.setItem("starred_location_ids", JSON.stringify(req.body));

    return res(ctx.status(204));
  }),
];
